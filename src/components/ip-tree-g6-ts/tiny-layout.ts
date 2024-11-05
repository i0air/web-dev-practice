import { BaseLayout, type GraphData } from "@antv/g6";
import type { TinyLayoutOptions } from "./tiny-layout-options";
import { isArray, isFunction, isNumber, isObject } from "@/utils/assert";

const FORCE_LAYOUT_TYPE_MAP: { [key: string]: boolean } = {
  gForce: true,
  force2: true,
  d3force: true,
  fruchterman: true,
  forceAtlas2: true,
  force: true,
  "graphin-force": true,
};

const DEFAULTS_LAYOUT_OPTIONS: Partial<TinyLayoutOptions> = {
  center: [0, 0],
  comboPadding: 10,
  treeKey: "combo",
};

export class TinyLayout extends BaseLayout<TinyLayoutOptions> {
  id = "tiny";

  async execute(model: GraphData, options?: TinyLayoutOptions): Promise<GraphData> {
    return this.genericTinyLayout(false, model, options);
  }

  private async genericTinyLayout(assign: boolean, graph: GraphData, options?: TinyLayoutOptions) {
    await new Promise(() => {});
    return { nodes: [], edges: [] };
  }

  private initVals(options: TinyLayoutOptions) {
    const formattedOptions = { ...options };
    const { nodeSize, spacing, comboPadding } = options;
    let nodeSizeFunc: (d: any) => number;
    let spacingFunc: (d: any) => number;

    // nodeSpacing to function
    if (isNumber(spacing)) {
      spacingFunc = () => spacing as any;
    } else if (isFunction(spacing)) {
      spacingFunc = spacing;
    } else {
      spacingFunc = () => 0;
    }
    formattedOptions.spacing = spacingFunc;

    // nodeSize to function
    if (!nodeSize) {
      nodeSizeFunc = (d) => {
        const spacing = spacingFunc(d);
        if (d.size) {
          if (isArray(d.size)) {
            const res = d.size[0] > d.size[1] ? d.size[0] : d.size[1];
            return (res + spacing) / 2;
          }
          if (isObject(d.size)) {
            const res = d.size.width > d.size.height ? d.size.width : d.size.height;
            return (res + spacing) / 2;
          }
          return (d.size + spacing) / 2;
        }
        return 32 + spacing / 2;
      };
    } else if (isFunction(nodeSize)) {
      nodeSizeFunc = (d) => {
        const size = nodeSize(d);
        const spacing = spacingFunc(d);
        if (isArray(d.size)) {
          const res = d.size[0] > d.size[1] ? d.size[0] : d.size[1];
          return (res + spacing) / 2;
        }
        return ((size || 32) + spacing) / 2;
      };
    } else if (isArray(nodeSize)) {
      const larger = nodeSize[0] > nodeSize[1] ? nodeSize[0] : nodeSize[1];
      const radius = larger / 2;
      nodeSizeFunc = (d) => radius + spacingFunc(d) / 2;
    } else {
      // number type
      const radius = nodeSize / 2;
      nodeSizeFunc = (d) => radius + spacingFunc(d) / 2;
    }
    formattedOptions.nodeSize = nodeSizeFunc;

    // comboPadding to function
    let comboPaddingFunc: (d: any) => number;
    if (isNumber(comboPadding)) {
      comboPaddingFunc = () => comboPadding as any;
    } else if (isArray(comboPadding)) {
      comboPaddingFunc = () => Math.max.apply(null, comboPadding);
    } else if (isFunction(comboPadding)) {
      comboPaddingFunc = comboPadding;
    } else {
      // null type
      comboPaddingFunc = () => 0;
    }
    formattedOptions.comboPadding = comboPaddingFunc;
    return formattedOptions;
  }
}
