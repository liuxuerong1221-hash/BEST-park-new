<template>
  <BasePanel class="access-record" title="通行记录">
    <template #actions>
      <div class="access-record__tabs">
        <button
          v-for="t in tabs"
          :key="t.value"
          class="access-record__tab"
          :class="{ 'access-record__tab--active': tab === t.value }"
          type="button"
          @click="tab = t.value"
        >{{ t.label }}</button>
      </div>
    </template>

    <div class="access-record__toolbar">
      <label class="access-record__search">
        <input
          v-model="keyword"
          class="access-record__search-input"
          placeholder="请输入关键词搜索"
        />
        <svg class="access-record__search-icon" viewBox="0 0 18 18" fill="none">
          <circle cx="8" cy="8" r="5.5" stroke="#00AEFF" stroke-width="1.4"/>
          <path d="M12.5 12.5L16 16" stroke="#00AEFF" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
      </label>

      <DatePicker v-model="date" />
    </div>

    <div v-if="tab === 'person'" class="access-record__person-table">
      <div class="access-record__person-row access-record__person-row--head">
        <span class="access-record__person-name">姓名</span>
        <span class="access-record__person-gender">性别</span>
        <span class="access-record__person-role">身份</span>
        <span class="access-record__person-time">通行时间</span>
        <span class="access-record__person-status-head">状态</span>
      </div>

      <div
        v-for="r in filteredPersonRecords"
        :key="r.id"
        class="access-record__person-row"
      >
        <span class="access-record__person-name">{{ r.name }}</span>
        <span class="access-record__person-gender">{{ r.gender }}</span>
        <span class="access-record__person-role">{{ r.role }}</span>
        <span class="access-record__person-time">{{ r.time }}</span>
        <span
          class="access-record__person-status"
          :class="`access-record__person-status--${r.direction}`"
        >{{ r.direction === 'in' ? '进' : '出' }}</span>
      </div>
    </div>

    <div v-else class="access-record__list">
      <div
        v-for="r in filteredVehicleRecords"
        :key="r.id"
        class="access-record__item"
        :class="`access-record__item--${r.direction}`"
      >
        <!-- 左：抓拍图 -->
        <button
          class="access-record__photo"
          type="button"
          aria-label="查看抓拍图"
          @click="openPreview(r)"
        >
          <span class="access-record__plate">{{ r.plate }}</span>
        </button>

        <!-- 中：信息（两列：标签 / 值）-->
        <div class="access-record__info">
          <div class="access-record__info-labels">
            <span>车牌号：</span>
            <span>通过设备：</span>
            <span>通行时间：</span>
          </div>
          <div class="access-record__info-values">
            <span>{{ r.plate }}</span>
            <span>{{ r.device }}</span>
            <span>{{ r.time }}</span>
          </div>
        </div>

        <!-- 右：光效层（绝对定位，59x127） -->
        <div class="access-record__glow" aria-hidden="true">
          <div class="access-record__glow-fill" />
          <div class="access-record__glow-stripe" />
        </div>

        <!-- 状态徽章 + 上下三角（垂直居中聚合） -->
        <div class="access-record__indicator" aria-hidden="true">
          <span class="access-record__triangle access-record__triangle--top" />
          <div class="access-record__status">
            <span class="access-record__status-ring access-record__status-ring--outer" />
            <span class="access-record__status-ring access-record__status-ring--mid" />
            <span class="access-record__status-ring access-record__status-ring--inner" />
            <span class="access-record__status-text">{{ r.direction === 'in' ? '进' : '出' }}</span>
          </div>
          <span class="access-record__triangle access-record__triangle--bottom" />
        </div>
      </div>
    </div>

    <!-- 抓拍图预览弹窗 -->
    <Teleport to="body">
      <div
        v-if="previewRecord"
        class="capture-modal"
        role="dialog"
        aria-modal="true"
        aria-label="车辆抓拍图预览"
        tabindex="-1"
        @click.self="closePreview"
        @keydown.esc="closePreview"
      >
        <section class="capture-modal__panel">
          <header class="capture-modal__header">
            <div class="capture-modal__title">
              <span class="capture-modal__dot" />
              <span class="capture-modal__title-text">车辆抓拍图 · {{ previewRecord.plate }}</span>
              <span
                class="capture-modal__badge"
                :class="`capture-modal__badge--${previewRecord.direction}`"
              >{{ previewRecord.direction === 'in' ? '进' : '出' }}</span>
            </div>
            <button class="capture-modal__close" type="button" aria-label="关闭" @click="closePreview">
              <svg viewBox="0 0 16 16" fill="none">
                <path d="M9.57 8L15.73 1.86C16.15 1.44 16.15 0.75 15.73 0.31C15.32 -0.10 14.62 -0.10 14.19 0.31L8.02 6.48L1.86 0.31C1.44 -0.10 0.75 -0.10 0.31 0.31C-0.10 0.72 -0.10 1.42 0.31 1.86L6.48 8.02L0.31 14.19C-0.10 14.60 -0.10 15.30 0.31 15.73C0.72 16.15 1.42 16.15 1.86 15.73L8.02 9.57L14.19 15.73C14.60 16.15 15.30 16.15 15.73 15.73C16.15 15.32 16.15 14.62 15.73 14.19L9.57 8Z" fill="#FFFFFF"/>
              </svg>
            </button>
          </header>

          <div class="capture-modal__body">
            <div class="capture-modal__image">
              <svg viewBox="0 0 640 400" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="cap-sky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#0E2647"/>
                    <stop offset="100%" stop-color="#08172E"/>
                  </linearGradient>
                  <linearGradient id="cap-ground" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#13365C"/>
                    <stop offset="100%" stop-color="#061328"/>
                  </linearGradient>
                  <linearGradient id="cap-car" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#2B6AA8"/>
                    <stop offset="100%" stop-color="#0D2D4D"/>
                  </linearGradient>
                </defs>
                <rect width="640" height="260" fill="url(#cap-sky)"/>
                <rect y="260" width="640" height="140" fill="url(#cap-ground)"/>
                <rect x="40" y="160" width="80" height="100" fill="#0B2C52" opacity="0.7"/>
                <rect x="520" y="140" width="90" height="120" fill="#0B2C52" opacity="0.7"/>
                <rect x="80" y="120" width="10" height="140" fill="#1B3F6B"/>
                <rect x="550" y="120" width="10" height="140" fill="#1B3F6B"/>
                <rect x="90" y="170" width="460" height="6" fill="#4DF2FF" opacity="0.75"/>
                <g transform="translate(180, 220)">
                  <rect x="0" y="40" width="280" height="70" rx="12" fill="url(#cap-car)" stroke="#4DF2FF" stroke-opacity="0.4"/>
                  <path d="M30 40 L70 10 L210 10 L250 40 Z" fill="#1B3F6B" stroke="#4DF2FF" stroke-opacity="0.3"/>
                  <rect x="75" y="15" width="130" height="22" rx="3" fill="#0A2240" opacity="0.8"/>
                  <circle cx="55" cy="115" r="18" fill="#050F1E" stroke="#4DF2FF" stroke-opacity="0.5"/>
                  <circle cx="55" cy="115" r="8" fill="#1B3F6B"/>
                  <circle cx="225" cy="115" r="18" fill="#050F1E" stroke="#4DF2FF" stroke-opacity="0.5"/>
                  <circle cx="225" cy="115" r="8" fill="#1B3F6B"/>
                  <rect x="100" y="80" width="80" height="20" rx="2" fill="#0E7F3B" stroke="#FFFFFF" stroke-width="0.6"/>
                  <text x="140" y="95" text-anchor="middle" font-size="12" fill="#FFFFFF" font-family="PingFang SC, sans-serif" font-weight="700">{{ previewRecord.plate }}</text>
                  <rect x="10" y="50" width="16" height="10" rx="2" fill="#FFE48A" opacity="0.9"/>
                  <rect x="254" y="50" width="16" height="10" rx="2" fill="#FFE48A" opacity="0.9"/>
                </g>
                <g opacity="0.16">
                  <path d="M0 120 H640" stroke="#4DF2FF" stroke-dasharray="4 6"/>
                  <path d="M0 300 H640" stroke="#4DF2FF" stroke-dasharray="4 6"/>
                </g>
                <text x="20" y="30" fill="#4DF2FF" font-size="14" font-family="PingFang SC, sans-serif" opacity="0.75">BEST · 智慧园区 · 通行抓拍</text>
              </svg>
            </div>
            <div class="capture-modal__meta">
              <span>通行时间：{{ previewRecord.time }}</span>
              <span>通过设备：{{ previewRecord.device }}</span>
            </div>
          </div>
        </section>
      </div>
    </Teleport>
  </BasePanel>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import BasePanel from '@/components/common/BasePanel.vue'
