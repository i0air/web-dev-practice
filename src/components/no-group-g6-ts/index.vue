<script lang="ts" setup>
import { RectangleGenerator } from "@/data/rectangle-generator";
import { Graph, type NodeData } from "@antv/g6";
import { onMounted, ref } from "vue";

const props = withDefaults(defineProps<RectangleGenerator.Options>(), { i: 0, size: 10 });
const graphRef = ref<HTMLElement>();
const colors = ["#ff0000", "#00ff00", "#8888ff", "#ffff00", "#ff00ff", "#00ffff"];

let graph: Graph;

function init() {
  graph = new Graph({
    container: graphRef.value,
    node: {
      style: { size: props.size, labelText: (d) => d.id },
    },
    behaviors: ["drag-canvas", "zoom-canvas", "drag-element"],
  });
}

function add() {}

defineExpose({ add });

onMounted(() => {
  init();
});
</script>

<template>
  <div ref="graphRef"></div>
</template>

<style lang="scss" scoped></style>
