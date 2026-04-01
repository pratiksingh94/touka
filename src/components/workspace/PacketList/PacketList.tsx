import type { PacketRecord } from "@/parser/core/types";
import { useMemo, useRef } from "react";
import { getPacketSummary } from "./getPacketSummary";
import { useVirtualizer } from "@tanstack/react-virtual";

interface Props {
  packets: PacketRecord[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  height: number;
}

const COLUMNS = [
  { key: "no", label: "No.", width: 55 },
  { key: "time", label: "Time", width: 100 },
  { key: "src", label: "Src", width: 145 },
  { key: "dst", label: "Dst", width: 145 },
  { key: "protocol", label: "Protocol", width: 85 },
  { key: "length", label: "Length", width: 65 },
  { key: "info", label: "Info", width: undefined }
] as const;

const PROTOCOL_COLORS: Record<string, string> = {
  arp: "#c678dd",
  icmp: "#56b6c2",
  tcp: "#7ec8e3",
  udp: "#98c379",
  dns: "#e5c07b",
  http: "#98c379",
  tls: "#e06c75"
}

const SELECTED_BG = "#1f3a5f";
const HOVER_BG = "#1c2128";

function getProtocolColor(protocol: string): string {
  const lower = protocol.toLowerCase();
  return PROTOCOL_COLORS[lower] ?? "#e6edf3"
}

export function PacketList({ packets, selectedIndex, onSelect, height }: Props) {
  const parentRef = useRef<HTMLDivElement>(null);

  const firstTimestamp = useMemo(() => {
    if(packets.length === 0) return 0;
    return Number(packets[0].header.timestamp_ns) / 1e9;
  }, [packets])

  const summaries = useMemo(() => {
    return packets.map(p => getPacketSummary(p));
  }, [packets])

  const rowVisualizer = useVirtualizer({
    count: packets.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 22,
    overscan: 8
  })

  const renderCell = (packet: PacketRecord, summary: (typeof summaries)[0], _i: number, columnKey: string) => {
    const baseStyle = {height: "22px"};

    switch (columnKey) {
      case "no":
        return (
          <div key={columnKey} style={{...baseStyle, width: 55, flexShrink: 0}} className="px-1 flex items-center">
            {_i + 1}
          </div>
        )

      case "time":
        return (
          <div
          key={columnKey}
          style={{...baseStyle, width: 100, flexShrink: 0}}
          className="px-1 flex items-center text-text-secondary">
            {((Number(packet.header.timestamp_ns) / 1e9) - firstTimestamp).toFixed(6).padStart(10, "0")}
          </div>
        );

      case "src":
        return (
          <div
          key={columnKey}
          style={{ ...baseStyle, width: 145, flexShrink: 0 }}
          className="px-1 flex items-center">
            {summary.src}
          </div>
        );

      case "dst":
        return (
          <div
          key={columnKey}
          style={{...baseStyle, width: 145, flexShrink: 0}}
          className="px-1 flex items-center">
            {summary.dst}
          </div>
        );

      case "protocol":
        return (
          <div
          key={columnKey}
          style={{
            ...baseStyle,
            width: 85,

            flexShrink: 0,
            color: getProtocolColor(summary.protocol)
          }}
          className="px-1 flex items-center">
            {summary.protocol}
          </div>
        );
          
        case "length":
          return (
            <div
            key={columnKey}
            style={{ ...baseStyle, width: 65, flexShrink: 0}}
            className="px-1 flex items-center text-text-secondary">
              {packet.data.type === "ethernet" ? packet.data.raw.length : "?"}
            </div>
          );

        case "info":
          return (
            <div
            key={columnKey}
            style={{ ...baseStyle, flex: 1, minWidth: 0 }}
            className="px-1 flex items-center truncate text-text-secondary">
              {summary.info}
            </div>
          );
        default:
          return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-bg-primary">
      <div className="h-[26px] flex items-center bg-bg-secondary border-b border-border shrink-0" style={{paddingLeft: 4, paddingRight: 4}}>
        {COLUMNS.map(col => (
          <div
          key={col.key}
          className="text-[11px] uppercase tracking-[0.08em] text-text-secondary"
          style={{
            width: col.width,
            flexShrink: 0,
            paddingLeft: 4,
            paddingRight: 4
          }}>
            {col.label}
          </div>
        ))}
      </div>

      <div
      ref={parentRef}
      className="flex-1 overflow-auto"
      style={{height: height-26}}>
        {packets.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-text-secondary text-xs">No packets</span>
          </div>
        ) : (
          <div style={{
            height: rowVisualizer.getTotalSize(),
            width: "100%",
            position: "relative"
          }}>
            {rowVisualizer.getVirtualItems().map(virtualRow => {
              const packet = packets[virtualRow.index]
              const summary = summaries[virtualRow.index];

              const isSelected = selectedIndex === virtualRow.index;

              return (
                <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={rowVisualizer.measureElement}
                className="absolute top-0 left-0 w-full flex items-center cursor-pointer text-xs"
                style={{
                  height: virtualRow.size,
                  transform: `translatey(${virtualRow.start}px)`,
                  backgroundColor: isSelected ? SELECTED_BG : "transparent"
                }}
                onClick={() => onSelect(virtualRow.index)}
                onMouseEnter={(e) => {
                  if(!isSelected) {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor = HOVER_BG;
                  }
                }}
                onMouseLeave={(e) => {
                  if(!isSelected) {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent";
                  }
                }}>
                  {COLUMNS.map(col => renderCell(packet, summary, virtualRow.index, col.key))}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}