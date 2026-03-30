export const ICMPv4_TYPES: Record<number, string> = {
  0: "Echo Reply",
  3: "Destination Unreachable",
  4: "Source Quench",
  5: "Redirect",
  8: "Echo Request",
  9: "Router Advertisement",
  10: "Router Solitication",
  11: "Time Exceeded",
  12: "Parameter Problem",
  13: "Timestamp Request",
  14: "Timestamp Reply",
  17: "Address Mask Request",
  18: "Address Mask Reply"
}

export const ICMPv4_CODES: Record<number, Record<number, string>> = {
  3: {
    0: "Net Unreachable",
    1: "Host Unreachable",
    2: "Protocol Unreachable",
    3: "Port Unreachable",
    4: "Fragmentation Needed",
    5: "Source Route Failed",
    6: "Destination Network Unknown",
    7: "Destination Host Unknown",
    9: "Network Administratively Prohibibted",
    10: "Host Administratively Prohibited",
    11: "Network Unreachable for ToS",
    12: "Host Unreachable for ToS",
    13: "Communication Administatively Prohibited"
  },
  5: {
    0: "Redirect for Network",
    1: "Redirect for Host",
    2: "Redirect for ToS and Network",
    3: "Redirect for ToS and Host"
  },
  11: {
    0: "TTL Exceeded in Transit",
    1: "Fragment Reassembly Time Exceeded"
  },
  12: {
    0: "Pointer indicates the error",
    1: "Missing a Required Option",
    2: "Bad Length"
  }
}