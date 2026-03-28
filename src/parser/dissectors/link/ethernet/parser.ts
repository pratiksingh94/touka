// +------------------------+---------------------+
// | Field                  | Size                |
// +------------------------+---------------------+
// | Preamble               | 7 bytes             |
// | SFD                    | 1 byte              |
// | Destination MAC        | 6 bytes             |
// | Source MAC             | 6 bytes             |
// | Type/Length            | 2 bytes             |
// | Payload                | 46 – 1500 bytes     |
// | FCS (CRC)              | 4 bytes             |
// +------------------------+---------------------+

import { BinaryReader } from "@/parser/core/BinaryReader";
import type { EthernetFrame } from "./types";
import { toMAC } from "@/parser/utils/toMAC";
import { dispatchNetwork } from "../../network/dispatch";

function parseEthernet(raw: Uint8Array): EthernetFrame {
  const reader = new BinaryReader(raw);
  const destMac = toMAC(reader.readBytes(6));
  const srcMac = toMAC(reader.readBytes(6));

  let etherType = reader.readUInt16();
  if(etherType === 0x8100) {
    reader.readUInt16() // 0x8100 is a VLAN tagged frame so we discard the tag
    etherType = reader.readUInt16() // real shit
  }
  
  const rawPayload = reader.readRemaining();
  const payload = dispatchNetwork(etherType, rawPayload)

  return {
    type: "ethernet",
    destMac,
    srcMac,
    etherType,
    payload
  }
}

export {parseEthernet};
