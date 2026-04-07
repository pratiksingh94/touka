import type { PacketDetails, SelectedField } from "@/views/PacketDetail/types";
import { useTooltip } from "./utils/useTooltip";
import { PaneHeader } from "../PaneHeader";
import { findFieldAtOffset } from "./utils/findFieldAtOffset";
import { OffsetColumn } from "./components/OffsetColumn";
import { HexColumn } from "./components/HexColumn";
import { AsciiColumn } from "./components/AsciiColumn";
import { Tooltip } from "./components/Tooltip";

interface Props {
  raw: Uint8Array | null;
  protocols: PacketDetails[];
  selectedField: SelectedField;
  onFieldSelect: (field: SelectedField, offset: number) => void;
}

const BYTES_PER_ROW = 16;

export function HexPane({ raw, protocols, selectedField, onFieldSelect}: Props) {
  const { tooltip, showTooltip, moveTooltip, hideTooltip } = useTooltip();

  if(raw === null) {
    return (
      <div className="flex flex-col h-full">
        <PaneHeader leftText="Hex Dump"/>
        <div className="flex-1 flex items-center justify-center">
          <span className="text-text-muted text-sm">Select a packet</span>
        </div>
      </div>
    );
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    moveTooltip(e.nativeEvent);
  }

  const handleByteClick = (offset: number) => {
    const field = findFieldAtOffset(protocols, offset);

    onFieldSelect(field, offset);
  }

  return (
    <div className="flex flex-col h-full">
      <PaneHeader leftText="Hex Dump"/>
      <div
      className="flex-1 overflow-auto p-2 bg-bg-primary min-h-0"
      onMouseLeave={hideTooltip}
      onMouseMove={handleMouseMove}
      >
        <div className="flex gap-4">
          <OffsetColumn totalBytes={raw.length} bytesPerRow={BYTES_PER_ROW}/>
          <HexColumn
          data={raw}
          bytesPerRow={BYTES_PER_ROW}
          selectedField={selectedField}
          onShowTooltip={showTooltip}
          onByteClick={handleByteClick}
          />

          <AsciiColumn
          data={raw}
          bytesPerRow={BYTES_PER_ROW}
          selectedField={selectedField}
          onShowTooltip={showTooltip}
          onByteClick={handleByteClick}
          />
        </div>
      </div>

      <Tooltip
      visible={tooltip.visibile}
      x={tooltip.x}
      y={tooltip.y}
      offset={tooltip.offset}
      />
    </div>
  )
}