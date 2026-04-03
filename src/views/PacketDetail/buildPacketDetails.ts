import type { PacketRecord } from "@/parser/core/types";
import type { PacketDetails } from "./types";
import { LINK_BUILDERS, NET_BUILDERS, TRANSPORT_BUILDERS } from "./registry";

export function buildPacketDetails(p: PacketRecord ): PacketDetails[] {
  const detailsArr: PacketDetails[] = [];
  let offset = 0;

  const link = p.data;
  const linkBuilder = LINK_BUILDERS[link.type]
  if(linkBuilder) {
    const { headerLength, details } = linkBuilder(link, 0);
    detailsArr.push(details),
    offset += headerLength
  }

  // TODO: MAKE THIS BETTER BY EACH LAYER HAVINT ITS OWN RETURN TYPE WITH PAYLOAD?: 

  if(!("payload" in link)) return detailsArr;
  const network = link.payload;
  const networkBuilder = NET_BUILDERS[network.type]
  if(networkBuilder) {
    const { headerLength, details } = networkBuilder(network, offset);
    detailsArr.push(details);
    offset += headerLength
  }

  if(!("payload" in network)) return detailsArr;
  const transport = network.payload;
  const transportBuilder = TRANSPORT_BUILDERS[transport.type];
  if(transportBuilder) {
    const {headerLength, details} = transportBuilder(transport, offset)
    detailsArr.push(details);
    offset += headerLength;
  }

  return detailsArr
}