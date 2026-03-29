import { BinaryReader } from "@/parser/core/BinaryReader";
import type { ARPPacket } from "./types";
import { toIPv4 } from "@/parser/utils/toIP";
import { toMAC } from "@/parser/utils/toMAC";

export function parseARP(raw: Uint8Array): ARPPacket {
  const reader = new BinaryReader(raw);

  const hardwareType = reader.readUInt16();
  const protocol = reader.readUInt16();

  reader.readUInt8(); // hardware address length
  reader.readUInt8(); // protocol address length

  const operation = reader.readUInt16();

  const senderMAC = toMAC(reader.readBytes(6));
  const senderIP = toIPv4(reader);

  const targetMAC = toMAC(reader.readBytes(6));
  const targetIP = toIPv4(reader);

  return {
    type: "arp",
    hardwareType,
    protocol,
    operation: operation === 1 ? "request" : "reply",
    senderMAC,
    senderIP,
    targetMAC,
    targetIP
  }
}