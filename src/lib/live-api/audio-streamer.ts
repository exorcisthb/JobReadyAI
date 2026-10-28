/**
 * Copyright 2024 Google LLC
 * Adapted for JobReady AI
 */

import {
  createWorketFromSrc,
  registeredWorklets,
} from "./audioworklet-registry";

export interface AudioPlaybackSnapshot {
  turn: number;
  playing: boolean;
  time: number;
  level: number;
  bufferedDuration: number;
}

let nextPlaybackTurn = 0;

export class AudioStreamer {
  private sampleRate: number = 24000;
  private bufferSize: number = 7680;
  private audioQueue: Float32Array[] = [];
  private isPlaying: boolean = false;
  private isStreamComplete: boolean = false;
  private checkInterval: number | null = null;
  private scheduledTime: number = 0;
  private initialBufferTime: number = 0.1;
  public gainNode: GainNode;
  public source: AudioBufferSourceNode;
  private activeSources = new Set<AudioBufferSourceNode>();
  private playbackStartTimer: ReturnType<typeof setTimeout> | null = null;
  private scheduleTimer: ReturnType<typeof setTimeout> | null = null;
  private playbackStarted = false;
  // Read-only avatar telemetry; it does not change audio scheduling/output.
  private playbackOrigin: number | null = null;
  private playbackTurn = 0;
  private playbackEnvelope: { start: number; end: number; level: number }[] = [];

  getPlaybackSnapshot(): AudioPlaybackSnapshot {
    const now = this.context.currentTime;
    this.playbackEnvelope = this.playbackEnvelope.filter(bin => bin.end > now - .1);
    const bin = this.playbackEnvelope.find(bin => bin.start <= now && bin.end > now);
    const playing = this.context.state === "running" && Boolean(bin);
    const queued = this.audioQueue.reduce((samples, data) => samples + data.length, 0) / this.sampleRate;
    return {
      turn: this.playbackTurn,
      playing,
      time: this.playbackOrigin === null ? 0 : Math.max(0, now - this.playbackOrigin),
      level: playing ? bin!.level : 0,
      bufferedDuration: this.playbackOrigin === null ? 0 : Math.max(0, this.scheduledTime - this.playbackOrigin + queued),
    };
  }

  public onComplete = () => {};
  public onPlaybackStart = () => {};

  constructor(public context: AudioContext) {
    this.gainNode = this.context.createGain();
    this.gainNode.gain.setValueAtTime(1, this.context.currentTime);
    this.source = this.context.createBufferSource();
    this.gainNode.connect(this.context.destination);
    this.addPCM16 = this.addPCM16.bind(this);
  }

  async addWorklet<T extends (d: any) => void>(
    workletName: string,
    workletSrc: string,
    handler: T
  ): Promise<this> {
    let workletsRecord = registeredWorklets.get(this.context);
    if (workletsRecord && workletsRecord[workletName]) {
      workletsRecord[workletName].handlers.push(handler);
      return Promise.resolve(this);
    }

    if (!workletsRecord) {
      registeredWorklets.set(this.context, {});
      workletsRecord = registeredWorklets.get(this.context)!;
    }

    workletsRecord[workletName] = { handlers: [handler] };

    const src = createWorketFromSrc(workletName, workletSrc);
    await this.context.audioWorklet.addModule(src);
    const worklet = new AudioWorkletNode(this.context, workletName);

    workletsRecord[workletName].node = worklet;

    return this;
  }

  private _processPCM16Chunk(chunk: Uint8Array): Float32Array {
    const float32Array = new Float32Array(chunk.length / 2);
    const dataView = new DataView(chunk.buffer);

    for (let i = 0; i < chunk.length / 2; i++) {
      try {
        const int16 = dataView.getInt16(i * 2, true);
        float32Array[i] = int16 / 32768;
      } catch (e) {
        console.error(e);
      }
    }
    return float32Array;
  }

