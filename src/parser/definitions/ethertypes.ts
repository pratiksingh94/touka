// i will add support for most of these later

export const ETHERTYPE_NAMES: Record<number, string> = {
  0x0800: "IPv4",
  0x0806: "ARP",
  0x08DD: "IPv6",
  0x8100: "VLAN Tagged (802.1Q)",
  0x9100: "VLAN Double Tagged",
  0x0842: "Wake-on-LAN",
  0x8847: "MPLS Unicast",
  0x8848: "MPLS Multicast",
  0x88CC: "LLDP"
}