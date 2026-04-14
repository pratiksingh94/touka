import { parseDNS } from "./DNS/parser";
import type { ApplicationLayer,  UnknownUDPApplicationLayer } from "./types";

type ApplicationParser = (raw: Uint8Array) => ApplicationLayer;

const UDPApplicationRegistry: Partial<Record<number, ApplicationParser>> = {
  53: parseDNS
}

export function dispatchUDPApplication(port: number, raw: Uint8Array): ApplicationLayer {
  const parser = UDPApplicationRegistry[port];
  if(!parser) return {type:"unknown-application", raw } as UnknownUDPApplicationLayer;
  
  return parser(raw);
}