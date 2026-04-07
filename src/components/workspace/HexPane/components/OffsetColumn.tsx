import { formatOffset } from "../utils/formatBytes";

interface Props {
  totalBytes: number;
  bytesPerRow: number;
}

export function OffsetColumn({totalBytes, bytesPerRow}: Props) {
  const rows = Math.ceil(totalBytes / bytesPerRow);

  return (
    <div className="select-none shrink-0">
      {Array.from({length: rows}, (_, rowindex) => {
        const offset = rowindex * bytesPerRow;
        return (
          <div
          key={rowindex}
          className="h-4 text-text-muted font-mono text-xs leading-5 w-12 text-right pr-3"
          >
            {formatOffset(offset)}
          </div>
        )
      })}
    </div>
  )
}