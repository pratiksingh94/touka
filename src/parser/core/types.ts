import type { LinkLayer } from "../dissectors/link/types";
import type { LinkType } from "./constants";



export type LinkType = typeof LinkType[keyof typeof LinkType];


export type GlobalHeader = {
  littleEndian: boolean;
  timestampResolution: "micro" | "nano";
  majorVersion: number;
  minorVersion: number;
  thisZone: number; // useless ngl
  sigFigs: number; // this too
  snaplen: number;
  network: number;
}

export type PacketHeader = {
  timestamp_ns: bigint;
  inclLen: number;
  origLen: number;
}

export type PacketRecord = {
  header: PacketHeader;
  data: LinkLayer
}

export type PCAP = {
  globalHeaders: GlobalHeader;
  packets: PacketRecord[]
}

