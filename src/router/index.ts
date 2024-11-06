import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  {
    path: "/svgjs",
    name: "SvgJs",
    component: () => import("../views/SvgJsView.vue"),
  },
  {
    path: "/d3/timeline",
    name: "D3Timeline",
    component: () => import("../views/D3TimelineView.vue"),
  },
  {
    path: "/d3/plot",
    name: "D3Plot",
    component: () => import("../views/D3PlotView.vue"),
  },
  {
    path: "/pixi",
    name: "Pixi",
    component: () => import("../views/PixiView.vue"),
  },
  {
    path: "/g6/tree",
    name: "G6Tree",
    component: () => import("../views/G6TreeView.vue"),
  },
  {
    path: "/gis/mars3d",
    name: "Mars3D",
    component: () => import("../views/Mars3dView.vue"),
  },
];

export const router = createRouter({ history: createWebHistory(import.meta.env.BASE_URL), routes });
