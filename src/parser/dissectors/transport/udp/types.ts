export type UDPPacket = {
  type: "udp",
  srcPort: number;
  dstPort: number;
  length: number;
  payload: Uint8Array
}
