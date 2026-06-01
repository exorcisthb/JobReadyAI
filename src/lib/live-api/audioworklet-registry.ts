/**
 * Copyright 2024 Google LLC
 * Adapted for JobReady AI
 */

export type WorkletGraph = {
  node?: AudioWorkletNode;
  handlers: Array<(d: any) => void>;
};

export const registeredWorklets: WeakMap<
  AudioContext,
  Record<string, WorkletGraph>
> = new WeakMap();

export function createWorketFromSrc(name: string, src: string): string {
  const blob = new Blob([src], { type: "application/javascript" });
  return URL.createObjectURL(blob);
}
