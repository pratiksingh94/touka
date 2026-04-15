import type { HTTPStream } from "@/parser/dissectors/application/HTTP1.1/types";

// ts different from the one used in hexpane
function isPrintable(body: Uint8Array | null): boolean {
  if (!body || body.length === 0) return false;
  for (const byte of body) {
    if (byte < 0x20 || byte > 0x7e) return false;
  }

  return true;
}

function StatusCodeColor({ code }: { code: number }) {
  let color = "text-text-muted";

  if (code >= 200 && code < 300) {
    color = "text-green-400";
  } else if (code >= 300 && code < 400) {
    color = "text-yellow-400";
  } else if (code >= 400) {
    color = "text-red-400";
  }

  return <span className={color}>{code}</span>;
}

export function HTTPStreamDisplay({ stream }: { stream: HTTPStream }) {
  const pairs: Array<{
    req: (typeof stream.requests)[0];
    res: (typeof stream.response)[0];
  }> = [];

  for (
    let i = 0;
    i < Math.max(stream.requests.length, stream.response.length);
    i++
  ) {
    pairs.push({
      req: stream.requests[i],
      res: stream.response[i],
    });
  }

  return (
    <div className="space-y-3">
      {pairs.map((p, i) => (
        <div className="border border-border rounded overflow-hidden" key={i}>
          {p.req && (
            <div className="bg-bg-primary">
              <div className="px-3 py-1.5 bg-accent/10 border-b border-border flex items-center gap-2">
                <span className="px-1.5 py-0.5 bg-accent text-bg-primary text-[10px] font-medium rounded">
                  REQUEST
                </span>
                <span className="text-primary text-sm">
                  {p.req.method} {p.req.path}
                </span>
              </div>

              <div className="p-2 space-y-1">
                {Object.entries(p.req.headers).map(([key, value]) => (
                  <div key={key} className="flex gap-2 text-[11px]">
                    <span className="text-text-muted min-w-[100px] shrink-0">
                      {key}:
                    </span>
                    <span className="text-primary flex-1 break-all">
                      {value}
                    </span>
                  </div>
                ))}
                {p.req.body && (
                  <div className="mt-2 pt-2 border- border-border">
                    {isPrintable(p.req.body) ? (
                      <pre
                        className="text-primary text-[10px] whitespace-pre-wra
                   break-all"
                      >
                        {new TextDecoder().decode(p.req.body)}
                      </pre>
                    ) : (
                      <span className="text-text-muted text-[11px]">
                        binary body ({p.req.body.length} bytes)
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {p.res && (
            <div className="bg-bg-primary">
              <div className="px-3 py-1.5 bg-accent/10 border-b border-border flex items-center gap-2">
                <span className="px-1.5 py-0.5 bg-accent text-bg-primary text-[10px] font-medium rounded border border-border">
                  RESPONSE
                </span>
                <span className="text-sm">
                  <StatusCodeColor code={p.res.statusCode}/> {p.res.statusText}
                </span>
              </div>
              <div className="p-2 space-y-1">
                {Object.entries(p.res.headers).map(([key, value]) => (
                  <div key={key} className="flex gap-2 text-[11px]">
                    <span className="text-text-muted min-w-[100px] shrink-0">{key}:</span>
                    <span className="text-primary flex-1 break-all">{value}</span>
                  </div>
                ))}
                {p.res.body && (
                  <div className="mt-2 pt-2 border-t border-border">
                    {isPrintable(p.res.body) ? (
                      <pre className="text-primary text-[10px] whitespace-pre-wrap break-all">{new TextDecoder().decode(p.res.body)}</pre>
                    ) : (
                      <span className="text-text-muted text-[11px]">binary body ({p.res.body.length} bytes)</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
