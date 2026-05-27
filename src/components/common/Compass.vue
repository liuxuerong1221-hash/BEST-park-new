<template>
  <div class="compass">
    <svg width="119" height="119" viewBox="0 0 119 119" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- 外圆 -->
      <circle cx="59.5" cy="59.5" r="52" stroke="#00AEFF" stroke-width="1" stroke-opacity="0.4"/>
      <circle cx="59.5" cy="59.5" r="46.8" stroke="#00AEFF" stroke-width="0.5" stroke-opacity="0.3"/>
      <!-- 刻度线 -->
      <g stroke="#00AEFF" stroke-opacity="0.5" stroke-width="1">
        <line v-for="i in 36" :key="i"
          :x1="59.5 + 44 * Math.cos((i * 10 - 90) * Math.PI / 180)"
          :y1="59.5 + 44 * Math.sin((i * 10 - 90) * Math.PI / 180)"
          :x2="59.5 + (i % 3 === 0 ? 50 : 47) * Math.cos((i * 10 - 90) * Math.PI / 180)"
          :y2="59.5 + (i % 3 === 0 ? 50 : 47) * Math.sin((i * 10 - 90) * Math.PI / 180)"
        />
      </g>
      <!-- 中心点 -->
      <circle cx="59.5" cy="59.5" r="4" fill="#00AEFF"/>
      <!-- 指针（可动） -->
      <g :transform="`rotate(${rotation}, 59.5, 59.5)`">
        <polygon points="59.5,15 64,55 59.5,50 55,55" fill="#D82F29"/>
        <polygon points="59.5,104 64,64 59.5,69 55,64" fill="rgba(0,174,255,0.3)"/>
      </g>
      <!-- NSEW 文字 -->
      <text x="59.5" y="10" text-anchor="middle" font-size="10" fill="#00AEFF" font-weight="bold">N</text>
      <text x="59.5" y="114" text-anchor="middle" font-size="10" fill="rgba(0,174,255,0.6)">S</text>
      <text x="7" y="63" text-anchor="middle" font-size="10" fill="rgba(0,174,255,0.6)">W</text>
      <text x="113" y="63" text-anchor="middle" font-size="10" fill="rgba(0,174,255,0.6)">E</text>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const rotation = ref(0)
</script>

<style lang="scss" scoped>
.compass {
  width: 119px;
  height: 119px;
  background: rgba(10, 29, 53, 0.8);
  border-radius: 50%;
  border: 1px solid $color-border;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
