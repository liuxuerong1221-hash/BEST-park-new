<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="icon-gate-offline"
  >
    <defs>
      <linearGradient id="gate-offline-grad" x1="30" y1="0" x2="30" y2="60" gradientUnits="userSpaceOnUse">
        <stop stop-color="#FFE48A" />
        <stop offset="1" stop-color="#F9B933" />
      </linearGradient>
    </defs>
    <circle cx="30" cy="30" r="28" fill="rgba(249, 185, 51, 0.12)" stroke="url(#gate-offline-grad)" stroke-width="2" />
    <path
      d="M28 22H20C19 22 18 23 18 24V38C18 39 19 40 20 40H32C33 40 34 39 34 38V36H30C28 36 26 34 26 32V28C26 26 28 24 30 24H34V24C34 23 33 22 32 22H29C28.5 22 28 21.8 27.5 21.5L25 19H21C20 19 19 20 19 21C19 22 20 23 21 23H27C27.5 23 28 23.2 28.5 23.5L31 25H32C34 25 36 27 36 29V31H30C29 31 28 32 28 33V37C28 38 29 39 30 39H36V38C36 40 34 42 32 42H20C18 42 16 40 16 38V24C16 22 18 20 20 20H28V22ZM32 33L38 35L32 37V36H30V34H32V33Z"
      fill="url(#gate-offline-grad)"
    />
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  size?: number
}>(), {
  size: 60,
})
</script>

<style lang="scss" scoped>
.icon-gate-offline {
  display: block;
  flex-shrink: 0;
}
</style>
