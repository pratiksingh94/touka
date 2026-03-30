// todo: add RA and RS like NA and NS, add packet too big, LATER


export type NDPOptionLinkLayer = {
  kind: "source-link-layer" | "target-link-layer";
  mac: string;
}

export type NDPOptionPrefix = {
  kind: "prefix-info";
  prefixLength: number;
  onLink: boolean;
  autoConfig: boolean;
  validLifetime: number;
  preferredLifetime: number;
  prefix: string;
}

export type NDPOptionMTU = {
  kind: "mtu";
  mtu: number;
}

export type NDPUnknownOption = {
  kind: "unknown";
  optType: number;
  raw: Uint8Array;
}

export type NDPOption = NDPOptionLinkLayer | NDPOptionPrefix | NDPOptionMTU | NDPUnknownOption;



export type ICMPv6Echo = {
  type: "icmpv6";
  kind: "echo-request" | "echo-reply";
  code: 0;
  identifier: number;
  sequence: number;
  data: Uint8Array;
  raw: Uint8Array;
}

export type ICMPv6Unreachable = {
  type: "icmpv6";
  kind: "unreachable";
  code: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  originalPacket: Uint8Array;
  raw: Uint8Array;
}

export type ICMPv6TimeExceeded = {
  type: "icmpv6";
  kind: "time-exceeded";
  code: 0 | 1;
  originalPacket: Uint8Array;
  raw: Uint8Array;
}

export type ICMPv6NeighbourSolicitation = {
  type: "icmpv6";
  kind: "neighbour-solicitation";
  code: 0;
  targetAddress: string;
  options: NDPOption[];
  raw: Uint8Array;
}

export type ICMPv6NeighbourAdvertisement = {
  type: "icmpv6";
  kind: "neighbour-advertisement";
  code: 0;
  router: boolean;
  solicited: boolean;
  override: boolean;
  targetAddress: string;
  options: NDPOption[];
  raw: Uint8Array;
}

export type ICMPv6Generic = {
  type: "icmpv6";
  kind: "generic";
  icmpType: number;
  code: number;
  raw:Uint8Array;
}

export type ICMPv6Packet = ICMPv6Echo | ICMPv6Unreachable | ICMPv6TimeExceeded | ICMPv6NeighbourSolicitation | ICMPv6NeighbourAdvertisement | ICMPv6Generic