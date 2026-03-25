import { WorkspaceHeader } from "./WorkspaceHeader";

interface Props {
  file: File;
  onBack: () => void;
}

export function WorkSpace({ file, onBack }: Props) {
  return (
    <div className="h-screen flex flex-col bg-bg-primary">
      <WorkspaceHeader filename={file.name} onBack={onBack}/>
      <main className="flex-1 overflow-hidden">
        ee
      </main>
    </div>
  )
}