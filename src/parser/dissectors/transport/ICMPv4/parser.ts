import { BinaryReader } from "@/parser/core/BinaryReader";
import type { ICMPv4Echo, ICMPv4Packet, ICMPv4TimeExceeded, ICMPv4Unreachable } from "./types";

export function parseICMPv4(raw: Uint8Array): ICMPv4Packet {
  const reader = new BinaryReader(raw);

  const type = reader.readUInt8();
  const code = reader.readUInt8();

  let packet: ICMPv4Packet;
  if(type === 0 && code === 0) {
    packet = parseEcho(reader, code, "echo-reply");
  } else if(type === 3 && code === 0) {
    packet = parseUnreachable(reader, code, "net");
  } else if(type === 3 && code === 1) {
    packet = parseUnreachable(reader, code, "host");
  } else if(type === 3 && code === 2) {
    packet = parseUnreachable(reader, code, "host");
  } else if(type === 8 && code === 0) {
    packet = parseEcho(reader, code, "echo-request");
  } else if(type === 11 && code === 0) {
    packet = parseTimeExceeded(reader, code);
  } else {
    packet = {
      type: "icmpv4",
      kind: "generic",
      icmpType: type,
      code,
      raw
    }
  }

  return packet;
}


function parseEcho(reader: BinaryReader, code: number, kind: "echo-reply" | "echo-request"): ICMPv4Echo {
  reader.readUInt16() // discarding checksum
  const identifier = reader.readUInt16();

  const seqNum = reader.readUInt16();
  const data = reader.readRemaining();

  return {
    type: "icmpv4",
    kind,
    code,
    identifier,
    sequence: seqNum,
    data
  }
}

function parseUnreachable(reader: BinaryReader, code: number, unreachable: "net" | "host" | "port"): ICMPv4Unreachable {
  reader.readUInt16(); // checksum
  reader.readUInt32(); // unused

  const originalIPHeader = reader.readBytes(20);
  const originalPayloadStart = reader.readBytes(8);

  return {
    type: "icmpv4",
    kind: "unreachable",
    unreachable,
    code,
    originalIPHeader,
    originalPayloadStart
  }
}

function parseTimeExceeded(reader: BinaryReader, code: number): ICMPv4TimeExceeded {
  reader.readUInt16();
  reader.readUInt32();

  const originalIPHeader = reader.readBytes(20);
  const originalPayloadStart = reader.readBytes(8);

  return {
    type: "icmpv4",
    kind: "time-exceeded",
    code,
    originalIPHeader,
    originalPayloadStart
  }
}