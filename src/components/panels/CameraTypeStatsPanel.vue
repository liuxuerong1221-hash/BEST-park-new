<template>
  <BasePanel class="camera-stats" title="监控设备类型统计">
    <!-- 在线 / 离线 统计条 -->
    <div class="camera-stats__status">
      <div class="camera-stats__status-block camera-stats__status-block--online">
        <span class="camera-stats__status-label">在线</span>
        <span class="camera-stats__status-value">{{ onlineCount }}</span>
      </div>
      <div class="camera-stats__status-block camera-stats__status-block--offline">
        <span class="camera-stats__status-label">离线</span>
        <span class="camera-stats__status-value">{{ offlineCount }}</span>
      </div>
    </div>

    <!-- 设备类型电池 -->
    <div class="camera-stats__types">
      <div
        v-for="device in devices"
        :key="device.name"
        class="camera-stats__type"
      >
        <div class="camera-stats__battery">
          <div class="camera-stats__battery-top" />
          <div class="camera-stats__battery-body">
            <div
              class="camera-stats__battery-fill"
              :style="{ '--fill-h': device.percent + '%' }"
            >
              <div class="camera-stats__battery-fill-cap" />
              <div class="camera-stats__battery-particles" aria-hidden="true">
                <span v-for="n in 6" :key="n" />
              </div>
            </div>
            <div class="camera-stats__battery-lines" aria-hidden="true">
              <span v-for="n in 4" :key="n" />
            </div>
            <span class="camera-stats__battery-text">{{ device.percent }}%</span>
          </div>
          <div class="camera-stats__battery-base" />
          <div class="camera-stats__battery-shadow" aria-hidden="true" />
        </div>
        <div class="camera-stats__type-caption">
          <span class="camera-stats__type-name">{{ device.name }}</span>
          <span class="camera-stats__type-count">{{ device.count }}台</span>
        </div>
      </div>
    </div>
  </BasePanel>
</template>

<script setup lang="ts">
import BasePanel from '@/components/common/BasePanel.vue'

interface CameraType {
  name: string
  count: number
  percent: number
}

const onlineCount = 3567
const offlineCount = 3567

const devices: CameraType[] = [
  { name: '半球',     count: 60, percent: 45 },
  { name: '枪机',     count: 60, percent: 72 },
  { name: '球机',     count: 60, percent: 28 },
  { name: '云台枪机', count: 60, percent: 61 },
]
</script>

