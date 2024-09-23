<script setup>
import * as d3 from "d3";
import { ref, onMounted } from "vue";

const props = defineProps({
  nodes: { type: Array, default: () => [] },
  links: { type: Array, default: () => [] },
  padding: { type: Array, default: () => [50, 50, 50, 50] },
  width: { type: Number, default: 600 },
  height: { type: Number, default: 300 },
});
const svgRef = ref();

//#region d3 chart demo
const x = d3
  .scaleTime()
  .domain(d3.extent(props.nodes, (d) => d.date))
  .range([props.padding[3], props.width - props.padding[1]]);

const y = d3
  .scalePoint()
  .domain(props.nodes.map((d) => d.id))
  .range([props.height - props.padding[2], props.padding[0]]);

const zoomd = d3.zoom().on("zoom", (event) => {
  const rx = event.transform.rescaleX(x);
  d3.selectAll(".nodes circle").attr("cx", (d) => rx(d.date));
  d3.selectAll(".arrowLine path").attr("d", (d) => {
    const x1 = rx(props.nodes.filter((item) => item.id === d.source)[0].date);
    const x2 = rx(props.nodes.filter((item) => item.id === d.target)[0].date);
    const y1 = (y(d.source) || 0) - 5;
    const y2 = (y(d.target) || 0) + 5;
    return `M ${x1},${y1} L ${x2},${y2}`;
  });
  d3.select(".x-axis").call(xAxis, rx);
});

function xAxis(g, x) {
  return g
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${props.height - props.padding[2]})`)
    .call(
      d3
        .axisBottom(x)
        .ticks(props.width / 80)
        .tickSizeOuter(0),
    );
}

function yAxis(g, y) {
  return g
    .attr("class", "y-axis")
    .attr("transform", `translate(${props.padding[3]},0)`)
    .call(d3.axisLeft(y).tickFormat(formatter))
    .call((_g) =>
      _g
        .selectAll(".tick line")
        .attr("x1", props.width - props.padding[1] - props.padding[3])
        .attr("stroke-opacity", 0.3),
    );
}

function formatter(item) {
  return props.nodes.filter((n) => n.id === item + "")[0].name;
}

function setYAxisStyle(g, lineWidth) {
  const colors = ["#419388", "#4795eb", "#d83965"];
  // 去除y轴的竖线
  g.select(".domain").remove();

  g.selectAll(".tick").each(function (d, i) {
    const tick = d3.select(this);
    // 在各项开头增加圆形节点
    tick
      .append("circle")
      .attr("r", 8)
      .attr("fill", colors[i % 3]);
    // 设置文本颜色，和圆形颜色保持一致
    tick.select("text").attr("fill", colors[i % 3]);
    // 设置横线颜色
    tick
      .select("line")
      .attr("x1", lineWidth)
      .attr("stroke", colors[i % 3])
      .attr("stroke-width", 2);
  });
}

function setYAxisEvent(g) {
  g.selectAll(".tick").each(function () {
    const tick = d3.select(this);
    const left = +tick.select("line").attr("x2");
    const right = +tick.select("line").attr("x1");
    const r = +tick.select("circle").attr("r");
    tick.select("text").on("click", function () {
      const rect = d3.select("rect");
      if (rect.empty()) {
        tick
          .insert("rect", ":first-child")
          .attr("x", left - 3)
          .attr("y", -r - 5)
          .attr("width", right - left + 3)
          .attr("height", r * 2 + 10)
          .attr("fill", "#AAA")
          .attr("fill-stroke", 0.2);
      } else {
        rect.remove();
      }
    });
  });
}

function drawNodes(g, nodes, x, y) {
  return g
    .attr("class", "nodes")
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("cx", (n) => x(n.date))
    .attr("cy", (n) => y(n.id) || null)
    .attr("r", 5)
    .attr("fill", "aqua");
}

function drawLinks(g, nodes, links, x, y) {
  return g
    .append("g")
    .attr("class", "arrowLine")
    .selectAll("path")
    .data(links)
    .join("path")
    .attr("d", (n) => {
      const x1 = x(nodes.filter((item) => item.id === n.source)[0].date);
      const x2 = x(nodes.filter((item) => item.id === n.target)[0].date);
      const y1 = (y(n.source) || 0) - 5;
      const y2 = (y(n.target) || 0) + 5;
      return `M ${x1},${y1} L ${x2},${y2}`;
    })
    .attr("pathLength", "90")
    .attr("stroke", "skyblue")
    .attr("marker-end", "url(#arrow)");
}

function drawTooltip(g, links) {
  const tooltip = g.append("g").attr("class", "tooltip").style("pointer-events", "none");

  const entered = (event, data) => {
    const position = d3.pointer(event);
    const curLink = links.filter((item) => item.source === data.id || item.target === data.id);
    const textData = [`节点名称: ${data.name}`];
    if (curLink.length !== 0) {
      curLink.forEach((item) => {
        textData.push(`起始节点: ${item.source}`);
        textData.push(`目标节点: ${item.target}`);
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
          .attr("y", (_, i) => `${(i - textData.length) * 1.2}em`)
          .attr("fill", "black")
          .text((d) => d),
      );
    const textNode = text.node();
    const { x, y, width: w, height: h } = textNode.getBBox();
    text.attr("transform", `translate(${-w / 2},0)`);
    path.attr("d", `M${-w / 2 - 10},-12 v${-h - 10}h${w + 20}v${h + 10}h${-(w / 2) - 7}l-3,5l-3,-5h${-(w / 2) - 7}`);
    tooltip.style("display", "");
  };

  const leaved = () => {
    tooltip.style("display", "none");
  };

  g.selectAll(".nodes circle")
    .on("pointerenter", (event, data) => entered(event, data))
    .on("pointerleave", leaved);
}
//#endregion

function init() {
  if (!svgRef.value) return;

  const svg = d3.select(svgRef.value).attr("viewBox", [0, 0, props.width, props.height]);

  svg
    .append("defs")
    .append("marker")
    .attr("id", "arrow")
    .attr("markerHeight", 10)
    .attr("markerWidth", 10)
    .attr("refX", 5)
    .attr("refY", 2.5)
    .attr("orient", "auto")
    .append("path")
    .attr("fill", "skyblue")
    .attr("d", "M0,0 v5 l7,-2.5 Z");

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

onMounted(() => {
  init();
});
</script>

<template>
  <svg ref="svgRef" class="timeline"></svg>
</template>

<style lang="scss" scoped>
.timeline {
  background-color: #ffffff40;
}
</style>
