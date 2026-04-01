import type { PacketRecord } from "@/parser/core/types";
import { ICMPv4_CODES } from "@/parser/definitions/ICMPv4";
import { ICMPv6_CODES } from "@/parser/definitions/ICMPv6";
import type { EthernetFrame } from "@/parser/dissectors/link/ethernet/types";
import type { ARPPacket } from "@/parser/dissectors/network/arp/types";
import type { IPv4Packet } from "@/parser/dissectors/network/ipv4/types";
import type { IPv6Packet } from "@/parser/dissectors/network/ipv6/types";
import type { ICMPv4Packet } from "@/parser/dissectors/transport/ICMPv4/types";
import type { ICMPv6Packet } from "@/parser/dissectors/transport/ICMPv6/types";
import type { TCPPacket } from "@/parser/dissectors/transport/tcp/types";
import type { UDPPacket } from "@/parser/dissectors/transport/udp/types";
import { abbreviateIPv6 } from "@/utils/abbreviateIPv6";

export type PacketSummary = {
  src: string;
  dst: string;
  protocol: string;
  info: string;
}

function getSrcDst(packet: PacketRecord): {src: string; dst: string} {
  const {data} = packet;

  if(data.type === "ethernet") {
    const { payload } = data as EthernetFrame;

    if(payload.type === "ipv4") {
      return {src: payload.srcIP, dst: payload.dstIP}
    }
    if(payload.type === "ipv6") {
      return {src: abbreviateIPv6(payload.src), dst: abbreviateIPv6(payload.dst)}
    }
    if(payload.type === "arp") {
      return {src: payload.senderIP, dst: payload.targetIP}
    }
  }

  // nullish coalescing operator go brrr
  return {
    src: (data as {srcMac?: string}).srcMac ?? "",
    dst: (data as {destMac?: string}).destMac ?? ""
  }
}


function getProtocol(packet: PacketRecord): string {
  const {data} = packet;
  
  // gonna do this properly later
  if(data.type !== "ethernet") return "unknown";

  const { payload } = data as EthernetFrame;

  if(payload.type === "arp") return "ARP";
  if(payload.type === "unknown-network") return "Unknown";

  const transport = "payload" in payload ? (payload as IPv4Packet | IPv6Packet).payload : null;

  if(!transport) return "Unknown";

  if(transport.type === "icmpv4") return "ICMP";
  if(transport.type === "icmpv6") return "ICMPv6";

  if(transport.type === "tcp") {
    const tcp = transport as TCPPacket;
    if(tcp.dstPort === 80 || tcp.srcPort === 80 || tcp.srcPort === 8080 || tcp.dstPort === 8080) return "HTTP";
    if(tcp.dstPort === 443 || tcp.srcPort === 443) return "TLS";
    return "TCP";
  }

  if(transport.type === "udp") {
    const udp = transport as UDPPacket;
    if(udp.dstPort === 53 || udp.srcPort === 53) return "DNS";
    return "UDP";
  }

  if(transport.type === "unknown-transport") return "Unknown";

  return "Unknown";
}


function getInfo(packet: PacketRecord): string {
  const {data} = packet;

  if(data.type !== "ethernet") return "Unknown";

  const { payload } = data as EthernetFrame;

  if(payload.type === "arp") {
    const arp = payload as ARPPacket;
    if(arp.operation === "request") {
      return `Who has ${arp.targetIP}? Tell ${arp.senderIP}`
    }
    return `${arp.senderIP} is at ${arp.senderMAC}`
  }

  if(payload.type !== "ipv4" && payload.type !== "ipv6") return "Unknown";

  const transport = (payload as IPv4Packet | IPv6Packet).payload;

  if(transport.type === "icmpv4") {
    const icmp = transport as ICMPv4Packet;
    if(icmp.kind === "echo-request" || icmp.kind === "echo-reply") {
      const kind = icmp.kind === "echo-request" ? "Echo request" : "Echo reply";

      return `${kind} id=0x${icmp.identifier.toString(16)} seq=${icmp.sequence}`
    } else if(icmp.kind === "time-exceeded") {
      return `Time exceeded`
    } else if(icmp.kind === "unreachable") {
      return ICMPv4_CODES[3][icmp.code]
    }

    return `Unknown`
  }

  if(transport.type === "icmpv6") {
    const icmp = transport as ICMPv6Packet;
    if(icmp.kind === "echo-request" || icmp.kind === "echo-reply") {
      const kind = icmp.kind === "echo-request" ? "Echo request" : "Echo reply";

      return `${kind} id=0x${icmp.identifier.toString(16)} seq=${icmp.sequence}`
    } else if(icmp.kind === "time-exceeded") {
      return `Time exceeded`
    } else if(icmp.kind === "unreachable") {
      return ICMPv6_CODES[1][icmp.code]
    }

    return `Unknown`
  }

  if(transport.type === "tcp") {
    const tcp = transport as TCPPacket;

    const flags = Object.entries(tcp.flags)
    .filter(([, v]) => v)
    .map(([k]) => k);
    const flagStr = flags.length > 0 ? flags.join(", ") : "none";

    return `${tcp.srcPort} -> ${tcp.dstPort} [${flagStr}] Seq=${tcp.sequenceNumber}`;
  }

  if(transport.type === "udp") {
    const udp = transport as UDPPacket;
    return `${udp.srcPort} -> ${udp.dstPort} Len=${udp.length}`
  }
  
  return `Unknown`
}


export function getPacketSummary(packet: PacketRecord): PacketSummary {
  const {src, dst} = getSrcDst(packet);
  const protocol = getProtocol(packet);
  const info = getInfo(packet);

  return { src, dst, protocol, info }
}