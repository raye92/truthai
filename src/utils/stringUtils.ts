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

export function extractAssistantResponse(text: string): string | null {
  const source = String(text ?? '');
  const regex = /<assistant_response\b[^>]*>([\s\S]*?)<\/assistant_response>/gi;
  let match: RegExpExecArray | null;
  let lastInner: string | null = null;
  while ((match = regex.exec(source)) !== null) {
    lastInner = match[1];
  }
  return lastInner?.trim() || null;
}


