function ScreenshotPlaceholder({
  src,
  label,
}: {
  src?: string;
  label: string;
}) {
  return (
    <div className="overflow-hidden rounded border border-border">
      <img src={src} alt={label} className="w-full" />
    </div>
  );
}

export function WhatTheHell() {
  const handleBack = () => {
    window.location.href = '/'
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <div
        className="max-w-[680px] mx-auto px-6 py-12"
        style={{
          paddingLeft: "24px",
          paddingRight: "24px",
          paddingTop: "48px",
          paddingBottom: "48px",
        }}
      >
        {/* HEADER  */}
        <header className="mb-8">
          <h1
            className="text-4xl font-bold mb-2"
            style={{ color: "var(--color-accent)" }}
          >
            what the hell is this?
          </h1>
          <p
            className="text-base mb-6"
            style={{ color: "var(--color-text-muted)" }}
          >
            a packet analyser that runs entirely in your browser
          </p>
          <div
            className="border-t"
            style={{ borderColor: "var(--color-border)" }}
          />
        </header>

        {/* SECTION ONE  */}
        <section className="mb-10">
          <h2
            className="text-sm uppercase tracking-wider mb-4"
            style={{ color: "var(--color-protocol-title)" }}
          >
            what does that even mean
          </h2>
          <p
            className="text-sm loading-relaxed mb-4"
            style={{ color: "var(--color-text-primary", lineHeight: 1.7 }}
          >
            Everytime you visit a website, send a message, or load a video, your
            computer is sending and receiving tiny chunks of data called
            packets. Normally this happens invisibily, but a packet analyser
            lets you see those packets: where they came from, where they are
            going, whats inside them and what not.
          </p>
          <div
            className="pl-4 py-3 pr-4"
            style={{
              backgroundColor: "var(--color-bg-tertiary)",
              borderLeft: "3px solid var(--color-accent)",
            }}
          >
            <p
              className="text-sm"
              style={{ color: "var(--color-text-primary)" }}
            >
              THink of it like an x-ray for your network traffic.
            </p>
          </div>
        </section>

        {/* SECTION TWO  */}
        <section className="mb-10">
          <h2
            className="text-sm uppercase tracking-wider mb-4"
            style={{ color: "var(--color-protocol-title)" }}
          >
            what is .pcap file
          </h2>
          <p
            className="text-sm leading-relaxed mb-4"
            style={{ color: "var(--color-text-primary)", lineHeight: 1.7 }}
          >
            A .pcap file is a recording of network traffic. Security
            researchers, CTF players, and network engineers use them constantly.
          </p>
          <div
            className="pl-4 py-3 pr-4"
            style={{
              backgroundColor: "var(--color-bg-tertiary)",
              borderLeft: "3px solid var(--color-border)",
            }}
          >
            <p
              className="text-sm"
              style={{ color: "var(--color-text-primary)" }}
            >
              If you dont have one then you can use the two samples provided!,
              or you can just generate one using wireshark, tcpdump, WinDump, or
              python (scapy)
            </p>
          </div>
        </section>

        {/* THIRD SECTION  */}
        <section className="mb-10">
          <h2
            className="text-sm uppercase tracking-wider mb-4"
            style={{ color: "var(--color-protocol-title)" }}
          >
            the three panes
          </h2>
          <p
            className="text-sm leading-relaxed mb-4"
            style={{ color: "var(--color-text-primary)", lineHeight: 1.7 }}
          >
            When you load a capture, you will see three main aeras:
          </p>
          <div className="flex gap-2 mb-4">
            <ScreenshotPlaceholder
              src="/assets/packet-list.png"
              label="Packet List"
            />
            <ScreenshotPlaceholder
              src="/assets/packet-details.png"
              label="Packet Details"
            />
            <ScreenshotPlaceholder
              src="/assets/packet-hex.png"
              label="Packet Raw Hex Dump"
            />
          </div>
          <div className="flex gap-3">
            <span
              className="font-bold shrink-0 text-sm"
              style={{ color: "var(--color-protocol-title)" }}
            >
              Packet List
            </span>
            <span className="text-sm">
              shows every packet in the capture with timestamps, source/dest,
              protocol, and length
            </span>
          </div>
          <div className="flex gap-3">
            <span
              className="font-bold shrink-0 text-sm"
              style={{ color: "var(--color-protocol-title)" }}
            >
              Details
            </span>
            <span className="text-sm">
              expands the selected packet into its full protocol stack — click
              the arrows to expand
            </span>
          </div>
          <div className="flex gap-3">
            <span
              className="font-bold shrink-0 text-sm"
              style={{ color: "var(--color-protocol-title)" }}
            >
              Hex Dump
            </span>
            <span className="text-sm">
              raw bytes of the packet — click any field to highlight it in the
              hex view
            </span>
          </div>
        </section>

        {/* FOUTTH SECTION  */}
                <section className="mb-10">
          <h2 className="text-sm uppercase tracking-wider mb-4" style={{ color: "var(--color-protocol-title)" }}>
            how to try it
          </h2>
          
          {/* step 1 */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono font-bold" style={{ color: "var(--color-text-muted)" }}>1</span>
              <span className="font-bold" style={{ color: "var(--color-protocol-title)" }}>get a .pcap file</span>
            </div>
            <p className="text-sm mb-2" style={{ color: "var(--color-text-primary)" }}>
              Use the given sample files or record your own with Wireshark or tcpdump.
            </p>
            <div className="flex gap-2">
              <ScreenshotPlaceholder src="/assets/upload-pcap.png" label="sample files" />
            </div>
          </div>

          {/* step 2 */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono font-bold" style={{ color: "var(--color-text-muted)" }}>2</span>
              <span className="font-bold" style={{ color: "var(--color-protocol-title)" }}>click packets to inspect</span>
            </div>
            <p className="text-sm mb-2" style={{ color: "var(--color-text-primary)" }}>
              Click any row in the packet list. Expand the protocol layers in the details pane, click the arrows to go down from ethernet all the way to the application data
            </p>
            <div className="flex gap-2">
              <ScreenshotPlaceholder src="/assets/select-packet.png" label="packet details" />
            </div>
          </div>

          {/* step 3 */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono font-bold" style={{ color: "var(--color-text-muted)" }}>3</span>
              <span className="font-bold" style={{ color: "var(--color-protocol-title)" }}>use follow stream</span>
            </div>
            <p className="text-sm mb-2" style={{ color: "var(--color-text-primary)" }}>
              For TCP packets, click the "Follow Stream" button at the bottom of the details pane. This reassembles the full TCP stream, HTTP requests/responses or FTP sessions as a chat log. (fpt soon!)
            </p>
            <div className="flex gap-2">
              <ScreenshotPlaceholder src="/assets/follow-stream.png" label="follow stream" />
            </div>
          </div>

          {/* step 4 */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono font-bold" style={{ color: "var(--color-text-muted)" }}>4</span>
              <span className="font-bold" style={{ color: "var(--color-protocol-title)" }}>find the interesting stuff ig</span>
            </div>
            <p className="text-sm" style={{ color: "var(--color-text-primary)" }}>
              Look for HTTP: those show unencrypted content sometimes. DNS queries are also interesting (i hate them tho). soon i will add FTP application layer too
            </p>
            <div className="flex gap-2">
              <ScreenshotPlaceholder src="/assets/http-stream.png" label="http stream result" />
            </div>
          </div>
        </section>

                <footer>
          <div className="border-t mb-6" style={{ borderColor: "var(--color-border)" }} />
          <p 
            className="text-center text-xs mb-4" 
            style={{ color: "var(--color-text-muted)" }}
          >
            built for Hack Club YSWS flavortown!
          </p>
          <p className="text-center">
            <button
              onClick={handleBack}
              className="text-xs transition-colors cursor-pointer bg-transparent border-none p-0"
              style={{ color: "var(--color-accent)" }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
            >
              ← back to da tool
            </button>
          </p>
        </footer>
      </div>
    </div>
  );
}
