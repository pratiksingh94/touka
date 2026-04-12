// export type FTPLine = {
//   direction: "client-to-server" | "server-to-client";
//   raw: string;
// }

export type FTPResponse = {
  code: number;
  message: string;
  multiline: boolean;
}

export type FTPCommand = {
  command: string;
  argument: string | null;
}

export type FTPStream = {
  type: "ftp";
  // lines: FTPLine[];
  commands: FTPCommand[];
  responses: FTPResponse[];
}