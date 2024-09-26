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

const padding = [20, 20, 30, 70];
const width = 1024;
const height = 600;

const options = reactive<TimelineProps>({ nodes, lines, links, padding, width, height });
</script>

<template>
  <div class="d3-timeline-view">
    <timeline-ts :="options" />
    <!-- <timeline-js :="options" /> -->
  </div>
</template>

<style lang="scss" scoped>
@media (min-width: 1024px) {
  .d3-timeline-view {
    display: flex;
    align-items: center;
    min-height: 100vh;
  }
}
</style>
