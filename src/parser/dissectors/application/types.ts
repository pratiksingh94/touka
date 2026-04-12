import type { FTPStream } from "./FTP/types";
import type { HTTPStream } from "./HTTP1.1/types";

export type ApplicationLayer = HTTPStream | FTPStream | UnknownApplicationLayer;

export type UnknownApplicationLayer = {
  type: "unknown-application",
  clientToServerRaw: Uint8Array,
  serverToClientRaw: Uint8Array
}