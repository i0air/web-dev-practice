<script lang="ts" setup>
import { Panel } from "@/components/ui/panel";
import { Button } from "@pixi/ui";
import { Application, Assets, Container, Graphics, Sprite, Text, TextStyle, Texture } from "pixi.js";
import { onMounted, ref } from "vue";

const elRef = ref<HTMLDivElement>();

async function pixiui() {
  const app = new Application();
  await app.init({ resizeTo: elRef.value, backgroundAlpha: 0.2 });
  elRef.value?.appendChild(app.canvas);

  const container = new Container();
  container.x = 100;
  container.y = 100;

  const buttonView = new Container();
  const buttonBg = new Graphics().roundRect(0, 0, 120, 32, 3).fill(0x00aaee);
  const buttonText = new Text({ text: "确定", style: { fontSize: 16, fill: 0xffffff } });
  buttonText.anchor.set(0.5);
  buttonText.x = buttonBg.width / 2;
  buttonText.y = buttonBg.height / 2;
  buttonView.addChild(buttonBg, buttonText);
  const button = new Button(buttonView);
  button.onPress.connect(() => {
    console.log("button pressed");
  });
  button.onHover.connect(() => {
    buttonBg.tint = 0x0099cc;
  });
  button.onOut.connect(() => {
    buttonBg.tint = 0xffffff;
  });
  container.addChild(button.view);
  app.stage.addChild(container);
}

async function load() {
  //#region 初始化
  const app = new Application();
  await app.init({ background: 0xffffff, resizeTo: elRef.value });
  elRef.value?.appendChild(app.canvas);
  //#endregion

  //#region 加载资源
  await Assets.load(["/assets/wallhaven-pkw6y3_3840x2160.png", "/assets/engineering.png"]);
  //#endregion

  //#region 添加背景
  const bg = new Sprite({
    texture: Assets.get<Texture>("/assets/wallhaven-pkw6y3_3840x2160.png"),
    anchor: 0.5,
    scale: { x: app.screen.width / 3840, y: app.screen.height / 2160 },
    x: app.screen.width / 2,
    y: app.screen.height / 2,
    alpha: 0.5,
  });
  app.stage.addChild(bg);
  //#endregion

  const pnl0 = new Panel({ x: 10, y: 50, width: 200, height: 100 });
  pnl0.addChild(new Panel({ x: 10, y: 10, width: 100, height: 80, background: 0x8e5c94 }));
  app.stage.addChild(pnl0);

  const pnl1 = new Panel({ x: app.screen.width / 2, y: app.screen.height / 2, width: 200, height: 100, background: 0x8e5c94 });
  app.stage.addChild(pnl1);

  const clip = new Graphics().circle(app.screen.width / 2, app.screen.height / 2, 200).fill({ color: 0xffffff, alpha: 0.1 });
  app.stage.addChild(clip);
  pnl1.mask = clip;

  //#region 添加角标
  const icon = new Sprite({
    texture: Assets.get<Texture>("/assets/engineering.png"),
    anchor: 0.5,
    scale: 0.35,
    x: app.screen.width - 50,
    y: app.screen.height - 50,
  });
  app.stage.addChild(icon);
  //#endregion

  //#region 添加台标
  const text = new Text({
    x: 10,
    y: 10,
    text: "Hello PixiJS",
    style: new TextStyle({ fontSize: 16, fill: 0xffffff, stroke: { color: 0x4a1850, width: 5, join: "round" } }),
  });
  app.stage.addChild(text);
  //#endregion

  //#region 设置动画
  app.ticker.add(() => {
    const r = (icon.rotation + 0.01) % (Math.PI * 2);
    icon.rotation = r;
  });
  //#endregion
}

async function maskTest() {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ antialias: true, resizeTo: elRef.value });

  // Append the application canvas to the document body
  elRef.value?.appendChild(app.canvas);

  app.stage.eventMode = "static";

  // Load textures
  await Assets.load(["/assets/engineering.png", "/assets/tree.png", "/assets/wallhaven-pkw6y3_3840x2160.png"]);

  const bg = Sprite.from("/assets/wallhaven-pkw6y3_3840x2160.png");

  bg.anchor.set(0.5);
  bg.scale.set(0.5);
  bg.x = app.screen.width / 2;
  bg.y = app.screen.height / 2;

  app.stage.addChild(bg);

  const container = new Container();

  container.x = app.screen.width / 2;
  container.y = app.screen.height / 2;

  // Add a bunch of sprites
  const light = Sprite.from("/assets/engineering.png");
  light.anchor.set(0.5);

  const tree = Sprite.from("/assets/tree.png");
  tree.anchor.set(0.5);
  tree.scale.set(0.5);

  container.addChild(light, tree);

  app.stage.addChild(container);

  // Let's create a moving shape mask
  const thing = new Graphics();

  app.stage.addChild(thing);
  thing.x = app.screen.width / 2;
  thing.y = app.screen.height / 2;

  container.mask = thing;

  app.stage.on("pointertap", () => {
    if (!container.mask) {
      container.mask = thing;
      help.text = "Click or tap to turn masking off.";
    } else {
      container.mask = null;
      help.text = "Click or tap to turn masking on.";
    }
  });

  const help = new Text({
    text: "Click or tap to turn masking off.",
    style: {
      fontFamily: "Arial",
      fontSize: 12,
      fontWeight: "bold",
      fill: "white",
    },
  });

  help.y = app.screen.height - 26;
  help.x = 10;
  app.stage.addChild(help);

  let count = 0;
  // Animate the mask
  app.ticker.add(() => {
    // bg.rotation += 0.01;

    light.rotation -= 0.02;

    // panda.scale.x = 1 + Math.sin(count) * 0.04;
    // panda.scale.y = 1 + Math.cos(count) * 0.04;

    count += 0.1;

    thing.clear();
    // thing.moveTo(-120 + Math.sin(count) * 20, -100 + Math.cos(count) * 20);
    // thing.lineTo(120 + Math.cos(count) * 20, -100 + Math.sin(count) * 20);
    // thing.lineTo(120 + Math.sin(count) * 20, 100 + Math.cos(count) * 20);
    // thing.lineTo(-120 + Math.cos(count) * 20, 100 + Math.sin(count) * 20);
    thing.ellipse(0, 0, 100, 50);
    thing.fill({ color: 0x8bc5ff, alpha: 0.4 });
    thing.rotation = count * 0.1;
  });
}

onMounted(async () => {
  // maskTest();
  load();
});
</script>

<template>
  <div ref="elRef" class="pixi-view"></div>
</template>

<style lang="scss" scoped>
.pixi-view {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}
</style>
