import { BinaryReader } from "@/parser/core/BinaryReader";
import { parseIPv4 } from "./ipv4/parser";
import type { NetworkLayer, UnknownNetworkLayer } from "./types";

type NetworkParser = (raw: Uint8Array) => NetworkLayer;

const networkRegistry: Partial<Record<number, NetworkParser>> = {
  0x0800: parseIPv4  
}


export function dispatchNetwork(protocol: number, raw: Uint8Array): NetworkLayer {
  const parser = networkRegistry[protocol];

  if(!parser) {
    const reader = new BinaryReader(raw)
    return {
      type: "unknown-network",
      raw: reader.readBytes(reader.byteLength - reader.offset)
    } as UnknownNetworkLayer
  }

  return parser(raw);
}
