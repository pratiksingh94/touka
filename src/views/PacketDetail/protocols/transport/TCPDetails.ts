import type { TCPPacket } from "@/parser/dissectors/transport/tcp/types";
import type { DetailsBuilderResult } from "../../types";

export function buildTCPDetails(p: TCPPacket, offset: number): DetailsBuilderResult {
  const flags = Object.entries(p.flags)
    .filter(([, v]) => v)
    .map(([k]) => k);
    const flagStr = flags.length > 0 ? flags.join(", ") : "none";
  return {
    headerLength: p.headerLength,
    details: {
      title: "Transport Control Protocol",
      summary: `Src Port ${p.srcPort} -> Dst Port ${p.dstPort}`,
      offset,
      length: p.headerLength,
      fields: [
        {label: "Source Port", value: `${p.srcPort}`, offset:  0, length: 2},
        {label: "Destination Port", value: `${p.dstPort}`, offset:  2, length: 2},
        {label: "Sequence Number", value: `${p.sequenceNumber}`, offset:  4, length: 4},
        {label: "Acknowledgement Number", value: `${p.acknowledgementNumber}`, offset:  8, length: 4},
        {label: "Flags", value: `[${flagStr}]`, offset:  13, length: 1, children: [
          {label: "Congestion Window Reduced (CWR)", value: p.flags.CWR ? "Set": "Not set", offset:  13, length: 1},
          {label: "Explicit Congestion Echo (ECE)", value: p.flags.ECE ? "Set": "Not set", offset:  13, length: 1},
          {label: "Urgent (URG)", value: p.flags.URG ? "Set": "Not set", offset:  13, length: 1},
          {label: "Acknowledgment (ACK)", value: p.flags.ACK ? "Set": "Not set", offset:  13, length: 1},
          {label: "Push (PSH)", value: p.flags.PSH ? "Set": "Not set", offset:  13, length: 1},
          {label: "Reset (RST)", value: p.flags.RST ? "Set": "Not set", offset:  13, length: 1},
          {label: "Urgent (URG)", value: p.flags.URG ? "Set": "Not set", offset:  13, length: 1},
          {label: "Synchronize (SYN)", value: p.flags.SYN ? "Set": "Not set", offset:  13, length: 1},
          {label: "Finish (Fin)", value: p.flags.FIN ? "Set": "Not set", offset:  13, length: 1},
        ]}
      ]
    }
  }
}