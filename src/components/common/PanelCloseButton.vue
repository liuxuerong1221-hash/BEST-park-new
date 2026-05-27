<template>
  <button
    class="panel-close-btn"
    :class="{ 'is-hover-reveal': hoverReveal }"
    :style="widthStyle"
    type="button"
    aria-label="关闭"
    @click="emit('close')"
  >
    <svg class="panel-close-btn__icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M9.57 8L15.73 1.86C16.15 1.44 16.15 0.75 15.73 0.31C15.32 -0.10 14.62 -0.10 14.19 0.31L8.02 6.48L1.86 0.31C1.44 -0.10 0.75 -0.10 0.31 0.31C-0.10 0.72 -0.10 1.42 0.31 1.86L6.48 8.02L0.31 14.19C-0.10 14.60 -0.10 15.30 0.31 15.73C0.72 16.15 1.42 16.15 1.86 15.73L8.02 9.57L14.19 15.73C14.60 16.15 15.30 16.15 15.73 15.73C16.15 15.32 16.15 14.62 15.73 14.19L9.57 8Z"
        fill="currentColor"
      />
    </svg>
    <span class="panel-close-btn__text">{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  width?: number | string
  label?: string
  hoverReveal?: boolean
}>(), {
  width: 100,
  label: '关闭',
  hoverReveal: false,
})

const emit = defineEmits<{ close: [] }>()

const widthStyle = computed(() => {
  if (props.hoverReveal) return undefined
  const w = typeof props.width === 'number' ? `${props.width}px` : props.width
  return { width: w }
})
</script>

<style lang="scss" scoped>
.panel-close-btn {
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 16px;
  border: 1px solid rgba(0, 174, 255, 0.5);
  border-radius: $radius-sm;
  background: linear-gradient(0deg, rgba(1, 158, 244, 0.5) -19%, rgba(14, 33, 56, 0) 100%);
  color: $color-text-1;
  font-size: $font-size-sm;
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
  transition: background 0.18s ease, filter 0.18s ease;

  &:hover {
    background: linear-gradient(0deg, rgba(1, 158, 244, 0.7) -19%, rgba(14, 33, 56, 0.2) 100%);
    filter: drop-shadow(0 0 8px rgba(29, 234, 255, 0.34));
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px rgba(77, 242, 255, 0.45);
  }

  &__icon {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }

  &__text {
    white-space: nowrap;
  }

  &.is-hover-reveal {
    min-width: 100px;
    margin: 0 auto;
    flex-shrink: 0;
    opacity: 0;
    max-height: 0;
    padding-top: 0;
    padding-bottom: 0;
    overflow: hidden;
    transition: opacity 0.2s ease, max-height 0.2s ease, margin 0.2s ease;
  }
}

@media (prefers-reduced-motion: reduce) {
  .panel-close-btn {
    transition: none;
  }
}
</style>
