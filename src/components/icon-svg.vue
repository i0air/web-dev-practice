<script lang="ts" setup>
import { onMounted, shallowRef } from "vue";

const props = defineProps<{ name: string }>();
const dycIcon = shallowRef<any>(null);

async function loadSvg(name: string) {
  try {
    const { default: icon } = await import(`@/assets/svg/${name}.svg`);
    dycIcon.value = icon;
  } catch (ex) {
    console.warn(ex);
  }
}

onMounted(() => {
  loadSvg(props.name);
});
</script>

<template>
  <component :is="dycIcon" v-bind="$attrs" class="icon-svg" />
</template>

<style lang="scss" scoped>
@keyframes turn-a-round {
  0% {
    transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(360deg);
  }
}

.icon-svg {
  width: auto;
  height: 1em;

  &:hover {
    animation: turn-a-round 3s linear infinite;
  }
}
</style>
