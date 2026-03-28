import { BinaryReader } from "@/parser/core/BinaryReader";
import { parseEthernet } from "./ethernet/parser";
import type { LinkLayer, UnknownLinkLayer } from "./types";

type LinkParser = (raw: Uint8Array) => LinkLayer;

const linkRegistry: Partial<Record<number, LinkParser>> = {
  1: parseEthernet
}


export function dispatchLink(linkType: number, raw: Uint8Array): LinkLayer {
  const parser = linkRegistry[linkType];

  if(!parser) {
    const reader = new BinaryReader(raw)
    return {
      type: "unknown-link",
      raw: reader.readBytes(reader.byteLength - reader.offset)
    } as UnknownLinkLayer
  }

  return parser(raw);
}

