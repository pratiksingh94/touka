import type { TransportLayer, UnknownTransportLayer } from "./types";
import { parseTCP } from "./tcp/parser";
import { parseUDP } from "./udp/parser";

type TransportParser = (raw: Uint8Array) => TransportLayer;

const transportRegistry: Partial<Record<number, TransportParser>> = {
  6: parseTCP,
  17: parseUDP
}


export function transportDispatcher(protocol: number, raw: Uint8Array): TransportLayer {
  const parser = transportRegistry[protocol];

  if(!parser) {
    return {
      type: "unknown-transport",
      raw
    } as UnknownTransportLayer
  }

  return parser(raw)
}
