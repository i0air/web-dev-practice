<script lang="ts" setup>
import IPTree from "@/components/ip-tree-g6-ts/index.vue";
import FrameWorker from "@/services/frame?worker";
import { reactive, ref } from "vue";

const treeRef = ref<InstanceType<typeof IPTree>>();
const state = reactive({ nodes: 0, edges: 0, combos: 0 });
let worker: Worker;

function start() {
  if (worker) return;
  worker = new FrameWorker();
  worker.onmessage = (e) => {
    treeRef.value?.add(e.data);
  };
  worker.postMessage(0);
}

function stop() {
  worker && worker.terminate();
}

function handleAdded(nodes: number, edges: number, combos: number) {
  state.nodes = nodes;
  state.edges = edges;
  state.combos = combos;
}

function render() {
  treeRef.value?.render();
}
</script>

<template>
  <div class="g6-tree-view">
    <div class="toolbar">
      <div>
        <el-button type="primary" @click="start">开始</el-button>
        <el-button type="danger" @click="stop">停止</el-button>
        <el-button type="warning" @click="render">绘制</el-button>
      </div>
      <div>节点：{{ state.nodes }} 连线：{{ state.edges }} 分组：{{ state.combos }}</div>
    </div>
    <IPTree ref="treeRef" class="ip-tree" @added="handleAdded" />
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

  .ip-tree {
    flex: 1;
  }
}
</style>
