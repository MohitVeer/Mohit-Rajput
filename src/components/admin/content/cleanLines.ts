export function cleanLines(lines: string[]): string[] {
  return lines.map((line) => line.trim()).filter(Boolean)
}
