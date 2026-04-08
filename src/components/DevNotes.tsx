export function DevNotes() {
  return (
    <div className="text-sm text-text-secondary space-y-2">
      <p>This project is still under active development :3 expect incomplete features and frequent changes!</p>
      
      <p>
        Currently, only the Ethernet link layer and its related protocols (IP, TCP, UDP, ICMP, ARP) are supported.
        More protocols will be added over time.
      </p>

      {/* <p>
        Packet parsing is not fully detailed yet. Some fields (e.g., checksums) are not included as its an MPV thingy right now.
      </p> */}

      <p>
        Protocol implementations like ICMPv4 and ICMPv6 are minimal for now, only type and code are parsed.
        Additional fields and deeper parsing will be added in future updates!!
      </p>
    </div>
  )
}