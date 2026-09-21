/** 将模型置信度转换成稳定的中文界面文案。 */
export function formatAiConfidence(confidence: number) {
  const normalized = Math.max(0, Math.min(1, Number.isFinite(confidence) ? confidence : 0));
  return `${Math.round(normalized * 100)}%`;
}

export function aiConfidenceLevel(confidence: number) {
  if (confidence >= 0.85) return "high" as const;
  if (confidence >= 0.7) return "medium" as const;
  return "low" as const;
}
