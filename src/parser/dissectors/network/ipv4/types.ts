import type { TransportLayer } from "../../transport/types";

export type IPv4Flags = {
  reserved: boolean;
  dontFragment: boolean;
  moreFragments: boolean;
}

export type IPv4Packet = {
  type: "ipv4";
  ihl: number;
  totalLength: number;
  identification: number;
  flags: IPv4Flags;
  fragmentOffset: number;
  ttl: number;
  protocol: number;
  srcIP: string;
  dstIP: string;
  payload: TransportLayer;
  raw: Uint8Array;
}
