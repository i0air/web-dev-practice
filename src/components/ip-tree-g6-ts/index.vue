<script lang="ts" setup>
import type { IPFrame, IPSession } from "@/typings/ip-session";
import { Graph, type GraphData } from "@antv/g6";
import { onMounted, reactive, ref } from "vue";
// import comboData from "@/data/combo.json";

const emits = defineEmits<{ (event: "added", nodes: number, edges: number, combos: number): void }>();
const state = reactive<{ sessions: IPSession[]; data: GraphData; theme: number }>({
  sessions: [],
  data: { nodes: [], edges: [], combos: [] },
  theme: 0,
});
const graphRef = ref<HTMLDivElement>();
let graph: Graph;

function init() {
  graph = new Graph({
    container: graphRef.value,
    theme: "dark",
    node: {
      style: { size: 20, labelText: (d) => d.label + "" },
      palette: { type: "group", field: (d) => d.combo + "" },
    },
    layout: {
      type: "combo-combined",
      comboPadding: 2,
      animation: false,
    },
    behaviors: ["drag-canvas", "zoom-canvas", "drag-element"],
  });

  graph.render();
}

function srcid(frame: IPFrame) {
  return `${frame.srcCommNetId}|${frame.srcIp}`;
}

function dsrid(frame: IPFrame) {
  return `${frame.dstCommNetId}|${frame.dstIp}`;
}

function add(session: IPSession) {
  state.sessions.push(session);
  // 处理 session，生成 data
  const f = session.data;
  const data: GraphData = {
    nodes: [
      {
        id: srcid(f),
        label: f.srcIp,
        combo: f.srcCommNetId ? f.srcCommNetId + "" : undefined,
        data: { device: f.srcDevice, ip: f.srcIp, commNetId: f.srcCommNetId },
      },
      {
        id: dsrid(f),
        label: f.dstIp,
        combo: f.dstCommNetId ? f.dstCommNetId + "" : undefined,
        data: { device: f.dstDevice, ip: f.dstIp, commNetId: f.dstCommNetId },
      },
    ],
    edges: [{ source: srcid(f), target: dsrid(f) }],
    combos: [],
  };
  if (f.srcCommNetId) data.combos?.push({ id: f.srcCommNetId + "" });
  if (f.dstCommNetId && f.dstCommNetId !== f.srcCommNetId) data.combos?.push({ id: f.dstCommNetId + "" });

  data.combos?.forEach((combo) => {
    if (!state.data.combos?.find((c) => c.id === combo.id)) {
      state.data.combos?.push(combo);
      graph.addComboData([combo]);
    }
  });
  data.nodes?.forEach((node) => {
    if (!state.data.nodes?.find((n) => n.id === node.id)) {
      state.data.nodes?.push(node);
      graph.addNodeData([node]);
    }
  });
  data.edges?.forEach((edge) => {
    if (!state.data.edges?.find((e) => e.source === edge.source && e.target === edge.target)) {
      state.data.edges?.push(edge);
      graph.addEdgeData([edge]);
    }
  });

  emits("added", state.data.nodes?.length || 0, state.data.edges?.length || 0, state.data.combos?.length || 0);
  graph.render();
}

function render() {
  graph.render();
}

defineExpose({ add, render });

onMounted(() => {
  init();
});
</script>

<template>
  <div ref="graphRef"></div>
</template>

<style lang="scss" scoped>
div {
  background-color: #00000080;
}
</style>
