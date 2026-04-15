import type { PacketDetails, SelectedField } from "@/views/PacketDetail/types";
import { ProtocolBlock } from "./ProtocolBlock";
import type { ReassembledStream } from "@/TCPReassembly/types";
import type { PacketRecord } from "@/parser/core/types";
import { findStreamForPacket } from "@/TCPReassembly/utils/findStreamForPacket";

interface Props {
  protocols: PacketDetails[];
  selectedField: SelectedField;
  autoExpandProtocolIndex: number | null; // long ahh name dawg
  streams: ReassembledStream[];
  selectedPacket: PacketRecord | null;
  onFieldSelect: (field: SelectedField, offset?: number) => void;
  onFollowStream: (streamKey: string) => void;
}

export function PacketDetailsPane({protocols, selectedField, autoExpandProtocolIndex, streams, selectedPacket, onFollowStream, onFieldSelect}: Props) {
  const hasTCP = protocols.some(p => p.title.toLowerCase().includes("transport control"));
  const matchingStream = selectedPacket ? findStreamForPacket(streams, selectedPacket) : null;
  const showButton = hasTCP && matchingStream !== null;

  return (
    <div className="flex flex-col h-full bg-bg-primary">
      <div className="flex-1 overflow-auto">
        {protocols.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-text-secondary text-xs">
              No packets loaded / Select a packet
            </span>
          </div>
        ) : (
          protocols.map((p, i) => (
            <ProtocolBlock
            key={`${p.title}-${i}`}
            protocol={p}
            protocolIndex={i}
            isFirst={i === 0}
            selectedField={selectedField}
            autoExpand={autoExpandProtocolIndex === i}
            onFieldSelect={onFieldSelect}
            />
          ))
        )}
      </div>


      {showButton && matchingStream && (
        <div className="shrink-0 border-t border-border mt-2 mx-2 mb-1">
          <button
          onClick={() => onFollowStream(matchingStream.streamKey)}
          className="w-full px-3 py-2 text-[11px] text-accent border border-border rounded bg-bg-secondary hover:bg-bg-tertiary transition-colors text-left cursor-pointer"
          >
            Follow {matchingStream.application?.type.includes("unknown") ? "TCP" : matchingStream.application?.type.toUpperCase()} Stream →
          </button>
        </div>
      )}
    </div>
  )
}