import { parsePCAP } from "@/parser/core/parse";
import { WorkspaceHeader } from "./WorkspaceHeader";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PacketRecord } from "@/parser/core/types";
import { HorizontalResizeHandle, VertocalResizeHandle } from "./ResizeHandle";
import { ProtocolTreePane } from "./panes/ProtocolTreePane";
import { HexDumpPane } from "./panes/HexDumpPane";
import { PacketList } from "./PacketList/PacketList";
import { PaneHeader } from "./PaneHeader";

interface Props {
  file: File;
  onBack: () => void;
}

export function WorkSpace({ file, onBack }: Props) {
  const [packets, setPackets] = useState<PacketRecord[]>([]);

  const [selectedIndex, setSelectIndex] = useState<number | null>(null);

  const [topBodyHeight, setTopBodyHeight] = useState(0);

  const topPaneRef = useRef<HTMLDivElement>(null);

  const getInitialSizes = () => ({
    top: Math.floor(window.innerHeight * 0.55),
    left: Math.floor(window.innerWidth * 0.4)
  });

  const [topHeight, setTopHeight] = useState(getInitialSizes().top);
  const [leftWidth, setLeftWidth] = useState(getInitialSizes().left);

  useEffect(() => {
    parsePCAP(file)
    .then(result => setPackets(result.packets))
    .catch(console.error)
  }, [file])

  useEffect(() => {
    const pane = topPaneRef.current;
    if(!pane) return;

    const updateHeight = () => {
      const headerHeight = 26;
      const totalHeight = pane.clientHeight;
      setTopBodyHeight(Math.max(0, totalHeight - headerHeight))
    }

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(pane);

    return () => observer.disconnect();
  }, [topHeight])
  
  const handleHorizontalResize = useCallback((delta: number) => {
    setTopHeight(prev => Math.max(150, prev + delta))
  }, []);

  const handleVerticalResize = useCallback((delta: number) => {
    setLeftWidth(prev => Math.max(180, prev + delta))
  }, [])

  const handleSelect = useCallback((index: number) => {
    setSelectIndex(index)
  }, []);
  return (
    <div className="h-screen flex flex-col bg-bg-primary overflow-hidden">
      <WorkspaceHeader filename={file.name} onBack={onBack}/>


      {/* FIRST PANE, PACKET LIST  */}
      <div className="shrink-0" style={{height: topHeight}}>
        <div ref={topPaneRef} className="h-full flex flex-col">
          <PacketList
          packets={packets}
          selectedIndex={selectedIndex}
          onSelect={handleSelect}
          height={topBodyHeight || topHeight}/>
        </div>
      </div>

      <HorizontalResizeHandle onResize={handleHorizontalResize}/>

      <div className="flex-1 flex overflow-hidden">
        <div style={{width: leftWidth}} className="shrink-0">
          <ProtocolTreePane/>
        </div>

        <VertocalResizeHandle onResize={handleVerticalResize}/>

      <div className="flex-1">
        <HexDumpPane/>
      </div>
      </div>
    </div>
  )
}