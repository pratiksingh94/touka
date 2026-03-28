
import { BinaryReader } from "@/parser/core/BinaryReader";
import type { UDPPacket } from "./types";

export function parseUDP(raw: Uint8Array): UDPPacket {
  const reader = new BinaryReader(raw);
  
  const srcPort = reader.readUInt16();
  const dstPort = reader.readUInt16();
  const length = reader.readUInt16();
  reader.skip(2) // useless checksum (at least for us)

  const payloadLength = length - 8 // UDP has a fixed 8 bytes header thats so simple
  const payload = reader.readBytes(payloadLength);

  return {
    type: "udp",
    srcPort,
    dstPort,
    length,
    payload
  }
}
