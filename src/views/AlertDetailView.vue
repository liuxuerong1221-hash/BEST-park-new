<template>
  <div class="alert-detail">
    <div class="alert-detail__bg" />
    <img class="alert-detail__frame alert-detail__frame--left"  src="@/assets/images/left-左.png" alt="" />
    <img class="alert-detail__frame alert-detail__frame--right" src="@/assets/images/left-右.png" alt="" />
    <AppHeader class="alert-detail__header" />

    <main class="alert-detail__body">
      <!-- 返回按钮（浮动，与其他二级页面规范一致） -->
      <button class="alert-detail__back" type="button" @click="goBack">
        <span class="alert-detail__back-icon" aria-hidden="true">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="alert-back-stroke" x1="20" y1="0" x2="20" y2="40" gradientUnits="userSpaceOnUse">
                <stop stop-color="#0C84FF" />
                <stop offset="1" stop-color="#1DEAFF" />
              </linearGradient>
            </defs>
            <circle cx="20" cy="20" r="19.5" fill="rgba(2, 37, 79, 0.6)" stroke="url(#alert-back-stroke)" />
            <path d="M22.5 13L15.5 20L22.5 27" stroke="#4DF2FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
        <span class="alert-detail__back-text">返回</span>
      </button>

      <!-- 左侧：告警信息 -->
      <aside class="alert-detail__left">
        <!-- 标题 -->
        <h2 class="alert-info__title">安防告警</h2>

        <!-- 告警类型（整行） -->
        <div class="alert-info__row">
          <span class="alert-info__lbl">告警类型：</span>
          <span class="alert-info__val alert-info__val--type">{{ alert.type }}</span>
        </div>

        <!-- 两列字段 -->
        <div class="alert-info__grid2">
          <div class="alert-info__field">
            <span class="alert-info__lbl">告警位置：</span>
            <span class="alert-info__val">{{ alert.location }}</span>
          </div>
          <div class="alert-info__field">
            <span class="alert-info__lbl">告警设备：</span>
            <span class="alert-info__val">{{ alert.device }}</span>
          </div>
        </div>
        <div class="alert-info__grid2">
          <div class="alert-info__field">
            <span class="alert-info__lbl">设备IP：</span>
            <span class="alert-info__val">{{ alert.ip }}</span>
          </div>
          <div class="alert-info__field">
            <span class="alert-info__lbl">告警时间：</span>
            <span class="alert-info__val">{{ alert.time }}</span>
          </div>
        </div>

        <!-- 处理情况 -->
        <h3 class="alert-info__section">处理情况</h3>

        <div class="alert-info__row">
          <span class="alert-info__lbl">处理状态：</span>
          <span
            class="alert-info__val"
            :class="alert.status === '已处理' ? 'alert-info__val--done' : 'alert-info__val--pending'"
          >{{ alert.status }}</span>
        </div>
        <div class="alert-info__row">
          <span class="alert-info__lbl">处理时间：</span>
          <span class="alert-info__val">{{ alert.status === '已处理' ? alert.handleTime : '—' }}</span>
        </div>

        <div class="alert-info__spacer" />

        <!-- 操作按钮 -->
        <div class="alert-info__actions">
          <div class="alert-info__action-group">
            <p class="alert-info__hint">跳转至警情系统去处理</p>
            <button class="alert-info__btn alert-info__btn--primary" type="button" @click="goProcess">去处理</button>
          </div>
          <div class="alert-info__action-group">
            <p class="alert-info__hint">点击手动处理在大屏直接处理</p>
            <button class="alert-info__btn alert-info__btn--outline" type="button" @click="showConfirm = true">手动处理</button>
          </div>
        </div>
      </aside>

      <!-- 中间：地图（透明，显示背景） -->
      <section class="alert-detail__center">
        <!-- 告警打点 -->
        <div class="alert-pin" :style="{ left: '44%', top: '42%' }">
          <div class="alert-dot" />
          <div class="alert-pin__label">{{ alert.type }}</div>
        </div>

        <!-- 楼栋聚合点位：复用指南针 + 楼层选择器 -->
        <div class="alert-detail__map-controls">
          <Compass />
          <FloorSelector
            :selected-floor="selectedFloor"
            @floor-change="onFloorChange"
          />
          <FirstPersonRoamButton />
        </div>

      </section>

      <!-- 右侧：实时监控 / 录像回放 / 抓拍图片 -->
      <aside class="alert-detail__right">
        <!-- 实时监控 -->
        <div class="alert-cam">
          <p class="alert-cam__title">实时监控</p>
          <div class="alert-cam__screen">
            <div class="alert-cam__grid" />
            <span class="alert-cam__ts">2024-07-17 11:26:22:913</span>
            <span class="alert-cam__camid">id Bone 序号-01 2235796</span>
            <span class="alert-cam__rec">● REC</span>
            <div class="alert-cam__scan" />
          </div>
        </div>

        <!-- 录像回放 -->
        <div class="alert-cam">
          <p class="alert-cam__title">录像回放</p>
          <div class="alert-cam__screen">
            <div class="alert-cam__grid" />
            <span class="alert-cam__ts">2024-07-17 11:26:22:913</span>
            <span class="alert-cam__camid">id Bone 序号-01 2235796</span>
            <button class="alert-cam__play" aria-label="播放录像">
              <svg viewBox="0 0 44 44" fill="none">
                <circle cx="22" cy="22" r="21.5" fill="rgba(0,0,0,0.55)" stroke="rgba(255,255,255,0.3)"/>
                <path d="M18.5 14.5L31 22L18.5 29.5V14.5Z" fill="white"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- 抓拍图片 -->
        <div class="alert-cam">
          <p class="alert-cam__title">抓拍图片</p>
          <div class="alert-cam__screen">
            <div class="alert-cam__grid" />
            <span class="alert-cam__ts">2024-07-17 11:26:22:913</span>
            <span class="alert-cam__camid">id Bone 序号-01 2235796</span>
            <div class="alert-cam__no-feed">
              <svg viewBox="0 0 40 36" fill="none" width="40" height="36">
                <rect x="2" y="6" width="36" height="26" rx="2.5" stroke="rgba(0,174,255,0.4)" stroke-width="1.5"/>
                <circle cx="20" cy="19" r="7" stroke="rgba(0,174,255,0.35)" stroke-width="1.5"/>
                <circle cx="20" cy="19" r="3" fill="rgba(0,174,255,0.25)"/>
                <rect x="14" y="2" width="12" height="6" rx="1.5" stroke="rgba(0,174,255,0.4)" stroke-width="1.5"/>
              </svg>
              <p>暂无抓拍图片</p>
            </div>
          </div>
        </div>
      </aside>
    </main>


    <!-- 手动处理确认弹窗 -->
    <Teleport to="body">
      <div v-if="showConfirm" class="alert-confirm-overlay" @click.self="showConfirm = false">
        <div class="alert-confirm">
          <div class="alert-confirm__icon">
            <svg viewBox="0 0 56 56" fill="none" width="56" height="56">
              <circle cx="28" cy="28" r="27" fill="rgba(255,72,72,0.1)" stroke="rgba(255,72,72,0.55)" stroke-width="1.5"/>
              <path d="M28 17v14" stroke="#FF4848" stroke-width="2.5" stroke-linecap="round"/>
              <circle cx="28" cy="38" r="1.5" fill="#FF4848"/>
            </svg>
          </div>
          <p class="alert-confirm__text">确认手动处理该警情么？</p>
          <div class="alert-confirm__btns">
            <button class="alert-confirm__btn alert-confirm__btn--cancel" type="button" @click="showConfirm = false">取消</button>
            <button class="alert-confirm__btn alert-confirm__btn--ok" type="button" @click="confirmHandle">确认</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '@/components/common/AppHeader.vue'
