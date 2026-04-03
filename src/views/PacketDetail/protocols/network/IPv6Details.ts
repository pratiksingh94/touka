import type { IPv6Packet } from "@/parser/dissectors/network/ipv6/types";
import type { DetailsBuilderResult } from "../../types";
import { abbreviateIPv6 } from "@/utils/abbreviateIPv6";
import { IPv6_EXT_HEADER_NAMES } from "@/parser/definitions/ipv6ext";
import { IP_PROTOCOL_NAMES } from "@/parser/definitions/ipProtocol";

export function buildIPv6Details(ip: IPv6Packet, offset: number): DetailsBuilderResult {
  const extHeaderLen = ip.extenstionHeaders.reduce((a,h) => a + h.length, 0)
  return {
    headerLength: 40 + extHeaderLen,
    details: {
      title: "Internet Protocol Version 6",
      summary: `${abbreviateIPv6(ip.src)} -> ${abbreviateIPv6(ip.dst)}`,
      offset,
      length: 40 + extHeaderLen,
      fields: [
        {label: "Version", value: "6", offset: offset + 0, length: 1},
        {label: "Traffic Class", value: `${ip.trafficClass}`, offset: offset + 0, length: 1},
        {label: "Flow Label", value: `${ip.flowLabel}`, offset: offset + 0, length: 1},
        {label: "Payload Length", value: `${ip.payloadLength}`, offset: offset + 1, length: 2},
        {label: "Next Header", value: `${ip.nextHeader} (${IP_PROTOCOL_NAMES[ip.nextHeader] ?? IPv6_EXT_HEADER_NAMES[ip.nextHeader] ?? "Unknown"})`, offset: offset + 3, length: 1},
        {label: "Hop Limit", value: `${ip.hopLimit}`, offset: offset + 4, length: 1},
        {label: "Source", value: `${ip.src}`, offset: offset + 5, length: 16},
        {label: "Destination", value: `${ip.dst}`, offset: offset + 21, length: 16}
      ]
    }
  }
}