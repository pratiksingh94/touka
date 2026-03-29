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
  const trafficClass = (firstWord >> 20) & 0xFF;
  const flowLabel = firstWord & 0xFFFFF;

  const payloadLength = reader.readUInt16();
  let nextHeader = reader.readUInt8();
  const hopLimit = reader.readUInt8();

  const src = toIPv6(reader.readBytes(16));
  const dst = toIPv6(reader.readBytes(16));


  const EXTENSTION_HEADERS = new Set([0, 43, 44, 60])
  const headerExts: IPv6ExtensionHeader[] = [];
  while(EXTENSTION_HEADERS.has(nextHeader)) {
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

  const payload = dispatchTransport(nextHeader, reader.readRemaining())

  return {
    type: "ipv6",
    trafficClass,
    flowLabel,
    nextHeader,
    payloadLength,
    hopLimit,
    src,
    dst,
    extenstionHeaders: headerExts,
    payload
  }
}