<template>
  <div
    class="access-marker"
    :class="[`access-marker--${kind}`, { 'access-marker--active': active }]"
    :style="positionStyle"
    role="button"
    tabindex="0"
    @click="emit('select')"
    @keydown.enter.prevent="emit('select')"
    @keydown.space.prevent="emit('select')"
  >
    <div class="access-marker__icon" aria-hidden="true">
      <IconAccessMarker :kind="kind" />
    </div>
    <span class="access-marker__label">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import IconAccessMarker from '@/components/icons/IconAccessMarker.vue'

type Kind = 'gate' | 'turnstile' | 'barrier'

const props = withDefaults(defineProps<{
  x?: number
  y?: number
  active?: boolean
  label: string
  kind?: Kind
}>(), {
  x: 50,
  y: 50,
  active: false,
  kind: 'gate',
})

const emit = defineEmits<{
  select: []
}>()

const positionStyle = computed(() => ({
  left: `${props.x}%`,
  top: `${props.y}%`,
}))
</script>

<style lang="scss" scoped>
.access-marker {
  position: absolute;
  transform: translate(-50%, -50%);
  display: inline-flex;
  align-items: center;
  height: 40px;
  padding: 0 12px 0 0;
  background: rgba(2, 37, 79, 0.7);
  border: 1px solid rgba(0, 174, 255, 0.55);
  border-radius: 20px;
  color: $color-primary-bright;
  cursor: pointer;
  outline: none;
  z-index: 3;
  backdrop-filter: blur(4px);
  box-shadow: 0 0 10px rgba(0, 174, 255, 0.35);
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;

  &:hover {
    transform: translate(-50%, -50%) translateY(-2px);
    box-shadow: 0 0 14px rgba(77, 242, 255, 0.55);
  }

  &--turnstile {
    border-color: rgba(46, 208, 176, 0.6);
    color: #2ED0B0;
    box-shadow: 0 0 10px rgba(46, 208, 176, 0.35);

    &:hover {
      box-shadow: 0 0 14px rgba(46, 208, 176, 0.55);
    }
  }

  &--barrier {
    border-color: rgba(249, 185, 51, 0.6);
    color: #F9B933;
    box-shadow: 0 0 10px rgba(249, 185, 51, 0.35);

    &:hover {
      box-shadow: 0 0 14px rgba(249, 185, 51, 0.55);
    }
  }

  &--active {
    border-color: currentColor;
    box-shadow: 0 0 16px currentColor;
  }

  &__icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    svg {
      width: 22px;
      height: 22px;
      filter: drop-shadow(0 0 4px currentColor);
    }
  }

  &__label {
    font-size: $font-size-xxs;
    color: $color-text-1;
    font-weight: 500;
    line-height: 1;
    padding: 0 4px;
    white-space: nowrap;
  }

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -6px;
    transform: translateX(-50%);
    width: 6px;
    height: 6px;
    background: currentColor;
    border-radius: 50%;
    box-shadow: 0 0 8px currentColor;
  }
}
</style>
