import type { EthernetFrame } from "@/parser/dissectors/link/ethernet/types";
import type { DetailsBuilderResult } from "../../types";
import { ETHERTYPE_NAMES } from "@/parser/definitions/ethertypes";

export function buildEthernetDetails(frame: EthernetFrame, offset: number): DetailsBuilderResult {
  return {
    headerLength:frame.etherType === 0x8100 ? 18 : 14,
    details: {
      title: "Ethernet II",
      summary: `${frame.srcMac} -> ${frame.destMac} | ${ETHERTYPE_NAMES[frame.etherType]}`,
      offset,
      length: frame.etherType === 0x8100 ? 18 : 14,
      fields: [
        {label: "Destination", value: frame.destMac, offset: 0, length: 6},
        {label: "Source", value: frame.srcMac, offset: 6, length: 6},
        {label: "Type", value: `0x${frame.etherType.toString(16)} | ${ETHERTYPE_NAMES[frame.etherType]}`, offset: 12, length: 2}
      ]
    }
  }
}