import DatePicker from '@/components/common/DatePicker.vue'

type Direction = 'in' | 'out'

interface Record {
  id: number
  plate: string
  device: string
  time: string
  direction: Direction
}

interface PersonRecord {
  id: number
  name: string
  gender: string
  role: string
  time: string
  direction: Direction
}

const tabs = [
  { value: 'person',  label: '人员' },
  { value: 'vehicle', label: '车辆' },
] as const
type Tab = typeof tabs[number]['value']
const tab = ref<Tab>('vehicle')

const keyword = ref('')
const date = ref('2026-4-20')
const previewRecord = ref<Record | null>(null)

const records: Record[] = [
  { id: 1, plate: '皖A1***45', device: '门禁1', time: '2025.1.1 15:12:11', direction: 'in' },
  { id: 2, plate: '皖A1***45', device: '门禁1', time: '2025.1.1 15:12:11', direction: 'out' },
  { id: 3, plate: '皖A2***86', device: '道闸2', time: '2025.1.1 15:08:34', direction: 'in' },
  { id: 4, plate: '皖A3***12', device: '摆闸1', time: '2025.1.1 14:55:02', direction: 'out' },
  { id: 5, plate: '皖A4***78', device: '门禁2', time: '2025.1.1 14:42:18', direction: 'in' },
  { id: 6, plate: '皖A5***99', device: '道闸1', time: '2025.1.1 14:30:51', direction: 'out' },
]

