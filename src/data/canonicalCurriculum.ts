/**
 * CRESCO Production — Canonical Curriculum Data (CS-4200)
 *
 * Authoritative curriculum matching CRESCO_CANONICAL_CURRICULUM.md and Student app:
 * - 5 Syllabus Units
 * - 21 Gamified Quest Levels
 * - 30 Canonical Modules (u3_m01 - u5_m09) with 0 duplicates
 */

import type { CanonicalModuleOverview } from '../types';

export const CS_4200_COURSE_INFO = {
  courseId: 'cs-4200',
  code: 'CS-4200',
  title: 'Computer Networks',
  department: 'Computer Science & Engineering',
  institution: 'Kalasalingam Academy of Research and Education',
  syllabusCode: 'KARE-CSE-CN-2026',
  totalUnits: 5,
  totalLevels: 21,
  totalModules: 30,
  passingScore: 70,
  units: [
    { unitNumber: 1, id: 'unit_1', title: 'Physical Layer & Transmission Fundamentals', moduleCount: 0, levelRange: 'Levels 1–3' },
    { unitNumber: 2, id: 'unit_2', title: 'Data Link Layer & MAC Protocols', moduleCount: 0, levelRange: 'Levels 4–6' },
    { unitNumber: 3, id: 'unit_3', title: 'Network Layer & IP Addressing Architecture', moduleCount: 12, levelRange: 'Levels 7–11' },
    { unitNumber: 4, id: 'unit_4', title: 'Transport Layer Protocols & Reliability', moduleCount: 9, levelRange: 'Levels 12–16' },
    { unitNumber: 5, id: 'unit_5', title: 'Application Layer, Web Performance & Network Security', moduleCount: 9, levelRange: 'Levels 17–21' },
  ]
};

