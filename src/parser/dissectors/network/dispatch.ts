import { BinaryReader } from "@/parser/core/BinaryReader";
import { parseIPv4 } from "./ipv4/parser";
import type { NetworkLayer, UnknownNetworkLayer } from "./types";
import { parseARP } from "./arp/parsers";
import { parseIPv6 } from "./ipv6/parsers";

type NetworkParser = (raw: Uint8Array) => NetworkLayer;

const networkRegistry: Partial<Record<number, NetworkParser>> = {
  0x0800: parseIPv4,
  0x86dd: parseIPv6,
  0x0806: parseARP
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
