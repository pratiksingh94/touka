import { BinaryReader } from "@/parser/core/BinaryReader";
import type { ICMPv6Echo, ICMPv6Generic, ICMPv6NeighbourAdvertisement, ICMPv6NeighbourSolicitation, ICMPv6Packet, ICMPv6TimeExceeded, ICMPv6Unreachable, NDPOption } from "./types";
import { toIPv6 } from "@/parser/utils/toIP";
import { toMAC } from "@/parser/utils/toMAC";

export function parseICMPv6(raw: Uint8Array): ICMPv6Packet {
  const reader = new BinaryReader(raw);

  const type = reader.readUInt8();
  const code = reader.readUInt8();
  reader.readUInt16() // checksum

  let packet: ICMPv6Packet;
  if((type === 128 || type === 129) && code === 0)  {
    packet = parseEcho(reader, type, raw);
  } else if(type === 1) {
    packet = parseUnreachable(reader, code as 0 | 1 | 2 | 3 | 4 | 5 | 6, raw);
  } else if(type === 3) {
    packet = parseTimeExceeded(reader, code as 0 | 1, raw);
  } else if(type === 135) {
    packet = parseNeighbourSolicitation(reader, raw);
  } else if(type === 136) {
    packet = parseNeighbourAdvertisement(reader, raw);
  } else {
    packet = parseGeneric(reader, type, code);
  }

  return packet;
}


function parseEcho(reader: BinaryReader, type: number, raw: Uint8Array): ICMPv6Echo {
  const identifier = reader.readUInt16();
  const sequence = reader.readUInt16();
  const data = reader.readRemaining();

  return {
    type: "icmpv6",
    kind: type === 128 ? "echo-request" : "echo-reply",
    code: 0,
    identifier,
    sequence,
    data,
    raw
  }
}

function parseUnreachable(reader: BinaryReader, code: 0 | 1 | 2 | 3 | 4 | 5 | 6, raw: Uint8Array): ICMPv6Unreachable {
  reader.readUInt32(); // unused
  const originalPacket = reader.readRemaining();

  return {
    type: "icmpv6",
    kind: "unreachable",
    code,
    originalPacket,
    raw
  }
}

function parseTimeExceeded(reader: BinaryReader, code: 0 | 1, raw: Uint8Array): ICMPv6TimeExceeded {
  reader.readUInt32();
  const originalPacket = reader.readRemaining();

  return {
    type: "icmpv6",
    kind: "time-exceeded",
    code,
    originalPacket,
    raw
  }
}

function parseNeighbourSolicitation(reader: BinaryReader, raw: Uint8Array): ICMPv6NeighbourSolicitation {
  reader.readUInt32(); // reserved

  const targetAddress = toIPv6(reader.readBytes(16));
  const options = parseNDPOptions(reader);

  return {
    type: "icmpv6",
    kind: "neighbour-solicitation",
    code: 0,
    targetAddress,
    options,
    raw
  }
}

function parseNeighbourAdvertisement(reader: BinaryReader, raw: Uint8Array): ICMPv6NeighbourAdvertisement {
  const flagsWord = reader.readUInt32();
  return {
    type: "icmpv6",
    kind: "neighbour-advertisement",
    code: 0,
    router: (flagsWord & 0x80000000) !== 0,
    solicited: (flagsWord & 0x40000000) !== 0,
    override: (flagsWord & 0x20000000) !== 0,
    targetAddress: toIPv6(reader.readBytes(16)),
    options: parseNDPOptions(reader),
    raw
  }
}

function parseGeneric(reader: BinaryReader, icmpType: number, code: number): ICMPv6Generic {
  return {
    type: "icmpv6",
    kind: "generic",
    icmpType,
    code,
    raw: reader.readRemaining(),
  }
}



function parseNDPOptions(reader: BinaryReader): NDPOption[] {
  const options: NDPOption[] = [];
  while(!reader.isEOF()) {
    const optType = reader.readUInt8();
    const optLen = reader.readUInt8();
    const totalBytes = optLen * 8;
    const valueBytes = totalBytes - 2;

    if(optType === 0) break; // guard if malformed

    if(optType === 1 || optType === 2) {
      const macBytes = reader.readBytes(6);
      reader.skip(valueBytes - 6);
      options.push({
        kind: optType === 1 ? "source-link-layer" : "target-link-layer",
        mac: toMAC(macBytes)
      })
    } else if(optType === 3) {
      const prefixLength = reader.readUInt8();

      const flagsByte = reader.readUInt8();
      const onLink = (flagsByte & 0x80) !== 0;
      const autoConfig = (flagsByte & 0x40) !== 0;

      const validLifetime = reader.readUInt32();
      const preferredLifetime = reader.readUInt32();

      reader.skip(4); // resereved
      const prefix = toIPv6(reader.readBytes(16));

      options.push({
        kind: "prefix-info",
        prefixLength,
        onLink,
        autoConfig,
        validLifetime,
        preferredLifetime,
        prefix
      })
    } else if(optType === 5) {
      reader.skip(2);
      const mtu = reader.readUInt32();

      options.push({
        kind: "mtu",
        mtu
      })
    } else {
      const raw = reader.readBytes(valueBytes);
      options.push({
        kind: "unknown",
        optType,
        raw
      })
    }
  }

  return options;
}