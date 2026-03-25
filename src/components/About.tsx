export function About() {
  return (
    <div className="text-sm text-text-secondary space-y-2">
      <p> A PCAP file or Packet analyser in web just like wireshark! </p>
      <p>NO external library used for parsing or analysis, purely hand-written logic.</p>
      <p>Made for a YSWS by HackCub <a href="https://flavortown.hackclub.com" target="_blank" className="text-accent hover:underline">Flavortown</a>.</p>
    </div>
  )
}