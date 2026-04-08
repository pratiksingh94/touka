# Touka / とうか

Browser based packet analyzer.  
Made with no external library for analysis or parsing!

*とうか　(透過) = transparency / transmission / passing through!*

> Status: under active development :3

## Screenshots

![home page](https://cdn.hackclub.com/019d26a1-9a14-7e91-9b6c-dd7089b50f0d/localhost_5174_.png)


## Testing

There are multiple ways to try my project!

### 1. Use the sample capture
Use the provided `test.pcap` file on site.

> This file is generated using Scapy (Python) and includes most of the supported protocols.

---

### 2. Use external sample captures
Download captures from [Wireshark SampleCaptures](https://wiki.wireshark.org/samplecaptures)

> Note: These files contain a WIDE variety of protocols.
> Currently supported: Ethernet and its related protocols (IP, TCP, UDP, ICMP, ARP).

---

### 3. Generate your own captures
You can generate custom `.pcap` files using Scapy.  
Check out: [/gen-pcap](/gen-pcap/)

```bash
python -m venv venv
source venv/bin/activate # Use the appropriate command for your shell

pip install scapy

# Edit gen.py if needed, or run directly to generate test.pcap
python3 gen.py
```

---

### 4. Capture your own packets
Use Wireshark/Tcpdump to capture your own network traffic and upload the `.pcap` file.

> This project runs entirely on the client side. Your files are not uploaded or stored anywhere!!



## To-Do (vague asf)
1. add more link layer stuff
2. add more details in detail builders like checksum to keep all the struct data

## Things that i did but not completely (this is for me):
1. complete ICMP builder functions with NDP stuff
2. complete more ICMPv6 stuff left, RA/RS

## Logs
- [Changelog](./CHANGELOG.md)


## Tech Stack
- React + TypeScript
- Vite
- Tailwind CSS


