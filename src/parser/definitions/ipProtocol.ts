// shared between IPv4 and IPv6

export const IP_PROTOCOL_NAMES: Record<number, string> = {
  1: "ICMP",
  2: "IGMP",
  6: "TCP",
  17: "UDP",
  41: "IPv6-in-IPv4", // w h a t
  43: "IPv6 Routing Header",
  44: "IPv6 Fragment Header",
  47: "GRE",
  50: "ESP",
  51: "AH", // AHHHHHHHHHHHHHHHHHHH,
  58: "ICMPv6",
  59: "No Next Header",
  60: "IPv6 Destination Options",
  89: "OSPF",
  132: "SCTP"
}