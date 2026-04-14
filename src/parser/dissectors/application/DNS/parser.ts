import { BinaryReader } from "@/parser/core/BinaryReader";
import type {
  DNSFlags,
  DNSPacket,
  DNSQuestion,
  DNSResourceRecord,
} from "./types";
import { DNS_CLASSES, DNS_RECORD_TYPES } from "@/parser/definitions/DNS";
import { toIPv4, toIPv6 } from "@/parser/utils/toIP";


function readName(
  fullPacket: Uint8Array,
  currentOffset: number,
): { name: string; endOffset: number } {
  const labels = [];
  const visited = new Set();

  while (true) {
    if (visited.has(currentOffset)) break;
    visited.add(currentOffset);

    const lengthByte = fullPacket[currentOffset];
    if (lengthByte === 0x00) {
      currentOffset += 1;
      break;
    }

    if ((lengthByte & 0xc0) === 0xc0) {
      const pointerOffset =
        ((lengthByte & 0x3f) << 8) | fullPacket[currentOffset + 1];
      currentOffset += 2;

      const { name: pointedName } = readName(fullPacket, pointerOffset);
      labels.push(pointedName);
      break;
    } else {
      const labelLength = lengthByte;
      currentOffset += 1;

      const smallLilReader = new BinaryReader(fullPacket);
      smallLilReader.offset = currentOffset;

      const label = smallLilReader.readStr(labelLength);
      labels.push(label);
      currentOffset += labelLength;
    }
  }

  return { name: labels.join("."), endOffset: currentOffset };
}

// had to preffier this file it was so messed up :sob:
function parseRData(
  recordType: number,
  rdData: Uint8Array,
  fullPacket: Uint8Array,
  rdDataOffset: number,
) {
  const reader = new BinaryReader(rdData);

  switch (recordType) {
    case 1:
      return { type: "A" as const, address: toIPv4(reader) };
    case 28:
      return { type: "AAAA"  as const, address: toIPv6(reader.readBytes(16)) };
    case 5:
      // CNAME
      const {name: cname} = readName(fullPacket, rdDataOffset)
      return { type: "CNAME" as const, cname }
    case 2:
      // NS
      const {name: nameserver} = readName(fullPacket, rdDataOffset)
      return { type: "NS" as const, nameserver}
    case 12: // PTR
      const { name: ptrdname } = readName(fullPacket, rdDataOffset);
      return { type: "PTR" as const, ptrdname }
    case 15:
      const preference = reader.readUInt16();
      const { name: exchange } = readName(fullPacket, rdDataOffset + 2);
      return { type: "MX" as const, preference, exchange };
    case 16:
      const strings: string[] = [];
      while (!reader.isEOF()) {
        const len = reader.readUInt8();
        strings.push(reader.readStr(len));
      }
      return { type: "TXT" as const, text: strings };
    default:
      return { type: "unknown" as const, raw: rdData };
  }
}

function readResourceRecord(
  fullPacket: Uint8Array,
  offset: number,
): { record: DNSResourceRecord; endOffset: number } {
  const { name, endOffset } = readName(fullPacket, offset);

  const reader = new BinaryReader(fullPacket);
  reader.offset = endOffset;

  const recordType = reader.readUInt16();
  const recordClass = reader.readUInt16();
  const ttl = reader.readUInt32();

  const rdLength = reader.readUInt16();
  const rdDataOffset = reader.offset;
  const rdData = reader.readBytes(rdLength);

  const data = parseRData(recordType, rdData, fullPacket, rdDataOffset);

  return {
    record: {
      name,
      recordType: DNS_RECORD_TYPES[recordType] ?? "unknown",
      recordClass: DNS_CLASSES[recordClass] ?? "unknown",
      ttl,
      data,
    },
    endOffset: reader.offset,
  };
}

export function parseDNS(raw: Uint8Array): DNSPacket {
  const reader = new BinaryReader(raw);

  const transactionID = reader.readUInt16();
  const flagByte = reader.readUInt16();

  const flags: DNSFlags = {
    qr: Boolean((flagByte >> 15) & 0x1),
    opcode: (flagByte >> 11) & 0xf,
    aa: Boolean((flagByte >> 10) & 0x1),
    tc: Boolean((flagByte >> 9) & 0x1),
    rd: Boolean((flagByte >> 8) & 0x1),
    ra: Boolean((flagByte >> 7) & 0x1),
    rcode: (flagByte >> 0) & 0xf,
  };

  const qdCount = reader.readUInt16();
  const anCount = reader.readUInt16();
  const nsCount = reader.readUInt16();
  const arCount = reader.readUInt16();

  reader.offset = 12; // ts where the header ends

  const questions: DNSQuestion[] = [];
  for (let i = 0; i < qdCount; i++) {
    const { name, endOffset } = readName(raw, reader.offset);
    reader.offset = endOffset;

    const recordType = reader.readUInt16();
    const recordClass = reader.readUInt16();

    questions.push({
      name,
      recordType: DNS_RECORD_TYPES[recordType],
      recordClass: DNS_CLASSES[recordClass] ?? "unknown",
    });
  }

  const answers: DNSResourceRecord[] = [];
  for (let i = 0; i < anCount; i++) {
    const {record, endOffset} = readResourceRecord(raw, reader.offset);
    answers.push(record);
    reader.offset = endOffset;
  }

  const authority: DNSResourceRecord[] = [];
  for(let i = 0; i < nsCount; i++) {
    const {record, endOffset} = readResourceRecord(raw, reader.offset);
    authority.push(record);
    reader.offset = endOffset;
  }

  const additional: DNSResourceRecord[] = [];
  for(let i = 0; i < arCount; i++) {
    const { record, endOffset} = readResourceRecord(raw, reader.offset);
    additional.push(record),
    reader.offset = endOffset
  }


  return {
    type: "DNS",
    transactionID,
    flags,
    isResponse: flags.qr,
    questions,
    answers,
    authority,
    additional
  }
}