const personRecords: PersonRecord[] = [
  { id: 1, name: '张某', gender: '女', role: '员工', time: '2025-11-1 18:09:23', direction: 'out' },
  { id: 2, name: '张某', gender: '女', role: '员工', time: '2025-11-1 18:09:23', direction: 'in' },
  { id: 3, name: '张某', gender: '女', role: '员工', time: '2025-11-1 18:09:23', direction: 'out' },
  { id: 4, name: '张某', gender: '女', role: '员工', time: '2025-11-1 18:09:23', direction: 'out' },
  { id: 5, name: '张某', gender: '女', role: '员工', time: '2025-11-1 18:09:23', direction: 'out' },
  { id: 6, name: '张某', gender: '女', role: '员工', time: '2025-11-1 18:09:23', direction: 'out' },
]

const filteredVehicleRecords = computed(() => {
  if (!keyword.value.trim()) return records
  const k = keyword.value.trim()
  return records.filter(r => r.plate.includes(k) || r.device.includes(k))
})

const filteredPersonRecords = computed(() => {
  if (!keyword.value.trim()) return personRecords
  const k = keyword.value.trim()
  return personRecords.filter(r =>
    r.name.includes(k) ||
    r.gender.includes(k) ||
    r.role.includes(k) ||
    r.time.includes(k),
  )
})

function openPreview(record: Record) {
  previewRecord.value = record
}

function closePreview() {
  previewRecord.value = null
}
</script>

