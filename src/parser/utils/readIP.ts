import type { BinaryReader } from "../core/BinaryReader"


function readIP(reader: BinaryReader) {
  return [
    reader.readUInt8(),
    reader.readUInt8(),
    reader.readUInt8(),
    reader.readUInt8()
  ].join(".")
}

export {readIP}
