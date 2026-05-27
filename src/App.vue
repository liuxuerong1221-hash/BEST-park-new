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

/* 大屏浅色背景叠加四边遮罩：让顶部/底部/左右边缘的 UI 在浅色航拍图上可读
   仅作用于使用大屏背景的视图（命名约定：根容器__bg），机房动环、机柜独立背景不受影响 */
.scale-inner [class$="__bg"]:not(.security-mach__bg):not(.security-cabinet__bg)::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse 72% 68% at 50% 50%,
      rgba(18, 35, 58, 0) 0%,
      rgba(18, 35, 58, 0) 48%,
      rgba(18, 35, 58, 0.42) 82%,
      rgba(11, 22, 40, 0.66) 100%),
    linear-gradient(to right,
      rgba(18, 35, 58, 0.55) 0%,
      rgba(18, 35, 58, 0) 12%,
      rgba(18, 35, 58, 0) 88%,
      rgba(18, 35, 58, 0.55) 100%),
    linear-gradient(to bottom,
      rgba(18, 35, 58, 0.6) 0%,
      rgba(18, 35, 58, 0) 14%,
      rgba(18, 35, 58, 0) 84%,
      rgba(18, 35, 58, 0.6) 100%);
}
</style>
