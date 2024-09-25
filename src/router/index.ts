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
      path: "/lab",
      name: "lab",
      component: () => import("../views/LabView.vue"),
    },
    {
      path: "/test",
      name: "test",
      component: () => import("../views/TestView.vue"),
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/pixi",
      name: "pixi",
      component: () => import("../views/PixiView.vue"),
    },
  ],
});

export default router;
