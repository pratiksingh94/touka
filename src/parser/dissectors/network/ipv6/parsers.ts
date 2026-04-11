import { BinaryReader } from "@/parser/core/BinaryReader";
import type { IPv6ExtensionHeader, IPv6Packet } from "./types";
import { dispatchTransport } from "../../transport/dispatch";
import { toIPv6 } from "@/parser/utils/toIP";


// extension headers:
// 0 - hop-by-hop (extension header)
// 6 - TCP
// 17 - UDP
// 43 - routing (extension header)
// 44 - fragment (extension header)
// 58 - ICMPv6
// 59 - no next header yay
// 60 - destination optons (extension headers)


export function parseIPv6(raw: Uint8Array): IPv6Packet {
  const reader = new BinaryReader(raw);

  const firstWord = reader.readUInt32();
  const version = (firstWord >> 28) & 0xF; // useless tbh
  void version;
  const trafficClass = (firstWord >> 20) & 0xFF;
  const flowLabel = firstWord & 0xFFFFF;

  const payloadLength = reader.readUInt16();
  let nextHeader = reader.readUInt8();
  const hopLimit = reader.readUInt8();

  const srcIP = toIPv6(reader.readBytes(16));
  const dstIP = toIPv6(reader.readBytes(16));


  const EXTENSION_HEADERS = new Set([0, 43, 44, 60])
  const headerExts: IPv6ExtensionHeader[] = [];
  while(EXTENSION_HEADERS.has(nextHeader)) {
    const type = nextHeader;
    nextHeader = reader.readUInt8();
    const headerExtLength = (reader.readUInt8() + 1) * 8;
    const raw = reader.readBytes(headerExtLength - 2);

    headerExts.push({
      type,
      length: headerExtLength,
      raw
    })
  }

  
  const ip: IPv6Packet = {
    type: "ipv6",
    trafficClass,
    flowLabel,
    nextHeader,
    payloadLength,
    hopLimit,
    srcIP,
    dstIP,
    extensionHeaders: headerExts,
    payload: null!,
    raw
  }
  ip.payload = dispatchTransport(nextHeader, ip, reader.readRemaining())

  return ip;
}