<script lang="ts" setup>
import LinePlot from "@/components/line-plot-d3-ts.vue";
import * as d3 from "d3";

const data = d3.ticks(-Math.PI, Math.PI, 200).map(Math.sin);
</script>

<template>
  <div class="d3-plot-view">
    <LinePlot :data="data" />
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .d3-plot-view {
    display: flex;
    align-items: center;
    min-height: 100vh;
  }
}
</style>