import Compass from '@/components/common/Compass.vue'
import FloorSelector from '@/components/common/FloorSelector.vue'
import FirstPersonRoamButton from '@/components/common/FirstPersonRoamButton.vue'

const route = useRoute()
const router = useRouter()

type AlertStatus = '未处理' | '已处理'

interface AlertDetail {
  id: number
  type: string
  status: AlertStatus
  location: string
  time: string
  ip: string
  device: string
  handleTime: string
}

const allAlerts: AlertDetail[] = [
  { id: 1, type: '入侵报警', status: '未处理', location: '一楼大厅',   time: '2025.1.1 15:12:11', ip: '192.168.1.101', device: '摄像头001', handleTime: '' },
  { id: 2, type: '非法闯入', status: '未处理', location: '北二门门禁', time: '2025.1.1 14:56:02', ip: '192.168.1.102', device: '摄像头012', handleTime: '' },
  { id: 3, type: '周界报警', status: '未处理', location: '西侧围墙',   time: '2025.1.1 14:22:48', ip: '192.168.1.088', device: '摄像头033', handleTime: '' },
  { id: 4, type: '异常聚集', status: '已处理', location: '停车场B区',  time: '2025.1.1 13:50:11', ip: '192.168.1.045', device: '摄像头027', handleTime: '2025-01-01 14:05:33' },
  { id: 5, type: '烟感报警', status: '已处理', location: '机房',       time: '2025.1.1 13:12:06', ip: '192.168.1.200', device: '摄像头055', handleTime: '2025-01-01 13:40:22' },
]

const alertId = computed(() => parseInt(route.params.id as string))
const alert = computed<AlertDetail>(() =>
  allAlerts.find(a => a.id === alertId.value) ?? allAlerts[0],
)

const showConfirm = ref(false)

