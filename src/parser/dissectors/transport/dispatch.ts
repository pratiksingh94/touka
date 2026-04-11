import type { TransportLayer, UnknownTransportLayer } from "./types";
import { parseTCP } from "./tcp/parser";
import { parseUDP } from "./udp/parser";
import { parseICMPv4 } from "./ICMPv4/parser";
import { parseICMPv6 } from "./ICMPv6/parser";
import type { TCPPacket } from "./tcp/types";
import type { IPv4Packet } from "../network/ipv4/types";
import type { IPv6Packet } from "../network/ipv6/types";

type TransportParser = (raw: Uint8Array) => TransportLayer;


type TransportHook = (tcp: TCPPacket, ip: IPv4Packet | IPv6Packet) => void;
let hook: TransportHook | null = null;

export function setTransportHook(fn: TransportHook) { hook = fn };


const transportRegistry: Partial<Record<number, TransportParser>> = {
  1: parseICMPv4,
  58: parseICMPv6,
  6: parseTCP,
  17: parseUDP,
}


export function dispatchTransport(protocol: number, ip: IPv4Packet | IPv6Packet, raw: Uint8Array): TransportLayer {
  const parser = transportRegistry[protocol];

  if(!parser) {
    return {
      type: "unknown-transport",
      raw
    } as UnknownTransportLayer
  }

  const result = parser(raw);

  if(result.type === "tcp" && hook) {
    hook(result, ip)
  }

  return result;
}
