# Changelog
the stuff changing duh dawg

### 25-03-2026
- initialized project
- created home page and drag and drop upload
- added workspace header

### 28-03-2026
- created a group of dissectors to parse ethernet link layer packets (ethernet -> IP -> TCP/UDP)
- types of all the packets and frames
- file structure to manage parsers of all 4 layers

### 30-03-2026
- added support for ICMPv4, ICMPv6, IPv6, ARP
- now storing raw bytes with all packets for hex view
- made definition look up table for UI display of packets

### 01-04-2026
- created the 3 pane UI with resize handles
- created Packet List pane, shows all packets

# 04-04-2026
- added "Details Builder" function which takes a packet and gives it's details of the protocols in a flat array, it will be used to show data on UI
- made ICMP and ICMPv6 save `icmpType` in the struct too for ease in details building
- removed the type `flag: number` from IPv4 and made it a boolean object
- fixed a typo in `etherTypes` constant
