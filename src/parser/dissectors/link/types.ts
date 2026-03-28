import type { EthernetFrame } from "./ethernet/types"

export type LinkLayer = EthernetFrame | UnknownLinkLayer;


export type UnknownLinkLayer = {
  type: "unknown-link",
  raw: Uint8Array
}

