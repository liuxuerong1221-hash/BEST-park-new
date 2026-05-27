<template>
  <BasePanel class="alert-list" title="告警列表">
    <div class="alert-list__toolbar">
      <div class="alert-list__select" @click="toggleStatusMenu">
        <span class="alert-list__select-text">{{ statusLabel }}</span>
        <svg class="alert-list__select-arrow" viewBox="0 0 10 6" fill="none">
          <path d="M1 1L5 5L9 1" stroke="#4DF2FF" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
      </div>
      <DatePicker v-model="date" />
    </div>

    <div class="alert-list__items">
      <article
        v-for="alert in filteredAlerts"
        :key="alert.id"
        class="alert-list__item"
        role="button"
        tabindex="0"
        @click="handleAlert(alert)"
        @keydown.enter="handleAlert(alert)"
      >
        <div class="alert-list__thumb" aria-hidden="true">
          <div class="alert-list__thumb-grid" />
          <div class="alert-list__thumb-scan" />
        </div>

        <div class="alert-list__info">
          <div class="alert-list__row">
            <span class="alert-list__label">告警类型：</span>
            <span class="alert-list__value alert-list__value--danger">{{ alert.type }}</span>
          </div>
          <div class="alert-list__row">
            <span class="alert-list__label">状态：</span>
            <span
              class="alert-list__value"
              :class="alert.status === '已处理' ? 'alert-list__value--success' : 'alert-list__value--danger'"
            >{{ alert.status }}</span>
          </div>
          <div
            class="alert-list__row"
            @mouseenter="handleTipEnter($event, alert.location)"
            @mouseleave="handleTipLeave"
          >
            <span class="alert-list__label">告警地点：</span>
            <span class="alert-list__value alert-list__value--primary">{{ alert.location }}</span>
          </div>
          <div
            class="alert-list__row"
            @mouseenter="handleTipEnter($event, alert.time)"
            @mouseleave="handleTipLeave"
          >
            <span class="alert-list__label">告警时间：</span>
            <span class="alert-list__value alert-list__value--primary">{{ alert.time }}</span>
          </div>
        </div>

        <button class="alert-list__btn" type="button" @click.stop="handleAlert(alert)">
          去处理
        </button>

        <div class="alert-list__glow" aria-hidden="true">
          <div class="alert-list__glow-fill" />
          <div class="alert-list__glow-bar" />
        </div>
      </article>
    </div>

    <!-- 文字溢出提示气泡 -->
    <Teleport to="body">
      <div
        v-if="tooltip.visible"
        class="alert-list__tooltip"
        :style="{ top: `${tooltip.y}px`, left: `${tooltip.x}px` }"
      >{{ tooltip.text }}</div>
    </Teleport>

    <!-- 状态下拉 -->
    <Teleport to="body">
      <div
        v-if="statusMenuOpen"
        class="alert-status-menu"
        :style="statusMenuStyle"
        @click.stop
      >
        <button
          v-for="s in statusOptions"
          :key="s.value"
          class="alert-status-menu__item"
          :class="{ 'alert-status-menu__item--active': statusFilter === s.value }"
          type="button"
          @click="selectStatus(s.value)"
        >{{ s.label }}</button>
      </div>
    </Teleport>
  </BasePanel>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import BasePanel from '@/components/common/BasePanel.vue'
import DatePicker from '@/components/common/DatePicker.vue'

interface Alert {
  id: number
  type: string
  status: '未处理' | '已处理'
  location: string
  time: string
}

const statusOptions = [
  { value: 'all',    label: '全部状态' },
  { value: 'unhandled', label: '未处理' },
  { value: 'handled', label: '已处理' },
] as const
type StatusFilter = typeof statusOptions[number]['value']

const router = useRouter()

const statusFilter = ref<StatusFilter>('all')
const date = ref('2026-4-20')
const statusMenuOpen = ref(false)
const statusMenuPos = ref({ top: 0, left: 0 })
const tooltip = ref({ visible: false, text: '', x: 0, y: 0 })

