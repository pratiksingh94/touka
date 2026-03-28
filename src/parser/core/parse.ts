import { dispatchLink } from "../dissectors/link/dispatch";
import { parseGlobalHeaders, parsePacketHeader } from "../file/pcap";
import { BinaryReader } from "./BinaryReader";
import type { PacketRecord } from "./types";

async function parsePCAP(file: File) {
  const reader = new BinaryReader(await file.arrayBuffer());

  const magic = reader.readUInt32();
  
  let littleEndian: boolean;
  let timestampResolution: "micro" | "nano";
  if(magic === 0xA1B2C3D4) {
    littleEndian = false;
    timestampResolution = "micro";
  } else if(magic === 0xD4C3B2A1) {
    littleEndian = true;
    timestampResolution = "micro";
  } else if(magic === 0xA1B23C4D) {
    littleEndian = false;
    timestampResolution = "nano";
  } else if(magic === 0x4D3CB2A1) {
    littleEndian = true;
    timestampResolution = "nano"
  } else {
    throw new Error("invalid PCAP file")
  }

  // console.log({ littleEndian, timestampResolution })
  reader.setEndian(littleEndian)

  const globalHeaders = parseGlobalHeaders(reader, littleEndian, timestampResolution);
  
  const packets: PacketRecord[] = [];
  while(reader.offset + 16 <= reader.byteLength) {
    const header = parsePacketHeader(reader, timestampResolution);

    const rawData = reader.readBytes(header.inclLen);
    const data = dispatchLink(globalHeaders.network, rawData)

    packets.push({
      header,
      data
    })
  }

  const PCAP = { globalHeaders, packets };
  console.log(PCAP)
}

export {parsePCAP}