import type { TCPPacket } from "@/parser/dissectors/transport/tcp/types";
import { TCPStream } from "./TCPStream";
import { makeStreamKey, type ReassembledStream, type StreamKey } from "./types";
import type { IPv4Packet } from "@/parser/dissectors/network/ipv4/types";
import type { IPv6Packet } from "@/parser/dissectors/network/ipv6/types";
import { dispatchTCPApplication } from "@/parser/dissectors/application/dispatchTCPApp";


type StreamEntry = {
  clientToServer: TCPStream;
  serverToClient: TCPStream;
  clientIP: string;
  clientPort: number;
  serverIP: string;
  serverPort: number;
  serverInitialized: boolean;
}


class StreamTracker {
  private streams: Map<StreamKey, StreamEntry> = new Map();
  private completed: ReassembledStream[] = [];

  ingest(tcp: TCPPacket, ip: IPv4Packet | IPv6Packet) {
    const key = makeStreamKey(ip.srcIP, tcp.srcPort, ip.dstIP, tcp.dstPort);


    if(tcp.flags.SYN && !tcp.flags.ACK) {
      const entry: StreamEntry = {
        clientToServer: new TCPStream(),
        serverToClient: new TCPStream(),
        clientIP: ip.srcIP,
        clientPort: tcp.srcPort,
        serverIP: ip.dstIP,
        serverPort: tcp.dstPort,
        serverInitialized: false
      }

      entry.clientToServer.initialize(tcp.sequenceNumber + 1); // i hate this
      this.streams.set(key, entry);

      return;
    }


    // const entry = this.streams.get(key);
    // if(!entry) return;

    const entry = this.streams.get(key);
    if(!entry) return;

    if(tcp.flags.SYN && tcp.flags.ACK && !entry.serverInitialized) {
      entry.serverToClient.initialize(tcp.sequenceNumber + 1);
      entry.serverInitialized = true;
      return;
    }

    const isClientPacket = entry.clientIP === ip.srcIP && entry.clientPort === tcp.srcPort;
    const stream = isClientPacket ? entry.clientToServer : entry.serverToClient;

    if(tcp.payload.length > 0) {
      stream.ingest(tcp.sequenceNumber, tcp.payload)
    }

    if(tcp.flags.FIN || tcp.flags.RST) {
      if(tcp.payload.length > 0) {
        stream.ingest(tcp.sequenceNumber, tcp.payload)
      }

      entry.clientToServer.drain();
      entry.serverToClient.drain();

      const clientBytes = entry.clientToServer.getReassembled();
      const serverBytes = entry.serverToClient.getReassembled();

      const application = dispatchTCPApplication(entry.serverPort, clientBytes, serverBytes);

      this.completed.push({
        streamKey: key,
        clientToServer: clientBytes,
        serverToClient: serverBytes,
        application
      });

      this.streams.delete(key);
    }
  }

  flush() {
    for (const [key, entry] of this.streams.entries()) {
      entry.clientToServer.drain();
      entry.serverToClient.drain();

      const clientBytes = entry.clientToServer.getReassembled();
      const serverBytes = entry.serverToClient.getReassembled();

      const application = dispatchTCPApplication(entry.serverPort, clientBytes, serverBytes);

      this.completed.push({
        streamKey: key,
        clientToServer: clientBytes,
        serverToClient: serverBytes,
        application
      })
    }

    this.streams.clear();
  }

  getCompleted() {
    return this.completed;
  }
}

export {StreamTracker}