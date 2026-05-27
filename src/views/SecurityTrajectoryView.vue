<template>
  <div class="security-traj">
    <div class="security-traj__bg" />
    <TrajectoryMap
      class="security-traj__map-overlay"
      :waypoints="waypoints"
      :play-state="playState"
      @play-end="handlePlayEnd"
      @pin-click="handlePinClick"
    />
    <img class="security-traj__frame security-traj__frame--left"  src="@/assets/images/left-左.png" alt="" />
    <img class="security-traj__frame security-traj__frame--right" src="@/assets/images/left-右.png" alt="" />

    <AppHeader class="security-traj__header" />

    <main class="security-traj__body">
      <aside class="security-traj__left">
        <TrajectoryQueryPanel v-model:selected-id="selectedId" />
      </aside>

      <!-- 返回 -->
      <button class="security-traj__back" type="button" @click="goBack">
        <span class="security-traj__back-icon" aria-hidden="true">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="traj-back-stroke" x1="20" y1="0" x2="20" y2="40" gradientUnits="userSpaceOnUse">
                <stop stop-color="#0C84FF" />
                <stop offset="1" stop-color="#1DEAFF" />
              </linearGradient>
            </defs>
            <circle cx="20" cy="20" r="19.5" fill="rgba(2,37,79,0.6)" stroke="url(#traj-back-stroke)" />
            <path d="M22.5 13L15.5 20L22.5 27" stroke="#4DF2FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
        <span class="security-traj__back-text">返回</span>
      </button>

      <!-- 轨迹播放控制 -->
      <div class="security-traj__controls">
        <button
          class="security-traj__ctrl-btn"
          :class="{ 'security-traj__ctrl-btn--active': playState === 'playing' }"
          type="button"
          :disabled="!canPlay"
          @click="onPlay"
        >
          <span class="security-traj__ctrl-icon">
            <svg viewBox="0 0 40 40" fill="none">
              <defs>
                <linearGradient id="ctrl-stroke-play" x1="20" y1="0" x2="20" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#0C84FF" /><stop offset="1" stop-color="#1DEAFF" />
                </linearGradient>
              </defs>
              <circle cx="20" cy="20" r="19.5" fill="rgba(2,37,79,0.6)" stroke="url(#ctrl-stroke-play)" />
              <path d="M16 13L28 20L16 27V13Z" fill="#4DF2FF" />
            </svg>
          </span>
          <span class="security-traj__ctrl-text">轨迹播放</span>
        </button>

        <button
          class="security-traj__ctrl-btn"
          :class="{ 'security-traj__ctrl-btn--active': playState === 'paused' }"
          type="button"
          :disabled="!canPlay"
          @click="onPause"
        >
          <span class="security-traj__ctrl-icon">
            <svg viewBox="0 0 40 40" fill="none">
              <defs>
                <linearGradient id="ctrl-stroke-pause" x1="20" y1="0" x2="20" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#0C84FF" /><stop offset="1" stop-color="#1DEAFF" />
                </linearGradient>
              </defs>
              <circle cx="20" cy="20" r="19.5" fill="rgba(2,37,79,0.6)" stroke="url(#ctrl-stroke-pause)" />
              <rect x="13" y="13" width="5" height="14" rx="1" fill="#4DF2FF" />
              <rect x="22" y="13" width="5" height="14" rx="1" fill="#4DF2FF" />
            </svg>
          </span>
          <span class="security-traj__ctrl-text">暂停</span>
        </button>

        <button
          class="security-traj__ctrl-btn"
          :class="{ 'security-traj__ctrl-btn--active': playState === 'idle' }"
          type="button"
          :disabled="!canPlay"
          @click="onStop"
        >
          <span class="security-traj__ctrl-icon">
            <svg viewBox="0 0 40 40" fill="none">
              <defs>
                <linearGradient id="ctrl-stroke-stop" x1="20" y1="0" x2="20" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#0C84FF" /><stop offset="1" stop-color="#1DEAFF" />
                </linearGradient>
              </defs>
              <circle cx="20" cy="20" r="19.5" fill="rgba(2,37,79,0.6)" stroke="url(#ctrl-stroke-stop)" />
              <rect x="13" y="13" width="14" height="14" rx="1.5" fill="#4DF2FF" />
            </svg>
          </span>
          <span class="security-traj__ctrl-text">结束</span>
        </button>
      </div>

      <section class="security-traj__center">
        <!-- 楼栋聚合点位：复用指南针 + 楼层选择器 -->
        <div class="security-traj__map-controls">
          <Compass />
          <FloorSelector
            :selected-floor="selectedFloor"
            @floor-change="onFloorChange"
          />
          <FirstPersonRoamButton />
        </div>
      </section>

      <!-- 监控视频弹窗：右上角 -->
      <Transition name="security-traj__monitor-fade">
        <div v-if="activeWaypoint" class="security-traj__monitor" role="dialog" aria-label="实时监控">
          <header class="security-traj__monitor-head">
            <span class="security-traj__monitor-title">实时监控</span>
            <button class="security-traj__monitor-close" type="button" aria-label="关闭" @click="closeMonitor">
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
              </svg>
            </button>
          </header>
          <div class="security-traj__monitor-video">
            <div class="security-traj__monitor-scan" />
            <span class="security-traj__monitor-rec">
              <span class="security-traj__monitor-rec-dot" />REC
            </span>
            <span class="security-traj__monitor-stamp">{{ activeWaypoint.location }} · {{ activeWaypoint.firstTime }}</span>
          </div>
          <div class="security-traj__monitor-meta">
            <p class="security-traj__monitor-row">
              <span class="security-traj__monitor-key">位置</span>
              <span class="security-traj__monitor-val">{{ activeWaypoint.location }}</span>
            </p>
            <p class="security-traj__monitor-row">
              <span class="security-traj__monitor-key">时间</span>
              <span class="security-traj__monitor-val">{{ activeWaypoint.firstTime }}</span>
            </p>
            <p class="security-traj__monitor-row">
              <span class="security-traj__monitor-key">设备</span>
              <span class="security-traj__monitor-val">{{ activeWaypoint.device }}</span>
            </p>
          </div>
        </div>
      </Transition>
    </main>

  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/common/AppHeader.vue'
