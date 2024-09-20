<script lang="ts" setup>
import LinePlot from "@/components/LinePlot.vue";
import * as d3 from "d3";

const data = d3.ticks(-Math.PI, Math.PI, 200).map(Math.sin);
</script>

<template>
  <div class="about">
    <LinePlot :data="data" />
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    display: flex;
    align-items: center;
    min-height: 100vh;
  }
}
</style>
