<script lang="ts" setup>
import * as d3 from "d3";
import { type D3ZoomEvent } from "d3";
import { onMounted, ref } from "vue";
import type { TimelineLink, TimelineNode, TimelineProps } from ".";
import { Color } from "cesium";

const props = defineProps<TimelineProps>();
const svgRef = ref<SVGSVGElement>();

//#region 定义
const x = d3
  .scaleTime()
  .domain(d3.extent(props.nodes, (d) => new Date(d.date)) as [Date, Date])
  .range([props.padding[3], props.width - props.padding[1]]);

const y = d3
  .scalePoint()
  .domain(props.lines.map((d) => d.id + "").sort(d3.descending))
  .range([props.height - props.padding[2], props.padding[0]]);

const s = 6;

const xAxis = (g: d3.Selection<SVGGElement, TimelineNode, any, unknown>, x: d3.ScaleTime<number, number>) =>
  g
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${props.height - props.padding[2]})`)
    .call(
      d3
        .axisBottom(x)
        .ticks(props.width / 80)
        .tickSizeOuter(0),
    );
const yAxis = (g: d3.Selection<SVGGElement, TimelineNode, any, unknown>, y: d3.ScalePoint<string>) =>
  g
    .attr("class", "y-axis")
    .attr("transform", `translate(${props.padding[3]},0)`)
    .call(d3.axisLeft(y).tickFormat((id) => props.lines.find((l) => l.id + "" === id)?.name || `未命名${id}`))
    .call((_g) =>
      _g
        .selectAll(".tick line")
        .attr("x1", props.width - props.padding[1] - props.padding[3])
        .attr("stroke-opacity", 0.3),
    );

const setYAxisStyle = (g: d3.Selection<SVGGElement, TimelineNode, any, unknown>, lineWidth: number) => {
  // const colors = ["#419388", "#4795eb", "#d83965"];
  // 去除y轴的竖线
  // g.select(".domain").remove();

  g.selectAll(".tick").each(function (d, i) {
    // const color = Color.fromRandom({ alpha: 1 }).toCssHexString();
    const tick = d3.select(this);
    // // 在各项开头增加圆形节点
    // tick
    //   .append("circle")
    //   .attr("r", 8)
    //   .attr("fill", colors[i % 3]);
    // 设置文本颜色，和圆形颜色保持一致
    tick.select("text"); //.attr("fill", color);
    // 设置横线颜色
    tick.select("line").attr("x1", lineWidth).attr("stroke-width", 2); //.attr("stroke", color);
  });
};

const setYAxisEvent = (g: d3.Selection<SVGGElement, TimelineNode, any, unknown>) => {
  g.selectAll(".tick").each(function () {
    const tick = d3.select(this);
    const left = +tick.select("line").attr("x2");
    const right = +tick.select("line").attr("x1");
    const svgg = tick.node() as SVGGElement;
    const bbox = svgg.getBBox();

    tick.select("text").on("click", function () {
      const rect = d3.select("rect");
      if (rect.empty()) {
        tick
          .insert("rect", ":first-child")
          .attr("x", left)
          .attr("y", bbox.y - s / 2 - 2)
          .attr("width", right - left)
          .attr("height", bbox.height + s + 4)
          .attr("fill", "#AAA")
          .attr("fill-stroke", 0.2);
      } else {
        rect.remove();
      }
    });
  });
};

const drawNodes = (
  g: d3.Selection<SVGGElement, TimelineNode, any, unknown>,
  nodes: TimelineNode[],
  x: d3.ScaleTime<number, number>,
  y: d3.ScalePoint<string>,
) =>
  g
    .attr("class", "nodes")
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("cx", (n) => x(new Date(n.date)))
    .attr("cy", (n) => y(n.line + "") || null)
    .attr("r", s)
    .attr("fill", "#ffff00a0");

const validLink = (link: TimelineLink, nodes: TimelineNode[]) => {
  return link.target !== link.source && nodes.findIndex((node) => node.id === link.source) >= 0 && nodes.findIndex((node) => node.id === link.target) >= 0;
};

const drawLink = (link: TimelineLink, nodes: TimelineNode[], x: d3.ScaleTime<number, number>, y: d3.ScalePoint<string>) => {
  const x1 = x(new Date(nodes.find((n) => n.id === link.source)!.date));
  const x2 = x(new Date(nodes.find((n) => n.id === link.target)!.date));
  const y1 = y(nodes.find((n) => n.id === link.source)!.line + "") || 0;
  const y2 = y(nodes.find((n) => n.id === link.target)!.line + "") || 0;
  return `M ${x1},${y1} L ${x2},${y2}`;
};

const drawLinks = (
  g: d3.Selection<SVGGElement, TimelineNode, any, unknown>,
  nodes: TimelineNode[],
  links: TimelineLink[],
  x: d3.ScaleTime<number, number>,
  y: d3.ScalePoint<string>,
) =>
  g
    .append("g")
    .attr("class", "arrowLine")
    .selectAll("path")
    .data(links.filter((link) => validLink(link, nodes)))
    .join("path")
    .attr("d", (d) => drawLink(d, nodes, x, y))
    .attr("pathLength", "90")
    .attr("stroke", "red")
    .attr("marker-end", "url(#arrow)");

const drawTooltip = (g: d3.Selection<SVGSVGElement, TimelineNode, any, unknown>, links: TimelineLink[]) => {
  const tooltip = g.append("g").attr("class", "tooltip").style("pointer-events", "none");

  const entered = (event: MouseEvent, data: TimelineNode) => {
    const position = d3.pointer(event);
    const curLink = links.filter((item) => item.source === data.id || item.target === data.id);
    const textData = [`节点名称: ${data.name}(${data.id})`];
    if (curLink.length !== 0) {
      curLink.forEach((item) => {
        const source = props.nodes.find((node) => node.id === item.source);
        const target = props.nodes.find((node) => node.id === item.target);
        textData.push(`${source?.name}(${item.source}) → ${target?.name}(${item.target})`);
      });
    }
    tooltip.style("dispaly", null);
    tooltip.attr("transform", `translate(${position[0]}, ${position[1]})`);
    const path = tooltip.selectAll("path").data([,]).join("path").attr("fill", "white").attr("stroke", "black");
    const text = tooltip
      .selectAll("text")
      .data([,])
      .join("text")
      .call((text) =>
        text
          .selectAll("tspan")
          .data(textData)
          .join("tspan")
          .attr("x", 0)
          .attr("y", (_, i) => `${(i - textData.length) * 1.25}em`)
          .attr("fill", "black")
          .text((d) => d),
      );
    const textNode = text.node() as SVGTextElement;
    const { x, y, width: w, height: h } = textNode.getBBox();
    text.attr("transform", `translate(${-w / 2},0)`);
    path.attr("d", `M${-w / 2 - 10},-12 v${-h - 4}h${w + 20}v${h + 4}h${-(w / 2) - 7}l-3,5l-3,-5h${-(w / 2) - 7}`);
    tooltip.style("display", "");
  };

  const leaved = () => {
    tooltip.style("display", "none");
  };

  g.selectAll(".nodes circle")
    .on("pointerenter", (event, data) => entered(event, data as TimelineNode))
    .on("pointerleave", leaved);
};

const zoomd = d3.zoom<SVGSVGElement, TimelineNode>().on("zoom", (event: D3ZoomEvent<SVGSVGElement, TimelineNode>) => {
  const rx = event.transform.rescaleX(x);
  d3.selectAll<SVGCircleElement, TimelineNode>(".nodes circle").attr("cx", (d) => rx(new Date(d.date)));
  d3.selectAll<SVGPathElement, TimelineLink>(".arrowLine path").attr("d", (d) => drawLink(d, props.nodes, rx, y));
  d3.select<SVGGElement, TimelineNode>(".x-axis").call(xAxis, rx);
});
//#endregion

function init() {
  if (!svgRef.value) return;

  const svg = d3
    .select<SVGSVGElement, TimelineNode>(svgRef.value)
    .attr("viewBox", [0, 0, props.width, props.height])
    .attr("width", props.width)
    .attr("height", props.height);

  svg
    .append("defs")
    .append("marker")
    .attr("id", "arrow")
    .attr("markerHeight", 20)
    .attr("markerWidth", 20)
    .attr("refX", 10)
    .attr("refY", 5)
    .attr("orient", "auto")
    .append("path")
    .attr("fill", "red")
    .attr("d", "M0,0 v10 l10,-5 Z");

  // 设置剪切区域，避免节点和边超出轴线
  svg
    .append("clipPath")
    .attr("id", "clipView")
    .append("path")
    .attr(
      "d",
      `M${props.padding[3]},0 h${props.width - props.padding[3] - props.padding[1]} v${props.height} h${-(props.width - props.padding[3] - props.padding[1])} v${-props.height}z`,
    );

  svg.append("g").call(xAxis, x);

  svg
    .append("g")
    .call(yAxis, y)
    .call(setYAxisStyle, props.width - props.padding[1] - props.padding[3])
    .call(setYAxisEvent);

  svg.call(zoomd);

  svg.append("g").attr("clip-path", "url(#clipView)").call(drawNodes, props.nodes, x, y);

  svg.append("g").attr("clip-path", "url(#clipView)").call(drawLinks, props.nodes, props.links, x, y);

  svg.call(drawTooltip, props.links);
}

function fold() {
  const id = "2-1";
  // 1.移除指定Y轴轴线
  d3.select(`.y-axis-${id}`).remove();
  // 2.移除该轴线上所有节点
  // 3.移除与该轴线上节点相连的边
}

onMounted(() => {
  init();
});
</script>

<template>
  <div class="toolbar" :style="{ maxWidth: `${width}px` }">
    <el-button type="primary" @click="fold">折叠</el-button>
    <el-button type="primary">展开</el-button>
  </div>
  <svg ref="svgRef" class="timeline"></svg>
</template>

<style lang="scss" scoped>
.toolbar {
  display: flex;
  align-items: center;
  background-color: #ffffff80;
  padding: 10px;
}
.timeline {
  background-color: #ffffff30;
}
</style>
