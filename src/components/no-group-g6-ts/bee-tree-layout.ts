import { BaseLayout, type BaseLayoutOptions, type GraphData } from "@antv/g6";

export interface BeeTreeLayoutOptions extends BaseLayoutOptions {
  i: number;
  r: number;
  size: number;
  center: { x: number; y: number };
}

const DEFAULT_OPTIONS: Partial<BeeTreeLayoutOptions> = {
  i: 0,
  r: 100,
  size: 10,
  center: { x: 0, y: 0 },
};

export class BeeTreeLayout extends BaseLayout<BeeTreeLayoutOptions> {
  id = "bee-tree";

  execute(model: GraphData, options?: BeeTreeLayoutOptions | undefined): Promise<GraphData> {
    const mergedOptions = { ...DEFAULT_OPTIONS, ...this.options };
    const { id, r, size, center } = mergedOptions;

    // TODO: 实现BeeTree布局算法
    return Promise.resolve(model);
  }
}
