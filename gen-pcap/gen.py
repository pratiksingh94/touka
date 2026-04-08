from scapy.all import *

packets = []

# ARP Request
packets.append(
    Ether(src="aa:bb:cc:dd:ee:01", dst="ff:ff:ff:ff:ff:ff") /
    ARP(op=1,
        hwsrc="aa:bb:cc:dd:ee:01", psrc="192.168.1.1",
        hwdst="00:00:00:00:00:00", pdst="192.168.1.2")
)

# ARP Reply
packets.append(
    Ether(src="aa:bb:cc:dd:ee:02", dst="aa:bb:cc:dd:ee:01") /
    ARP(op=2,
        hwsrc="aa:bb:cc:dd:ee:02", psrc="192.168.1.2",
        hwdst="aa:bb:cc:dd:ee:01", pdst="192.168.1.1")
)


# Echo Request (ping)
packets.append(
    Ether(src="aa:bb:cc:dd:ee:01", dst="aa:bb:cc:dd:ee:02") /
    IP(src="192.168.1.1", dst="192.168.1.2", ttl=64) /
    ICMP(type=8, code=0, id=0x1234, seq=1) /
    Raw(b"pingpingpingping")
)

# Echo Reply
packets.append(
    Ether(src="aa:bb:cc:dd:ee:02", dst="aa:bb:cc:dd:ee:01") /
    IP(src="192.168.1.2", dst="192.168.1.1", ttl=64) /
    ICMP(type=0, code=0, id=0x1234, seq=1) /
    Raw(b"pingpingpingping")
)

# Destination Unreachable - Port Unreachable (type=3, code=3)
packets.append(
    Ether(src="aa:bb:cc:dd:ee:02", dst="aa:bb:cc:dd:ee:01") /
    IP(src="192.168.1.2", dst="192.168.1.1") /
    ICMP(type=3, code=3) /
    IP(src="192.168.1.1", dst="192.168.1.2") /
    UDP(sport=12345, dport=9999)
)

# TTL Exceeded (what traceroute generates)
packets.append(
    Ether(src="aa:bb:cc:dd:ee:02", dst="aa:bb:cc:dd:ee:01") /
    IP(src="192.168.1.2", dst="192.168.1.1") /
    ICMP(type=11, code=0) /
    IP(src="192.168.1.1", dst="8.8.8.8", ttl=1) /
    UDP(sport=33434, dport=33434)
)




# DNS Query over UDP
packets.append(
    Ether(src="aa:bb:cc:dd:ee:01", dst="aa:bb:cc:dd:ee:02") /
    IP(src="192.168.1.1", dst="8.8.8.8") /
    UDP(sport=54321, dport=53) /
    DNS(rd=1, qd=DNSQR(qname="example.com", qtype="A"))
)

# DNS Response
packets.append(
    Ether(src="aa:bb:cc:dd:ee:02", dst="aa:bb:cc:dd:ee:01") /
    IP(src="8.8.8.8", dst="192.168.1.1") /
    UDP(sport=53, dport=54321) /
    DNS(qr=1, aa=1, rd=1, ra=1,
        qd=DNSQR(qname="example.com"),
        an=DNSRR(rrname="example.com", ttl=300, rdata="93.184.216.34"))
)

# Generic UDP
packets.append(
    Ether(src="aa:bb:cc:dd:ee:01", dst="aa:bb:cc:dd:ee:02") /
    IP(src="192.168.1.1", dst="192.168.1.2") /
    UDP(sport=9000, dport=9001) /
    Raw(b"hello from udp")
)




# TCP 3-way handshake
packets.append(
    Ether(src="aa:bb:cc:dd:ee:01", dst="aa:bb:cc:dd:ee:02") /
    IP(src="192.168.1.1", dst="192.168.1.2") /
    TCP(sport=54400, dport=80, flags="S", seq=1000)
)
packets.append(
    Ether(src="aa:bb:cc:dd:ee:02", dst="aa:bb:cc:dd:ee:01") /
    IP(src="192.168.1.2", dst="192.168.1.1") /
    TCP(sport=80, dport=54400, flags="SA", seq=2000, ack=1001)
)
packets.append(
    Ether(src="aa:bb:cc:dd:ee:01", dst="aa:bb:cc:dd:ee:02") /
    IP(src="192.168.1.1", dst="192.168.1.2") /
    TCP(sport=54400, dport=80, flags="A", seq=1001, ack=2001)
)

# HTTP GET over TCP (cleartext — this is the credential demo)
http_request = (
    b"GET / HTTP/1.1\r\n"
    b"Host: example.com\r\n"
    b"Authorization: Basic dXNlcjpodW50ZXIy\r\n"  # user:hunter2 in base64
    b"User-Agent: TestClient/1.0\r\n"
    b"\r\n"
)
packets.append(
    Ether(src="aa:bb:cc:dd:ee:01", dst="aa:bb:cc:dd:ee:02") /
    IP(src="192.168.1.1", dst="192.168.1.2") /
    TCP(sport=54400, dport=80, flags="PA", seq=1001, ack=2001) /
    Raw(http_request)
)

