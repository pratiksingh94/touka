interface Props {
  filename: string;
  onBack: () => void;
}

export function WorkspaceHeader({ filename, onBack }: Props) {
  return (
    <header className="h-10 px-4 flex items-center gap-4 border-b border-border-muted bg-bg-secondary">
      <button
      onClick={onBack}
      className="text-text-muted hover:text-text-primary transition-colors cursor-pointer"
      >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h1 className="text-sm font-medium  text-text-primary">Toka</h1>
      <span className="text-text-muted">/</span>
      <span className="text-sm text-text-secondary truncate max-w-md">{filename}</span>
    </header>
  )
}