const statusLabel = computed(() => {
  return statusOptions.find(s => s.value === statusFilter.value)?.label ?? '全部状态'
})

const statusMenuStyle = computed(() => ({
  top: `${statusMenuPos.value.top}px`,
  left: `${statusMenuPos.value.left}px`,
  transform: 'scale(var(--app-scale, 1))',
  transformOrigin: 'top left',
}))

const alerts: Alert[] = [
  { id: 1, type: '入侵报警', status: '未处理', location: '一楼大厅',   time: '2025.1.1 15:12:11' },
  { id: 2, type: '非法闯入', status: '未处理', location: '北二门门禁', time: '2025.1.1 14:56:02' },
  { id: 3, type: '周界报警', status: '未处理', location: '西侧围墙',   time: '2025.1.1 14:22:48' },
  { id: 4, type: '异常聚集', status: '已处理', location: '停车场B区',  time: '2025.1.1 13:50:11' },
  { id: 5, type: '烟感报警', status: '已处理', location: '机房',       time: '2025.1.1 13:12:06' },
]

const filteredAlerts = computed(() => {
  if (statusFilter.value === 'all') return alerts
  const matchStatus = statusFilter.value === 'handled' ? '已处理' : '未处理'
  return alerts.filter(a => a.status === matchStatus)
})

function toggleStatusMenu(event: MouseEvent) {
  const trigger = event.currentTarget as HTMLElement
  const rect = trigger.getBoundingClientRect()
  statusMenuPos.value = { top: rect.bottom + 4, left: rect.left }
  statusMenuOpen.value = !statusMenuOpen.value
}

function selectStatus(value: StatusFilter) {
  statusFilter.value = value
  statusMenuOpen.value = false
}

function handleTipEnter(event: MouseEvent, text: string) {
  const row = event.currentTarget as HTMLElement
  const valueEl = row.querySelector('.alert-list__value') as HTMLElement | null
  if (!valueEl || valueEl.scrollWidth <= valueEl.clientWidth) return
  const rect = row.getBoundingClientRect()
  tooltip.value = { visible: true, text, x: rect.left, y: rect.top }
}

function handleTipLeave() {
  tooltip.value.visible = false
}

function handleAlert(alert: Alert) {
  router.push({ name: 'security-alert', params: { id: alert.id } })
}

function onDocClick(e: MouseEvent) {
  if (!statusMenuOpen.value) return
  const menu = document.querySelector('.alert-status-menu')
  const target = e.target as Node
  if (menu && menu.contains(target)) return
  if ((target as HTMLElement).closest?.('.alert-list__select')) return
  statusMenuOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', onDocClick)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
})
</script>

