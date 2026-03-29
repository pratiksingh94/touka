import type { TransportLayer } from "../../transport/types";

export type IPv4Packet = {
  type: "ipv4";
  ihl: number;
  totalLength: number;
  identification: number;
  flags: number;
  fragmentOffset: number;
  ttl: number;
  protocol: number;
  srcIP: string;
  dstIP: string;
  payload: TransportLayer;
}
