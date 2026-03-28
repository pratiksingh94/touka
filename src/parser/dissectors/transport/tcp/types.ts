export type TCPPacket = {
  type: "tcp",
  srcPort: number,
  dstPort: number,
  sequenceNumber: number,
  acknowledgementNumber: number,
  headerLength: number,
  flags: {
    CWR: boolean,
    ECE: boolean,
    URG: boolean,
    ACK: boolean,
    PSH: boolean,
    RST: boolean,
    SYN: boolean,
    FIN: boolean
  },
  payload: Uint8Array
}
