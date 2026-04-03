import type { IPv4Packet } from "@/parser/dissectors/network/ipv4/types";
import type { DetailsBuilderResult} from "../../types";
import { IP_PROTOCOL_NAMES } from "@/parser/definitions/ipProtocol";

export function buildIPv4Details(ip: IPv4Packet, offset: number): DetailsBuilderResult {
  return {
    headerLength: ip.ihl,
    details: {
      title: "Internet Protocol Version 4",
      summary: `${ip.srcIP} -> ${ip.dstIP}`,
      offset,
      length: ip.ihl,
      fields: [
        {label: "Version", value: "4", offset: offset + 0, length: 1},
        {label: "Header length", value: `${ip.ihl}`, offset: offset + 0, length: 1},
        {label: "Total length", value: `${ip.totalLength}`, offset: offset + 2, length: 2},
        {label: "Identification", value: `${ip.identification}`, offset: offset + 4, length: 2},
        {label: "Flags", value: `DF=${ip.flags.dontFragment ? 1 : 0}`, offset: offset + 6, length: 2, children: [
          { label: "Dont fragment", value: ip.flags.dontFragment ? "Set" : "Not set", offset: offset + 6, length: 2},
          { label: "More fragments", value: ip.flags.moreFragments ? "Set" : "Not set", offset: offset + 6, length: 2}
        ]},
        {label: "Time to Live", value: `${ip.ttl}`, offset: offset + 8, length: 2},
        {label: "Protocol", value: `${ip.protocol} (${IP_PROTOCOL_NAMES[ip.protocol]})`, offset: offset + 9, length: 1},
        {label: "Source", value: `${ip.srcIP}`, offset: offset + 12, length: 4},
        {label: "Destination", value: `${ip.dstIP}`, offset: offset + 16, length: 4}
      ]
    }
  }
}