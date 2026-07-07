/**
 * Copyright 2024 Google LLC
 * Adapted for JobReady AI
 */

import {
  Content,
  GoogleGenAI,
  LiveCallbacks,
  LiveClientToolResponse,
  LiveConnectConfig,
  LiveServerContent,
  LiveServerMessage,
  LiveServerToolCall,
  LiveServerToolCallCancellation,
  Part,
} from "@google/genai";

import { EventEmitter } from "eventemitter3";
import { base64ToArrayBuffer } from "./utils";

export interface LiveClientEventTypes {
  audio: (data: ArrayBuffer) => void;
  close: (event: CloseEvent) => void;
  content: (data: LiveServerContent) => void;
  error: (error: ErrorEvent) => void;
  interrupted: () => void;
  open: () => void;
  setupcomplete: () => void;
  toolcall: (toolCall: LiveServerToolCall) => void;
  toolcallcancellation: (
    toolcallCancellation: LiveServerToolCallCancellation
  ) => void;
  turncomplete: () => void;
  inputtranscription: (text: string, finished: boolean) => void;
  outputtranscription: (text: string, finished: boolean) => void;
}

export class GenAILiveClient extends EventEmitter<LiveClientEventTypes> {
  protected client: GoogleGenAI;

  private _status: "connected" | "disconnected" | "connecting" = "disconnected";
  public get status() {
    return this._status;
  }

  private _session: any | null = null;
  public get session() {
    return this._session;
  }

  private _model: string | null = null;
  public get model() {
    return this._model;
  }

  protected config: LiveConnectConfig | null = null;

  public getConfig() {
    return { ...this.config };
  }

  constructor(options: { apiKey: string }) {
    super();
    this.client = new GoogleGenAI(options);
    this.send = this.send.bind(this);
    this.onopen = this.onopen.bind(this);
    this.onerror = this.onerror.bind(this);
    this.onclose = this.onclose.bind(this);
    this.onmessage = this.onmessage.bind(this);
  }

  async connect(model: string, config: LiveConnectConfig): Promise<boolean> {
    if (this._status === "connected" || this._status === "connecting") {
      return false;
    }

    this._status = "connecting";
    this.config = config;
    this._model = model;

    const callbacks: LiveCallbacks = {
      onopen: this.onopen,
      onmessage: this.onmessage,
      onerror: this.onerror,
      onclose: this.onclose,
    };

    try {
      this._session = await this.client.live.connect({
        model,
        config,
        callbacks,
      });
    } catch (e) {
      console.error("Error connecting to GenAI Live:", e);
      this._status = "disconnected";
      return false;
    }

    this._status = "connected";
    return true;
  }

  public disconnect() {
    if (!this.session) {
      return false;
    }
    this.session?.close();
    this._session = null;
    this._status = "disconnected";
    return true;
  }

  protected onopen() {
    console.log("✅ Connected to Gemini Live");
    this.emit("open");
  }

  protected onerror(e: ErrorEvent) {
    console.error("❌ Gemini error:", e.message);
    this.emit("error", e);
  }

  protected onclose(e: CloseEvent) {
    console.log("🔌 Disconnected:", e.reason || "No reason", `(code: ${e.code})`);
    this.emit("close", e);
  }

  protected async onmessage(message: LiveServerMessage) {
    if (message.setupComplete) {
      console.log("✅ Setup complete");
      this.emit("setupcomplete");
      return;
    }
    if (message.toolCall) {
      this.emit("toolcall", message.toolCall);
      return;
    }
    if (message.toolCallCancellation) {
      this.emit("toolcallcancellation", message.toolCallCancellation);
      return;
    }

    if (message.serverContent) {
      const { serverContent } = message;
      if ("interrupted" in serverContent) {
        console.log("⚠️ Interrupted");
        this.emit("interrupted");
        return;
      }

      // Process transcription and audio BEFORE emitting turncomplete
      if (serverContent.inputTranscription?.text !== undefined) {
        this.emit(
          "inputtranscription",
          serverContent.inputTranscription.text,
          serverContent.inputTranscription.finished === true
        );
      }

      if (serverContent.outputTranscription?.text !== undefined) {
        this.emit(
          "outputtranscription",
          serverContent.outputTranscription.text,
          serverContent.outputTranscription.finished === true
        );
      }

      if ("modelTurn" in serverContent) {
        let parts: Part[] = serverContent.modelTurn?.parts || [];

        const audioParts = parts.filter(
          (p) => p.inlineData && p.inlineData.mimeType?.startsWith("audio/pcm")
        );
        const base64s = audioParts.map((p) => p.inlineData?.data);

        console.log('📦 Server response: audio parts:', audioParts.length, 'total parts:', parts.length);

        const otherParts = parts.filter(p => !audioParts.includes(p));

        base64s.forEach((b64) => {
          if (b64) {
            const data = base64ToArrayBuffer(b64);
            console.log('🎵 Emitting audio event, buffer size:', data.byteLength);
            this.emit("audio", data);
          }
        });
        
        if (!otherParts.length) {
          return;
        }

        parts = otherParts;

        const content: { modelTurn: Content } = { modelTurn: { parts } };
        this.emit("content", content);
      }

      // turncomplete fires LAST, after all transcription chunks for this message
      if ("turnComplete" in serverContent) {
        console.log("✓ Turn complete");
        this.emit("turncomplete");
      }
    }
  }

  sendRealtimeInput(chunks: Array<{ mimeType: string; data: string }>) {
    if (this._status !== "connected") return;
    for (const ch of chunks) {
      this.session?.sendRealtimeInput({ media: ch });
    }
  }

  sendToolResponse(toolResponse: LiveClientToolResponse) {
    if (
      toolResponse.functionResponses &&
      toolResponse.functionResponses.length
    ) {
      this.session?.sendToolResponse({
        functionResponses: toolResponse.functionResponses,
      });
    }
  }

  send(parts: Part | Part[], turnComplete: boolean = true) {
    this.session?.sendClientContent({ turns: parts, turnComplete });
  }
}
