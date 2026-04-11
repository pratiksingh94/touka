import type { ApplicationLayer } from "@/parser/dissectors/application/types";

export type StreamKey = string;


export type ReassembledStream = {
  streamKey: StreamKey;
  clientToServer: Uint8Array;
  serverToClient: Uint8Array;
  application?: ApplicationLayer
}


// ehhh, i will put this in a dedicated utils folder when i have more util function to add lol
export function makeStreamKey(ipA: string, portA: number, ipB: string, portB: number): StreamKey {
  const sideA = `${ipA}:${portA}`;
  const sideB = `${ipB}:${portB}`;

  return sideA < sideB ? `${sideA}<->${sideB}` : `${sideB}<->${sideA}`;
}