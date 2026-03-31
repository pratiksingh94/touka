import { PaneHeader } from "../PaneHeader"

interface Props {
  packetCount: number
}

export function PacketListPane({packetCount}: Props) {
  return (
    <div className="flex flex-col h-full">
      <PaneHeader leftText="Packet List" rightText={`${packetCount} packets`}/>
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex items-start justify-start p-4">
          <span className="text-text-secondary" style={{fontSize: "12px"}}>No packets loaded / Select a packet</span>
        </div>
      </div>
    </div>
  )
}