import { buildDNSDetails } from "./protocols/application/DNSDetails";
import { buildEthernetDetails } from "./protocols/link/ethernetDetails";
import { buildARPDetails } from "./protocols/network/ARPDetails";
import { buildIPv4Details } from "./protocols/network/IPv4Details";
import { buildIPv6Details } from "./protocols/network/IPv6Details";
import { buildICMPv4Details } from "./protocols/transport/ICMPv4Details";
import { buildICMPv6Details } from "./protocols/transport/ICMPv6Details";
import { buildTCPDetails } from "./protocols/transport/TCPDetails";
import { buildUDPDetails } from "./protocols/transport/UDPDetails";
import type { DetailsBuilderResult } from "./types";

type DetailsBuilder<T> = (packet: T, offset: number) => DetailsBuilderResult;

export const LINK_BUILDERS: Partial<Record<string, DetailsBuilder<any>>> = {
  ethernet: buildEthernetDetails
}

export const NET_BUILDERS: Partial<Record<string, DetailsBuilder<any>>> = {
  ipv4: buildIPv4Details,
  ipv6: buildIPv6Details,
  arp: buildARPDetails
}

export const TRANSPORT_BUILDERS: Partial<Record<string, DetailsBuilder<any>>> = {
  tcp: buildTCPDetails,
  udp: buildUDPDetails,
  icmpv4: buildICMPv4Details,
  icmpv6: buildICMPv6Details,
}

export const APPLICATION_BUILDERS: Partial<Record<string, DetailsBuilder<any>>> = {
  DNS: buildDNSDetails
}