<style lang="scss" scoped>
$record-bg: linear-gradient(255deg, rgba(5, 25, 49, 0.35) 9%, rgba(10, 44, 83, 0.6) 96%);
$record-border: #0B2C52;
$ctrl-bg: rgba(8, 39, 76, 0.6);
$ctrl-border: rgba(0, 174, 255, 0.4);
$tab-inactive: rgba(0, 174, 255, 0.2);
$tab-active: #00AEFF;
$enter-color: #0CF92C;
$exit-color: #FF1414;
$enter-glow: linear-gradient(90deg, rgba(156, 255, 169, 0) 14%, rgba(53, 255, 80, 0.55) 88%);
$exit-glow:  linear-gradient(90deg, rgba(255, 72, 72, 0) 15%, rgba(255, 72, 72, 0.55) 88%);

.access-record {
  flex: 0 0 auto;
  height: 367px;
  gap: 10px;
  min-height: 0;

  // 复写 BasePanel 背景到设计稿一致
  :deep(.base-panel),
  &.base-panel {
    background: rgba(5, 25, 49, 0.64);
    border-color: $record-border;
  }

  // 顶部 tabs
  &__tabs {
    display: flex;
    gap: 0;
  }

  &__tab {
    width: 46px;
    height: 24px;
    border: 1px solid rgba(0, 174, 255, 0.4);
    background: rgba(0, 174, 255, 0.06);
    color: $color-text-2;
    font-size: $font-size-xxs;
    cursor: pointer;
    transition: background 0.18s ease, color 0.18s ease;
    padding: 0;

    &:first-child { border-radius: $radius-sm 0 0 $radius-sm; }
    &:last-child  { border-radius: 0 $radius-sm $radius-sm 0; border-left: none; }

    &--active {
      background: rgba(0, 174, 255, 0.28);
      color: $color-text-1;
      box-shadow: inset 0 0 6px rgba(77, 242, 255, 0.45);
    }

    &:hover:not(&--active) {
      color: $color-text-1;
      background: rgba(0, 174, 255, 0.18);
    }
  }

  // 工具栏
  &__toolbar {
    display: flex;
    gap: 10px;
    flex-shrink: 0;
  }

  &__search {
    flex: 1;
    height: 34px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 10px;
    background: $ctrl-bg;
    border: 1px solid $ctrl-border;
    border-radius: 4px;
  }

  &__search-input {
    flex: 1;
    background: transparent;
    border: 0;
    outline: 0;
    color: $color-text-1;
    font-size: $font-size-xs;
    font-family: inherit;

    &::placeholder { color: rgba(255, 255, 255, 0.85); }
  }

  &__search-icon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  &__person-table {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    overscroll-behavior: contain;
    padding-right: 2px;

    &::-webkit-scrollbar { width: 4px; }
    &::-webkit-scrollbar-thumb {
      background: rgba(0, 174, 255, 0.4);
      border-radius: 2px;
    }
  }

  &__person-row {
    flex-shrink: 0;
    min-height: 38px;
    display: grid;
    grid-template-columns: 58px 60px 60px minmax(116px, 1fr) 30px;
    align-items: center;
    padding: 0 8px 0 12px;
    background: $ctrl-bg;
    border: 1px solid rgba(0, 174, 255, 0.1);
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
    line-height: 20px;

    & + & {
      margin-top: -1px;
    }

    &--head {
      position: relative;
      overflow: hidden;
      background: linear-gradient(180deg, rgba(0, 174, 255, 0) 0%, rgba(0, 174, 255, 0.58) 100%);
      font-weight: 800;

      &::before {
        content: '';
        position: absolute;
        inset: 1px 0;
        pointer-events: none;
        opacity: 0.13;
        background: repeating-linear-gradient(122deg, transparent 0 16px, #2BA7EA 16px 18px, transparent 18px 20px);
      }

      > span {
        position: relative;
        z-index: 1;
      }
    }
  }

  &__person-name,
  &__person-gender,
  &__person-role,
  &__person-time,
  &__person-status-head {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__person-status {
    width: 26px;
    height: 23px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    font-size: 12px;
    line-height: 17px;

    &--in {
      color: $enter-color;
      background: rgba(12, 249, 44, 0.3);
    }

    &--out {
      color: $exit-color;
      background: rgba(255, 72, 72, 0.3);
    }
  }

  // 列表：默认显示 2 行（127×2 + 10 间距 = 264px），超出滚动
  &__list {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    overscroll-behavior: contain;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-right: 2px;

    &::-webkit-scrollbar { width: 4px; }
    &::-webkit-scrollbar-thumb {
      background: rgba(0, 174, 255, 0.4);
      border-radius: 2px;
    }
  }

  // 单卡 392 宽，高度按内容自适应（最小 127）
  &__item {
    position: relative;
    flex: 0 0 auto;
    min-height: 127px;
    padding: 14px 0;
    background: $record-bg;
    border: 1px solid $record-border;
    border-radius: 4px;
    overflow: hidden;
  }

  // 抓拍图：保持 3:2 比例（设计稿 149:99），随容器宽度等比缩放
  &__photo {
    position: relative;
    margin-left: 14px;
    width: 130px;
    aspect-ratio: 149 / 99;
    height: auto;
    border-radius: 4px;
    background:
      linear-gradient(135deg, rgba(0, 174, 255, 0.18) 0%, rgba(0, 60, 110, 0.5) 100%),
      repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.04) 0 6px, transparent 6px 12px);
    border: 1px solid rgba(0, 174, 255, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    box-shadow:
      5px 5px 5px 0 rgba(0, 0, 0, 0.349),
      inset 0 5px 5px 0 rgba(0, 0, 0, 0.349);
    padding: 0;
    cursor: pointer;
    transition: border-color 0.18s ease, box-shadow 0.18s ease;

    &:hover {
      border-color: rgba(77, 242, 255, 0.6);
      box-shadow:
        5px 5px 5px 0 rgba(0, 0, 0, 0.349),
        inset 0 5px 5px 0 rgba(0, 0, 0, 0.349),
        0 0 12px rgba(77, 242, 255, 0.3);
    }

    &::before {
      content: '';
      position: absolute;
      inset: 14px 18px;
      border: 1px dashed rgba(0, 174, 255, 0.28);
      border-radius: 4px;
    }
  }

  &__plate {
    position: relative;
    z-index: 1;
    font-family: $font-number;
    font-size: $font-size-sm;
    font-weight: bold;
    color: rgba(255, 255, 255, 0.7);
    letter-spacing: 1px;
  }

  // 信息：紧跟图片右侧，垂直居中；让出右侧 65px 给徽章 + 光效
  &__info {
    position: absolute;
    left: 154px;
    right: 65px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    gap: 4px;
    font-size: $font-size-xxs;
    line-height: 30px;
  }

  &__info-labels,
  &__info-values {
    display: flex;
    flex-direction: column;
  }

  &__info-labels {
    width: 60px;
    color: #FFFFFF;
    opacity: 0.8;
    flex-shrink: 0;
  }

  &__info-values {
    width: 89px;
    color: #00AEFF;
    font-family: $font-number;

    span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  // 右侧光效底层 59px，跟随卡片高度
  &__glow {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 59px;
    pointer-events: none;
  }

  // 90deg 渐变填充矩形（圆角右侧）
  &__glow-fill {
    position: absolute;
    inset: 0;
    border-radius: 0 3px 3px 0;
    opacity: 0.2;
  }

  &__item--in &__glow-fill {
    background: $enter-glow;
  }

  &__item--out &__glow-fill {
    background: $exit-glow;
  }

  // 装饰性高光（跟随卡片高度，仅上下各留 3px）
  &__glow-stripe {
    position: absolute;
    left: 35px;
    top: 3px;
    bottom: 3px;
    width: 46px;
    background: linear-gradient(120deg,
      transparent 30%,
      rgba(255, 255, 255, 0.18) 50%,
      transparent 70%);
    mix-blend-mode: screen;
    opacity: 0.6;
  }

  // 状态指示器整体（上三角 + 圆 + 下三角）：右锚定，垂直居中，确保完整显示
  &__indicator {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    width: 36px;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5.45px;
  }

  // 上下小三角 5x4.55
  &__triangle {
    width: 0;
    height: 0;
    border-left: 2.5px solid transparent;
    border-right: 2.5px solid transparent;
    opacity: 0.5;
  }

  &__item--in &__triangle {
    &--top    { border-bottom: 4.55px solid $enter-color; }
    &--bottom { border-top:    4.55px solid $enter-color; }
  }

  &__item--out &__triangle {
    &--top    { border-bottom: 4.55px solid $exit-color; }
    &--bottom { border-top:    4.55px solid $exit-color; }
  }

  // 状态圈 36x36
  &__status {
    position: relative;
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__status-ring {
    position: absolute;
    border-radius: 50%;
    border: 1px solid currentColor;

    &--outer { inset: 0; }
    &--mid   { inset: 2px; }
    &--inner { inset: 3px; opacity: 0.3; }
  }

  &__item--in &__status  { color: $enter-color; }
  &__item--out &__status { color: $exit-color; }

  &__status::after {
    content: '';
    position: absolute;
    inset: 4px;
    border-radius: 50%;
    background: radial-gradient(circle, currentColor 0%, transparent 70%);
    opacity: 0.18;
  }

  &__status-text {
    position: relative;
    z-index: 1;
    font-size: $font-size-xs;
    font-weight: bold;
    color: currentColor;
    text-shadow: 0 0 6px currentColor;
  }
}

.capture-modal {
  position: fixed;
  inset: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
  background: rgba(0, 8, 18, 0.78);
  backdrop-filter: blur(6px);

  &__panel {
    width: min(680px, calc(100vw - 96px));
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid rgba(77, 242, 255, 0.35);
    border-radius: $radius-md;
    background: rgba(5, 25, 49, 0.95);
    box-shadow: 0 0 32px rgba(0, 174, 255, 0.24), inset 0 0 24px rgba(0, 174, 255, 0.08);
  }

  &__header {
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 $spacing-lg;
    border-bottom: 1px solid rgba(0, 174, 255, 0.24);
    flex-shrink: 0;
  }

  &__title {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    min-width: 0;
  }

  &__dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: $color-primary;
    box-shadow: 0 0 10px rgba(0, 174, 255, 0.75);
    flex-shrink: 0;
  }

  &__title-text {
    font-size: $font-size-sm;
    font-weight: bold;
    color: $color-text-1;
    white-space: nowrap;
  }

  &__badge {
    height: 22px;
    display: inline-flex;
    align-items: center;
    padding: 0 8px;
    border-radius: 4px;
    font-size: $font-size-xxs;
    font-weight: bold;

    &--in {
      color: #0CF92C;
      background: rgba(12, 249, 44, 0.25);
    }

    &--out {
      color: #FF1414;
      background: rgba(255, 72, 72, 0.25);
    }
  }

  &__close {
    width: 30px;
    height: 30px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0;
    padding: 7px;
    background: transparent;
    cursor: pointer;

    &:hover { opacity: 0.75; }
    svg { width: 16px; height: 16px; }
  }

  &__body {
    padding: $spacing-lg;
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
  }

  &__image {
    width: 100%;
    border-radius: $radius-sm;
    overflow: hidden;
    border: 1px solid rgba(0, 174, 255, 0.2);

    svg {
      width: 100%;
      height: auto;
      display: block;
    }
  }

  &__meta {
    display: flex;
    justify-content: space-between;
    color: $color-text-2;
    font-size: $font-size-xs;
  }
}
</style>