  addPCM16(chunk: Uint8Array) {
    console.log('🔊 AudioStreamer.addPCM16 called with chunk size:', chunk.length);
    this.isStreamComplete = false;
    let processingBuffer = this._processPCM16Chunk(chunk);
    
    while (processingBuffer.length >= this.bufferSize) {
      const buffer = processingBuffer.slice(0, this.bufferSize);
      this.audioQueue.push(buffer);
      processingBuffer = processingBuffer.slice(this.bufferSize);
    }
    
    if (processingBuffer.length > 0) {
      this.audioQueue.push(processingBuffer);
    }
    
    console.log('📊 Audio queue length:', this.audioQueue.length, 'isPlaying:', this.isPlaying);
    console.log('🔊 Gain node value:', this.gainNode.gain.value, 'AudioContext state:', this.context.state);
    
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.scheduledTime = this.context.currentTime + this.initialBufferTime;
      console.log('▶️ Starting audio playback at', this.scheduledTime);
      this.scheduleNextBuffer();
    }
  }

  private createAudioBuffer(audioData: Float32Array): AudioBuffer {
    const audioBuffer = this.context.createBuffer(
      1,
      audioData.length,
      this.sampleRate
    );
    audioBuffer.getChannelData(0).set(audioData);
    return audioBuffer;
  }

  private scheduleNextBuffer() {
    const SCHEDULE_AHEAD_TIME = 0.2;

    while (
      this.audioQueue.length > 0 &&
      this.scheduledTime < this.context.currentTime + SCHEDULE_AHEAD_TIME
    ) {
      const audioData = this.audioQueue.shift()!;
      const audioBuffer = this.createAudioBuffer(audioData);
      const source = this.context.createBufferSource();

      this.activeSources.add(source);
      source.onended = () => {
        this.activeSources.delete(source);
        if (!this.activeSources.size && !this.audioQueue.length && this.isStreamComplete) {
          this.isPlaying = false;
          if (this.checkInterval) clearInterval(this.checkInterval);
          this.checkInterval = null;
          this.playbackStarted = false;
          this.playbackOrigin = null;
          this.playbackEnvelope = [];
          this.onComplete();
        }
      };

      source.buffer = audioBuffer;
      source.connect(this.gainNode);

      const worklets = registeredWorklets.get(this.context);

      if (worklets) {
        Object.entries(worklets).forEach(([, graph]) => {
          const { node, handlers } = graph;
          if (node) {
            source.connect(node);
            node.port.onmessage = function (ev: MessageEvent) {
              handlers.forEach((handler) => {
                handler.call(node.port, ev);
              });
            };
            node.connect(this.context.destination);
          }
        });
      }
      
      const startTime = Math.max(this.scheduledTime, this.context.currentTime);
      if (!this.playbackStarted) {
        this.playbackStarted = true;
        this.playbackStartTimer = setTimeout(() => {
          this.playbackStartTimer = null;
          this.onPlaybackStart();
        }, Math.max(0, (startTime - this.context.currentTime) * 1000));
      }
      if (this.playbackOrigin === null) {
        this.playbackOrigin = startTime;
        this.playbackTurn = ++nextPlaybackTurn;
      }
      const binSamples = Math.round(this.sampleRate * .04);
      for (let offset = 0; offset < audioData.length; offset += binSamples) {
        const end = Math.min(audioData.length, offset + binSamples);
        let sum = 0;
        for (let i = offset; i < end; i++) sum += audioData[i] * audioData[i];
        this.playbackEnvelope.push({
          start: startTime + offset / this.sampleRate,
          end: startTime + end / this.sampleRate,
          level: Math.min(1, Math.sqrt(sum / (end - offset)) * 6),
        });
      }
      source.start(startTime);
      this.scheduledTime = startTime + audioBuffer.duration;
    }

    if (this.audioQueue.length === 0) {
      if (this.isStreamComplete) {
        this.isPlaying = false;
        if (this.checkInterval) {
          clearInterval(this.checkInterval);
          this.checkInterval = null;
        }
      } else {
        if (!this.checkInterval) {
          this.checkInterval = window.setInterval(() => {
            if (this.audioQueue.length > 0) {
              this.scheduleNextBuffer();
            }
          }, 100) as unknown as number;
        }
      }
    } else {
      const nextCheckTime =
        (this.scheduledTime - this.context.currentTime) * 1000;
      if (this.scheduleTimer) clearTimeout(this.scheduleTimer);
      this.scheduleTimer = setTimeout(
        () => {
          this.scheduleTimer = null;
          this.scheduleNextBuffer();
        },
        Math.max(0, nextCheckTime - 50)
      );
    }
  }

  stop() {
    if (this.scheduleTimer) clearTimeout(this.scheduleTimer);
    this.scheduleTimer = null;
    if (this.playbackStartTimer) clearTimeout(this.playbackStartTimer);
    this.playbackStartTimer = null;
    this.playbackStarted = false;
    for (const source of this.activeSources) {
      source.onended = null;
      source.stop();
    }
    this.activeSources.clear();
    this.playbackOrigin = null;
    this.playbackEnvelope = [];
    this.isPlaying = false;
    this.isStreamComplete = true;
    this.audioQueue = [];
    this.scheduledTime = this.context.currentTime;

    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }

    // Sources are stopped above. Keep the output connected and preserve mute;
    // a delayed gain reset would disconnect a reply arriving immediately after stop.
  }

  dispose() {
    this.stop();
  }

  async resume() {
    if (this.context.state === "suspended") {
      await this.context.resume();
    }
    this.isStreamComplete = false;
    this.scheduledTime = this.context.currentTime + this.initialBufferTime;
    this.gainNode.gain.setValueAtTime(1, this.context.currentTime);
  }

  complete() {
    this.isStreamComplete = true;
    if (this.activeSources.size === 0 && this.audioQueue.length === 0) {
      this.isPlaying = false;
      if (this.checkInterval) clearInterval(this.checkInterval);
      this.checkInterval = null;
      this.playbackStarted = false;
      this.onComplete();
    }
  }
}
