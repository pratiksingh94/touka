from scapy.all import *

packets = []

client_ip = "192.168.1.100"
server_ip = "67.184.216.34"

client_port = 54321
server_port = 80

# SYN
packets.append(
    Ether(src="aa:bb:cc:dd:ee:01", dst="bb:cc:dd:ee:ff:01")
    / IP(src=client_ip, dst=server_ip)
    / TCP(sport=client_port, dport=server_port, flags="S", seq=1000)
)
# SYN-ACK
packets.append(
    Ether(src="bb:cc:dd:ee:ff:01", dst="aa:bb:cc:dd:ee:01")
    / IP(src=server_ip, dst=client_ip)
    / TCP(sport=server_port, dport=client_port, flags="SA", seq=2000, ack=1001)
)
# ACK
packets.append(
    Ether(src="aa:bb:cc:dd:ee:01", dst="bb:cc:dd:ee:ff:01")
    / IP(src=client_ip, dst=server_ip)
    / TCP(sport=client_port, dport=server_port, flags="A", seq=1001, ack=2001)
)


# FIRST REQUEST

http_get = (
    b"GET /index.html HTTP/1.1\r\n"
    b"Host: example.com\r\n"
    b"User-Agent: ToukaLmao/1.0\r\n"
    b"Accept: text/html,application/xhtml+xml\r\n"
    b"Accept-Language: en-US,en;q=0.9\r\n"
    b"Connection: keep-alive\r\n"
    b"\r\n"
)

packets.append(
    Ether(src="aa:bb:cc:dd:ee:01", dst="bb:cc:dd:ee:ff:01")
    / IP(src=client_ip, dst=server_ip)
    / TCP(sport=client_port, dport=server_port, flags="PA", seq=1001, ack=2001)
    / Raw(http_get)
)


http_response = (
    b"HTTP/1.1 200 OK\r\n"
    b"Date: Mon, 01 Jan 2067 12:00:00 GMT\r\n"
    b"Server: Apache/2.4.1 (Unix)\r\n"
    b"Content-Type: text/html; charset=UTF-8\r\n"
    b"Content-Length: 128\r\n"
    b"Last-Modified: Sun, 01 Jan 2026 00:00:00 GMT\r\n"
    b"Accept-Ranges: bytes\r\n"
    b"Connection: keep-alive\r\n"
    b"\r\n"
    b"<html><head><title>hello hello</title></head><body>hiiii :3</body></html>"
)

packets.append(
    Ether(src="bb:cc:dd:ee:ff:01", dst="aa:bb:cc:dd:ee:01")
    / IP(src=server_ip, dst=client_ip)
    / TCP(
        sport=server_port,
        dport=client_port,
        flags="PA",
        seq=2001,
        ack=1001 + len(http_get),
    )
    / Raw(http_response)
)


# SECOND REQUEST
http_get2 = (
    b"GET /style.css HTTP/1.1\r\n"
    b"Host: example.com\r\n"
    b"User-Agent: ToukaLmao/1.0\r\n"
    b"Referer: http://touka.pratiksingh.xyz/index.html\r\n"
    b"Accept: text/css,*/*;q=0.1\r\n"
    b"\r\n"
)
packets.append(
    Ether(src="aa:bb:cc:dd:ee:01", dst="bb:cc:dd:ee:ff:01")
    / IP(src=client_ip, dst=server_ip)
    / TCP(
        sport=client_port,
        dport=server_port,
        flags="PA",
        seq=1001 + len(http_get),
        ack=2001 + len(http_response),
    )
    / Raw(http_get2)
)


http_404 = (
    b"HTTP/1.1 404 Not Found\r\n"
    b"Date: Mon 01 Jan 2026 12:00:01 GMT\r\n"
    b"Server: Apache/2.4.1 (Unix)\r\n"
    b"Content-Type: text/html\r\n"
    b"Content-Length: 85\r\n"
    b"\r\n"
    b"<html><head><title>404 not found L</title></head></html>"
)

packets.append(
    Ether(src="bb:cc:dd:ee:ff:01", dst="aa:bb:cc:dd:ee:01")
    / IP(src=server_ip, dst=client_ip)
    / TCP(
        sport=server_port,
        dport=client_port,
        flags="PA",
        seq=2001 + len(http_response),
        ack=1001 + len(http_get) + len(http_get2),
    )
    / Raw(http_404)
)


# THIRD REQUEST
http_post = (
    b"POST /api/data HTTP 1.1\r\n"
    b"Host: example.com\r\n"
    b"User-Agent: ToukaLmao/1.0\r\n"
    b"Content-Type: application/json\r\n"
    b"Content-Length: 47\r\n"
    b"\r\n"
    b'{"username":"testuser"}'
)

