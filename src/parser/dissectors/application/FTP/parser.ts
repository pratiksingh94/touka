import { cleanText } from "@/parser/utils/cleanText";
import type { FTPCommand, FTPResponse, FTPStream } from "./types";


// TODO: FIX BINARY LEAKING


export function parseFTP(clientToServerRaw: Uint8Array, serverToClientRaw: Uint8Array): FTPStream {
  const clientText = cleanText(new TextDecoder().decode(clientToServerRaw));
  const serverText = cleanText(new TextDecoder().decode(serverToClientRaw));

  const clientLines = clientText.split("\r\n");
  const serverLines = serverText.split("\r\n");

  // const clientLines = extractLines(clientToServerRaw);
  // const serverLines = extractLines(serverToClientRaw);
  

  // console.log({clientLines, serverLines})
  // console.log("client raw length:", clientToServerRaw.length)
  // console.log("client first 100 bytes:", clientToServerRaw.slice(0, 100))
  // console.log("server raw length:", serverToClientRaw.length)

  const commands: FTPCommand[] = [];
  const responses: FTPResponse[] = [];

  for (const line of clientLines) {
    commands.push({
      command: line.split(" ")[0],
      argument: line.split(" ").slice(1).join(" ")
    })
  }

  for(const line of serverLines) {
    if(line.trim() === "") continue;
    
    if(line[3] === "-") {
      responses.push({
        code: Number(line.slice(0,3)),
        message: line.slice(3, line.length),
        multiline: true
      })
    } else {
      responses.push({
        code: Number(line.slice(0,3)),
        message: line.slice(3, line.length),
        multiline: false
      })
    }
  }

  return {
    type: "ftp",
    commands,
    responses
  }
}