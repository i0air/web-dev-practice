import type { BaseLayoutOptions } from "@antv/g6";
import type { Layout } from "@antv/layout";

export type PointTuple = [number, number] | [number, number, number];

/**
 * <zh/> Tiny 复合布局配置项
 *
 * <en/> Tiny layout configuration item
 */
export interface TinyLayoutOptions {
  /**
   * <zh/> 布局类型
   *
   * <en/> Layout type
   */
  type: "tiny";
  /**
   * <zh/> 布局的中心、默认为图的中心
   *
   * <en/> The center of the layout, default to the center of the graph
   */
  center?: PointTuple;
  /**
   * <zh/> 节点大小（直径）。用于碰撞检测
   *
   * <en/> The size of the node (diameter). Used for collision detection
   * @remarks
   * <zh/> 若不指定，则根据传入的节点的 size 属性计算。若即不指定，节点中也没有 size，则默认大小为 10
   *
   * <en/> If not specified, it will be calculated based on the size attribute of the incoming node. If neither is specified, the default size is 10
   * @defaultValue 10
   */
  nodeSize?: number | number[] | ((d?: Node) => number);
  /**
   * <zh/> preventNodeOverlap 或 preventOverlap 为 true 时生效, 防止重叠时节点/ combo 边缘间距的最小值。可以是回调函数, 为不同节点设置不同的最小间距
   *
   * <en/> It takes effect when preventNodeOverlap or preventOverlap is true. The minimum spacing between nodes when overlapping is prevented. It can be a callback function, and different minimum spacing can be set for different nodes
   */
  spacing?: number | ((d?: Node) => number);
  /**
   * <zh/> 最外层的布局算法，默认为 force
   *
   * <en/> The outermost layout algorithm, default to force
   * @example
   * ```ts
   * import { ForceLayout } from '@antv/layout';
   *
   * outerLayout: new ForceLayout({
   * gravity: 1,
   * factor: 2,
   * linkDistance: (edge: any, source: any, target: any) => {
   * const nodeSize = ((source.size?.[0] || 30) + (target.size?.[0] || 30)) / 2;
   * return Math.min(nodeSize * 1.5, 700);
   *   }
   *  });
   * ```
   * @defaultValue ForceLayout
   */
  outerLayout?: Layout<any>;
  /**
   * <zh/> combo 内部的布局算法，需要使用同步的布局算法，默认为 concentric
   *
   * <en/> The layout algorithm inside the combo, which needs to use a synchronized layout algorithm, default to concentric
   * @example
   * ```ts
   * import { ConcentricLayout } from '@antv/layout';
   *
   * innerLayout: new ConcentricLayout({
   *  sortBy: 'id'
   *  });
   * ```
   * @defaultValue ConcentricLayout
   */
  innerLayout?: Layout<any>;
  /**
   * <zh/>  Combo 内部的 padding 值，不用于渲染，仅用于计算力。推荐设置为与视图上 combo 内部 padding 值相同的值
   *
   * <en/> The padding value inside the combo, which is not used for rendering, but only for calculating force. It is recommended to set it to the same value as the combo internal padding value on the view
   * @defaultValue 10
   */
  comboPadding?: ((d?: unknown) => number) | number | number[] | undefined;
  /**
   * <zh/> treeKey
   *
   * <en/> treeKey
   */
  treeKey?: string;
}
