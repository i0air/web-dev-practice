<script setup lang="ts">
import type { TimelineLine, TimelineLink, TimelineNode, TimelineProps } from "@/components/timeline-d3-ts";
import TimelineTs from "@/components/timeline-d3-ts/index.vue";
import TimelineJs from "@/components/timeline-d3-js/index.vue";
import { reactive } from "vue";
import Mock from "mockjs";

const lines: TimelineLine[] = Mock.mock({
  "array|10": [{ "id|+1": 1, name: "@cname" }],
}).array;

// SVG 方案超过1000个点会卡顿
const nodes: TimelineNode[] = Mock.mock({
  "array|1000": [{ "id|+1": 1, "line|1-10": 8, name: "@cword(3,5)", date: "@datetime('2024-MM-dd HH:mm:ss')" }],
}).array;

const links: TimelineLink[] = Mock.mock({
  "array|10": [{ "source|1-1000": 1, "target|1-1000": 1 }],
}).array;

// const lines: TimelineLine[] = [
//   { id: "1", name: "线1" },
//   { id: "2", name: "线2" },
//   { id: "3", name: "线3" },
//   { id: "4", name: "线4" },
//   { id: "5", name: "线5" },
//   { id: "6", name: "线6" },
// ];

// const nodes: TimelineNode[] = [
//   { id: "1", line: "1", name: "节点1", date: new Date("2021-10-19 12:00:00") },
//   { id: "1-5", line: "5", name: "节点1-1", date: new Date("2021-10-19 12:00:00") },
//   { id: "2", line: "2", name: "节点2", date: new Date("2021-10-20 12:00:00") },
//   { id: "2-1", line: "1", name: "节点2-1", date: new Date("2021-10-20 12:00:00") },
//   { id: "3", line: "3", name: "节点3", date: new Date("2021-10-21 12:00:00") },
//   { id: "4", line: "4", name: "节点4", date: new Date("2021-10-22 12:00:00") },
//   { id: "5", line: "5", name: "节点5", date: new Date("2021-10-23 12:00:00") },
//   { id: "5-1", line: "5", name: "节点5", date: new Date("2021-10-23 13:00:00") },
//   { id: "6", line: "6", name: "节点6", date: new Date("2021-10-24 12:00:00") },
// ];

// const links: TimelineLink[] = [
//   { source: "1", target: "1-5" },
//   { source: "2", target: "2-1" },
// ];

const padding = [20, 20, 30, 70];
const width = 1000;
const height = 500;

const options = reactive<TimelineProps>({ nodes, lines, links, padding, width, height });
</script>

<template>
  <div class="test-view">
    <timeline-ts :="options" />
    <!-- <timeline-js :="options" /> -->
  </div>
</template>

<style lang="scss" scoped>
.test-view {
  width: 60vw;
}
</style>
