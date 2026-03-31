import { PaneHeader } from "../PaneHeader";

export function HexDumpPane() {
  return (
    <div className="flex flex-col h-full">
      <PaneHeader leftText="Hex Dump"/>
      <div className="flex-1 overflow-auto p-4">
        <span className="text-text-secondary" style={{fontSize: "12px"}}>
          No packets loaded / Select a packet
        </span>
      </div>
    </div>
  )
}