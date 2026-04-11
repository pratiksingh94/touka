export type HTTPRequest = {
  type: "http-request";
  method: string;
  path: string;
  version: string;
  headers: Record<string, string>;
  body: Uint8Array | null;
}

export type HTTPResponse = {
  type: "http-response";
  version: string;
  statusCode: number;
  statusText: string;
  headers: Record<string, string>;
  body: Uint8Array | null;
}

export type HTTPStream = {
  type: "http";
  requests: HTTPRequest[];
  response: HTTPResponse[];
}