/**
 * Get color based on risk score
 * @param score Risk score between 0 and 1
 * @returns Hex color code
 */
export function getColorByRisk(score: number): string {
  if (score >= 0.8) return '#b71c1c'; // critical - dark red
  if (score >= 0.6) return '#f44336'; // high - red
  if (score >= 0.3) return '#ff9800'; // medium - orange
  return '#4caf50';                   // low - green
}
