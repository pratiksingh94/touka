interface Props {
  leftText: string;
  rightText?: string;
}

export function PaneHeader({leftText, rightText}: Props) {
  return (
  <div className="h-7 px-3 flex items-center justify-between bg-bg-secondary border-b border-border">
    <span className="uppercase text-[11px] tracking-[0.08em] text-text-secondary">
      {leftText}
    </span>
    {rightText && (
      <span className="uppercase text-[11px] tracking-[0.08em] text-text-secondary">
        {rightText}
      </span>
    )}
  </div>
  )
}