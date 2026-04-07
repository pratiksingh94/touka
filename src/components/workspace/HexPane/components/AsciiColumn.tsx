import { isPrintable } from "../utils/isPrintable";

interface Props {
  data: Uint8Array;
  bytesPerRow: number;
  selectedField: {
    offset: number;
    length: number
  } | null;
  onShowTooltip: (e: React.MouseEvent, offset: number) => void;
  onByteClick: (byteOffset: number) => void;
}

export function AsciiColumn({ data, bytesPerRow, selectedField, onShowTooltip, onByteClick}: Props) {
  const rows = Math.ceil(data.length/bytesPerRow);

  return (
    <div className="font-mono text-xs shrink-0">
      {Array.from({length: rows}, (_, rowIndex) => {
        const rowStart = rowIndex * bytesPerRow;
        const rowEnd = Math.min(rowStart + bytesPerRow, data.length);
        const rowBytes = Array.from(data.slice(rowStart, rowEnd))

        return (
          <div key={rowIndex} className="h-5 leading-5 flex">
            {rowBytes.map((byte, colIndex) => {
              const byteIndex = rowStart + colIndex;
              const isHighlighted = selectedField !== null && byteIndex >= selectedField.offset && byteIndex < selectedField.offset + selectedField.length;
              const printable = isPrintable(byte);

              return (
                <span
                key={colIndex}
                className={`w-[9px] text-center select-none shrink-0 
                  ${isHighlighted ? "bg-accent/30 text-text-primary" : printable ? "text-text-primary" : "text-text-muted"}
                  ${colIndex === 8 ? "mr-3" : ""}
                  hover:bg-accent/20 cursor-pointer`}
                  onClick={() => onByteClick(byteIndex)}
                  onMouseEnter={(e) => {
                    e.stopPropagation();
                    onShowTooltip(e, byteIndex)
                  }}
                >
                  {printable ? String.fromCharCode(byte): "·"}
                </span>
              );
            })}
            {rowBytes.length < bytesPerRow && Array.from({length: bytesPerRow - rowBytes.length}, (_, i) => (
              <span key={`pad-${i}`} className="w-[9x] text-center shrink-0">&nbsp;</span>
            ))}
          </div>
        )
      })}
    </div>
  )
}