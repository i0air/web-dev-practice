import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/svgjs",
      name: "svgjs",
      component: () => import("../views/SvgJsView.vue"),
    },
    {
      path: "/d3/timeline",
      name: "timeline",
      component: () => import("../views/D3TimelineView.vue"),
    },
    {
      path: "/d3/plot",
      name: "plot",
      component: () => import("../views/D3PlotView.vue"),
    },
    {
      path: "/pixi",
      name: "pixi",
      component: () => import("../views/PixiView.vue"),
    },
    {
      path: "/g6/tree",
      name: "tree",
      component: () => import("../views/G6TreeView.vue"),
    }
  ],
});

export default router;
