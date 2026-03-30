export const ICMPv6_TYPES: Record<number, string> = {
  1: "Destination Unreachable",
  2: "Packete Too Big",
  3: "Time Exceeded",
  4: "Parameter Problem",
  128: "Echo Request",
  129: "Echo Reply",
  130: "Multicast Listener Query",
  131: "Multicast Listener Report",
  132: "Multicast Listener Done",
  133: "Router Solicitation",
  134: "Router Advertisements",
  135: "Neighbor Solicitation",
  136: "Neighbor Advertisement",
  137: "Redirect Message"
}

export const ICMPv6_CODES: Record<number, Record<number, string>> = {
  1: {
    0: "No route to destination",
    1: "Administratively prohibited",
    2: "Beyond scope of sources address",
    3: "Address unreachable",
    4: "Port unreachable",
    5: "Source address failed policy",
    6: "Reject route to destination"
  },
  3: {
    0: "Hop limit exceeded in transit",
    1: "Fragment reassembly time exceeded"
  },
  4: {
    0: "Erroneous header field",
    1: "Unrecognized next header type",
    2: "Unrecognized IPv6 option"
  }
}