import type { PacketDetails, SelectedField } from "@/views/PacketDetail/types";
import { useEffect, useRef, useState } from "react";
import { DetailsField } from "./DetailsField";

interface Props {
  protocol: PacketDetails;
  protocolIndex: number;
  isFirst: boolean;
  selectedField: SelectedField;
  autoExpand: boolean;
  onFieldSelect: (field: SelectedField, offset?: number) => void;
}

export function ProtocolBlock({ protocol, isFirst, selectedField, autoExpand, onFieldSelect }: Props) {
  const [expanded, setExpanded] = useState(false);
  const prevAutoExpand = useRef(false);

  useEffect(() => {
    if(autoExpand && !prevAutoExpand.current) {
      setExpanded(true);
    }

    prevAutoExpand.current = autoExpand;
  }, [autoExpand])

  return (
    <div className={isFirst ? "" : "border-t border-border"}>
      <div className="h-6 px-3 flex items-center justify-between bg-[#1c2128] cursor-pointer hover:bg-border-muted transition-colors" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-1">
          <span className="text-text-secondary text-xs">
            {expanded ? "▾" : "▸"}
          </span>
          <span className="text-protocol-title text-xs">
            {protocol.title}
          </span>
        </div>
        {!expanded && (
          <span className="text-text-secondary text-[11px] truncate max-w-xs">
            {protocol.summary}
          </span>
        )}
      </div>
      {expanded && (
        <div>
          {protocol.fields.map((f, i) => (
            <DetailsField
            key={`${f.label}-${i}`}
            field={f}
            depth={1}
            baseOffset={protocol.offset}
            protocolOffset={protocol.offset}
            protocolLength={protocol.length}
            selectedField={selectedField}
            onFieldSelect={onFieldSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}