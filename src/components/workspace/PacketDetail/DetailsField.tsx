import type { PacketField, SelectedField } from "@/views/PacketDetail/types";
import { useState } from "react";

interface Props {
  field: PacketField;
  depth: number;
  selectedField: SelectedField;
  onFieldSelect: (field: SelectedField) => void;
}

export function DetailsField({field, depth, selectedField, onFieldSelect}: Props) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = field.children && field.children.length > 0;

  const isSelected = selectedField?.offset === field.offset && selectedField?.length === field.length;

  const handleClick = () => {
    onFieldSelect({ offset: field.offset, length: field.length})
  }

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded)
  }

  return (
    <>
    <div className={`h-5 px-3 flex items-center text-xs transition-colors ${hasChildren ? "cursor-pointer" : ""} ${isSelected ? "bg-[#1f3a5f]" : "hover:bg-[#1c2128]"}`} style={{paddingLeft: depth * 16 + 12 }} onClick={hasChildren ? handleToggle : handleClick}>
      <span className={`w-4 mr-1 flex items-center justify-center text-text-secondary transition-colors ${hasChildren ? "hover:text-protocol-title" : ""}`}>
        {hasChildren ? (
          <span className="text-[11px] font-medium">
            {expanded ? "▾" : "▸"}
          </span>
        ) : (
          <span className="text-[10px] text-border">·</span>
        )} 
      </span>
      <span className="text-protocol-title mr-1">
        {field.label}: 
      </span>
      <span className="text-primary">{field.value}</span>
    </div>

    {hasChildren && expanded && (
      <div onClick={handleClick}>
      {field.children!.map((ch, i) => (
        <DetailsField
        key={`${ch.offset}-${i}`}
        field={ch}
        depth={depth + 1}
        selectedField={selectedField}
        onFieldSelect={onFieldSelect}
        />
      ))}
      </div>
    )}
    </>
  )
}