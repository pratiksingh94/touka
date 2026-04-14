import type { DNSClass, DNSRecordType } from "@/parser/dissectors/application/DNS/types"

export const DNS_RECORD_TYPES: Record<number, DNSRecordType> = {
  1: "A",
  28: "AAAA",
  5: "CNAME",
  15: "MX",
  2: "NS",
  12: "PTR",
  6: "SOA",
  33: "SRV",
  16: "TXT",
  41: "OPT"
} as const;


export const DNS_CLASSES: Record<number, DNSClass> = {
  1: "Internet"
}