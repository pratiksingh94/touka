// prettier i hate + love you

import type { PacketField, SelectedField } from "@/views/PacketDetail/types";
import { useState } from "react";

interface Props {
  field: PacketField;
  depth: number;
  baseOffset: number;
  protocolOffset: number;
  protocolLength: number;
  selectedField: SelectedField;
  onFieldSelect: (field: SelectedField) => void;
}

export function DetailsField({
  field,
  depth,
  baseOffset,
  protocolOffset,
  protocolLength,
  selectedField,
  onFieldSelect,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = field.children && field.children.length > 0;

  const absoluteOffset = baseOffset + (field.offset ?? 0)
  const fieldLength = field.length ?? protocolLength;

  const isSelected =
    selectedField?.offset === absoluteOffset &&
    selectedField?.length === fieldLength;

  const handleClick = () => {
    if(field.offset !== undefined && field.length !== undefined) {
      onFieldSelect({offset: absoluteOffset, length: field.length})
    } else {
      onFieldSelect({offset: protocolOffset, length: protocolLength})
    }
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
    if(field.offset !== undefined && field.length !== undefined) {
      onFieldSelect({ offset: absoluteOffset, length: field.length})
    } else {
      onFieldSelect({offset: protocolOffset, length: protocolLength})
    }
  };

  return (
    <>
      <div
        className={`h-5 px-3 flex items-center text-xs transition-colors cursor-pointer ${isSelected ? "bg-accent/30" : "hover:bg-bg-secondary"}`}
        style={{ paddingLeft: depth * 16 + 12 }}
        onClick={hasChildren ? handleToggle : handleClick}
      >
        <span
          className={`w-4 mr-1 flex items-center justify-center text-text-secondary transition-colors ${hasChildren ? "hover:text-protocol-title" : ""}`}
        >
          {hasChildren ? (
            <span className="text-[11px] font-medium">
              {expanded ? "▾" : "▸"}
            </span>
          ) : (
            <span className="text-[10px] text-border">·</span>
          )}
        </span>
        <span className="text-protocol-title mr-1">{field.label}:</span>
        <span className="text-primary">{field.value}</span>
      </div>

      {hasChildren && expanded && (
        <div onClick={handleClick}>
          {field.children!.map((ch, i) => (
            <DetailsField
              key={`${ch.label}-${i}`}
              field={ch}
              depth={depth + 1}
              baseOffset={baseOffset}
              protocolOffset={protocolOffset}
              protocolLength={protocolLength}
              selectedField={selectedField}
              onFieldSelect={onFieldSelect}
            />
          ))}
        </div>
      )}
    </>
  );
}
