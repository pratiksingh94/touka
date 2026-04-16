import { useState } from "react";

const isValidPCAPFIle = (file: File) => {
  return file.name.toLowerCase().endsWith(".pcap")
}


type SampleFile = {
  name: string;
  path: string;
  description: string;
}

const SAMPLE_FILES: SampleFile[] = [
  {
    name: "test.pcap",
    path: "/test-samples/test.pcap",
    description: "Mixed protocols (DNS, HTTP, ARP, ICMP)"
  },
  {
    name: "http-test.pcap",
    path: "/test-samples/http-test.pcap",
    description: "HTTP-heavy (GET, POST, 200, 404, 401 responses)"
  }
]




export function UploadZone({onFileSelect}: {onFileSelect: (f: File) => void}) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null)
  const [loadingSample, setLoadingSample] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true);
    setError(null);
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    const file = e.dataTransfer.files[0];
    if(isValidPCAPFIle(file)) {
      onFileSelect(file);
    } else {
      setError("Only .pcap files are supported!")
    }
  }

  const handleClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pcap,application/vnd.tcpdump.pcap,application/octet-stream"
    input.onchange  = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if(file) {
        if(isValidPCAPFIle(file)) {
          setError(null);
          onFileSelect(file)
        } else {
          setError("Only .pcap files are supported!")
        }
      }
    }

    input.click()
  }


  const handleLoadSample = async (e: React.MouseEvent, sample: SampleFile) => {
    e.stopPropagation();
    setError(null);
    setLoadingSample(sample.name)
    try {
      const res = await fetch(sample.path);
      const blob = await res.blob();
      const file = new File([blob], sample.name, { type: "application/octet-stream" })

      onFileSelect(file);
    } catch (err) {
      console.error("failed to load sample file", error);
    } finally {
      setLoadingSample(null);
    }
  }


  return (
    <div className="mx-auto max-w-xl w-full space-y-6">
      <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`px-8 py-16 border border-dashed border-border-muted rounded-lg cursor-pointer transition-colors duration-150 ${isDragging ? 'border-accent bg-accent-muted' : 'hover:border-accent'}`}
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

      {error && (
        <div className="text-red-500 text-xs text-center">{error}</div>
      )}

      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-border"/>
        <span className="text-text-muted text-xs">OR</span>
        <div className="flex-1 h-px bg-border"/>
      </div>

      <div className="space-y-2">
        <p className="text-text-muted text-xs text-center mb-2">Load sample files</p>
        <div className="grid grid-cols-2 gap-2">
          {SAMPLE_FILES.map(s => (
            <button
            key={s.name}
            onClick={(e) => handleLoadSample(e, s)}
            disabled={loadingSample !== null}
            className="py-3 px-4 border rounded-lg cursor-pointer border-border text-left hover:border-acent hover:bg-bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="text-text-primary text-sm font-medium">{s.name}</div>
              <div className="text-text-muted text-[10px] mt-0.5 line-clamp-2">{s.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}