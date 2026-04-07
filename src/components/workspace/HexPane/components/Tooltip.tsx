import { toHex } from "../utils/formatBytes";

interface Props {
  visible: boolean;
  x: number;
  y: number;
  offset: number;
}

export function Tooltip({ visible, x, y, offset}: Props) {
  if(!visible) return null;

  const w = 120;
  const h = 24;

  const adjX = Math.min(x, window.innerWidth - w - 10);
  const adjY = Math.min(y, window.innerHeight - h - 10);

  return (
    <div className="fixed z-50 pointer-events-none px-2 py-1 text-[11px] font-mono bg-bg-secondary border border-border shadow-md rounded"
    style={{ left: adjX, top: adjY}}
    >
      <span className="text-text-muted">Offset: </span>
      <span className="text-text-primary">0x{toHex(offset, 4)}</span>
      <span className="text-text-muted"> ({offset})</span>
    </div>
  )
}