// Simple explainable matching score. This is rule-based similarity, not a trained AI model.
const normalize = (s = "") => s.toLowerCase().replace(/[^a-z0-9 ]/g, " ").trim();

export function scoreMatch(lost, found) {
  let score = 0;
  if (normalize(lost.category) === normalize(found.category)) score += 35;
  const a = new Set(normalize(lost.title + " " + lost.description).split(/\s+/).filter(w => w.length > 2));
  const b = new Set(normalize(found.title + " " + found.description).split(/\s+/).filter(w => w.length > 2));
  const overlap = [...a].filter(w => b.has(w)).length;
  const union = new Set([...a, ...b]).size || 1;
  score += Math.round((overlap / union) * 40);
  if (normalize(lost.location) === normalize(found.location)) score += 20;
  const days = Math.abs(new Date(lost.date) - new Date(found.date)) / 86400000;
  if (days <= 3) score += 5;
  return Math.min(score, 100);
}