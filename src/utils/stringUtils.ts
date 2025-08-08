export function stripCodeFences(text: string): string {
  const trimmed = (text ?? '').trim();
  const fenceMatch = trimmed.match(/^```(?:\w+)?\s*([\s\S]*?)\s*```$/);
  if (fenceMatch) {
    return String(fenceMatch[1]).trim();
  }
  return trimmed
    .replace(/^```(?:\w+)?\s*/, '')
    .replace(/\s*```$/, '')
    .trim();
}


