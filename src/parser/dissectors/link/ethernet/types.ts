import type { NetworkLayer } from "../../network/types";

export type EthernetFrame = {
  type: "ethernet";
  destMac: string;
  srcMac: string;
  etherType: number;
  payload: NetworkLayer
}
