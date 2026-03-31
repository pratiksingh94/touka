import { parsePCAP } from "@/parser/core/parse";
import { WorkspaceHeader } from "./WorkspaceHeader";
import { useCallback, useEffect, useState } from "react";
import type { PacketRecord } from "@/parser/core/types";
import { PacketListPane } from "./panes/PacketListPane";
import { HorizontalResizeHandle, VertocalResizeHandle } from "./ResizeHandle";
import { ProtocolTreePane } from "./panes/ProtocolTreePane";
import { HexDumpPane } from "./panes/HexDumpPane";

interface Props {
  file: File;
  onBack: () => void;
}

export function WorkSpace({ file, onBack }: Props) {
  const [packets, setPackets] = useState<PacketRecord[]>([])

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
  
  const handleHorizontalResize = useCallback((delta: number) => {
    setTopHeight(prev => Math.max(150, prev + delta))
  }, []);

  const handleVerticalResize = useCallback((delta: number) => {
    setLeftWidth(prev => Math.max(180, prev + delta))
  }, [])
  return (
    <div className="h-screen flex flex-col bg-bg-primary overflow-hidden">
      <WorkspaceHeader filename={file.name} onBack={onBack}/>

      <div className="shrink-0" style={{height: topHeight}}>
        <PacketListPane packetCount={packets.length}/>
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