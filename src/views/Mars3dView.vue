<script lang="ts" setup>
import * as mars3d from "mars3d";
import { Cartesian3, Cartographic, Matrix4, Transforms } from "mars3d-cesium";
import { onMounted, onUnmounted } from "vue";

let map: mars3d.Map | null;
let layer: mars3d.layer.GraphicLayer;

/** 构建地图 */
async function createMap() {
  map = new mars3d.Map("mars3dContainer", {
    control: { homeButton: true },
    scene: {
      center: { lng: 121.5, lat: 23.5, alt: 2e5, heading: 0, pitch: -90 },
      globe: { depthTestAgainstTerrain: true },
    },
  });

  /** 添加本地图层服务 */
  const tileLayer = new mars3d.layer.XyzLayer({
    url: "//192.168.50.200:8888/L{sx}/R{sy}/C{sz}.jpg",
    customTags: {
      sx: (_: mars3d.layer.XyzLayer, _z: number, _y: number, x: number) => x.toString().padStart(2, "0").toUpperCase(),
      sy: (_: unknown, _z: number, y: number) => y.toString(16).padStart(8, "0").toUpperCase(),
      sz: (_: unknown, z: number) => z.toString(16).padStart(8, "0").toUpperCase(),
    },
    maximumLevel: 18,
  });
  map.addLayer(tileLayer);

  /** 添加绘画图层 */
  layer = new mars3d.layer.GraphicLayer();
  map.addLayer(layer);

  /** 监听相机移动结束事件 */
  map.viewer.camera.moveEnd.addEventListener(() => {
    const m3dview = map?.getCameraView();
    const lv = 27 - Math.log2(m3dview.alt || 2e5);
    console.log("相机移动结束", m3dview.alt, lv);
  });
}

function createPointBall() {
  const center = Cartesian3.fromDegrees(121.311, 23.5, 2500);
  const top = Cartesian3.fromDegrees(121.311, 23.5, 2500 + 25000);

  drawPoint(center, "#ff0000");
  drawPoint(top, "#ff0000");
  drawLine([center, top]);
  drawSphere(center, 25000);

  const points = generatePoints(center, 25000, 1000);
  for (const point of points) {
    drawPoint(point);
  }
}

/** 球切面平移测试 */
function tryTranslate() {
  const c = Cartesian3.fromDegrees(121.811, 23.5, 1000);

  const px = translate(c, new Cartesian3(10000, 0, 0));
  const py = translate(c, new Cartesian3(0, 10000, 0));
  const pz = translate(c, new Cartesian3(0, 0, 10000));

  drawLine([c, px], "#0000ff");
  drawLine([c, py], "#00ff00");
  drawLine([c, pz], "#ff0000");
  drawPoint(px, "#0000ff", "X");
  drawPoint(py, "#00ff00", "Y");
  drawPoint(pz, "#ff0000", "Z");
}

function drawPoint(position: Cartesian3, color: string = "#00ff00", text: string = "") {
  const graphic = new mars3d.graphic.PointPrimitive({
    position,
    style: { color, pixelSize: 3, label: { text } },
  });
  layer.addGraphic(graphic);
}

function drawLine(positions: Cartesian3[], color: string = "#00ffff") {
  const graphic = new mars3d.graphic.PolylineEntity({
    positions,
    style: { width: 1, color, depthFail: true, depthFailColor: "#ff0000", depthFailOpacity: 0.2 },
  });
  layer.addGraphic(graphic);
}

function drawSphere(position: Cartesian3, radius: number, color: string = "#ffff0080") {
  const graphic = new mars3d.graphic.EllipsoidEntity({
    position,
    style: {
      radii: radius,
      maximumConeDegree: 180,
      materialType: mars3d.MaterialType.EllipsoidElectric,
      materialOptions: {
        color: color,
        speed: 5.0,
      },
      outline: false,
    },
  });
  layer.addGraphic(graphic);
}

/**
 * 将一个点按切面平移，坐标系为东-北-上
 * @param point 球面点
 * @param vetor 移动向量
 * @returns 球面点沿切面移动后的点
 */
function translate(point: Cartesian3, vetor: Cartesian3) {
  const m4 = Transforms.eastNorthUpToFixedFrame(point);
  return Matrix4.multiplyByPoint(m4, vetor, new Cartesian3());
}

/**
 * 生成球面点集
 * @param center 中心点
 * @param radius 半径
 * @param count 球面点数量
 * @param clip 是否裁剪，裁剪掉高度小于0的点
 */
function generatePoints(center: Cartesian3, radius: number, count: number, clip: boolean = false) {
  const points: Cartesian3[] = [];
  const ratio = (Math.sqrt(5) - 1) / 2; // 黄金比例，球面点分布方式

  for (let n = 1; n <= count; n++) {
    const zn = (2 * n - 1) / count - 1;
    const xn = Math.sqrt(1 - zn * zn) * Math.cos(2 * Math.PI * n * ratio);
    const yn = Math.sqrt(1 - zn * zn) * Math.sin(2 * Math.PI * n * ratio);
    const vn = new Cartesian3(xn * radius, yn * radius, zn * radius);
    const point = translate(center, vn);
    if (clip) {
      const cg = Cartographic.fromCartesian(point);
      if (cg.height < 0) continue;
    }
    points.push(point);
  }
  return points;
}

onMounted(() => {
  createMap();
  createPointBall();
  tryTranslate();
});

onUnmounted(() => {
  map = null;
});
</script>

<template>
  <div id="mars3dContainer"></div>
</template>

<style lang="scss" scoped>
#mars3dContainer {
  width: 100%;
  height: 100%;

  :deep(.cesium-viewer-toolbar) {
    top: unset;
    right: unset;
    bottom: 5px;
    left: 5px;
  }
}
</style>