<style lang="scss" scoped>
.camera-stats {
  flex: 0 0 auto;
  gap: $spacing-sm;

  &__status {
    display: flex;
    gap: 10px;
    flex-shrink: 0;
  }

  &__status-block {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 12px;
    height: 40px;
    border-radius: $radius-md;
    padding: 0 $spacing-md 0 0;

    &--online {
      background: rgba(40, 220, 185, 0.1);

      .camera-stats__status-label {
        background: #28DCB9;
        color: $color-text-1;
        align-self: stretch;
        display: flex;
        align-items: center;
        padding: 0 16px;
        border-radius: $radius-md;
        font-size: $font-size-sm;
        font-weight: 800;
        white-space: nowrap;
      }

      .camera-stats__status-value {
        color: $color-text-1;
      }
    }

    &--offline {
      background: rgba(255, 20, 20, 0.1);

      .camera-stats__status-label {
        background: rgba(255, 20, 20, 0.5);
        color: $color-text-1;
        align-self: stretch;
        display: flex;
        align-items: center;
        padding: 0 16px;
        border-radius: $radius-md;
        font-size: $font-size-sm;
        font-weight: 800;
        white-space: nowrap;
      }

      .camera-stats__status-value {
        color: $color-text-1;
      }
    }
  }

  &__status-value {
    font-family: $font-number;
    font-size: $font-size-md;
    font-weight: 800;
  }

  &__types {
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: $spacing-md;
    margin-top: $spacing-md;
  }

  &__type {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 11px;
  }

  // 电池主体
  &__battery {
    position: relative;
    width: 49px;
    height: 95px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__battery-top {
    width: 14px;
    height: 6px;
    border-radius: 3px 3px 0 0;
    background: linear-gradient(180deg, #4DE8FF 0%, #0D9ED4 100%);
    border: 1px solid rgba(17, 212, 240, 0.7);
    border-bottom: none;
    position: relative;
    z-index: 2;
  }

  &__battery-body {
    position: relative;
    width: 49px;
    flex: 1;
    background: rgba(11, 146, 255, 0.3);
    border: 1px solid #11D4F0;
    border-radius: 4px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: battery-glow-pulse 3s ease-in-out infinite;
  }

  &__battery-fill {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 0;
    background: linear-gradient(180deg, rgba(22, 151, 96, 0.7) 0%, rgba(17, 213, 180, 0.7) 100%);
    animation: fill-rise 2s ease-out forwards;

    &-cap {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      height: 4px;
      background: rgba(0, 252, 204, 0.7);
      animation: cap-flicker 2s ease-in-out infinite;
    }
  }

  &__battery-particles {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    pointer-events: none;

    span {
      position: absolute;
      border-radius: 50%;
      background: rgba(0, 252, 204, 0.9);
      box-shadow: 0 0 5px rgba(0, 252, 204, 0.6);
      animation: particle-rise 2s ease-in infinite;

      &:nth-child(1) { width: 2px; height: 2px; left: 12%; animation-delay:  0.0s; animation-duration: 1.8s; }
      &:nth-child(2) { width: 3px; height: 3px; left: 36%; animation-delay:  0.7s; animation-duration: 2.2s; }
      &:nth-child(3) { width: 2px; height: 2px; left: 58%; animation-delay:  1.2s; animation-duration: 1.6s; }
      &:nth-child(4) { width: 3px; height: 3px; left: 75%; animation-delay:  0.4s; animation-duration: 2.0s; }
      &:nth-child(5) { width: 2px; height: 2px; left: 25%; animation-delay:  1.6s; animation-duration: 2.4s; }
      &:nth-child(6) { width: 2px; height: 2px; left: 62%; animation-delay:  0.9s; animation-duration: 1.9s; }
    }
  }

  &__battery-lines {
    position: absolute;
    left: 4px;
    right: 4px;
    top: 6px;
    bottom: 6px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    pointer-events: none;

    span {
      height: 1px;
      background: linear-gradient(180deg, rgba(238, 238, 238, 0) 13%, rgba(167, 226, 255, 0.2) 59%, rgba(216, 216, 216, 0) 83%);
    }
  }

  &__battery-text {
    position: relative;
    z-index: 1;
    font-family: $font-body;
    font-size: $font-size-md;
    font-weight: 600;
    color: $color-text-1;
    text-shadow: 0 0 4px rgba(0, 0, 0, 0.4);
  }

  &__battery-base {
    width: 49px;
    height: 6px;
    border-radius: 0 0 4px 4px;
    background: linear-gradient(180deg, #194374 0%, #3D81E5 100%);
    position: relative;
    z-index: 2;
  }

  &__battery-shadow {
    position: absolute;
    left: 50%;
    bottom: -8px;
    transform: translateX(-50%);
    width: 54px;
    height: 10px;
    border-radius: 50%;
    background: rgba(11, 30, 53, 0.59);
    box-shadow: inset 0 0 4px rgba(17, 212, 240, 0.3);
  }

  &__type-caption {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  &__type-name,
  &__type-count {
    font-size: $font-size-xs;
    color: $color-text-1;
    line-height: 1.3;
    white-space: nowrap;
  }

  // 各电池错开延迟，避免同步闪烁
  @for $i from 1 through 4 {
    &__type:nth-child(#{$i}) {
      .camera-stats__battery-body {
        animation-delay: #{($i - 1) * 0.8}s;
      }
      .camera-stats__battery-fill {
        animation-delay: #{($i - 1) * 0.8}s;
      }
      .camera-stats__battery-fill-cap {
        animation-delay: #{($i - 1) * 0.8}s;
      }
    }
  }
}

// ── Keyframes ──────────────────────────────────────────
// 电量从底部上升到目标值，播放一次后保持
@keyframes fill-rise {
  0%   { height: 0; }
  100% { height: var(--fill-h); }
}

@keyframes battery-glow-pulse {
  0%, 100% { box-shadow: none; }
  50%       { box-shadow: 0 0 8px rgba(17, 212, 240, 0.55), inset 0 0 8px rgba(17, 212, 240, 0.08); }
}

@keyframes cap-flicker {
  0%, 100% { opacity: 0.7; }
  50%       { opacity: 1; box-shadow: 0 0 6px rgba(0, 252, 204, 0.9); }
}

@keyframes particle-rise {
  0%   { transform: translateY(0);     opacity: 0;   }
  15%  { opacity: 0.9; }
  80%  { opacity: 0.5; }
  100% { transform: translateY(-72px); opacity: 0;   }
}

@media (prefers-reduced-motion: reduce) {
  .camera-stats__battery-body,
  .camera-stats__battery-fill-cap {
    animation: none;
  }
  .camera-stats__battery-fill {
    animation: none;
    height: var(--fill-h);
  }
  .camera-stats__battery-particles span {
    animation: none;
  }
}
</style>
