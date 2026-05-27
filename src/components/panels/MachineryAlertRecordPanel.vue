<template>
  <BasePanel class="mach-record" title="机房告警记录">
    <!-- 工具栏 -->
    <div class="mach-record__toolbar">
      <label class="mach-record__search">
        <svg class="mach-record__search-icon" viewBox="0 0 16 16" fill="none">
          <circle cx="6.5" cy="6.5" r="5" stroke="#00AEFF" stroke-width="1.2"/>
          <path d="M10.5 10.5L14 14" stroke="#00AEFF" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
        <input
          v-model="keyword"
          class="mach-record__search-input"
          type="text"
          placeholder="请输入关键词搜索"
        />
      </label>

      <div class="mach-record__select" @click="toggleLevelMenu">
        <span class="mach-record__select-text">{{ levelLabel }}</span>
        <svg class="mach-record__select-arrow" viewBox="0 0 10 6" fill="none">
          <path d="M1 1L5 5L9 1" stroke="#00AEFF" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
      </div>

      <DatePicker v-model="date" />
    </div>

    <!-- 表格 -->
    <div class="mach-record__table">
      <div class="mach-record__scroll">
        <div class="mach-record__thead">
          <div class="mach-record__tr mach-record__tr--head">
            <span>告警名称</span>
            <span>设备名称</span>
            <span>告警级别</span>
            <span>告警时间</span>
            <span>消失时间</span>
          </div>
        </div>
        <div class="mach-record__tbody">
          <div
            v-for="row in pagedRows"
            :key="row.id"
            class="mach-record__tr"
            :class="{ 'mach-record__tr--selected': row.id === selectedId }"
            @click="clickRow(row)"
          >
            <span class="mach-record__cell--ellipsis" :title="row.name">{{ row.name }}</span>
            <span class="mach-record__cell--ellipsis" :title="row.device">{{ row.device }}</span>
            <span>
              <span class="mach-record__level-tag" :class="`mach-record__level-tag--${row.level}`">{{ levelText[row.level] }}</span>
            </span>
            <span class="mach-record__cell--time" :title="row.alertTime">{{ shortTime(row.alertTime) }}</span>
            <span class="mach-record__cell--time" :title="row.clearTime">{{ shortTime(row.clearTime) }}</span>
          </div>
          <div v-if="pagedRows.length === 0" class="mach-record__empty">暂无数据</div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="mach-record__pagination">
      <button class="mach-record__page-btn" :disabled="page === 1" @click="page--">
        <svg viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8L10 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      </button>
      <button
        v-for="p in displayedPages"
        :key="p"
        class="mach-record__page-btn"
        :class="{ 'mach-record__page-btn--active': p === page }"
        @click="page = p"
      >{{ p }}</button>
      <button class="mach-record__page-btn" :disabled="page === totalPages" @click="page++">
        <svg viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      </button>
      <span class="mach-record__page-info">共 {{ filteredRows.length }} 条</span>
    </div>

    <!-- 级别下拉 -->
    <Teleport to="body">
      <div v-if="levelMenuOpen" class="mach-level-menu" :style="levelMenuStyle" @click.stop>
        <button
          v-for="opt in levelOptions"
          :key="opt.value"
          class="mach-level-menu__item"
          :class="{ 'mach-level-menu__item--active': levelFilter === opt.value }"
          type="button"
          @click="selectLevel(opt.value)"
        >{{ opt.label }}</button>
      </div>
    </Teleport>
  </BasePanel>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import BasePanel from '@/components/common/BasePanel.vue'
import DatePicker from '@/components/common/DatePicker.vue'

type Level = 'urgent' | 'important' | 'normal' | 'hint'

interface AlertRow {
  id: number
  name: string
  device: string
  level: Level
  alertTime: string
  clearTime: string
}

const emit = defineEmits<{
  'select-device-type': [type: string | null]
}>()

const levelText: Record<Level, string> = { urgent: '紧急', important: '重要', normal: '一般', hint: '提示' }

const levelOptions = [
  { value: 'all',       label: '告警级别' },
  { value: 'urgent',    label: '紧急' },
  { value: 'important', label: '重要' },
  { value: 'normal',    label: '一般' },
  { value: 'hint',      label: '提示' },
] as const
type LevelFilter = typeof levelOptions[number]['value']

