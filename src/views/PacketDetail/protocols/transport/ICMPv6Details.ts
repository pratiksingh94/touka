
// todo: handle echo's fields vs others

import { ICMPv6_CODES, ICMPv6_TYPES } from "@/parser/definitions/ICMPv6";
import type { ICMPv6Packet } from "@/parser/dissectors/transport/ICMPv6/types";
import type { DetailsBuilderResult } from "../../types";

export function buildICMPv6Details(p: ICMPv6Packet, offset: number): DetailsBuilderResult {
  const typeName = ICMPv6_TYPES[p.icmpType] ?? "Unknown";

  const codeMap = ICMPv6_CODES[p.icmpType];
  const codeName = codeMap ? codeMap[p.code] : undefined;
  return {
    headerLength: p.raw.length,
    details: {
      title: "Internet Control Messaging Protocol Version 6",
      summary: ICMPv6_TYPES[p.icmpType],
      offset,
      length: p.raw.length,
      fields: [
        {label: "Type", value: `${typeName} (${p.icmpType})`, offset: offset + 0, length: 1},
        {label: "Code", value: codeName ? `${codeName} (${p.code})` : `${p.code}`, offset: offset + 1, length: 1},
      ]
    }
  }
}