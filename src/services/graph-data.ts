import type { NodeData } from "@antv/g6";
import { RectangleGenerator } from "../data/rectangle-generator";

const generate = (layout: RectangleGenerator) => {
  const { idx, x, y, m } = layout.next();
  const node: NodeData = { id: `${idx}`, label: `${idx}`, data: { m }, style: { x, y, size: 10 } };
  return node;
};

onmessage = (e: MessageEvent<RectangleGenerator.Options>) => {
  const options = e.data || { i: 0 };
  const layout = new RectangleGenerator(options);
  setInterval(() => postMessage(generate(layout)), 500);
};