const rows: AlertRow[] = [
  { id: 1,  name: '烟感告警1', device: '烟感探测器', level: 'urgent',    alertTime: '2022/06/28 09:24:46', clearTime: '2022/06/28 09:30:12' },
  { id: 2,  name: '烟感告警1', device: '烟感探测器', level: 'urgent',    alertTime: '2022/06/28 09:24:46', clearTime: '2022/06/28 09:30:12' },
  { id: 3,  name: '温度异常',  device: '温湿度传感器', level: 'important', alertTime: '2022/06/28 10:05:00', clearTime: '2022/06/28 10:20:33' },
  { id: 4,  name: '温度异常',  device: '温湿度传感器', level: 'important', alertTime: '2022/06/28 10:05:00', clearTime: '2022/06/28 10:20:33' },
  { id: 5,  name: '湿度超标',  device: '温湿度传感器', level: 'normal',    alertTime: '2022/06/28 11:00:00', clearTime: '2022/06/28 11:15:00' },
  { id: 6,  name: '湿度超标',  device: '温湿度传感器', level: 'normal',    alertTime: '2022/06/28 11:00:00', clearTime: '2022/06/28 11:15:00' },
  { id: 7,  name: '设备掉线',  device: 'UPS电源',     level: 'hint',      alertTime: '2022/06/28 13:00:00', clearTime: '2022/06/28 13:05:00' },
  { id: 8,  name: '设备掉线',  device: 'UPS电源',     level: 'hint',      alertTime: '2022/06/28 13:00:00', clearTime: '2022/06/28 13:05:00' },
  { id: 9,  name: '烟感告警2', device: '烟感探测器', level: 'urgent',    alertTime: '2022/06/28 14:10:00', clearTime: '2022/06/28 14:25:00' },
  { id: 10, name: '温度异常2', device: '精密空调',    level: 'important', alertTime: '2022/06/28 15:30:00', clearTime: '2022/06/28 15:50:00' },
]

const keyword     = ref('')
const date        = ref('2026-4-20')
const levelFilter = ref<LevelFilter>('all')
const levelMenuOpen = ref(false)
const levelMenuPos  = ref({ top: 0, left: 0 })
const page          = ref(1)
const pageSize      = 4
const selectedId    = ref<number | null>(null)

const deviceTypeMap: Record<string, string> = {
  '烟感探测器': 'smoke',
  '温湿度传感器': 'temp',
  'UPS电源': 'ups',
  '精密空调': 'ac',
}

function clickRow(row: AlertRow) {
  if (selectedId.value === row.id) {
    selectedId.value = null
    emit('select-device-type', null)
  } else {
    selectedId.value = row.id
    emit('select-device-type', deviceTypeMap[row.device] ?? null)
  }
}

const levelLabel = computed(() => levelOptions.find(o => o.value === levelFilter.value)?.label ?? '告警级别')

const levelMenuStyle = computed(() => ({
  top: `${levelMenuPos.value.top}px`,
  left: `${levelMenuPos.value.left}px`,
  transform: 'scale(var(--app-scale, 1))',
  transformOrigin: 'top left',
}))

const filteredRows = computed(() => {
  let list = rows
  if (levelFilter.value !== 'all') list = list.filter(r => r.level === levelFilter.value)
  if (keyword.value.trim()) {
    const kw = keyword.value.trim().toLowerCase()
    list = list.filter(r => r.name.toLowerCase().includes(kw) || r.device.toLowerCase().includes(kw))
  }
  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / pageSize)))

const displayedPages = computed(() => {
  const total = totalPages.value
  const cur   = page.value
  const half  = 2
  let start = Math.max(1, cur - half)
  let end   = Math.min(total, start + 4)
  start = Math.max(1, end - 4)
  const pages: number[] = []
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

const pagedRows = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredRows.value.slice(start, start + pageSize)
})

function toggleLevelMenu(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  levelMenuPos.value = { top: rect.bottom + 4, left: rect.left }
  levelMenuOpen.value = !levelMenuOpen.value
}

function selectLevel(value: LevelFilter) {
  levelFilter.value = value
  levelMenuOpen.value = false
  page.value = 1
}

function onDocClick(e: MouseEvent) {
  if (!levelMenuOpen.value) return
  const menu = document.querySelector('.mach-level-menu')
  const target = e.target as Node
  if (menu?.contains(target)) return
  if ((target as HTMLElement).closest?.('.mach-record__select')) return
  levelMenuOpen.value = false
}

function shortTime(t: string) {
  const m = t.match(/\d{4}\/(\d{2}\/\d{2}) (\d{2}:\d{2})/)
  return m ? `${m[1]} ${m[2]}` : t
}

onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))
</script>

