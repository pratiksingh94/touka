// +------------------------+---------------------+
// | Field                  | Size                |
// +------------------------+---------------------+
// | Version                | 4 bits              |
// | IHL                    | 4 bits              |
// | DSCP/ECN               | 8 bits              |
// | Total Length           | 16 bits             |
// | Identification         | 16 bits             |
// | Flags                  | 3 bits              |
// | Fragment Offset        | 13 bits             |
// | TTL                    | 8 bits              |
// | Protocol               | 8 bits              |
// | Header Checksum        | 16 bits             |
// | Source Address         | 32 bits             |
// | Destination Address    | 32 bits             |
// | Options + Padding      | Variable            |
// +------------------------+---------------------+

import { BinaryReader } from "@/parser/core/BinaryReader";
import type { IPv4Packet } from "./types";
import { readIP } from "@/parser/utils/readIP";
import { transportDispatcher } from "../../transport/dispatch";


function parseIPv4(raw: Uint8Array): IPv4Packet {
  const reader = new BinaryReader(raw);

  const byte = reader.readUInt8();
  const version = byte >> 4;
  const ihl = (byte & 0x0f) * 4;

  reader.skip(1); // DSCP + ECN

  const totalLength = reader.readUInt16();
  const identification = reader.readUInt16();

  const rawFlags = reader.readUInt16();
  const flags = rawFlags >> 13;
  const fragmentOffset = rawFlags & 0x1fff;

  const ttl = reader.readUInt8();
  const protocol = reader.readUInt8();

  reader.skip(2) // header checksum

  const srcIP = readIP(reader);
  const dstIP = readIP(reader);

  if(ihl > 20) {
    reader.skip(ihl - 20);
  }

  const rawPayload = raw.slice(ihl);
  const payload = transportDispatcher(protocol, rawPayload)

  return {
    type: "ipv4",
    version,
    ihl,
    totalLength,
    identification,
    flags,
    fragmentOffset,
    ttl,
    protocol,
    srcIP,
    dstIP,
    payload
  }
}

export {parseIPv4}
