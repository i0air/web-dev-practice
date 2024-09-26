import type { IPSession } from "@/typings/ip-session";
import dayjs from "dayjs";
import mockjs from "mockjs";

/**
 * @description: 模拟生成IP会话数据
 * @example
import FrameWorker from "@services/frame?worker";

const worker = new FrameWorker();

function start() {
  worker.onmessage = (e) => {
    console.log(e.data);
  };
  worker.postMessage({});
}

function stop() {
  worker.terminate();
}
 */
const generate = () => {
  const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
  const session: IPSession = mockjs.mock({
    action: "IP_SESSION",
    time: now,
    data: {
      id: null,
      sessionId: "2077827636504624400",
      time: now,
      srcDevice: "@cword(3,5)",
      srcIp: "@ip",
      srcPort: "@integer(19,65535)",
      srcMac: null,
      srcIsLan: false,
      srcCommNetId: "@integer(1,20)",
      dstDevice: "@cword(3,5)",
      dstIp: "@ip",
      dstPort: "@integer(19,65535)",
      dstMac: null,
      dstIsLan: false,
      dstCommNetId: "@integer(1,20)",
    },
  });
  const rate = 0.8;
  if (Math.random() > rate) session.data.srcCommNetId = null;
  if (Math.random() > rate) session.data.dstCommNetId = null;
  return session;
};

onmessage = () => {
  setInterval(() => postMessage(generate()), 500);
};
