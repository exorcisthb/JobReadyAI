export interface UserTurn {
  id: string;
  text: string;
  startedAt: number;
  closed: boolean;
  transcriptionFinished: boolean;
  endedAt: number | null;
}

export class VoiceActivityGate {
  active = false;
  private silentMs = 0;

  reset() { this.active = false; this.silentMs = 0; }

  process(probability: number, frameMs: number): "start" | "end" | null {
    if (!this.active) {
      if (probability < 0.5) return null;
      this.active = true;
      this.silentMs = 0;
      return "start";
    }
    // A quiet filler resets the full silence window, even without ASR text.
    this.silentMs = probability >= 0.35 ? 0 : this.silentMs + frameMs;
    if (this.silentMs < 1000) return null;
    this.reset();
    return "end";
  }
}

// Audio boundaries own the turn; delayed ASR updates the same message ID.
export class UserTurnTracker {
  private turns: UserTurn[] = [];
  private sequence = 0;
  private prefix = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  get current() { return this.turns[this.turns.length - 1]; }

  begin() {
    if (this.current && !this.current.closed) return this.current;
    const turn: UserTurn = {
      id: `user-${this.prefix}-${++this.sequence}`, text: "", startedAt: Date.now(), closed: false,
      transcriptionFinished: false, endedAt: null,
    };
    this.turns.push(turn);
    return turn;
  }

  append(text: string, finished: boolean) {
    const turn = this.turns.find((item) => !item.transcriptionFinished) || this.current || (text ? this.begin() : undefined);
    if (!turn) return;
    turn.text += text;
    if (finished) turn.transcriptionFinished = true;
    return turn;
  }

  close(endedAt: number) {
    const turn = this.current;
    if (!turn || turn.closed) return;
    turn.closed = true;
    turn.endedAt = endedAt;
    return turn;
  }

  finishResponse() {
    for (const turn of this.turns) {
      if (turn.closed) turn.transcriptionFinished = true;
    }
  }
}
