<script lang="ts" setup>
import IPTree from "@/components/ip-tree-g6-ts/index.vue";
import { RectangleGenerator } from "@/data/rectangle-generator";
import FrameWorker from "@/services/frame?worker";
import GraphDataWorker from "@/services/graph-data?worker";
import { Graph, type NodeData } from "@antv/g6";
import { reactive, ref } from "vue";

const treeRef = ref<InstanceType<typeof IPTree>>();
const state = reactive({ nodes: 0, edges: 0, combos: 0 });
let worker: Worker | null;

function log(msg: string, color?: string) {
  const el = infoRef.value;
  if (!el) return;
  const info = document.createElement("div");
  info.innerText = msg;
  if (color) info.style.color = color;
  el.appendChild(info);

  if (el.children.length > 50) {
    el.removeChild(el.children[0]);
  }
}

function start() {
  if (worker) return;
  worker = new FrameWorker();
  worker.onmessage = (e) => {
    treeRef.value?.add(e.data);
    log(`${e.data.data.srcIp}(${e.data.data.srcCommNetId}) - ${e.data.data.dstIp}(${e.data.data.dstCommNetId})`);
  };
  worker.postMessage(0);
}

function stop() {
  worker && worker.terminate();
  worker = null;
}

function handleAdded(nodes: number, edges: number, combos: number) {
  state.nodes = nodes;
  state.edges = edges;
  state.combos = combos;
}

//#region 单步测试
const colors = ["#ff0000", "#00ff00", "#8888ff", "#ffff00", "#ff00ff", "#00ffff"];
const infoRef = ref<HTMLDivElement>();
let gworker: Worker | null;
let graph: Graph;
let btnText = ref("单点绘制");

function render() {
  if (!graph) {
    graph = new Graph({
      container: "container",
      theme: "dark",
      node: {
        style: { fill: (d) => colors[Number(d.data?.m)], labelText: (d) => d.id },
      },
      behaviors: ["drag-canvas", "zoom-canvas", "drag-element"],
    });
  }
  if (gworker) {
    btnText.value = "单点绘制";
    gworker.terminate();
    gworker = null;
  } else {
    btnText.value = "停止绘制";
    gworker = new GraphDataWorker();
    gworker.onmessage = (e: MessageEvent<NodeData>) => {
      log(`${e.data.id}, ${e.data.style?.x}, ${e.data.style?.y}`, colors[Number(e.data.data?.m)]);
      graph.addNodeData([e.data]);
      graph.render();
    };
    const msg: RectangleGenerator.Options = { i: 0, gap: { x: 100, y: 100 }, center: { x: 600, y: 500 } };
    gworker.postMessage(msg);
  }
}
//#endregion
</script>

<template>
  <div class="g6-tree-view">
    <div class="toolbar">
      <div>
        <el-button type="primary" @click="start">开始</el-button>
        <el-button type="danger" @click="stop">停止</el-button>
        <el-button type="warning" @click="render">{{ btnText }}</el-button>
        <!-- <el-button type="success" @click="reset">重置</el-button> -->
      </div>
      <div>节点：{{ state.nodes }} 连线：{{ state.edges }} 分组：{{ state.combos }}</div>
    </div>

    <div class="graph-main">
      <IPTree ref="treeRef" class="ip-tree" @added="handleAdded" />
      <!-- <div id="container" class="ip-tree"></div> -->
      <div ref="infoRef" class="info"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.g6-tree-view {
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 10px #ffffff4a inset;
  width: 100vw;
  height: 100vh;

  .toolbar {
    display: flex;
    align-items: center;
    gap: 100px;
    box-shadow: 0 0 5px #ffffffa0 inset;
    padding: 10px;
    height: 44px;
  }

  .graph-main {
    display: flex;
    flex: 1;

    .ip-tree {
      flex: 1;
    }

    .info {
      background-color: #ffffff20;
      padding: 5px 10px;
      width: 400px;
      overflow: hidden;
      font-size: small;
      font-family: Consolas;

      & > * {
        white-space: nowrap;
      }
    }
  }
}
</style>
