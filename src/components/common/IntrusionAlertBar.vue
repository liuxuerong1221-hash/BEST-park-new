<template>
  <Transition name="alert-bar">
    <div v-if="visible" class="intrusion-alert" role="alert" @click="goDetail">
      <!-- 警示图标（同心圆 + 三角） -->
      <div class="intrusion-alert__icon" aria-hidden="true">
<span class="intrusion-alert__ring intrusion-alert__ring--outer" />
        <span class="intrusion-alert__ring intrusion-alert__ring--mid" />
        <span class="intrusion-alert__ring intrusion-alert__ring--inner" />
        <svg class="intrusion-alert__glyph" viewBox="0 0 20 18" fill="none">
          <path d="M10 0L20 17H0L10 0Z" fill="#FFFFFF" />
          <rect x="9" y="6" width="2" height="6" rx="1" fill="#D82F29" />
          <rect x="9" y="13" width="2" height="2" rx="1" fill="#D82F29" />
        </svg>
      </div>

      <div class="intrusion-alert__body">
        <span class="intrusion-alert__type">【<b>{{ type }}</b>】</span>
        <span class="intrusion-alert__time">{{ time }}</span>
        <span class="intrusion-alert__divider" />
        <span class="intrusion-alert__location">{{ location }}</span>
      </div>

      <button
        class="intrusion-alert__close"
        type="button"
        aria-label="关闭告警"
        @click.stop="visible = false"
      >
        <svg viewBox="0 0 14 14" fill="none">
          <path d="M1 1L13 13M13 1L1 13" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const props = withDefaults(defineProps<{
  type?: string
  time?: string
  location?: string
  alertId?: number
}>(), {
  type: '非法入侵',
  time: '2023-06-10  12:34:34',
  location: '北二门-1号门禁',
  alertId: 1,
})

const visible = ref(true)
const router = useRouter()

function goDetail() {
  router.push({ name: 'security-alert', params: { id: props.alertId } })
}
</script>

<style lang="scss" scoped>
.intrusion-alert {
  width: 662px;
  height: 53px;
  padding: 3px 9px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-radius: 8px;
  border: 1px solid #A22128;
  cursor: pointer;
  background: linear-gradient(90deg, rgba(122, 17, 24, 0.92) -1%, rgba(75, 12, 18, 0.88) 44%, rgba(139, 23, 29, 0.94) 101%);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.45);

  &__icon {
    position: relative;
    width: 47px;
    height: 47px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: intrusion-heartbeat 1.4s ease-in-out infinite;
  }

  &__ring {
    position: absolute;
    border-radius: 50%;
    border: 1px solid;

    &--outer {
      inset: 2px;
      border-color: rgba(255, 56, 56, 0.25);
      background: radial-gradient(circle, rgba(255, 72, 72, 0.12) 0%, rgba(110, 12, 19, 0) 100%);
    }

    &--mid {
      inset: 6px;
      border-color: rgba(255, 119, 119, 0.55);
      background: radial-gradient(circle, rgba(255, 72, 72, 0.3) 0%, rgba(110, 12, 19, 0) 100%);
    }

    &--inner {
      inset: 11px;
      border-color: rgba(255, 255, 255, 0.4);
    }
  }

  &__glyph {
    position: relative;
    z-index: 1;
    width: 20px;
    height: 18px;
    filter: drop-shadow(0 0 4px rgba(216, 47, 41, 0.6));
  }

  &__body {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 14px;
    color: $color-text-1;
    font-size: $font-size-sm;
    min-width: 0;
  }

  &__type {
    b {
      font-weight: 800;
      letter-spacing: 0.5px;
    }
  }

  &__time {
    opacity: 0.96;
    font-family: $font-number;
  }

  &__divider {
    width: 1px;
    height: 20px;
    background: rgba(255, 116, 116, 0.65);
    flex-shrink: 0;
  }

  &__location {
    font-weight: 600;
  }

  &__close {
    width: 31px;
    height: 31px;
    border: 0;
    background: #FF4D4F;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    padding: 0;
    transition: background 0.18s;

    svg {
      width: 12px;
      height: 12px;
    }

    &:hover {
      background: #FF7474;
    }
  }
}

@keyframes intrusion-heartbeat {
  0%        { transform: scale(1); }
  14%       { transform: scale(1.22); }
  28%       { transform: scale(1); }
  42%       { transform: scale(1.16); }
  56%       { transform: scale(1); }
  100%      { transform: scale(1); }
}

.alert-bar-enter-active,
.alert-bar-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.alert-bar-enter-from,
.alert-bar-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (prefers-reduced-motion: reduce) {
  .intrusion-alert__icon { animation: none; }
}
</style>
