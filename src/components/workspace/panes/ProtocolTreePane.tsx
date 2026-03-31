import { PaneHeader } from "../PaneHeader";

export function ProtocolTreePane() {
  return (
    <div className="flex flex-col h-full">
      <PaneHeader leftText="Protocol Tree"/>
      <div className="flex-1 overflow-auto p-4">
        <span style={{fontSize: "12px"}} className="text-text-secondary">
          No packets loaded / Select a packet
        </span>
      </div>
    </div>
  )
}