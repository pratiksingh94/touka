import type { ARPPacket } from "./arp/types";
import type { IPv4Packet } from "./ipv4/types"
import type { IPv6Packet } from "./ipv6/types";

export type NetworkLayer = IPv4Packet | IPv6Packet | ARPPacket | UnknownNetworkLayer;


export type UnknownNetworkLayer = {
  type: "unknown-network",
  raw: Uint8Array
}