# HTTP Response
http_response = (
    b"HTTP/1.1 200 OK\r\n"
    b"Content-Type: text/html\r\n"
    b"Content-Length: 13\r\n"
    b"\r\n"
    b"Hello, World!"
)
packets.append(
    Ether(src="aa:bb:cc:dd:ee:02", dst="aa:bb:cc:dd:ee:01") /
    IP(src="192.168.1.2", dst="192.168.1.1") /
    TCP(sport=80, dport=54400, flags="PA", seq=2001, ack=1001 + len(http_request)) /
    Raw(http_response)
)

# FTP credential capture
packets.append(
    Ether(src="aa:bb:cc:dd:ee:02", dst="aa:bb:cc:dd:ee:01") /
    IP(src="192.168.1.2", dst="192.168.1.1") /
    TCP(sport=21, dport=55000, flags="PA", seq=3000, ack=4000) /
    Raw(b"220 FTP Server ready\r\n")
)
packets.append(
    Ether(src="aa:bb:cc:dd:ee:01", dst="aa:bb:cc:dd:ee:02") /
    IP(src="192.168.1.1", dst="192.168.1.2") /
    TCP(sport=55000, dport=21, flags="PA", seq=4000, ack=3021) /
    Raw(b"USER admin\r\n")
)
packets.append(
    Ether(src="aa:bb:cc:dd:ee:01", dst="aa:bb:cc:dd:ee:02") /
    IP(src="192.168.1.1", dst="192.168.1.2") /
    TCP(sport=55000, dport=21, flags="PA", seq=4012, ack=3021) /
    Raw(b"PASS hunter2\r\n")
)

# TCP FIN teardown
packets.append(
    Ether(src="aa:bb:cc:dd:ee:01", dst="aa:bb:cc:dd:ee:02") /
    IP(src="192.168.1.1", dst="192.168.1.2") /
    TCP(sport=54400, dport=80, flags="FA", seq=2000, ack=3000)
)
packets.append(
    Ether(src="aa:bb:cc:dd:ee:02", dst="aa:bb:cc:dd:ee:01") /
    IP(src="192.168.1.2", dst="192.168.1.1") /
    TCP(sport=80, dport=54400, flags="FA", seq=3000, ack=2001)
)




# ICMPv6 Echo Request / Reply (ping6)
packets.append(
    Ether(src="aa:bb:cc:dd:ee:01", dst="aa:bb:cc:dd:ee:02") /
    IPv6(src="fe80::1", dst="fe80::2", hlim=64) /
    ICMPv6EchoRequest(id=0x5678, seq=1, data=b"ipv6pingdata")
)
packets.append(
    Ether(src="aa:bb:cc:dd:ee:02", dst="aa:bb:cc:dd:ee:01") /
    IPv6(src="fe80::2", dst="fe80::1", hlim=64) /
    ICMPv6EchoReply(id=0x5678, seq=1, data=b"ipv6pingdata")
)

# ICMPv6 Neighbor Solicitation (replaces ARP request)
packets.append(
    Ether(src="aa:bb:cc:dd:ee:01", dst="33:33:ff:00:00:02") /
    IPv6(src="fe80::1", dst="ff02::1:ff00:2") /
    ICMPv6ND_NS(tgt="fe80::2")
)

# ICMPv6 Neighbor Advertisement (replaces ARP reply)
packets.append(
    Ether(src="aa:bb:cc:dd:ee:02", dst="aa:bb:cc:dd:ee:01") /
    IPv6(src="fe80::2", dst="fe80::1") /
    ICMPv6ND_NA(tgt="fe80::2", R=0, S=1, O=1) /
    ICMPv6NDOptDstLLAddr(lladdr="aa:bb:cc:dd:ee:02")
)

# UDP over IPv6 (DNS)
packets.append(
    Ether(src="aa:bb:cc:dd:ee:01", dst="aa:bb:cc:dd:ee:02") /
    IPv6(src="2001:db8::1", dst="2001:db8::53") /
    UDP(sport=12345, dport=53) /
    DNS(rd=1, qd=DNSQR(qname="example.com", qtype="AAAA"))
)

# TCP over IPv6
packets.append(
    Ether(src="aa:bb:cc:dd:ee:01", dst="aa:bb:cc:dd:ee:02") /
    IPv6(src="2001:db8::1", dst="2001:db8::2") /
    TCP(sport=60000, dport=80, flags="S", seq=9000)
)




packets.append(
    Ether(src="aa:bb:cc:dd:ee:01", dst="aa:bb:cc:dd:ee:02") /
    Dot1Q(vlan=100) /
    IP(src="10.0.0.1", dst="10.0.0.2") /
    ICMP(type=8, seq=1) /
    Raw(b"vlan test")
)



wrpcap("test.pcap", packets)
print(f"wrote {len(packets)} packets to test.pcap")
