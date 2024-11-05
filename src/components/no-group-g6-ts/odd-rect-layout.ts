import { BaseLayout } from "@antv/g6";
import type { GraphData, BaseLayoutOptions } from "@antv/g6";

export interface OddRectLayoutOptions extends BaseLayoutOptions {
  gap?: { x: number; y: number };
  center?: [number, number];
}

const DEAULT_OPTIONS: Partial<OddRectLayoutOptions> = {
  gap: { x: 100, y: 100 },
  center: [0, 0],
};

export class OddRectLayout extends BaseLayout<OddRectLayoutOptions> {
  id = "odd-rect";

  execute(model: GraphData, options?: any): Promise<GraphData> {
    const mergedOptions = { ...DEAULT_OPTIONS, ...this.options };
    const {} = this.options;

    const nodes = model.nodes;

    return new Promise((resolve) => {});
  }
}