packets.append(
    Ether(src="aa:bb:cc:dd:ee:01", dst="bb:cc:dd:ee:ff:01")
    / IP(src=client_ip, dst=server_ip)
    / TCP(
        sport=client_port,
        dport=server_port,
        flags="PA",
        seq=1001 + len(http_get) + len(http_get2),
        ack=2001 + len(http_response) + len(http_404),
    )
    / Raw(http_post)
)


http_201 = (
    b"HTTP/1.1 201 Created\r\n"
    b"Date: Mon, 01 Jan 2026 12:00:02 GMT\r\n"
    b"Server: Apache/2.4.1 (Unix)\r\n"
    b"Content-Type: application/json\r\n"
    b"Content-Length: 32\r\n"
    b"Location: /api/data/67676767\r\n"
    b"\r\n"
    b'{"id":67676767}'
)

packets.append(
    Ether(src="bb:cc:dd:ee:ff:01", dst="aa:bb:cc:dd:ee:01")
    / IP(src=server_ip, dst=client_ip)
    / TCP(
        sport=server_port,
        dport=client_port,
        flags="PA",
        seq=2001 + len(http_response) + len(http_404),
        ack=1001 + len(http_get) + len(http_get2) + len(http_post),
    )
    / Raw(http_201)
)


# THIRD REQUEST
http_get3 = (
    b"GET /api/user HTTP/1.1\r\n"
    b"Host: example.com\r\n"
    b"User-Agent: ToukaLmao/1.0\r\n"
    b"Cookie: session_id=something;user_pref=dark_mode\r\n"
    b"Authorizaion: Bearer gnwrkshnglsgebgwn\r\n"
    b"Accept: application/json\r\n"
    b"\r\n"
)

packets.append(
    Ether(src="aa:bb:cc:dd:ee:01", dst="bb:cc:dd:ee:ff:01")
    / IP(src=client_ip, dst=server_ip)
    / TCP(
        sport=client_port,
        dport=server_port,
        flags="PA",
        seq=1001 + len(http_get) + len(http_get2) + len(http_post),
        ack=2001 + len(http_response) + len(http_404) + len(http_201),
    )
    / Raw(http_get3)
)


http_401 = (
    b"HTTP/1.1 401 Unauthorized\r\n"
    b"Date: Mon, 01 Jan 2024 12:00:03 GMT\r\n"
    b"Server: Apache/2.4.1 (Unix)\r\n"
    b'WWW-Authenticate: Bearer realm="api"\r\n'
    b"Content-Type: application/json\r\n"
    b"Content-Length: 48\r\n"
    b"\r\n"
    b'{"error":"invalid_token"}'
)

packets.append(
    Ether(src="bb:cc:dd:ee:ff:01", dst="aa:bb:cc:dd:ee:01")
    / IP(src=server_ip, dst=client_ip)
    / TCP(
        sport=server_port,
        dport=client_port,
        flags="PA",
        seq=2001 + len(http_response) + len(http_404) + len(http_201),
        ack=1001 + len(http_get) + len(http_get2) + len(http_post) + len(http_get3),
    )
    / Raw(http_401)
)


# TCP FIN
packets.append(
    Ether(src="aa:bb:cc:dd:ee:01", dst="bb:cc:dd:ee:ff:01")
    / IP(src=client_ip, dst=server_ip)
    / TCP(
        sport=client_port,
        dport=server_port,
        flags="FA",
        seq=1001 + len(http_get) + len(http_get2) + len(http_post) + len(http_get3),
        ack=2001 + len(http_response) + len(http_404) + len(http_201) + len(http_401),
    )
)

packets.append(
    Ether(src="bb:cc:dd:ee:ff:01", dst="aa:bb:cc:dd:ee:01")
    / IP(src=server_ip, dst=client_ip)
    / TCP(
        sport=server_port,
        dport=client_port,
        flags="FA",
        seq=2001 + len(http_response) + len(http_404) + len(http_201) + len(http_401),
    )
)

# TCP FIN
packets.append(
    Ether(src="aa:bb:cc:dd:ee:01", dst="bb:cc:dd:ee:ff:01")
    / IP(src=client_ip, dst=server_ip)
    / TCP(
        sport=client_port,
        dport=server_port,
        flags="FA",
        seq=1001 + len(http_get) + len(http_get2) + len(http_post) + len(http_get3),
        ack=2001 + len(http_response) + len(http_404) + len(http_201) + len(http_401),
    )
)
packets.append(
    Ether(src="bb:cc:dd:ee:ff:01", dst="aa:bb:cc:dd:ee:01")
    / IP(src=server_ip, dst=client_ip)
    / TCP(
        sport=server_port,
        dport=client_port,
        flags="FA",
        seq=2001 + len(http_response) + len(http_404) + len(http_201) + len(http_401),
    )
)

wrpcap("http-test.pcap", packets)
print(f"wrote {len(packets)} packets to http-test.pcap")