export const CANONICAL_MODULES: CanonicalModuleOverview[] = [
  // UNIT 3: Network Layer (12 Modules)
  {
    id: 'u3_m01',
    unitId: 'unit_3',
    unitNumber: 3,
    title: 'Network Layer Need, Datagram vs Virtual Circuit',
    readTime: '12 min',
    xpReward: 50,
    objectives: ['Distinguish connectionless datagram switching from connection-oriented virtual circuits', 'Understand host-to-host packet delivery guarantees'],
    keyTakeaways: ['Internet uses connectionless datagram switching for resilience', 'Virtual circuits require call setup and per-flow router state'],
    status: 'published'
  },
  {
    id: 'u3_m02',
    unitId: 'unit_3',
    unitNumber: 3,
    title: 'IPv4 Addressing Architecture & Header Anatomy',
    readTime: '15 min',
    xpReward: 60,
    objectives: ['Analyze 20-byte base IPv4 header format', 'Understand TTL decrement and checksum verification'],
    keyTakeaways: ['IPv4 header contains Version, IHL, Total Length, TTL, Protocol, and Header Checksum', 'TTL prevents infinite packet circulation in routing loops'],
    status: 'published'
  },
  {
    id: 'u3_m03',
    unitId: 'unit_3',
    unitNumber: 3,
    title: 'Classful IP Addressing & Address Exhaustion',
    readTime: '10 min',
    xpReward: 40,
    objectives: ['Identify Class A, B, C, D, and E boundaries', 'Analyze factors driving historical address exhaustion'],
    keyTakeaways: ['Fixed-size octet boundaries created severe IP address waste', 'Class B allocation collapse drove the adoption of CIDR'],
    status: 'published'
  },
  {
    id: 'u3_m04',
    unitId: 'unit_3',
    unitNumber: 3,
    title: 'Subnetting Principles & Custom Subnet Masks',
    readTime: '18 min',
    xpReward: 75,
    objectives: ['Calculate network ID, broadcast address, and usable host count', 'Derive subnet masks for given host capacity constraints'],
    keyTakeaways: ['Subnetting borrows host bits to create internal sub-networks', 'Usable hosts formula is 2^h - 2'],
    status: 'published'
  },
  {
    id: 'u3_m05',
    unitId: 'unit_3',
    unitNumber: 3,
    title: 'CIDR & Supernetting (VLSM Fundamentals)',
    readTime: '15 min',
    xpReward: 65,
    objectives: ['Apply slash notation prefixes (/24 to /30)', 'Perform route aggregation / supernetting'],
    keyTakeaways: ['CIDR eliminated fixed class boundaries using arbitrary prefix lengths', 'Route aggregation reduces global BGP routing table size'],
    status: 'published'
  },
  {
    id: 'u3_m06',
    unitId: 'unit_3',
    unitNumber: 3,
    title: 'Variable Length Subnet Masking (VLSM) Design',
    readTime: '20 min',
    xpReward: 80,
    objectives: ['Design hierarchical IP allocation schemes for varying department sizes', 'Prevent overlapping subnet assignments'],
    keyTakeaways: ['Sort requirements by descending host size before assigning subnets', 'Use /30 or /31 for point-to-point router links'],
    status: 'published'
  },
  {
    id: 'u3_m07',
    unitId: 'unit_3',
    unitNumber: 3,
    title: 'Address Resolution Protocol (ARP) & Cache Mechanics',
    readTime: '12 min',
    xpReward: 50,
    objectives: ['Trace IP-to-MAC resolution using ARP request broadcast and unicast reply', 'Understand ARP spoofing risks'],
    keyTakeaways: ['ARP operates at Layer 2/3 boundary using broadcast requests and unicast replies', 'ARP cache entries expire dynamically'],
    status: 'published'
  },
  {
    id: 'u3_m08',
    unitId: 'unit_3',
    unitNumber: 3,
    title: 'Dynamic Host Configuration Protocol (DHCP) & DORA',
    readTime: '14 min',
    xpReward: 55,
    objectives: ['Map DORA exchange: Discover, Offer, Request, Acknowledge', 'Understand DHCP relay agents'],
    keyTakeaways: ['DHCP uses UDP ports 67 (server) and 68 (client)', 'Relay agents allow one DHCP server to serve multiple subnets'],
    status: 'published'
  },
  {
    id: 'u3_m09',
    unitId: 'unit_3',
    unitNumber: 3,
    title: 'Network Address Translation (NAT) & PAT',
    readTime: '15 min',
    xpReward: 60,
    objectives: ['Contrast static NAT, dynamic NAT, and PAT (NAPT)', 'Analyze translation tables and port mappings'],
    keyTakeaways: ['PAT multiplexes thousands of private IP endpoints over a single public IP', 'NAT complicates peer-to-peer applications without STUN/TURN'],
    status: 'published'
  },
  {
    id: 'u3_m10',
    unitId: 'unit_3',
    unitNumber: 3,
    title: 'ICMP Diagnostics, Ping & Traceroute Operations',
    readTime: '12 min',
    xpReward: 50,
    objectives: ['Examine Echo Request/Reply, TTL Exceeded, and Destination Unreachable messages', 'Understand how Traceroute discovers path hops'],
    keyTakeaways: ['Traceroute increments TTL from 1 upwards to elicit ICMP Time Exceeded replies', 'ICMP is encapsulated directly within IP datagrams'],
    status: 'published'
  },
  {
    id: 'u3_m11',
    unitId: 'unit_3',
    unitNumber: 3,
    title: 'IPv6 Addressing Architecture & Neighbor Discovery',
    readTime: '16 min',
    xpReward: 70,
    objectives: ['Parse 128-bit hex notation, compression rules, and prefix notation', 'Understand NDP replacing ARP using ICMPv6'],
    keyTakeaways: ['IPv6 provides 3.4 x 10^38 addresses with no broadcast addresses', 'NDP uses multicast Neighbor Solicitation and Advertisement'],
    status: 'published'
  },
  {
    id: 'u3_m12',
    unitId: 'unit_3',
    unitNumber: 3,
    title: 'Distance Vector (RIP) vs Link State (OSPF) Routing',
    readTime: '20 min',
    xpReward: 85,
    objectives: ['Compare Bellman-Ford count-to-infinity with Dijkstra shortest path first', 'Analyze routing table convergence behavior'],
    keyTakeaways: ['RIP uses hop count capped at 15; OSPF uses cost based on bandwidth', 'OSPF converges much faster than RIP using Link State Advertisements'],
    status: 'published'
  },

  // UNIT 4: Transport Layer (9 Modules)
  {
    id: 'u4_m01',
    unitId: 'unit_4',
    unitNumber: 4,
    title: 'Transport Layer Role, Port Multiplexing & Sockets',
    readTime: '12 min',
    xpReward: 50,
    objectives: ['Explain process-to-process delivery using socket pairs', 'Understand well-known, registered, and ephemeral ports'],
    keyTakeaways: ['A socket is defined by (Source IP, Source Port, Dest IP, Dest Port, Protocol)', 'Well-known ports range from 0 to 1023'],
    status: 'published'
  },
  {
    id: 'u4_m02',
    unitId: 'unit_4',
    unitNumber: 4,
    title: 'User Datagram Protocol (UDP) & Real-Time Applications',
    readTime: '10 min',
    xpReward: 45,
    objectives: ['Analyze 8-byte UDP header', 'Evaluate trade-offs between zero connection overhead and unreliability'],
    keyTakeaways: ['UDP header is only 8 bytes (Source Port, Dest Port, Length, Checksum)', 'Preferred for VoIP, DNS, and live streaming where latency beats reliability'],
    status: 'published'
  },
  {
    id: 'u4_m03',
    unitId: 'unit_4',
    unitNumber: 4,
    title: 'TCP Segment Anatomy & Control Flags',
    readTime: '15 min',
    xpReward: 60,
    objectives: ['Identify SYN, ACK, FIN, RST, PSH, URG flags', 'Understand Sequence Numbers and Acknowledgement Numbers'],
    keyTakeaways: ['Sequence numbers track byte stream positions, not segment counts', 'SYN and FIN flags consume one sequence number each'],
    status: 'published'
  },
  {
    id: 'u4_m04',
    unitId: 'unit_4',
    unitNumber: 4,
    title: 'TCP 3-Way Handshake Connection Establishment',
    readTime: '15 min',
    xpReward: 65,
    objectives: ['Trace SYN, SYN-ACK, ACK handshake sequence', 'Understand Initial Sequence Number (ISN) randomization and SYN flood mitigation'],
    keyTakeaways: ['ISNs are randomized to prevent sequence prediction attacks', 'SYN cookies mitigate SYN flood resource exhaustion'],
    status: 'published'
  },
  {
    id: 'u4_m05',
    unitId: 'unit_4',
    unitNumber: 4,
    title: 'TCP Connection Teardown & TIME-WAIT State',
    readTime: '12 min',
    xpReward: 50,
    objectives: ['Trace 4-way FIN/ACK handshake', 'Analyze necessity of 2MSL TIME-WAIT state'],
    keyTakeaways: ['TIME-WAIT prevents delayed segments from corrupting future connections on the same socket', 'Last ACK ensures clean graceful closure'],
    status: 'published'
  },
  {
    id: 'u4_m06',
    unitId: 'unit_4',
    unitNumber: 4,
    title: 'TCP Flow Control & Sliding Window Protocol',
    readTime: '18 min',
    xpReward: 75,
    objectives: ['Calculate sliding window throughput based on RTT and Receiver Window (rwnd)', 'Understand Silly Window Syndrome prevention'],
    keyTakeaways: ['rwnd prevents the sender from overwhelming receiver buffer capacity', 'Nagle algorithm and Clark solution prevent small packet overhead'],
    status: 'published'
  },
  {
    id: 'u4_m07',
    unitId: 'unit_4',
    unitNumber: 4,
    title: 'TCP Retransmission Timeouts & RTT Estimation',
    readTime: '15 min',
    xpReward: 65,
    objectives: ['Compute Jacobson/Karels smoothed RTT (SRTT) and variance (RTTVAR)', 'Understand Karn algorithm for retransmitted segments'],
    keyTakeaways: ['RTO dynamically adapts to network delay fluctuations', 'Karn algorithm ignores ambiguous RTT samples from retransmitted segments'],
    status: 'published'
  },
  {
    id: 'u4_m08',
    unitId: 'unit_4',
    unitNumber: 4,
    title: 'TCP Congestion Control (Tahoe vs Reno Algorithms)',
    readTime: '20 min',
    xpReward: 85,
    objectives: ['Trace Slow Start, Congestion Avoidance, Fast Retransmit, and Fast Recovery', 'Understand ssthresh threshold mechanics'],
    keyTakeaways: ['Slow Start doubles cwnd every RTT; Congestion Avoidance increases cwnd by 1 MSS per RTT', 'Reno avoids dropping cwnd to 1 upon 3 duplicate ACKs using Fast Recovery'],
    status: 'published'
  },
  {
    id: 'u4_m09',
    unitId: 'unit_4',
    unitNumber: 4,
    title: 'Modern Congestion Control (BBR vs Loss-Based TCP)',
    readTime: '15 min',
    xpReward: 65,
    objectives: ['Contrast Google BBR model-based pacing with Cubic/Reno loss detection', 'Understand bufferbloat phenomena'],
    keyTakeaways: ['BBR optimizes for maximum bottleneck bandwidth and minimum round-trip time', 'Prevents queue bufferbloat without relying on dropped packets as signals'],
    status: 'published'
  },

  // UNIT 5: Application Layer & Security (9 Modules)
  {
    id: 'u5_m01',
    unitId: 'unit_5',
    unitNumber: 5,
    title: 'DNS Resolution Architecture & Root Server System',
    readTime: '14 min',
    xpReward: 55,
    objectives: ['Trace iterative vs recursive DNS queries', 'Analyze Root, TLD, and Authoritative nameserver hierarchy'],
    keyTakeaways: ['DNS root is served by 13 IP clusters operated with anycast routing', 'A, AAAA, CNAME, MX, and NS records define domain resolution mappings'],
    status: 'published'
  },
  {
    id: 'u5_m02',
    unitId: 'unit_5',
    unitNumber: 5,
    title: 'HTTP/1.1 vs HTTP/2 (Multiplexing & Head-of-Line Blocking)',
    readTime: '16 min',
    xpReward: 65,
    objectives: ['Understand HTTP/1.1 pipelining and domain sharding limitations', 'Analyze binary framing streams in HTTP/2'],
    keyTakeaways: ['HTTP/2 interleaves multiple requests over a single TCP connection', 'Application head-of-line blocking is solved, but TCP head-of-line blocking remains'],
    status: 'published'
  },
  {
    id: 'u5_m03',
    unitId: 'unit_5',
    unitNumber: 5,
    title: 'HTTP/3 & QUIC Transport (UDP Multiplexing Revolution)',
    readTime: '18 min',
    xpReward: 75,
    objectives: ['Explain why QUIC replaces TCP with UDP at the transport layer', 'Understand 0-RTT handshakes and connection migration'],
    keyTakeaways: ['QUIC eliminates TCP head-of-line blocking: independent packet streams over UDP', 'Connection ID enables seamless IP address migration between Wi-Fi and Cellular'],
    status: 'published'
  },
  {
    id: 'u5_m04',
    unitId: 'unit_5',
    unitNumber: 5,
    title: 'Transport Layer Security (TLS 1.3) Handshake & Encryption',
    readTime: '18 min',
    xpReward: 80,
    objectives: ['Map 1-RTT TLS 1.3 key exchange using Diffie-Hellman Ephemeral', 'Understand X.509 certificates and PKI authentication'],
    keyTakeaways: ['TLS 1.3 eliminates obsolete ciphers and encrypts handshakes in 1 RTT', 'Forward secrecy guarantees past communications cannot be decrypted if private key leaks'],
    status: 'published'
  },
  {
    id: 'u5_m05',
    unitId: 'unit_5',
    unitNumber: 5,
    title: 'Email Protocols (SMTP, IMAP, POP3) & MIME Encoding',
    readTime: '12 min',
    xpReward: 50,
    objectives: ['Distinguish push (SMTP) from pull (IMAP/POP3) delivery', 'Examine MIME multipart headers'],
    keyTakeaways: ['SMTP delivers email between mail servers over port 25/587', 'IMAP maintains mailbox state on the server, whereas POP3 typically downloads and deletes'],
    status: 'published'
  },
  {
    id: 'u5_m06',
    unitId: 'unit_5',
    unitNumber: 5,
    title: 'Dynamic Host Configuration: DHCP Relays & Options',
    readTime: '12 min',
    xpReward: 50,
    objectives: ['Configure DHCP Option 3 (Default Gateway), 6 (DNS), and 15 (Domain)', 'Trace GIADDR relay forwarding'],
    keyTakeaways: ['Relay agents rewrite broadcast discoveries into unicast forwardings to the centralized server', 'Options provide essential network parameter payloads'],
    status: 'published'
  },
  {
    id: 'u5_m07',
    unitId: 'unit_5',
    unitNumber: 5,
    title: 'Network Firewalls: Packet Filtering vs Stateful Inspection',
    readTime: '15 min',
    xpReward: 65,
    objectives: ['Compare stateless ACLs with stateful connection tracking tables', 'Understand Next-Gen Firewall (NGFW) deep packet inspection'],
    keyTakeaways: ['Stateful firewalls track TCP flags and sequence state to permit return traffic automatically', 'Stateless ACLs evaluate each packet in isolation against static rules'],
    status: 'published'
  },
  {
    id: 'u5_m08',
    unitId: 'unit_5',
    unitNumber: 5,
    title: 'Intrusion Detection Systems (IDS/IPS) & Signature Matching',
    readTime: '14 min',
    xpReward: 60,
    objectives: ['Contrast signature-based detection with anomaly detection', 'Differentiate passive tap IDS from inline drop IPS'],
    keyTakeaways: ['IDS alerts on suspicious traffic; IPS sits inline and actively drops malicious packets', 'Snort rules match protocol headers and payload byte patterns'],
    status: 'published'
  },
  {
    id: 'u5_m09',
    unitId: 'unit_5',
    unitNumber: 5,
    title: 'Virtual Private Networks (IPsec vs WireGuard & OpenVPN)',
    readTime: '18 min',
    xpReward: 75,
    objectives: ['Examine IPsec AH vs ESP in Tunnel and Transport modes', 'Evaluate modern WireGuard lightweight cryptography'],
    keyTakeaways: ['ESP provides confidentiality, authentication, and integrity; AH provides no encryption', 'WireGuard uses Noise protocol and modern elliptic curves in fewer than 4,000 lines of code'],
    status: 'published'
  }
];