<style lang="scss" scoped>
.mach-record {
  gap: 10px;
  padding-bottom: 16px;

  &__toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  &__search {
    flex: 1;
    height: 34px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 10px;
    background: rgba(8,39,76,0.6);
    border: 1px solid rgba(0,174,255,0.4);
    border-radius: 4px;
    cursor: text;
    transition: background 0.2s ease;

    &:hover { background: rgba(8,39,76,0.8); }
  }

  &__search-icon { width: 14px; height: 14px; flex-shrink: 0; }

  &__search-input {
    flex: 1;
    background: transparent;
    border: 0;
    outline: 0;
    font-size: $font-size-xs;
    color: $color-text-1;
    font-family: $font-body;

    &::placeholder { color: $color-text-1; }
  }

  &__select {
    height: 34px;
    width: 90px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    background: rgba(8,39,76,0.6);
    border: 1px solid rgba(0,174,255,0.4);
    border-radius: 4px;
    cursor: pointer;
    flex-shrink: 0;
    transition: background 0.2s ease;

    &:hover { background: rgba(8,39,76,0.8); }
  }

  &__select-text { font-size: $font-size-xs; color: $color-text-1; }
  &__select-arrow { width: 10px; height: 6px; }

  // 表格
  &__table {
    overflow: hidden;
  }

  &__scroll {
    width: 100%;
    height: 200px; // 表头 40px + 4行 × 40px
    overflow: auto;

    &::-webkit-scrollbar { width: 4px; height: 4px; }
    &::-webkit-scrollbar-thumb { background: transparent; border-radius: 2px; transition: background 0.2s; }
    &::-webkit-scrollbar-corner { background: transparent; }
    &:hover::-webkit-scrollbar-thumb { background: rgba(0,174,255,0.4); }
  }

  &__thead {
    position: sticky;
    top: 0;
    z-index: 1;
    background: linear-gradient(89deg, rgba(0,174,255,0.18) 2%, rgba(0,174,255,0) 98%);
    border-bottom: 1px solid $color-line;
    border-radius: $radius-sm $radius-sm 0 0;
  }

  &__tbody {}

  &__tr {
    display: grid;
    grid-template-columns: 84px 84px 64px 90px 90px;
    min-width: 436px;
    height: 40px;
    align-items: center;
    padding: 0 12px;
    font-size: $font-size-xxs;
    color: $color-text-2;
    border-bottom: 1px solid rgba(0,174,255,0.06);
    transition: background 0.15s;

    &--head {
      color: $color-text-1;
      font-weight: 500;
      font-size: $font-size-xs;
      border-bottom: 0;
    }

    &:nth-child(odd):not(&--head) { background: rgba(0,174,255,0.04); }
    &:hover:not(&--head) {
      background: rgba(0,174,255,0.14);
      color: $color-text-1;
      box-shadow: inset 2px 0 0 $color-primary-bright;
    }

    &--selected {
      background: rgba(77, 242, 255, 0.12) !important;
      color: $color-text-1;
      box-shadow: inset 2px 0 0 $color-primary-bright;
    }
  }

  &__cell--ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__cell--time {
    font-size: 11px;
    white-space: nowrap;
  }

  &__level-tag {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 22px;
    padding: 0 6px;
    border-radius: $radius-sm;
    font-size: $font-size-xxs;
    white-space: nowrap;

    &--urgent    { background: rgba(255,68,68,0.12);  border: 1px solid rgba(255,68,68,0.45);  color: #FF4444; }
    &--important { background: rgba(255,140,0,0.12);  border: 1px solid rgba(255,140,0,0.45);  color: #FF8C00; }
    &--normal    { background: rgba(0,153,255,0.12);  border: 1px solid rgba(0,153,255,0.45);  color: #0099FF; }
    &--hint      { background: rgba(34,197,94,0.12);  border: 1px solid rgba(34,197,94,0.45);  color: #22C55E; }
  }

  &__empty {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $color-text-3;
    font-size: $font-size-xs;
  }

  // 分页
  &__pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    flex-shrink: 0;
    padding-top: 4px;
  }

  &__page-btn {
    min-width: 28px;
    height: 28px;
    padding: 0 6px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(8,39,76,0.6);
    border: 1px solid $color-border;
    border-radius: 4px;
    color: $color-text-2;
    font-size: $font-size-xxs;
    font-family: $font-body;
    cursor: pointer;
    transition: border-color 0.18s, color 0.18s;

    svg { width: 14px; height: 14px; }

    &:hover:not(:disabled) { border-color: $color-primary; color: $color-text-1; }
    &:disabled { opacity: 0.35; cursor: default; }

    &--active {
      background: $color-primary;
      border-color: $color-primary;
      color: #fff;
    }
  }

  &__page-info {
    font-size: $font-size-xxs;
    color: $color-primary;
    margin-left: 8px;
  }
}

.mach-level-menu {
  position: fixed;
  min-width: 100px;
  background: rgba(5,25,49,0.95);
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

    &:hover { background: rgba(0,174,255,0.12); color: $color-text-1; }
    &--active { background: rgba(77,242,255,0.18); color: $color-primary-bright; }
  }
}
</style>
