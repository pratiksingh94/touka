export function extractLines(raw: Uint8Array): string[] {
  const lines: string[] = []
  let start = 0

  for (let i = 0; i < raw.length - 1; i++) {
    if (raw[i] === 0x0D && raw[i + 1] === 0x0A) {  // \r\n
      const line = raw.subarray(start, i)

      const filtered = line.filter(b => b !== 0x00);
      const isPrintable = filtered.every(b => (b >= 0x20 && b <= 0x7E) || b === 0x09)
      if (isPrintable && filtered.length > 0) {
        lines.push(new TextDecoder().decode(filtered))
      }

      start = i + 2
    }
  }

  return lines
}