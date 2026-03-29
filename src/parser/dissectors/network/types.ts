import type { ARPPacket } from "./arp/types";
import type { IPv4Packet } from "./ipv4/types"

export type NetworkLayer = IPv4Packet | ARPPacket | UnknownNetworkLayer;


export type UnknownNetworkLayer = {
  type: "unknown-network",
  raw: Uint8Array
}