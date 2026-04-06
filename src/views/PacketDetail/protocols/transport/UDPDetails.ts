import type { UDPPacket } from "@/parser/dissectors/transport/udp/types";
import type { DetailsBuilderResult } from "../../types";

export function buildUDPDetails(p: UDPPacket, offset: number): DetailsBuilderResult {
  return {
    headerLength: 8, //simple ahh,
    details: {
      title: "User Datagram Protocol",
      summary: `Src Port ${p.srcPort} -> Dst Port ${p.dstPort}`,
      offset,
      length: 8,
      fields: [
        {label: "Source Port", value: `${p.srcPort}`, offset:  0, length: 2},
        {label: "Destination Port", value: `${p.dstPort}`, offset:  2, length: 2},
        {label: "Length", value: `${p.length}`, offset:  4, length: 2},
      ]
    }
  }
}