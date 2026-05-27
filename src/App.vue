<template>
  <div class="scale-root">
    <div class="scale-inner" :style="innerStyle">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const DESIGN_W = 1920
const DESIGN_H = 1080

const scale  = ref(1)
const transX = ref(0)
const transY = ref(0)

function updateScale() {
  const s = Math.min(window.innerWidth / DESIGN_W, window.innerHeight / DESIGN_H)
  scale.value  = s
  transX.value = (window.innerWidth  - DESIGN_W * s) / 2 / s
  transY.value = (window.innerHeight - DESIGN_H * s) / 2 / s
  document.documentElement.style.setProperty('--app-scale', String(s))
}

onMounted(() => {
  updateScale()
  window.addEventListener('resize', updateScale)
})
onUnmounted(() => window.removeEventListener('resize', updateScale))

const innerStyle = computed(() => ({
  width:           `${DESIGN_W}px`,
  height:          `${DESIGN_H}px`,
  transformOrigin: 'top left',
  transform:       `scale(${scale.value}) translate(${transX.value}px, ${transY.value}px)`,
}))
</script>

<style>
.scale-root {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #12233A;
}
.scale-inner {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
