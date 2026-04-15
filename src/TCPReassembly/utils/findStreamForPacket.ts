import type { PacketRecord } from "@/parser/core/types";
import { makeStreamKey, type ReassembledStream } from "../types";
import { getTCPPacketInfo } from "./getTCPPacketInfo";

export function findStreamForPacket(streams: ReassembledStream[], packet: PacketRecord): ReassembledStream | null {
  const tcpInfo = getTCPPacketInfo(packet);
  if(!tcpInfo) return null;

  const packetKey = makeStreamKey(tcpInfo.srcIP, tcpInfo.srcPort, tcpInfo.dstIP, tcpInfo.dstPort);

  return streams.find(s => s.streamKey === packetKey) ?? null;
}