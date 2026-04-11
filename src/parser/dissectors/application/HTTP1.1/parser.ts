import { findHTTPStart } from "@/parser/utils/findHTTPStart";
import type { HTTPRequest, HTTPResponse, HTTPStream } from "./types";
import { splitHTTPReq, splitHTTPRes } from "@/parser/utils/splitHTTP";
import { cleanText } from "@/parser/utils/cleanText";

export function parseHTTPRequest(raw: Uint8Array): HTTPRequest {
  const cleaned = findHTTPStart(raw)
  const text = new TextDecoder().decode(cleaned);

  const [header, body] = text.split("\r\n\r\n");

  const lines = header.split("\r\n");

  const [method, path, version] = lines[0].split(" ");

  const headers: Record<string, string> = {};
  for (const line of lines.slice(1)) {
    const colon = line.indexOf(": ");
    if(colon === -1) continue;

    headers[line.slice(0, colon).toLowerCase()] = line.slice(colon + 2);
  }

  const encodedBody = body ? new TextEncoder().encode(body) : null;

  return {
    type: "http-request",
    method,
    path,
    version,
    headers,
    body: encodedBody
  }
}


export function parseHTTPResponse(raw: Uint8Array): HTTPResponse {
  const cleaned = findHTTPStart(raw);
  const text = new TextDecoder().decode(cleaned)
  
  const [header, body] = text.split("\r\n\r\n");
  const lines = header.split("\r\n");

  const [version, statusCode, statusText] = lines[0].split(" ");

  let headers: Record<string, string> = {};
  for(const line of lines.slice(1)) {
    const colon = line.indexOf(": ");
    if(colon  === -1) continue;

    headers[line.slice(0, colon).toLowerCase()] = line.slice(colon + 2);
  }

  const encodedBody = body ? new TextEncoder().encode(body) : null;

  return {
    type: "http-response",
    version,
    statusCode: Number(statusCode),
    statusText,
    headers,
    body: encodedBody,
  }
}


export function parseHTTP(reqRaw: Uint8Array, resRaw: Uint8Array): HTTPStream {
  const reqText = cleanText(new TextDecoder().decode(reqRaw));
  const resText = cleanText(new TextDecoder().decode(resRaw));
  return {
    type: "http",
    requests: splitHTTPReq(reqText).map(r => parseHTTPRequest(new TextEncoder().encode(r))),
    response: splitHTTPRes(resText).map(r => parseHTTPResponse(new TextEncoder().encode(r)))
  }
}