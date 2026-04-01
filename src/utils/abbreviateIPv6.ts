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
  if(longestRun > 1) {
    const before = stripped.slice(0, longestStart).join(":");
    const after = stripped.slice(longestStart + longestRun).join(":");

    return `${before}::${after || ""}`
  }

  return stripped.join(":")
}