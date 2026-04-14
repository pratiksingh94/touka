import type { ApplicationLayer } from "../../application/types";

export type UDPPacket = {
  type: "udp",
  srcPort: number;
  dstPort: number;
  length: number;
  payload: ApplicationLayer;
  raw: Uint8Array;
}
