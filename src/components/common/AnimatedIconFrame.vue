<template>
  <span class="animated-icon-frame" :class="classes" :style="styleVars">
    <img class="animated-icon-frame__icon" :src="src" :alt="alt" />
    <span v-if="effect === 'orbit'" class="animated-icon-frame__orbit-layer">
      <svg class="animated-icon-frame__orbit-track" viewBox="0 0 52 52" aria-hidden="true">
        <ellipse cx="26" cy="17.5" rx="20" ry="10" />
      </svg>
      <span class="animated-icon-frame__orbit-dot animated-icon-frame__orbit-dot--lead" />
      <span class="animated-icon-frame__orbit-dot animated-icon-frame__orbit-dot--trail" />
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Effect = 'orbit' | 'scan' | 'none'
type Tone = 'cyan' | 'yellow'

const props = withDefaults(defineProps<{
  src: string
  alt?: string
  size?: number
  effect?: Effect
  tone?: Tone
}>(), {
  alt: '',
  size: 52,
  effect: 'none',
  tone: 'cyan',
})

const classes = computed(() => [
  `animated-icon-frame--${props.effect}`,
  `animated-icon-frame--${props.tone}`,
])

const styleVars = computed(() => ({
  '--icon-size': `${props.size}px`,
}))
</script>

<style lang="scss" scoped>
.animated-icon-frame {
  width: var(--icon-size);
  height: var(--icon-size);
  flex-shrink: 0;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  --orbit-color: #4DF2FF;
  --orbit-glow: rgba(77, 242, 255, 0.86);

  &--yellow {
    --orbit-color: #FFE92B;
    --orbit-glow: rgba(255, 233, 43, 0.78);
  }

  &--scan {
    border-radius: 50%;
  }

  &--scan::after {
    content: '';
    position: absolute;
    left: 8px;
    right: 8px;
    top: 0;
    height: 1px;
    border-radius: 999px;
    background: linear-gradient(90deg, rgba(77, 242, 255, 0) 0%, rgba(215, 253, 255, 0.98) 50%, rgba(77, 242, 255, 0) 100%);
    box-shadow: 0 0 8px rgba(77, 242, 255, 0.9), 0 0 16px rgba(0, 174, 255, 0.5);
    opacity: 0;
    transform: translateY(6px);
    animation: icon-frame-scan 2.4s linear infinite;
    mix-blend-mode: screen;
    pointer-events: none;
    z-index: 2;
  }

  &__icon {
    width: var(--icon-size);
    height: var(--icon-size);
    object-fit: contain;
    position: relative;
    z-index: 1;
  }

  &__orbit-layer {
    position: absolute;
    inset: 0;
    width: 52px;
    height: 52px;
    pointer-events: none;
    transform: rotate(12deg);
    transform-origin: 26px 17.5px;
    z-index: 2;
  }

  &__orbit-track {
    position: absolute;
    inset: 0;
    width: 52px;
    height: 52px;
    pointer-events: none;

    ellipse {
      fill: none;
      stroke: var(--orbit-color);
      stroke-width: 0.8;
      stroke-linecap: round;
      opacity: 0.28;
      filter: drop-shadow(0 0 4px var(--orbit-glow));
    }
  }

  &__orbit-dot {
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 50%;
    background: var(--orbit-color);
    pointer-events: none;
    z-index: 2;
    offset-path: ellipse(20px 10px at 26px 17.5px);
    offset-rotate: 0deg;

    &--lead {
      width: 4px;
      height: 4px;
      box-shadow: 0 0 6px var(--orbit-glow), 0 0 12px var(--orbit-color);
      animation: icon-frame-orbit-chase 1.65s linear infinite;
    }

    &--trail {
      width: 2.5px;
      height: 2.5px;
      opacity: 0.62;
      box-shadow: 0 0 4px var(--orbit-glow), 0 0 8px var(--orbit-color);
      animation: icon-frame-orbit-chase 1.65s linear infinite;
      animation-delay: -0.22s;
    }
  }
}

@keyframes icon-frame-orbit-chase {
  0% { offset-distance: 0%; opacity: 0.35; }
  10% { opacity: 1; }
  52% { opacity: 0.95; }
  100% { offset-distance: 100%; opacity: 0.35; }
}

@keyframes icon-frame-scan {
  0% {
    opacity: 0;
    transform: translateY(6px);
  }
  12% {
    opacity: 0.9;
  }
  82% {
    opacity: 0.9;
  }
  100% {
    opacity: 0;
    transform: translateY(calc(var(--icon-size) - 7px));
  }
}

@media (prefers-reduced-motion: reduce) {
  .animated-icon-frame {
    &--scan::after,
    &__orbit-dot {
      animation: none;
      opacity: 0;
    }
  }
}
</style>
