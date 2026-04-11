export function splitHTTPReq(text: string): string[] {
  const parts: string[] = []
  const regex = /(?=GET |POST |PUT |DELETE |HEAD |OPTIONS |PATCH )/g
  const indices = []

  let match
  while ((match = regex.exec(text)) !== null) {
    indices.push(match.index)
    regex.lastIndex = match.index + 1;
  }

  for (let i = 0; i < indices.length; i++) {
    const start = indices[i]
    const end = indices[i + 1] ?? text.length
    parts.push(text.slice(start, end))
  }

  return parts
}

export function splitHTTPRes(text: string): string[] {
  const parts: string[] = []
  const indices = []
  const regex = /(?=HTTP\/1\.)/g

  let match
  while ((match = regex.exec(text)) !== null) {
    indices.push(match.index)
    regex.lastIndex = match.index + 1;
  }

  for (let i = 0; i < indices.length; i++) {
    const start = indices[i]
    const end = indices[i + 1] ?? text.length
    parts.push(text.slice(start, end))
  }

  return parts
}