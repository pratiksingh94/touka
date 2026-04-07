export function toHex(value: number, width: number = 2): string {
  return value.toString(16).toLowerCase().padStart(width, "0")
}

export function formatOffset(offset: number) {
  return toHex(offset, 4);
}

export function formatByte(byte: number) {
  return toHex(byte, 2);
}