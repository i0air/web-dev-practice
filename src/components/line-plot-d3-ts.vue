<script lang="ts" setup>
import * as d3 from "d3";
import { onMounted } from "vue";

type LinePlotProps = { data: number[]; width?: number; height?: number; margin?: { top: number; right: number; bottom: number; left: number } };

const props = withDefaults(defineProps<LinePlotProps>(), {
  data: () => <number[]>[],
  width: 500,
  height: 500,
  margin: () => ({ top: 20, right: 20, bottom: 20, left: 20 }),
});

const x = d3.scaleLinear([0, props.data.length - 1], [props.margin.left, props.width - props.margin.right]);
const y = d3.scaleLinear([d3.min(props.data) || 0, d3.max(props.data) || 1], [props.height - props.margin.bottom, props.margin.top]);
const line = d3.line((d, i) => x(i), y);

onMounted(() => {});
</script>

<template>
  <svg :width="width" :height="height" class="line-plot">
    <path fill="none" stroke="currentColor" stroke-width="1.5" :d="line(data) || undefined" />
    <g fill="white" stroke="currentColor" stroke-width="1.5">
      <circle v-for="(d, i) in data" :key="i" :cx="x(i)" :cy="y(d)" r="2.5" />
    </g>
  </svg>
</template>

<style lang="scss" scoped></style>
