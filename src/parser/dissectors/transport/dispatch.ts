import type { TransportLayer, UnknownTransportLayer } from "./types";
import { parseTCP } from "./tcp/parser";
import { parseUDP } from "./udp/parser";
import { parseICMPv4 } from "./ICMPv4/parser";
import { parseICMPv6 } from "./ICMPv6/parser";

type TransportParser = (raw: Uint8Array) => TransportLayer;

const transportRegistry: Partial<Record<number, TransportParser>> = {
  1: parseICMPv4,
  58: parseICMPv6,
  6: parseTCP,
  17: parseUDP,
}


export function dispatchTransport(protocol: number, raw: Uint8Array): TransportLayer {
  const parser = transportRegistry[protocol];

  if(!parser) {
    return {
      type: "unknown-transport",
      raw
    } as UnknownTransportLayer
  }

  return parser(raw)
}
