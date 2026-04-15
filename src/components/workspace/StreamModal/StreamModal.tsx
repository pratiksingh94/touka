import type { ReassembledStream } from "@/TCPReassembly/types";
import { HTTPStreamDisplay } from "./display/HTTPStreamDisplay";
import { UnknownStreamDisplay } from "./display/UnknownStreamDisplay";

interface Props {
  stream: ReassembledStream | null;
  onClose: () => void;
}

function EmptyStreamDisplay() {
  return (
    <div className="p-3 text-xs text-text-muted">
      <div>No application data in this stream</div>
      <div className="mt-2 space-y-1">
        <div>Client → Server: 0 bytes</div>
        <div>Server → Client: 0 bytes</div>
      </div>
    </div>
  )
}


function StreamContent({stream}: {stream: ReassembledStream}) {
  if(!stream.application) {
    return <EmptyStreamDisplay/>
  }

  const app = stream.application;

  switch (app.type) {
    case "http":
      return <HTTPStreamDisplay stream={app}/>
    default:
      return <UnknownStreamDisplay application={app}/>
  }
}

export function StreamModal({ stream, onClose }: Props) {
  if(!stream) return null;

  return (
    <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    onClick={onClose}
    >
      <div
      className="bg-bg-secondary border border-border rounded-md overflow-hidden flex flex-col"
      style={{width: "min(900px, 95vw)", height: "min(700px, 85vh"}}
      onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-bg-tertiary shrink-0">
          <span className="text-text-muted text-[11px] truncate pr-4">Stream: {stream.streamKey}</span>
          <button
          onClick={onClose}
          className="text-text-muted cursor-pointer hover:text-text-primary transition-colors text-xl leading-none shrink-0"
          >×</button>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <StreamContent stream={stream}/>
        </div>
      </div>
    </div>
  )
}