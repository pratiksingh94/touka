import { parsePCAP } from "@/parser/core/parse";
import { WorkspaceHeader } from "./WorkspaceHeader";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PacketRecord } from "@/parser/core/types";
import { HorizontalResizeHandle, VertocalResizeHandle } from "./ResizeHandle";
import { PacketList } from "./PacketList/PacketList";
import { buildPacketDetails } from "@/views/PacketDetail/buildPacketDetails";
import type { PacketDetails, SelectedField } from "@/views/PacketDetail/types";
import { PaneHeader } from "./PaneHeader";
import { PacketDetailsPane } from "./PacketDetail/PacketDetails";
import { HexPane } from "./HexPane/HexPane";

interface Props {
  file: File;
  onBack: () => void;
}

export function WorkSpace({ file, onBack }: Props) {
  const [packets, setPackets] = useState<PacketRecord[]>([]);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [protocolDetail, setProtocolDetail] = useState<PacketDetails[]>([])
  const [selectedField, setSelectedField] = useState<SelectedField>(null)

  const [topBodyHeight, setTopBodyHeight] = useState(0);

  const topPaneRef = useRef<HTMLDivElement>(null);

  const getInitialSizes = () => ({
    top: Math.floor(window.innerHeight * 0.55),
    left: Math.floor(window.innerWidth * 0.55)
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
    const packet = packets[index];
    if(!packet) return;

    setSelectedIndex(index)

    const details = buildPacketDetails(packet)
    setProtocolDetail(details);
    setSelectedField(null);
    // console.log(details)
  }, [packets]);

  const handleFieldSelect = useCallback((field: SelectedField) =>{
    setSelectedField(field);
  }, [])
  return (
    <div className="h-screen flex flex-col bg-bg-primary overflow-hidden">
      <WorkspaceHeader filename={file.name} onBack={onBack}/>

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
        <div style={{width: leftWidth}} className="shrink-0 flex flex-col">
          <PaneHeader leftText="Packet Details"/>
          <div className="flex-1 overflow-hidden">
            <PacketDetailsPane
            protocols={protocolDetail}
            selectedField={ selectedField}
            onFieldSelect={handleFieldSelect}
            />
          </div>
        </div>

        <VertocalResizeHandle onResize={handleVerticalResize}/>

      <div className="flex-1 min-w-0 overflow-hidden">
        <HexPane
        raw={selectedIndex !== null ? packets[selectedIndex].raw : null}
        protocols={protocolDetail}
        selectedField={selectedField}
        onFieldSelect={handleFieldSelect}
        />
      </div>
      </div>
    </div>
  )
}