<script setup lang="ts">
import { SVG } from "@svgdotjs/svg.js";
import { onMounted, ref } from "vue";

const elref = ref<HTMLDivElement>();

function init() {
  if (!elref.value) return;
  const draw = SVG().addTo(elref.value);
  draw.rect(100, 100).move(100, 50).fill("#f06");
}

onMounted(() => {
  init();
});
</script>

<template>
  <div ref="elref" class="lab">HELLO WORLD</div>
</template>

<style lang="scss" scoped>
.lab {
  background-color: #ffffff40;
}
</style>
