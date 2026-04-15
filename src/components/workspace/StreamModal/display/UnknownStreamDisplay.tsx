import type { ApplicationLayer, UnknownApplicationLayer } from "@/parser/dissectors/application/types";



export function UnknownStreamDisplay({ application }: {application: ApplicationLayer}) {
  if(application.type === "unknown-application" && "clientToServerRaw" in application) {
    const unknown = application as UnknownApplicationLayer;
    return (
      <div className="pt-3 text-xs text-text-muted">
        <div>No application dissector for this stream</div>
        <div className="mt-2 space-y-1">
          <div>Client → Server: {unknown.clientToServerRaw.length} bytes</div>
          <div>Server → Client: {unknown.serverToClientRaw.length}</div>
        </div>
      </div>
    )
  }
  return <div className="pt-3 text-text-muted text-xs">Unknown application type</div>
}