<template>
  <BasePanel class="key-monitoring" title="重点监控">
    <div class="key-monitoring__grid">
      <article
        v-for="item in items"
        :key="item.id"
        class="key-monitoring__card"
      >
        <header class="key-monitoring__card-head">
          <span class="key-monitoring__card-name">{{ item.name }}</span>
          <span class="key-monitoring__card-status">
            <span class="key-monitoring__card-dot" />
            <span class="key-monitoring__card-status-text">在线</span>
          </span>
        </header>
        <div class="key-monitoring__card-video">
          <div class="key-monitoring__video-grid" aria-hidden="true" />
          <div class="key-monitoring__video-scan" aria-hidden="true" />
          <svg
            class="key-monitoring__card-play"
            viewBox="0 0 28 28"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="14" cy="14" r="13" fill="rgba(2,37,79,0.6)" stroke="#4DF2FF" stroke-opacity="0.7"/>
            <path d="M11 9L19 14L11 19V9Z" fill="#4DF2FF"/>
          </svg>
          <span class="key-monitoring__card-tag">LIVE</span>
        </div>
      </article>
    </div>
  </BasePanel>
</template>

<script setup lang="ts">
import BasePanel from '@/components/common/BasePanel.vue'

interface MonitorItem {
  id: number
  name: string
}

const items: MonitorItem[] = [
  { id: 1, name: '南大门'   },
  { id: 2, name: '北大门'   },
  { id: 3, name: '东侧入口' },
  { id: 4, name: '西侧入口' },
  { id: 5, name: '消控室'   },
  { id: 6, name: '机房'     },
]
</script>

<style lang="scss" scoped>
.key-monitoring {
  flex: 1;
  min-height: 0;
  gap: $spacing-sm;

  &__grid {
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  &__card {
    display: flex;
    flex-direction: column;
    border: 1px solid #0B2C52;
    background: rgba(10, 44, 83, 0.3);
    overflow: hidden;
    min-height: 0;
  }

  &__card-head {
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    flex-shrink: 0;
    background: linear-gradient(89deg, rgba(9, 40, 77, 0.6) 2%, rgba(5, 25, 49, 0) 98%);
  }

  &__card-name {
    font-size: $font-size-xs;
    color: $color-text-1;
    font-weight: 500;
  }

  &__card-status {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  &__card-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #0CF92C;
    box-shadow: 0 0 6px rgba(12, 249, 44, 0.6);
  }

  &__card-status-text {
    font-size: $font-size-xxs;
    color: #0CF92C;
  }

  &__card-video {
    flex: 1;
    min-height: 0;
    position: relative;
    background:
      radial-gradient(circle at 50% 60%, rgba(0, 60, 120, 0.55) 0%, rgba(2, 12, 28, 0.85) 70%),
      #02101e;
    overflow: hidden;
  }

  &__video-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(77, 242, 255, 0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(77, 242, 255, 0.06) 1px, transparent 1px);
    background-size: 22px 22px;
  }

  &__video-scan {
    position: absolute;
    left: 0;
    right: 0;
    top: -2px;
    height: 40px;
    background: linear-gradient(180deg, rgba(77, 242, 255, 0) 0%, rgba(77, 242, 255, 0.14) 50%, rgba(77, 242, 255, 0) 100%);
    animation: key-monitoring-scan 4s linear infinite;
    pointer-events: none;
  }

  &__card-play {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 28px;
    height: 28px;
    filter: drop-shadow(0 0 6px rgba(77, 242, 255, 0.5));
  }

  &__card-tag {
    position: absolute;
    right: 6px;
    top: 6px;
    padding: 1px 6px;
    font-size: 10px;
    font-family: $font-number;
    color: #FF4848;
    background: rgba(255, 72, 72, 0.18);
    border: 1px solid rgba(255, 72, 72, 0.5);
    border-radius: 2px;
    letter-spacing: 0.5px;
  }
}

@keyframes key-monitoring-scan {
  0%   { transform: translateY(0); }
  100% { transform: translateY(120px); }
}

@media (prefers-reduced-motion: reduce) {
  .key-monitoring__video-scan { animation: none; }
}
</style>
