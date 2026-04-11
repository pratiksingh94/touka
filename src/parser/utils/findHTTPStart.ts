export function findHTTPStart(raw: Uint8Array) {
  const text = new TextDecoder().decode(raw);

  const reqMatch = text.search(/GET |POST |PUT |DELETE |OPTIONS |HEAD |PATCH/);
  if(reqMatch !== -1) return raw.subarray(reqMatch);

  const resMatch = text.indexOf("HTTP/");
  if(resMatch !== -1) return raw.subarray(resMatch);

  return raw;
}