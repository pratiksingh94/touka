import type { TCPPacket } from "./tcp/types"
import type { UDPPacket } from "./udp/types"

export type TransportLayer = TCPPacket | UDPPacket | UnknownTransportLayer;


export type UnknownTransportLayer = {
  type: "unknown-transport",
  raw: Uint8Array
}