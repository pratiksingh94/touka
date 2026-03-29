import type { TransportLayer } from "../../transport/types";

export type IPv6ExtensionHeader = {
  type: number;
  length: number;
  raw: Uint8Array;
} 


export type IPv6Packet = {
  type: "ipv6";
  trafficClass: number;
  flowLabel: number;
  payloadLength: number;
  nextHeader: number;
  hopLimit: number;
  src: string;
  dst: string;
  extenstionHeaders: IPv6ExtensionHeader[];
  payload: TransportLayer;
}