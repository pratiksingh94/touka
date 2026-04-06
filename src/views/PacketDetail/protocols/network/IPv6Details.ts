import type { IPv6Packet } from "@/parser/dissectors/network/ipv6/types";
import type { DetailsBuilderResult, PacketField } from "../../types";
import { IP_PROTOCOL_NAMES } from "@/parser/definitions/ipProtocol";
import { IPv6_EXT_HEADER_NAMES } from "@/parser/definitions/ipv6ext";
import { abbreviateIPv6 } from "@/utils/abbreviateIPv6";

export function buildIPv6Details(ip: IPv6Packet, offset: number): DetailsBuilderResult {
  const extHeaderLen = ip.extensionHeaders.reduce((a, h) => a + h.length, 0);
  const totalLength = 40 + extHeaderLen

  const fields: PacketField[] = [
    {label: "Version", value: "6", offset: 0, length: 4},
    {label: "Traffic Class", value: `0x${ip.trafficClass.toString(16).padStart(2, "0")}`, offset: 0, length: 4},
    {label: "Flow Label", value: `0x${ip.flowLabel.toString(16).padStart(5, "0")}`, offset: 0, length: 4},
    {label: "Payload Length", value: `${ip.payloadLength} bytes`, offset: 4, length: 2},
    {label: "Next Header", value: `${ip.nextHeader} (${IP_PROTOCOL_NAMES[ip.nextHeader] ?? IPv6_EXT_HEADER_NAMES[ip.nextHeader] ?? "Unknown"})`, offset: 6, length: 1},
    {label: "Hop Limit", value: `${ip.hopLimit}`, offset: 7, length: 1},
    {label: "Source", value: ip.src, offset: 8, length: 16},
    {label: "Destination", value: ip.dst, offset: 24, length: 16}
  ];

  if(ip.extensionHeaders.length > 0) {
    fields.push({
      label: "Extension Headers",
      value: `${ip.extensionHeaders.length}`,
      offset: 40,
      length: extHeaderLen,
      children: ip.extensionHeaders.map((h, i) => ({
        label: `${IPv6_EXT_HEADER_NAMES[h.type] ?? `Unknown (${h.type})`}`,
        value: `${h.length} bytes`,
        offset: 40 + ip.extensionHeaders.slice(0, i).reduce((a, x) => a + x.length, 0),
        length: h.length
      }))
    })
  }

  return {
    headerLength: totalLength,
    details: {
      title: "Internet Protocol Version 6",
      summary: `${abbreviateIPv6(ip.src)} -> ${abbreviateIPv6(ip.dst)}`,
      offset,
      length: totalLength,
      fields
    }
  }
}