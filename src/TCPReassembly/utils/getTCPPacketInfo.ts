import type { PacketRecord } from "@/parser/core/types";


export function getTCPPacketInfo(packet: PacketRecord): { srcIP: string; dstIP: string; srcPort: number; dstPort: number } | null {
  const link = packet.data;
  
  if (link.type !== "ethernet") return null;
  
  const network = link.payload;
  if (!network || typeof network !== "object") return null;
  
  let srcIP: string | undefined;
  let dstIP: string | undefined;
  
  if (network.type === "ipv4") {
    srcIP = network.srcIP;
    dstIP = network.dstIP;
  } else if (network.type === "ipv6") {
    srcIP = network.srcIP;
    dstIP = network.dstIP;
  } else {
    return null;
  }
  
  if (!srcIP || !dstIP) return null;
  
  const transport = network.payload;
  if (!transport || typeof transport !== "object") return null;
  if (transport.type !== "tcp") return null;
  
  return { srcIP, dstIP, srcPort: transport.srcPort, dstPort: transport.dstPort };
}
