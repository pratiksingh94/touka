import { About } from "./About";
import { DevNotes } from "./DevNotes";
import { Links } from "./Links";

export function InfoSection() {
  return (
    <div className="max-w-3xl mx-auto space-y-10 text-left pb-12">
      
    <section>
      <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">
        About
      </h3>
      <About/>
    </section>

    <section>
      <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">
        notes from developer
      </h3>
      <DevNotes/>
    </section>

    <section>
      <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">
        Links
      </h3>
      <Links/>
    </section>

  </div>
  )
}