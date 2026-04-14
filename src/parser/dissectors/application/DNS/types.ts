export type DNSRecordType = "A" | "NS" | "CNAME" | "SOA" | "PTR" | "MX" | "TXT" | "AAAA" | "SRV" | "OPT" | "unknown"

export type DNSClass = "Internet" | "unknown" // dont think i am gonna see anything else lmao, or maybe i will add later

export type DNSQuestion = {
  name: string;
  recordType: DNSRecordType,
  recordClass: DNSClass
}

export type DNSResourceRecord = {
  name: string;
  recordType: DNSRecordType,
  recordClass: DNSClass,
  ttl: number,
  data: DNSRecordData
}

export type DNSRecordData = 
  | { type: "A"; address: string }
  | { type: "AAAA"; address: string }
  | { type: "CNAME"; cname: string }
  | { type: "MX"; preference: number; exchange: string }
  | { type: "NS"; nameserver: string }
  | { type: "PTR"; ptrdname: string }
  | { type: "TXT"; text: string[] }
  | { type: "SOA"; mname: string; rname: string; serial: number; refresh: number; retry: number; expire: number; minimum: number }
  | { type: "SRV"; priority: number; weight: number; port: number; target: string }
  | { type: "unknown", raw: Uint8Array }


export type DNSFlags = {
  qr: boolean;
  opcode: number;
  aa: boolean;
  tc: boolean;
  rd: boolean;
  ra: boolean;
  rcode: number
}

export type DNSPacket = {
  type: "DNS";
  transactionID: number;
  flags: DNSFlags,
  isResponse: boolean;
  questions: DNSQuestion[];
  answers: DNSResourceRecord[];
  authority: DNSResourceRecord[];
  additional: DNSResourceRecord[];
  raw: Uint8Array;
}