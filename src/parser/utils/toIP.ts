import type { BinaryReader } from "../core/BinaryReader"


function toIP(reader: BinaryReader) {
  return [
    reader.readUInt8(),
    reader.readUInt8(),
    reader.readUInt8(),
    reader.readUInt8()
  ].join(".")
}

export {toIP}
