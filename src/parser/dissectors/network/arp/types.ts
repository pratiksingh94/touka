export type ARPOperation = "request" | "reply";

export type ARPPacket = {
  type: "arp";
  hardwareType: number;
  protocol: number;
  operation: ARPOperation;
  senderMAC: string;
  senderIP: string;
  targetMAC: string;
  targetIP: string;
  raw: Uint8Array;
}