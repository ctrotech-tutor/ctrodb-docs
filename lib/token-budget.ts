export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

export function truncateToBudget(
  sections: { content: string; score: number }[],
  budget: number,
): string {
  if (sections.length === 0) return ""

  const totalScore = sections.reduce((s, sec) => s + sec.score, 0)
  const parts: string[] = []

  for (const sec of sections) {
    const ratio = totalScore > 0 ? sec.score / totalScore : 1 / sections.length
    const maxChars = Math.max(100, Math.floor((budget * ratio) / 1.2))
    const truncated = sec.content.length > maxChars
      ? sec.content.slice(0, maxChars) + "…"
      : sec.content
    parts.push(truncated)
  }

  // If still over budget, hard-truncate proportionally
  let joined = parts.join("\n\n")
  while (estimateTokens(joined) > budget && joined.length > 200) {
    const cut = Math.floor(joined.length * 0.85)
    joined = joined.slice(0, cut) + "…"
  }

  return joined
}