import Compass from '@/components/common/Compass.vue'
import FloorSelector from '@/components/common/FloorSelector.vue'
import FirstPersonRoamButton from '@/components/common/FirstPersonRoamButton.vue'
import TrajectoryQueryPanel from '@/components/panels/TrajectoryQueryPanel.vue'
import TrajectoryMap, { type Waypoint } from '@/components/panels/TrajectoryMap.vue'
import {
  getActivitiesForPerson,
  LOCATION_COORDS,
} from '@/data/trajectoryMockData'

const router = useRouter()
function goBack() {
  router.push({ name: 'security' })
}

type PlayState = 'idle' | 'playing' | 'paused'
const playState = ref<PlayState>('idle')
const selectedId = ref<number>(1)

const selectedFloor = ref('1F')
function onFloorChange(floor: string) {
  selectedFloor.value = floor
}

const activities = computed(() => getActivitiesForPerson(selectedId.value))

const waypoints = computed<Waypoint[]>(() => {
  const groups = new Map<string, ReturnType<typeof getActivitiesForPerson>>()
  for (const a of activities.value) {
    const list = groups.get(a.location) ?? []
    list.push(a)
    groups.set(a.location, list)
  }
  return [...groups.entries()].map(([location, rows]) => {
    const coord = LOCATION_COORDS[location] ?? { x: 0.5, y: 0.5 }
    const seqs = rows.map(r => r.seq)
    const min = Math.min(...seqs)
    const max = Math.max(...seqs)
    return {
      location,
      x: coord.x,
      y: coord.y,
      seqRange: min === max ? String(min) : `${min}-${max}`,
      firstTime: rows[0].time.slice(11, 16),
      device: rows[0].device,
    }
  })
})

