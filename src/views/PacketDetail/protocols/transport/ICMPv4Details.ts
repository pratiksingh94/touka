import type { ICMPv4Packet } from "@/parser/dissectors/transport/ICMPv4/types";
import type { DetailsBuilderResult } from "../../types";
import { ICMPv4_CODES, ICMPv4_TYPES } from "@/parser/definitions/ICMPv4";

// todo: handle echo's fields vs others

export function buildICMPv4Details(p: ICMPv4Packet, offset: number): DetailsBuilderResult {
  const typeName = ICMPv4_TYPES[p.icmpType] ?? "Unknown";

  const codeMap = ICMPv4_CODES[p.icmpType];
  const codeName = codeMap ? codeMap[p.code] : undefined;
  return {
    headerLength: p.raw.length,
    details: {
      title: "Internet Control Messaging Protocol",
      summary: ICMPv4_TYPES[p.icmpType],
      offset,
      length: p.raw.length,
      fields: [
        {label: "Type", value: `${typeName} (${p.icmpType})`, offset:  0, length: 1},
        {label: "Code", value: codeName ? `${codeName} (${p.code})` : `${p.code}`, offset:  1, length: 1},
      ]
    }
  }
}