const selectedFloor = ref('1F')
function onFloorChange(floor: string) {
  selectedFloor.value = floor
}

function goBack() {
  router.push({ name: 'security' })
}

function goProcess() {
  console.log('跳转至警情系统处理告警', alertId.value)
}

function confirmHandle() {
  showConfirm.value = false
  console.log('手动处理告警', alertId.value)
}
</script>

<style lang="scss" scoped>
/* ═══ 页面容器 ════════════════════════════════════════ */
.alert-detail {
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
    top: 8px; bottom: 8px;
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
    grid-template-columns: $panel-left-w 1fr $panel-right-w;
    height: calc($screen-height - $header-h);
    padding: 0 40px;
    gap: 0;
  }

  &__left {
    background: $color-bg-panel;
    border: 1px solid $color-border;
    border-radius: $radius-md;
    padding: 20px 22px 24px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    margin: 24px 0;
  }

  &__center {
    position: relative;
  }

  &__map-controls {
    position: absolute;
    right: 8px;
    bottom: 24px;
    z-index: 5;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  &__right {
    background: $color-bg-panel;
    border: 1px solid $color-border;
    border-radius: $radius-md;
    display: flex;
    flex-direction: column;
    padding: 0 16px 16px;
    margin: 24px 0;
  }

}

/* ═══ 返回按钮（规范浮动样式） ════════════════════════ */
.alert-detail {
  &__back {
    position: absolute;
    left: calc(40px + #{$panel-left-w} + 16px);
    top: 32px;
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
    line-height: 20px;
    color: $color-text-1;
    white-space: nowrap;
  }
}

/* ═══ 左侧告警信息 ════════════════════════════════════ */
.alert-info {
  &__title {
    font-size: $font-size-md;
    font-weight: 600;
    color: $color-text-1;
    margin: 0 0 20px;
    letter-spacing: 0.05em;
  }

  &__section {
    font-size: $font-size-md;
    font-weight: 600;
    color: $color-text-1;
    margin: 16px 0 14px;
    padding-top: 16px;
    border-top: 1px solid $color-line;
    letter-spacing: 0.04em;
  }

  &__row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 14px;
  }

  &__grid2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 14px;
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__lbl {
    font-size: $font-size-xs;
    color: rgba(255, 255, 255, 0.5);
    white-space: nowrap;
    line-height: 1.4;
  }

  &__val {
    font-size: $font-size-sm;
    color: $color-text-2;
    line-height: 1.5;
    word-break: break-all;

    /* 告警类型标签 */
    &--type {
      display: inline-flex;
      align-items: center;
      padding: 2px 12px;
      background: rgba(255, 64, 64, 0.12);
      border: 1px solid rgba(255, 64, 64, 0.5);
      border-radius: $radius-sm;
      color: #FF4848;
      font-size: $font-size-xs;
      font-weight: 500;
      line-height: 22px;
    }

    /* 已处理标签 */
    &--done {
      display: inline-flex;
      align-items: center;
      padding: 2px 12px;
      background: rgba(46, 208, 176, 0.12);
      border: 1px solid rgba(46, 208, 176, 0.45);
      border-radius: $radius-sm;
      color: $color-success;
      font-size: $font-size-xs;
      font-weight: 500;
      line-height: 22px;
    }

    /* 未处理标签 */
    &--pending {
      display: inline-flex;
      align-items: center;
      padding: 2px 12px;
      background: rgba(255, 64, 64, 0.12);
      border: 1px solid rgba(255, 64, 64, 0.5);
      border-radius: $radius-sm;
      color: #FF4848;
      font-size: $font-size-xs;
      font-weight: 500;
      line-height: 22px;
    }
  }

  &__spacer { flex: 1; }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex-shrink: 0;
  }

  &__action-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  &__hint {
    font-size: $font-size-xxs;
    color: rgba(255, 255, 255, 0.38);
    margin: 0;
    line-height: 1.4;
  }

  &__btn {
    width: 100%;
    height: 38px;
    border-radius: $radius-sm;
    font-size: $font-size-xs;
    font-family: $font-body;
    font-weight: 500;
    cursor: pointer;
    transition: opacity 0.18s, transform 0.18s;

    &:hover  { opacity: 0.85; transform: translateY(-1px); }
    &:active { transform: translateY(0); }

    &--primary {
      background: linear-gradient(90deg, #006FC2 0%, $color-primary 100%);
      border: 0;
      color: $color-text-1;
    }

    &--outline {
      background: transparent;
      border: 1px solid $color-border;
      color: $color-primary;
    }
  }
}

