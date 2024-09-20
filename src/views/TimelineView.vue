<script setup lang="ts">
import type { TimelineProps } from "@/components/timeline";
import Timeline from "@/components/timeline/index.vue";
import ChartDemo from "@/components/ChartDemo.vue";
import { reactive } from "vue";

const nodes = [
  { id: "1", name: "节点1", date: new Date("2021-10-19 12:00:00") },
  { id: "1-1", name: "节点1-1", date: new Date("2021-10-19 12:00:00") },
  { id: "2", name: "节点2", date: new Date("2021-10-20 12:00:00") },
  { id: "2-1", name: "节点2-1", date: new Date("2021-10-20 12:00:00") },
  { id: "4", name: "节点4", date: new Date("2021-10-22 12:00:00") },
  { id: "3", name: "节点3", date: new Date("2021-10-21 12:00:00") },
  { id: "5", name: "节点5", date: new Date("2021-10-23 12:00:00") },
  { id: "6", name: "节点6", date: new Date("2021-10-24 12:00:00") },
];

const links = [
  { source: "1", target: "1-1" },
  { source: "2", target: "2-1" },
];

const padding = [20, 20, 20, 150];

const width = 600;
const height = 300;

const options = reactive<TimelineProps>({ nodes, links, padding, width, height });
</script>

<template>
  <timeline :="options" />
</template>

<style lang="scss" scoped></style>
