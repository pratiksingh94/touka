import type { DNSPacket, DNSRecordData, DNSResourceRecord } from "@/parser/dissectors/application/DNS/types";
import type { DetailsBuilderResult, PacketField } from "../../types";


function buildRecordDataChildren(data: DNSRecordData): PacketField[] {
  switch(data.type) {
    case "A":
    case "AAAA":
      return [{ label: "Address", value: data.address}]
    case "CNAME":
      return [{ label: "Target", value: data.cname}]
    case "NS":
      return [{ label: "Nameserver", value: data.nameserver}];
    case "PTR":
      return [{ label: "Target", value: data.ptrdname}]
    case "MX":
      return [
        {label: "Preference", value: String(data.preference)},
        {label: "Exchange", value: data.exchange}
      ]
    case "TXT":
      return [{ label: "Text", value: data.text.join(" ")}]
    case "SOA":
      return [
        {label: "Primary NS", value: data.mname},
        {label: "Email", value: data.rname},
        {label: "Serial", value: String(data.serial)},
        {label: "Refresh", value: String(data.refresh)},
        {label: "Retry", value: String(data.retry)},
        {label: "Expire", value: String(data.expire)},
        {label: "Min TTL", value: String(data.minimum)}
      ]
    case "SRV":
      return [
        {label: "Priority", value: String(data.priority)},
        {label: "Weight", value: String(data.weight)},
        {label: "Port", value: String(data.port)},
        {label: "Target", value: data.target}
      ]
    default:
      return [{label: "Data", value: "[raw]"}]
  }
}


function buildResourceRecordField(rr: DNSResourceRecord): PacketField {
  return {
    label: `${rr.name} ${rr.recordType}`,
    value: "",
    children: [
      {label: "Type", value: rr.recordType},
      {label: "Class", value: rr.recordClass},
      {label: "TTL", value: String(rr.ttl)},
      ...buildRecordDataChildren(rr.data)
    ]
  }
}


export function buildDNSDetails(dns: DNSPacket, offset: number): DetailsBuilderResult {
  const fields: PacketField[] = [];

  fields.push({ label: "Transaction ID", value: `0x${dns.transactionID.toString(16).toUpperCase()} (${dns.transactionID})`});
  

  const flagsStr: string[] = [];
  if(dns.flags.rd) flagsStr.push("RD");
  if(dns.flags.tc) flagsStr.push("TC");
  if(dns.flags.aa) flagsStr.push("AA");
  if(dns.flags.ra) flagsStr.push("RA");
  fields.push({ label: "Flags", value: flagsStr.join(", ")});

  if(dns.isResponse) {
    fields.push({ label: "QR", value: "Response"});
    fields.push({ label: "RCODE", value: String(dns.flags.rcode)})
  } else {
    fields.push({ label: "QR", value: "Query"})
  }

  fields.push({ label: "Questions", value: String(dns.questions.length)})
  fields.push({ label: "Answer RRs", value: String(dns.answers.length)})
  fields.push({label: "Authority RRs", value: String(dns.authority.length)})
  fields.push({label: "Additional RRs", value: String(dns.additional.length)})

  if(dns.questions.length > 0) {
    const questionChildren: PacketField[] = dns.questions.map((q, i) => ({
      label: `Query ${i + 1}`,
      value: `${q.name} ${q.recordType}`,
      children: [
        {label: "Name", value: q.name},
        {label: "Type", value: q.recordType},
        {label: "Class", value: q.recordClass}
      ]
    }));
    fields.push({ label: "Queries", value: "", children: questionChildren})
  }
  if(dns.answers.length > 0) {
      fields.push({
        label: "Answers",
        value: "",
        children: dns.answers.map(rr => buildResourceRecordField(rr))
      })
    }

    if(dns.authority.length > 0) {
      fields.push({
        label: "Authority",
        value: "",
        children: dns.authority.map(rr => buildResourceRecordField(rr))
      })
    }

    if(dns.additional.length > 0) {
      fields.push({
        label: "Additional",
        value: "",
        children: dns.additional.map(rr => buildResourceRecordField(rr))
      })
    }

    return {
      headerLength: dns.raw.length,
      details: {
        title: "Domain Name System",
        summary: `${dns.isResponse ? "Response" : "Query"} - ${dns.questions[0]?.name ?? "Unknown"}`,
        offset,
        length: dns.raw.length,
        fields
      }
    }
}