import type { DNSPacket } from "./DNS/types";
import type { FTPStream } from "./FTP/types";
import type { HTTPStream } from "./HTTP1.1/types";

export type ApplicationLayer = HTTPStream | FTPStream | DNSPacket | UnknownApplicationLayer | UnknownUDPApplicationLayer;

export type UnknownApplicationLayer = {
  type: "unknown-application",
  clientToServerRaw: Uint8Array,
  serverToClientRaw: Uint8Array
}

export type UnknownUDPApplicationLayer = {
  type: "unknown-application";
  raw: Uint8Array
}