export const LinkType = {
  Ethernet: 1,
  Raw: 101,
  IEEE802_11: 105,
  RadioTap: 127,
  LinuxSSL: 113
} as const;

export const EtherType = {
  IPv4: 0x0800,
  ARP: 0x0806,
  IPv6: 0x86DD
} as const;
