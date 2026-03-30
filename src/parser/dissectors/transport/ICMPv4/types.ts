export type ICMPv4Echo = {
  type: "icmpv4";
  kind: "echo-request" | "echo-reply";
  code: number;
  identifier: number;
  sequence: number;
  data: Uint8Array;
  raw: Uint8Array;
};

export type ICMPv4Unreachable = {
  type: "icmpv4";
  kind: "unreachable";
  code: number;
  originalIPHeader: Uint8Array;
  originalPayloadStart: Uint8Array;
  raw: Uint8Array;
}

export type ICMPv4TimeExceeded = {
  type: "icmpv4";
  kind: "time-exceeded";
  code: number;
  originalIPHeader: Uint8Array;
  originalPayloadStart: Uint8Array;
  raw: Uint8Array;
}

export type ICMPv4Generic = {
  type: "icmpv4";
  kind: "generic";
  icmpType: number;
  code: number;
  raw: Uint8Array;
}

export type ICMPv4Packet = ICMPv4Echo | ICMPv4Unreachable | ICMPv4TimeExceeded | ICMPv4Generic;