const canPlay = computed(() => waypoints.value.length >= 1)

function onPlay()  { if (canPlay.value) playState.value = 'playing' }
function onPause() { if (playState.value === 'playing') playState.value = 'paused' }
function onStop()  { playState.value = 'idle' }

function handlePlayEnd() {
  playState.value = 'idle'
}

const activeWaypoint = ref<Waypoint | null>(null)
function handlePinClick(w: Waypoint) {
  activeWaypoint.value = w
}
function closeMonitor() {
  activeWaypoint.value = null
}
</script>

<style lang="scss" scoped>
.security-traj {
  width: $screen-width;
  height: $screen-height;
  position: relative;
  overflow: hidden;
  background-color: $color-bg;
  font-family: $font-body;

  &__bg {
    position: absolute;
    inset: 0;
    background-image: url('@/assets/images/大屏背景@2x.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    z-index: 0;
  }

  &__frame {
    position: absolute;
    top: 8px;
    bottom: 8px;
    height: calc(100% - 16px);
    width: auto;
    pointer-events: none;
    z-index: 30;

    &--left  { left: 0; }
    &--right { right: 0; }
  }

  &__header {
    position: relative;
    z-index: 10;
    height: $header-h;
  }

  &__body {
    position: relative;
    z-index: 10;
    display: grid;
    grid-template-columns: $panel-left-w 1fr;
    height: calc($screen-height - $header-h);
    padding: 0 40px;
    gap: 8px;
  }

  &__left {
    position: relative;
    z-index: 20;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 24px 0 16px;
  }

  &__center {
    display: flex;
    flex-direction: column;
    position: relative;
  }

  &__map-overlay {
    position: absolute;
    inset: 0;
    z-index: 15;
    pointer-events: none;
  }

  &__monitor {
    position: absolute;
    top: calc($header-h + 24px);
    right: 56px;
    z-index: 18;
    width: 360px;
    padding: 12px;
    border: 1px solid rgba(77, 242, 255, 0.45);
    border-radius: 10px;
    background: rgba(5, 18, 36, 0.92);
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.45), 0 0 18px rgba(0, 174, 255, 0.25);
    backdrop-filter: blur(4px);
  }

  &__monitor-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  &__monitor-title {
    color: $color-text-1;
    font-size: $font-size-sm;
    font-weight: 600;
    letter-spacing: 1px;
  }

  &__monitor-close {
    width: 22px;
    height: 22px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 174, 255, 0.12);
    border: 1px solid rgba(0, 174, 255, 0.4);
    border-radius: 4px;
    color: $color-text-1;
    cursor: pointer;
    transition: background 0.18s ease;

    &:hover {
      background: rgba(0, 174, 255, 0.28);
    }
  }

  &__monitor-video {
    position: relative;
    width: 100%;
    height: 200px;
    border-radius: 6px;
    overflow: hidden;
    background:
      linear-gradient(180deg, rgba(11, 32, 60, 0.4) 0%, rgba(0, 8, 18, 0.9) 100%),
      radial-gradient(circle at 30% 40%, rgba(0, 174, 255, 0.18), transparent 55%),
      radial-gradient(circle at 70% 70%, rgba(77, 242, 255, 0.12), transparent 55%),
      #02060d;
  }

  &__monitor-scan {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba(77, 242, 255, 0.18) 49%,
      rgba(77, 242, 255, 0.32) 50%,
      rgba(77, 242, 255, 0.18) 51%,
      transparent 100%
    );
    background-size: 100% 200%;
    background-repeat: no-repeat;
    animation: security-traj-scan 4.2s linear infinite;
    pointer-events: none;
  }

  &__monitor-rec {
    position: absolute;
    top: 8px;
    left: 10px;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 2px 8px;
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.55);
    color: #FF5050;
    font-size: $font-size-xxs;
    font-weight: 600;
    letter-spacing: 1px;
  }

  &__monitor-rec-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #FF5050;
    box-shadow: 0 0 6px #FF5050;
    animation: security-traj-rec-blink 1.2s ease-in-out infinite;
  }

  &__monitor-stamp {
    position: absolute;
    bottom: 8px;
    right: 10px;
    color: rgba(255, 255, 255, 0.78);
    font-size: $font-size-xxs;
    text-shadow: 0 0 4px rgba(0, 0, 0, 0.8);
  }

  &__monitor-meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 10px;
  }

  &__monitor-row {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: $font-size-xxs;
  }

  &__monitor-key {
    color: $color-text-2;
    width: 36px;
    flex-shrink: 0;
  }

  &__monitor-val {
    color: $color-text-1;
  }

  &__map-controls {
    position: absolute;
    right: 8px;
    bottom: 8px;
    z-index: 5;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  &__back {
    position: absolute;
    left: calc(40px + #{$panel-left-w} + 24px);
    top: 24px;
    z-index: 12;
    width: 105px;
    height: 40px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0 16px 0 0;
    border: 0;
    border-radius: 20px;
    background: rgba(10, 15, 21, 0.5);
    color: $color-text-1;
    cursor: pointer;
    outline: none;
    transition: transform 0.18s ease, filter 0.18s ease;

    &:hover {
      transform: translateY(-1px);
      filter: drop-shadow(0 0 10px rgba(29, 234, 255, 0.34));
    }

    &:focus-visible {
      box-shadow: 0 0 0 2px rgba(77, 242, 255, 0.45);
    }
  }

  &__back-icon {
    width: 40px;
    height: 40px;
    flex-shrink: 0;

    svg { width: 40px; height: 40px; display: block; }
  }

  &__back-text {
    font-size: $font-size-xs;
    font-weight: 600;
    color: $color-text-1;
    white-space: nowrap;
  }

  // 轨迹控制按钮组
  &__controls {
    position: absolute;
    left: calc(40px + #{$panel-left-w} + 24px);
    bottom: 80px;
    z-index: 12;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__ctrl-btn {
    width: 120px;
    height: 40px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 0 14px 0 0;
    border: 0;
    border-radius: 20px;
    background: rgba(10, 15, 21, 0.5);
    cursor: pointer;
    outline: none;
    transition: transform 0.18s ease, filter 0.18s ease;

    &:hover {
      transform: translateY(-1px);
      filter: drop-shadow(0 0 10px rgba(29, 234, 255, 0.34));
    }

    &:focus-visible {
      box-shadow: 0 0 0 2px rgba(77, 242, 255, 0.45);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    &:disabled:hover {
      transform: none;
      filter: none;
    }

    &--active {
      filter: drop-shadow(0 0 8px rgba(77, 242, 255, 0.5));

      .security-traj__ctrl-text {
        color: $color-primary-bright;
      }
    }
  }

  &__ctrl-icon {
    width: 40px;
    height: 40px;
    flex-shrink: 0;

    svg { width: 40px; height: 40px; display: block; }
  }

  &__ctrl-text {
    font-size: $font-size-xs;
    font-weight: 600;
    color: $color-text-1;
    white-space: nowrap;
  }


}

@media (prefers-reduced-motion: reduce) {
  .security-traj__back { transition: none; }
  .security-traj__monitor-scan,
  .security-traj__monitor-rec-dot { animation: none; }
}

.security-traj__monitor-fade-enter-active,
.security-traj__monitor-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.security-traj__monitor-fade-enter-from,
.security-traj__monitor-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@keyframes security-traj-scan {
  0%   { background-position: 0 -100%; }
  100% { background-position: 0 100%; }
}

@keyframes security-traj-rec-blink {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.25; }
}
</style>
