export function isPrintable(byte:number): boolean {
  return byte >= 0x20 && byte <= 0x7e;
}