<style lang="scss" scoped>
.alert-list {
  flex: 1;
  min-height: 0;
  gap: 10px;

  &__toolbar {
    display: flex;
    gap: 10px;
    flex-shrink: 0;
  }

  &__select {
    width: 111px;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    background: rgba(8, 39, 76, 0.6);
    border: 1px solid rgba(0, 174, 255, 0.4);
    border-radius: 4px;
    cursor: pointer;
  }

  &__select-text {
    font-size: $font-size-xs;
    color: $color-text-1;
  }

  &__select-arrow {
    width: 10px;
    height: 6px;
  }

  &__items {
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

  &__item {
    position: relative;
    flex: 0 0 auto;
    min-height: 127px;
    padding: 14px 65px 14px 14px;
    background: linear-gradient(255deg, rgba(5, 25, 49, 0.35) 9%, rgba(10, 44, 83, 0.6) 96%);
    border: 1px solid #0B2C52;
    border-radius: 4px;
    overflow: hidden;
    display: grid;
    grid-template-columns: 130px 1fr;
    gap: 10px;
    align-items: center;
    cursor: pointer;
    transition: border-color 0.18s;

    &:hover { border-color: rgba(0, 174, 255, 0.35); }
  }

  &__thumb {
    position: relative;
    width: 130px;
    aspect-ratio: 149 / 99;
    border-radius: 4px;
    background:
      linear-gradient(135deg, rgba(0, 174, 255, 0.18) 0%, rgba(0, 60, 110, 0.5) 100%),
      #02101e;
    border: 1px solid rgba(0, 174, 255, 0.25);
    overflow: hidden;
    box-shadow:
      5px 5px 5px 0 rgba(0, 0, 0, 0.349),
      inset 0 5px 5px 0 rgba(0, 0, 0, 0.349);
  }

  &__thumb-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(77, 242, 255, 0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(77, 242, 255, 0.06) 1px, transparent 1px);
    background-size: 18px 18px;
  }

  &__thumb-scan {
    position: absolute;
    left: 0;
    right: 0;
    top: -2px;
    height: 30px;
    background: linear-gradient(180deg, rgba(255, 72, 72, 0) 0%, rgba(255, 72, 72, 0.22) 50%, rgba(255, 72, 72, 0) 100%);
    animation: alert-scan 3.5s linear infinite;
    pointer-events: none;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
  }

  &__row {
    display: flex;
    font-size: $font-size-xxs;
    line-height: 1.2;
    white-space: nowrap;

  }

  &__label {
    color: $color-text-1;
    opacity: 0.8;
  }

  &__value {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;

    &--danger  { color: #FF1414; }
    &--success { color: #28DCB9; }
    &--primary { color: #00AEFF; }
  }

  &__btn {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    width: 58px;
    height: 28px;
    background: $color-primary;
    border: 0;
    border-radius: 4px;
    color: $color-text-1;
    font-size: $font-size-xxs;
    cursor: pointer;
    z-index: 2;
    transition: opacity 0.18s;

    &:hover { opacity: 0.75; }
  }

  &__glow {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 59px;
    pointer-events: none;
  }

  &__glow-fill {
    position: absolute;
    inset: 0;
    border-radius: 0 3px 3px 0;
    opacity: 0.12;
    background: linear-gradient(90deg, rgba(255, 72, 72, 0) 15%, #FF4848 88%);
  }

  &__glow-bar {
    position: absolute;
    left: 56px;
    top: 1px;
    bottom: 1px;
    width: 2px;
    background: linear-gradient(180deg, transparent 0%, rgba(255, 72, 72, 0.8) 50%, transparent 100%);
  }
}

.alert-list__tooltip {
  position: fixed;
  transform: translateY(calc(-100% - 6px));
  padding: 4px 10px;
  background: rgba(5, 25, 49, 0.95);
  border: 1px solid $color-border;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  color: $color-text-1;
  font-size: $font-size-xxs;
  white-space: nowrap;
  pointer-events: none;
  z-index: 9999;
}

.alert-status-menu {
  position: fixed;
  min-width: 111px;
  background: rgba(5, 25, 49, 0.95);
  border: 1px solid $color-border;
  border-radius: 4px;
  box-shadow: $shadow-panel;
  backdrop-filter: blur(12px);
  z-index: 9999;
  padding: 4px 0;

  &__item {
    width: 100%;
    padding: 6px 12px;
    border: 0;
    background: transparent;
    color: $color-text-2;
    font-size: $font-size-xs;
    font-family: $font-body;
    text-align: left;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;

    &:hover {
      background: rgba(0, 174, 255, 0.12);
      color: $color-text-1;
    }

    &--active {
      background: rgba(77, 242, 255, 0.18);
      color: $color-primary-bright;
    }
  }
}

@keyframes alert-scan {
  0%   { transform: translateY(0); }
  100% { transform: translateY(100px); }
}

@media (prefers-reduced-motion: reduce) {
  .alert-list__thumb-scan { animation: none; }
}
</style>
