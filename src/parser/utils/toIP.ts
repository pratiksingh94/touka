import type { BinaryReader } from "../core/BinaryReader"


function toIPv4(reader: BinaryReader) {
  return [
    reader.readUInt8(),
    reader.readUInt8(),
    reader.readUInt8(),
    reader.readUInt8()
  ].join(".")
}

function toIPv6(bytes: Uint8Array) {
  const groups = [];
  for(let i = 0; i < 16; i += 2) {
    groups.push(((bytes[i] << 8) | bytes[i + 1]).toString(16).padStart(4, '0'))
  }

  return groups.join(':')
}

export {toIPv4, toIPv6}
