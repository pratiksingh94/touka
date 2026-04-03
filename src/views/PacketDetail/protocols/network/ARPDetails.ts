import type { ARPPacket } from "@/parser/dissectors/network/arp/types";
import type { DetailsBuilderResult } from "../../types";
import { ETHERTYPE_NAMES } from "@/parser/definitions/ethertypes";
import { ARP_HARDWARE_TYPES, ARP_OPERATIONS } from "@/parser/definitions/arp";

export function buildARPDetails(p: ARPPacket, offset: number): DetailsBuilderResult {
  return {
    headerLength: p.raw.length,
    details: {
      title: "Address Resolution Protocol",
      summary: `${p.operation}`,
      offset,
      length: p.raw.length,
      fields: [
        {label: "Hardware Type", value: `${ARP_HARDWARE_TYPES[p.hardwareType]} (${p.hardwareType})`, offset: offset + 0, length: 2},
        {label: "Protocol", value: `${ETHERTYPE_NAMES[p.protocol]} (${p.protocol})`, offset: offset + 2, length: 2},
        {label: "Operation", value: `${ARP_OPERATIONS[p.operation]} (${p.operation})`, offset: offset + 6, length: 2},
        {label: "Sender MAC", value: `${p.senderMAC}`, offset: offset + 8, length: 6},
        {label: "Sender IP", value: `${p.senderIP}`, offset: offset + 14, length: 4},
        {label: "Target MAC", value: `${p.targetMAC}`, offset: offset + 18, length: 6},
        {label: "Target IP", value: `${p.targetIP}`, offset: offset + 24, length: 4}
      ]
    }
  }
}