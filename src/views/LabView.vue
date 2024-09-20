<script setup lang="ts">
import { Color, Line, Rect, Svg, SVG, type NumberAlias } from "@svgdotjs/svg.js";
import { onMounted, ref } from "vue";

const el = ref<HTMLDivElement>();
let draw: Svg;
const rect = ref<Rect>();

function init() {
  if (!el.value) return;
  draw = SVG().addTo(el.value).size("100%", "100%");
  draw.addClass("svg0");

  draw.text("HELLO WORLD").fill("#fff").move(5, 5);
  const bg = draw.rect("50%", "100%").fill("#0002");

  const gline = draw.group();
  gline.line(0, 80, 190, 80).stroke({ width: 1, color: "#ffffff80" });
  gline.line(0, 130, 190, 130).stroke({ width: 1, color: "#ffffff80" });

  const g0 = draw.group();
  for (let i = 0; i < 10; i++) {
    g0.rect(10, 10)
      .move(i * 20, 75)
      .fill(Color.random().toHex());
  }

  const g1 = draw.group();
  for (let i = 0; i < 10; i++) {
    g1.rect(10, 10)
      .move(i * 20, 125)
      .fill(Color.random().toHex());
  }

  bg.on("wheel", (payload) => {
    const ev = payload as WheelEvent;

    gline.children().forEach((l0) => {
      if (ev.shiftKey) {
        const box = l0.bbox();
        (<Line>l0).plot(scale(box.x, ev.offsetX, ev.deltaY), box.y, scale(box.x2, ev.offsetX, ev.deltaY), box.y2);
      } else {
        l0.dy(ev.deltaY / 100);
      }
    });

    g0.children().forEach((r) => {
      if (ev.shiftKey) {
        r.x(scale(r.x(), ev.offsetX, ev.deltaY));
      } else {
        r.dy(ev.deltaY / 100);
      }
    });

    g1.children().forEach((r) => {
      if (ev.shiftKey) {
        r.x(scale(r.x(), ev.offsetX, ev.deltaY));
      } else {
        r.dy(ev.deltaY / 100);
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
