import type { PacketDetails, SelectedField } from "@/views/PacketDetail/types";
import { ProtocolBlock } from "./ProtocolBlock";

interface Props {
  protocols: PacketDetails[];
  selectedField: SelectedField;
  onFieldSelect: (field: SelectedField) => void;
}

export function PacketDetailsPane({protocols, selectedField, onFieldSelect}: Props) {
  return (
    <div className="flex flex-col h-full overflow-auto bg-bg-primary">
      {protocols.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <span className="text-text-secondary text-xs">No packets loaded / Select a packet</span>
        </div>
      ) : (
        protocols.map((prot, i) => (
          <ProtocolBlock
          key={`${prot.title}-${i}`}
          protocol={prot}
          isFirst={i === 0}
          selectedField={selectedField}
          onFieldSelect={onFieldSelect}
          />
        ))
      )}
    </div>
  )
}