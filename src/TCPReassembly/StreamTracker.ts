import type { TCPPacket } from "@/parser/dissectors/transport/tcp/types";
import { TCPStream } from "./TCPStream";
import { makeStreamKey, type StreamKey } from "./types";
import type { IPv4Packet } from "@/parser/dissectors/network/ipv4/types";
import type { IPv6Packet } from "@/parser/dissectors/network/ipv6/types";

class StreamTracker {
  private streams: Map<StreamKey, {clientToServer: TCPStream, serverToClient: TCPStream, clientIP: string, clientPort: number}> = new Map();


  ingest(tcp: TCPPacket, ip: IPv4Packet | IPv6Packet) {
    const key = makeStreamKey(ip.srcIP, tcp.srcPort, ip.dstIP, tcp.dstPort);


    if(tcp.flags.SYN && !tcp.flags.ACK) {
      this.streams.set(key, {
        clientToServer: new TCPStream(),
        serverToClient: new TCPStream(),
        clientIP: ip.srcIP,
        clientPort: tcp.srcPort
      });

      return
    }


    const entry = this.streams.get(key);
    if(!entry) return;

    const isClientPacket = entry.clientIP === ip.srcIP && entry.clientPort === tcp.srcPort;
    const stream = isClientPacket ? entry.clientToServer : entry.serverToClient;

    stream.ingest(tcp.sequenceNumber, tcp.payload);

    if(tcp.flags.FIN || tcp.flags.RST) {
      const entry = this.streams.get(key);
      if(!entry) return;

      entry.clientToServer.drain();
      entry.serverToClient.drain();

      // todo: work on application layer dispatcher
    }
  }


  // getCompleted() {
  //   return
  // }
}