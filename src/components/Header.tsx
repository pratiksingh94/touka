export function Header() {
  return (
    <header className="pt-20 pb-12 px-6">
      <h1 className="text-4xl font-semibold tracking-tight text-text-primary mb-2">
        Touka / とうか
      </h1>
      <div className="flex items-center gap-4">
        <p className="text-sm text-text-muted tracking-wide">Packet Transparency Tool</p>
        <span className="text-border">|</span>
        <a href="/whatthehell" className="text-sm transition-colors hover:text-accent text-accent">What is this? (CLICK IF YOU DONT KNOW)</a>
      </div>
    </header>
  )
}