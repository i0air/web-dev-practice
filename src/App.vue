<script setup lang="ts">
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { RouterLink, RouterView } from "vue-router";
import { routes } from "@/router";
import IconSvg from "@/components/icon-svg.vue";
</script>

<template>
  <el-config-provider :locale="zhCn">
    <header>
      <nav>
        <RouterLink v-for="(route, idx) in routes" :key="idx" :to="route.path">
          <IconSvg v-if="route.meta?.icon" :name="route.meta.icon + ''" />
          {{ route.name }}
        </RouterLink>
      </nav>
    </header>
    <RouterView />
  </el-config-provider>
</template>

<style scoped>
header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 999;
  line-height: 1.5;
}

nav {
  display: inline-flex;
  align-items: center;
  width: 100%;
  font-size: 12px;
  text-align: center;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  border-left: 1px solid var(--color-border);
  padding: 0 1rem;
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
  }

  nav {
    padding: 0.5rem 0;
    font-size: 1rem;
  }
}
</style>
