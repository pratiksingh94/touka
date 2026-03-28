import type { BinaryReader } from "../core/BinaryReader"
import type { GlobalHeader, PacketHeader } from "../core/types"


function parseGlobalHeaders(reader: BinaryReader, littleEndian: boolean, timestampResolution: "micro" | "nano"): GlobalHeader {
  return {
    littleEndian,
    majorVersion: reader.readUInt16(),
    minorVersion: reader.readUInt16(),
    // sigFigs and thisZone are both useless now but idk i am just storing it for the sake of having a proper format struct
    sigFigs: reader.readUInt32(),
    thisZone: reader.readUInt32(),

    snaplen: reader.readUInt32(),
    network: reader.readUInt32(),

    timestampResolution
  }
}

function parsePacketHeader(reader: BinaryReader, timestampResolution: "micro" | "nano"): PacketHeader {
  const ts_s = BigInt(reader.readUInt32());
  const ts_x = BigInt(reader.readUInt32());

  // normalizing to nanosecond cuz its just better while checking for timings in packets and wont have to manage micro and nano separetly
  let timestamp_ns = timestampResolution === "micro" ? ts_s * 1_000_000_000n + ts_x * 1000n : ts_s * 1_000_000_000n + ts_x;

  const inclLen = reader.readUInt32();
  const origLen = reader.readUInt32();

  return {
    timestamp_ns,
    inclLen,
    origLen
  }
}



export {parseGlobalHeaders, parsePacketHeader}