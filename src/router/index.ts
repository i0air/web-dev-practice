import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
    meta: { icon: "logos-vue" },
  },
  {
    path: "/svgjs",
    name: "SvgJs",
    component: () => import("../views/SvgJsView.vue"),
    meta: { icon: "logos-svg" },
  },
  {
    path: "/d3/timeline",
    name: "D3Timeline",
    component: () => import("../views/D3TimelineView.vue"),
    meta: { icon: "logos-d3" },
  },
  {
    path: "/d3/plot",
    name: "D3Plot",
    component: () => import("../views/D3PlotView.vue"),
    meta: { icon: "logos-d3" },
  },
  {
    path: "/pixi",
    name: "Pixi",
    component: () => import("../views/PixiView.vue"),
    meta: { icon: "logos-pixijs" },
  },
  {
    path: "/g6/tree",
    name: "G6Tree",
    component: () => import("../views/G6TreeView.vue"),
    meta: { icon: "flat-color-icons-engineering" },
  },
  {
    path: "/gis/mars3d",
    name: "Mars3D",
    component: () => import("../views/Mars3dView.vue"),
    meta: { icon: "earth" },
  },
];

export const router = createRouter({ history: createWebHistory(import.meta.env.BASE_URL), routes });
