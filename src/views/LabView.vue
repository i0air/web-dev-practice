<script setup lang="ts">
import { Color, Line, Rect, Svg, SVG, type NumberAlias } from "@svgdotjs/svg.js";
import { onMounted, ref } from "vue";

const el = ref<HTMLDivElement>();
const step = 0.02;
const size = 10;
let draw: Svg;

function init() {
  if (!el.value) return;
  draw = SVG().addTo(el.value).size("100%", "100%");
  draw.addClass("svg0");

  draw.text("HELLO WORLD").fill("#fff").move(5, 5);
  const bg = draw.rect("50%", "100%").fill("#0002");

  const gline = draw.group();
  gline.line(0, 80, 200, 80).stroke({ width: 1, color: "#ffffff80" });
  gline.line(0, 120, 200, 120).stroke({ width: 1, color: "#ffffff80" });

  const g0 = draw.group();
  for (let i = 0; i < 10; i++) {
    g0.rect(size, size)
      .move(i * 20, 80 - size / 2)
      .fill(Color.random().toHex() + "a0");
  }

  const g1 = draw.group();
  for (let i = 0; i < 10; i++) {
    g1.rect(size, size)
      .move(i * 20, 120 - size / 2)
      .fill(Color.random().toHex());
  }

  bg.on("wheel", (payload) => {
    const ev = payload as WheelEvent;

    gline.children().forEach((l0) => {
      if (ev.shiftKey) {
        const box = l0.bbox();
        (<Line>l0).plot(scale(box.x, ev.offsetX, ev.deltaY), box.y, scale(box.x2, ev.offsetX, ev.deltaY), box.y2);
      } else {
        l0.dx(ev.deltaY * step);
      }
    });

    g0.children().forEach((r) => {
      if (ev.shiftKey) {
        r.x(scale(r.x(), ev.offsetX, ev.deltaY));
      } else {
        r.dx(ev.deltaY * step);
      }
    });

    g1.children().forEach((r) => {
      if (ev.shiftKey) {
        r.x(scale(r.x(), ev.offsetX, ev.deltaY));
      } else {
        r.dx(ev.deltaY * step);
      }
    });
  });
}

function scale(v: NumberAlias, offset: number, delta: number) {
  const d = +v - offset;
  const s = Math.sign(delta);
  const q = 1 / 10;
  return +v + d * s * q;
}

onMounted(() => {
  init();
});
</script>

<template>
  <div ref="el" class="lab"></div>
</template>

<style lang="scss" scoped>
.lab {
  background-color: #ffffff20;
}
</style>
