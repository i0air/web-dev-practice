export interface IPSession {
  action: "IP_SESSION";
  time: string;
  data: IPFrame;
}

export interface IPFrame {
  id: number | null;
  sessionId: string;
  time: string;
  srcDevice: string;
  srcIp: string;
  srcPort: number | null;
  srcMac: string | null;
  srcIsLan: boolean;
  srcCommNetId: number | null;
  dstDevice: string;
  dstIp: string;
  dstPort: number | null;
  dstMac: string | null;
  dstIsLan: boolean;
  dstCommNetId: number | null;
}
