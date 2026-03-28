// +------------------------+---------------------+
// | Field                  | Size                |
// +------------------------+---------------------+
// | Source Port            | 16 bits             |
// | Destination Port       | 16 bits             |
// | Sequence Number        | 32 bits             |
// | Acknowledgment Number  | 32 bits             |
// | Data Offset            | 4 bits              |
// | Reserved               | 3 bits              |
// | Flags                  | 9 bits              |
// | Window Size            | 16 bits             |
// | Checksum               | 16 bits             |
// | Urgent Pointer         | 16 bits             |
// | Options + Padding      | Variable            |
// +------------------------+---------------------+

import { BinaryReader } from "@/parser/core/BinaryReader";
import type { TCPPacket } from "./types";


export function parseTCP(raw: Uint8Array): TCPPacket {
  const reader = new BinaryReader(raw);
  const srcPort = reader.readUInt16();
  const dstPort = reader.readUInt16();
  const sequenceNumber = reader.readUInt32();
  const acknowledgementNumber = reader.readUInt32();

  // the header length
  const byte12 = reader.readUInt8();
  const offset = (byte12 >> 4) * 4; // 32 bits words => byte
  
  // flags
  const byte13 = reader.readUInt8();
  const CWR = Boolean((byte13 >> 7) & 0x01);
  const ECE = Boolean((byte13 >> 6) & 0x01);
  const URG = Boolean((byte13 >> 5) & 0x01);
  const ACK = Boolean((byte13 >> 4) & 0x01);
  const PSH = Boolean((byte13 >> 3) & 0x01);
  const RST = Boolean((byte13 >> 2) & 0x01);
  const SYN = Boolean((byte13 >> 1) & 0x01);
  const FIN = Boolean((byte13 >> 0) & 0x01);

  reader.skip(offset - 20);
  const payloadLength = raw.byteLength - offset;
  const payload = reader.readBytes(payloadLength);

  const flags = { CWR, ECE, URG, ACK, PSH, RST, SYN, FIN };
  return {
    type: "tcp",
    srcPort,
    dstPort,
    sequenceNumber,
    acknowledgementNumber,
    headerLength: offset,
    flags,
    payload
  }
}
