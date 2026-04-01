// i hate IPv6

export function abbreviateIPv6(ip: string) {
  const parts = ip.split(":");
  if(parts.length !== 8) return ip;
  
  const stripped = parts.map(p => p.replace(/^0+/, "") || "0");

  let longestRun = 0;
  let longestStart = -1;
  let currentRun = 0;
  let currentStart = -1;

  for(let i = 0; i < 8; i++) {
    if(stripped[i] === "0") {
      if(currentRun === 0) currentStart = i;
      currentRun++;
    } else {
      if(currentRun > longestRun) {
        longestRun = currentRun;
        longestStart = currentStart
      }
      currentRun = 0;
    }
  }

  if(currentRun > longestRun) {
    longestRun = currentRun;
    longestStart = currentStart;
  }

  let result: string;
  if(longestRun > 1) {
    const before = stripped.slice(0, longestStart).join(":");
    const after = stripped.slice(longestStart + longestRun).join(":");

    result = `${before}::${after || ""}`
  } else {
    result = stripped.join(":")
  }

  const MAX_LEN = 18;
  if(result.length > MAX_LEN) {
    result = result.slice(0, MAX_LEN - 3) + '...'
  }

  return result;
}