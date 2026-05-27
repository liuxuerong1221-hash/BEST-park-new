<template>
  <button class="fp-roam" type="button" @click="emit('click')">
    <span class="fp-roam__icon" aria-hidden="true">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="4.5" r="2.5" stroke="#00AEFF" stroke-width="1.5" />
        <path
          d="M5.5 18 V13 a4.5 4.5 0 0 1 9 0 V18"
          stroke="#00AEFF"
          stroke-width="1.5"
          stroke-linecap="round"
          fill="none"
        />
        <path
          d="M14.5 11.5 L17 13 L14.5 14.5"
          stroke="#1DEAFF"
          stroke-width="1.2"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
        />
      </svg>
    </span>
    <span class="fp-roam__text">第一人称漫游</span>
  </button>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  click: []
}>()
</script>

<style lang="scss" scoped>
.fp-roam {
  width: 151px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 10px;
  background: rgba(5, 25, 49, 0.64);
  border: 1px solid $color-border;
  border-radius: $radius-md;
  backdrop-filter: blur(4px);
  color: $color-text-1;
  cursor: pointer;
  outline: none;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;

  &:hover {
    border-color: $color-primary;
    box-shadow: 0 0 12px rgba(0, 174, 255, 0.4);
    transform: translateY(-1px);
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px rgba(77, 242, 255, 0.45);
  }
}

.fp-roam__icon {
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.fp-roam__text {
  font-size: $font-size-xs;
  font-weight: 600;
  color: $color-text-1;
  white-space: nowrap;
  letter-spacing: 0.04em;
}

@media (prefers-reduced-motion: reduce) {
  .fp-roam {
    transition: none;
  }
}
</style>