/* ═══ 中间地图 — 告警打点 ══════════════════════════════ */
.alert-pin {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  &__label {
    position: relative;
    z-index: 2;
    font-size: $font-size-xs;
    font-weight: 500;
    color: #FF6060;
    background: rgba(5, 8, 22, 0.85);
    border: 1px solid rgba(255, 72, 72, 0.6);
    border-radius: 4px;
    padding: 3px 14px;
    white-space: nowrap;
    box-shadow: 0 0 8px rgba(255, 48, 48, 0.4);
    letter-spacing: 0.04em;
  }
}

.alert-dot {
  position: relative;
  width: 12px;
  height: 12px;
  background: #ff3b30;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(255, 59, 48, 0.8);

  &::after {
    content: "";
    position: absolute;
    inset: -8px;
    border-radius: 50%;
    background: rgba(255, 59, 48, 0.28);
    animation: alertPulse 1.6s infinite ease-out;
  }
}


/* ═══ 右侧摄像头面板 ══════════════════════════════════ */
.alert-cam {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding-top: 14px;

  & + & {
    border-top: 1px solid $color-line;
  }

  &__title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: $font-size-xs;
    color: $color-text-1;
    margin: 0 0 8px;
    flex-shrink: 0;

    &::before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: $color-primary;
      flex-shrink: 0;
    }
  }

  &__screen {
    flex: 1;
    min-height: 0;
    position: relative;
    background: rgba(4, 9, 20, 0.9);
    border: 1px solid $color-line;
    border-radius: $radius-sm;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
    background-size: 22px 22px;
    pointer-events: none;
  }

  &__scan {
    position: absolute;
    left: 0; right: 0;
    top: -2px;
    height: 28px;
    background: linear-gradient(180deg, rgba(0,174,255,0) 0%, rgba(0,174,255,0.1) 50%, rgba(0,174,255,0) 100%);
    animation: cam-scan 4s linear infinite;
    pointer-events: none;
  }

  &__ts {
    position: absolute;
    top: 6px;
    left: 8px;
    font-size: 10px;
    font-family: $font-number;
    color: rgba(255, 255, 255, 0.65);
    letter-spacing: 0.02em;
    line-height: 1;
    z-index: 2;
    white-space: nowrap;
  }

  &__camid {
    position: absolute;
    top: 6px;
    right: 8px;
    font-size: 10px;
    font-family: $font-number;
    color: rgba(255, 255, 255, 0.65);
    letter-spacing: 0.02em;
    line-height: 1;
    z-index: 2;
    white-space: nowrap;
  }

  &__rec {
    position: absolute;
    bottom: 6px;
    left: 8px;
    font-size: 10px;
    font-family: $font-number;
    color: #FF4848;
    letter-spacing: 0.05em;
    z-index: 2;
    animation: rec-blink 1.2s ease-in-out infinite;
  }

  &__play {
    position: relative;
    z-index: 2;
    width: 44px;
    height: 44px;
    background: none;
    border: 0;
    cursor: pointer;
    padding: 0;
    transition: transform 0.18s, filter 0.18s;

    &:hover {
      transform: scale(1.1);
      filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.4));
    }

    svg { display: block; }
  }

  &__no-feed {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;

    p {
      margin: 0;
      font-size: $font-size-xxs;
      color: rgba(255, 255, 255, 0.3);
    }
  }
}

/* ═══ 手动处理确认弹窗 ════════════════════════════════ */
.alert-confirm-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 5, 20, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
}

.alert-confirm {
  min-width: 340px;
  background: linear-gradient(180deg, rgba(5, 20, 50, 0.97) 0%, rgba(2, 10, 30, 0.98) 100%);
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  padding: 32px 32px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.6);

  &__icon svg { display: block; }

  &__text {
    margin: 0;
    font-size: $font-size-sm;
    color: $color-text-1;
    text-align: center;
  }

  &__btns {
    display: flex;
    gap: 16px;
    width: 100%;
  }

  &__btn {
    flex: 1;
    height: 42px;
    border-radius: $radius-sm;
    font-size: $font-size-xs;
    font-family: $font-body;
    font-weight: 500;
    cursor: pointer;
    transition: opacity 0.18s;

    &:hover { opacity: 0.85; }

    &--cancel {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.22);
      color: rgba(255, 255, 255, 0.6);
    }

    &--ok {
      background: linear-gradient(90deg, #CC2200 0%, #FF4848 100%);
      border: 0;
      color: $color-text-1;
    }
  }
}

/* ═══ 动画 ═══════════════════════════════════════════ */
@keyframes alertPulse {
  0%   { transform: scale(0.6); opacity: 0.9; }
  100% { transform: scale(1.8); opacity: 0; }
}

@keyframes cam-scan {
  0%   { transform: translateY(0); }
  100% { transform: translateY(calc(100% + 28px)); }
}

@keyframes rec-blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.25; }
}

@media (prefers-reduced-motion: reduce) {
  .alert-dot::after,
  .alert-cam__scan { animation: none; }
  .alert-cam__rec  { animation: none; }
}
</style>
