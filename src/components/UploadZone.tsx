import { useState } from "react";

export function UploadZone({onFileSelect}: {onFileSelect: (f: File) => void}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true);
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith(".pcap")) {
      onFileSelect(file);
    }
  }

  const handleClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pcap"
    input.onchange  = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if(file) {
        onFileSelect(file);
      }
    }

    input.click()
  }


  return (
    <div
    onClick={handleClick}
    onDragOver={handleDragOver}
    onDragLeave={handleDragLeave}
    onDrop={handleDrop}
    className={`mx-auto max-w-xl w-full px-8 py-16 border border-dashed border-border-muted rounded-lg cursor-pointer transition-colors duration-150 ${isDragging ? 'border-accent bg-accent-muted' : 'hover:border-border'}`}
    >
      <div className="flex flex-col items-center gap-3">
        <svg
          className="w-10 h-10 text-text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p className="text-text-secondary text-sm">Drop a .pcap file here or click upload</p>
      </div>
    </div>
  )
}