export function getInterviewOutcome(session: { status?: string; total_score?: number | null }) {
  if (session.status === "abandoned") return { kind: "abandoned", score: 0, badge: null } as const;
  if (session.status === "insufficient_data" || (session.status === "completed" && !Number.isFinite(session.total_score))) {
    return { kind: "insufficient_data", score: null, badge: null } as const;
  }
  if (session.status !== "completed" || !Number.isFinite(session.total_score)) {
    return { kind: "pending", score: null, badge: null } as const;
  }
  const score = session.total_score!;
  return { kind: "scored", score, badge: score >= 95 ? "excellent" : score >= 85 ? "great" : score >= 70 ? "good" : "improve" } as const;
}
