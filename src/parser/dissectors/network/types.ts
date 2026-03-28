import type { IPv4Packet } from "./ipv4/types"

export type NetworkLayer = IPv4Packet | UnknownNetworkLayer;


export type UnknownNetworkLayer = {
  type: "unknown-network",
  raw: Uint8Array
}