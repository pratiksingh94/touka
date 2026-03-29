import type { ICMPv4Packet } from "./ICMPv4/types";
import type { TCPPacket } from "./tcp/types"
import type { UDPPacket } from "./udp/types"

export type TransportLayer = TCPPacket | UDPPacket | ICMPv4Packet | UnknownTransportLayer;


export type UnknownTransportLayer = {
  type: "unknown-transport",
  raw: Uint8Array
}