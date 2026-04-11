import type { ApplicationLayer, UnknownApplicationLayer } from "./types";
import { parseHTTP } from "./HTTP1.1/parser"


type ApplicationParser = (clientToServerRaw: Uint8Array, serverToClientRaw: Uint8Array) => ApplicationLayer;

const ApplicationRegistry: Partial<Record<number, ApplicationParser>> = {
  80: parseHTTP,
  8080: parseHTTP
}

export function dispatchApplication(protocol: number, clientToServerRaw: Uint8Array, serverToClientRaw: Uint8Array): ApplicationLayer {
  const parser = ApplicationRegistry[protocol];

  if(!parser) {
    return {
      type: "unknown-application",
      clientToServerRaw,
      serverToClientRaw
    } as UnknownApplicationLayer
  }

  return parser(clientToServerRaw, serverToClientRaw)
}