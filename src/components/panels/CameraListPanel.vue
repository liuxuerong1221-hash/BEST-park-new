<template>
  <BasePanel class="camera-list" title="监控设备列表">
    <!-- 统计栏 -->
    <div class="camera-list__stats">
      <div class="stat-card stat-card--online">
        <IconGateOnlineNew :size="56" />
        <div class="stat-card__info">
          <span class="stat-card__num stat-card__num--cool">{{ onlineCount }}</span>
          <span class="stat-card__label">在线(台)</span>
        </div>
      </div>
      <div class="stat-card stat-card--offline">
        <IconGateOfflineNew :size="56" />
        <div class="stat-card__info">
          <span class="stat-card__num stat-card__num--warm">{{ offlineCount }}</span>
          <span class="stat-card__label">离线(台)</span>
        </div>
      </div>
    </div>

    <!-- 搜索 + 筛选 -->
    <div class="camera-list__toolbar">
      <label class="search-input">
        <input v-model="keyword" class="search-input__input" placeholder="请输入关键词搜索" />
        <svg class="search-input__icon" viewBox="0 0 18 18" fill="none">
          <circle cx="8" cy="8" r="5.5" stroke="#00AEFF" stroke-width="1.4"/>
          <path d="M12.5 12.5L16 16" stroke="#00AEFF" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
      </label>

      <div class="filter-select" @click="toggleKeyFilter">
        <span class="filter-select__text">{{ keyFilterLabel }}</span>
        <svg class="filter-select__caret" :class="{ 'filter-select__caret--open': keyFilterOpen }" viewBox="0 0 12 12" fill="none">
          <path d="M2 4.5L6 8.5L10 4.5" stroke="#00AEFF" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <ul v-if="keyFilterOpen" class="filter-select__menu" @click.stop>
          <li v-for="opt in keyFilterOptions" :key="opt.value"
              class="filter-select__option"
              :class="{ 'filter-select__option--active': keyFilter === opt.value }"
              @click="selectKeyFilter(opt.value)">{{ opt.label }}</li>
        </ul>
      </div>

      <div class="filter-select filter-select--sm" @click="toggleStatusFilter">
        <span class="filter-select__text">{{ statusFilterLabel }}</span>
        <svg class="filter-select__caret" :class="{ 'filter-select__caret--open': statusFilterOpen }" viewBox="0 0 12 12" fill="none">
          <path d="M2 4.5L6 8.5L10 4.5" stroke="#00AEFF" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <ul v-if="statusFilterOpen" class="filter-select__menu" @click.stop>
          <li v-for="opt in statusFilterOptions" :key="opt.value"
              class="filter-select__option"
              :class="{ 'filter-select__option--active': statusFilter === opt.value }"
              @click="selectStatusFilter(opt.value)">{{ opt.label }}</li>
        </ul>
      </div>
    </div>

    <!-- 表格 -->
    <div class="camera-list__table">
      <div class="camera-row camera-row--header">
        <span class="camera-row__name">设备名称</span>
        <span class="camera-row__type">设备类型</span>
        <span class="camera-row__location">所在位置</span>
        <span class="camera-row__status">状态</span>
        <span class="camera-row__key">加入重点监控</span>
      </div>

      <div class="camera-list__body">
        <div
          v-for="c in pagedList"
          :key="c.id"
          class="camera-row camera-row--selectable"
          :class="{ 'camera-row--selected': c.id === selectedId }"
          role="button"
          tabindex="0"
          @click="emit('select', c.id)"
          @keydown.enter.prevent="emit('select', c.id)"
          @keydown.space.prevent="emit('select', c.id)"
        >
          <span class="camera-row__name">{{ c.name }}</span>
          <span class="camera-row__type">{{ c.type }}</span>
          <span class="camera-row__location">{{ c.location }}</span>
          <span class="camera-row__status">
            <span class="status-dot" :class="`status-dot--${c.status}`" />
            {{ c.status === 'online' ? '在线' : '离线' }}
          </span>
          <span class="camera-row__key" @click.stop>
            <button
              class="toggle-btn"
              :class="{ 'toggle-btn--on': c.keyMonitor }"
              type="button"
              :aria-label="c.keyMonitor ? '取消重点监控' : '加入重点监控'"
              @click="toggleKeyMonitor(c.id)"
            >
              <span class="toggle-btn__thumb" />
            </button>
          </span>
        </div>
      </div>
    </div>

    <!-- 分页器 -->
    <div class="camera-list__pagination">
      <button class="page-btn page-btn--arrow" :disabled="currentPage === 1" @click="currentPage--">
        <svg viewBox="0 0 8 12" fill="none"><path d="M7 1L1 6L7 11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>

      <button
        v-for="p in displayedPages"
        :key="p"
        class="page-btn"
        :class="{ 'page-btn--active': p === currentPage }"
        @click="currentPage = p"
      >{{ p }}</button>

      <button class="page-btn page-btn--arrow" :disabled="currentPage === totalPages" @click="currentPage++">
        <svg viewBox="0 0 8 12" fill="none"><path d="M1 1L7 6L1 11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>

      <div class="filter-select filter-select--page-size" @click="togglePageSize">
        <span class="filter-select__text">{{ pageSize }}条/页</span>
        <svg class="filter-select__caret" :class="{ 'filter-select__caret--open': pageSizeOpen }" viewBox="0 0 12 12" fill="none">
          <path d="M2 4.5L6 8.5L10 4.5" stroke="#00AEFF" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <ul v-if="pageSizeOpen" class="filter-select__menu filter-select__menu--up" @click.stop>
          <li v-for="s in pageSizeOptions" :key="s"
              class="filter-select__option"
              :class="{ 'filter-select__option--active': pageSize === s }"
              @click="selectPageSize(s)">{{ s }}条/页</li>
        </ul>
      </div>

      <span class="page-jump">
        跳至
        <input v-model.number="jumpInput" class="page-jump__input" type="number" min="1" :max="totalPages" @keydown.enter="doJump" />
        页
      </span>
    </div>
  </BasePanel>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BasePanel from '@/components/common/BasePanel.vue'
import IconGateOnlineNew from '@/components/icons/IconGateOnlineNew.vue'
import IconGateOfflineNew from '@/components/icons/IconGateOfflineNew.vue'

type CameraStatus = 'online' | 'offline'
type CameraType = '枪机' | '球机' | '半球'

interface Camera {
  id: number
  name: string
  type: CameraType
  location: string
  ip: string
  status: CameraStatus
  keyMonitor: boolean
  x: number
  y: number
}

const props = withDefaults(defineProps<{
  cameras?: Camera[]
  selectedId?: number
}>(), {
  cameras: () => [
    { id: 1,  name: '一楼监控1-1',    type: '半球', location: '一楼北侧',      ip: '192.168.1.1',   status: 'online',  keyMonitor: true,  x: 200, y: 180 },
    { id: 2,  name: '一楼监控1-2',    type: '半球', location: '一楼南侧',      ip: '192.168.1.2',   status: 'online',  keyMonitor: true,  x: 260, y: 210 },
    { id: 3,  name: '二楼监控2-1',    type: '半球', location: '二楼北侧',      ip: '192.168.1.3',   status: 'online',  keyMonitor: true,  x: 320, y: 160 },
    { id: 4,  name: '二楼监控2-2',    type: '半球', location: '二楼南侧',      ip: '192.168.1.4',   status: 'online',  keyMonitor: true,  x: 380, y: 190 },
    { id: 5,  name: '教学楼415监控',  type: '半球', location: '教学楼415教室', ip: '192.168.1.5',   status: 'online',  keyMonitor: true,  x: 440, y: 230 },
    { id: 6,  name: '教学楼415监控',  type: '半球', location: '教学楼415教室', ip: '192.168.1.6',   status: 'online',  keyMonitor: true,  x: 500, y: 200 },
    { id: 7,  name: '教学楼415监控',  type: '半球', location: '教学楼415教室', ip: '192.168.1.7',   status: 'online',  keyMonitor: true,  x: 560, y: 170 },
    { id: 8,  name: '教学楼415监控',  type: '半球', location: '教学楼415教室', ip: '192.168.1.8',   status: 'online',  keyMonitor: true,  x: 610, y: 250 },
    { id: 9,  name: '教学楼415监控',  type: '半球', location: '教学楼415教室', ip: '192.168.1.9',   status: 'online',  keyMonitor: true,  x: 660, y: 300 },
    { id: 10, name: '教学楼415监控',  type: '半球', location: '教学楼415教室', ip: '192.168.1.10',  status: 'online',  keyMonitor: false, x: 700, y: 350 },
    { id: 11, name: '三楼监控3-1',    type: '枪机', location: '三楼走廊',      ip: '192.168.1.11',  status: 'online',  keyMonitor: false, x: 350, y: 280 },
    { id: 12, name: '三楼监控3-2',    type: '枪机', location: '三楼走廊',      ip: '192.168.1.12',  status: 'offline', keyMonitor: false, x: 410, y: 310 },
    { id: 13, name: '大门监控',        type: '球机', location: '正门入口',      ip: '192.168.1.13',  status: 'online',  keyMonitor: true,  x: 230, y: 400 },
    { id: 14, name: '停车场监控A',     type: '枪机', location: '地下停车场A区', ip: '192.168.1.14',  status: 'online',  keyMonitor: false, x: 280, y: 450 },
    { id: 15, name: '停车场监控B',     type: '枪机', location: '地下停车场B区', ip: '192.168.1.15',  status: 'offline', keyMonitor: false, x: 330, y: 480 },
    { id: 16, name: '食堂监控',        type: '半球', location: '食堂一楼',      ip: '192.168.1.16',  status: 'online',  keyMonitor: false, x: 500, y: 420 },
    { id: 17, name: '图书馆监控1',     type: '半球', location: '图书馆入口',    ip: '192.168.1.17',  status: 'online',  keyMonitor: true,  x: 580, y: 380 },
    { id: 18, name: '图书馆监控2',     type: '半球', location: '图书馆二楼',    ip: '192.168.1.18',  status: 'online',  keyMonitor: false, x: 640, y: 420 },
    { id: 19, name: '实验楼监控1',     type: '枪机', location: '实验楼入口',    ip: '192.168.1.19',  status: 'online',  keyMonitor: false, x: 720, y: 290 },
    { id: 20, name: '实验楼监控2',     type: '球机', location: '实验楼天台',    ip: '192.168.1.20',  status: 'online',  keyMonitor: true,  x: 760, y: 240 },
  ],
  selectedId: undefined,
})

const emit = defineEmits<{
  select: [id: number]
  visibleChange: [ids: number[]]
}>()

const cameraList = ref<Camera[]>(props.cameras.map(c => ({ ...c })))

watch(() => props.cameras, val => {
  cameraList.value = val.map(c => ({ ...c }))
}, { deep: true })

const onlineCount = computed(() => cameraList.value.filter(c => c.status === 'online').length)
const offlineCount = computed(() => cameraList.value.filter(c => c.status === 'offline').length)

// 搜索
const keyword = ref('')

// 重点监控筛选
const keyFilterOpen = ref(false)
const keyFilter = ref<'all' | 'key' | 'normal'>('all')
const keyFilterOptions = [
  { value: 'all',    label: '重点监控' },
  { value: 'key',    label: '已加入' },
  { value: 'normal', label: '未加入' },
] as const
const keyFilterLabel = computed(() => keyFilterOptions.find(o => o.value === keyFilter.value)?.label ?? '重点监控')
function toggleKeyFilter() { keyFilterOpen.value = !keyFilterOpen.value; statusFilterOpen.value = false }
function selectKeyFilter(v: typeof keyFilter.value) { keyFilter.value = v; keyFilterOpen.value = false; currentPage.value = 1 }

// 状态筛选
const statusFilterOpen = ref(false)
const statusFilter = ref<'all' | CameraStatus>('all')
const statusFilterOptions = [
  { value: 'all',     label: '状态' },
  { value: 'online',  label: '在线' },
  { value: 'offline', label: '离线' },
] as const
const statusFilterLabel = computed(() => statusFilterOptions.find(o => o.value === statusFilter.value)?.label ?? '状态')
function toggleStatusFilter() { statusFilterOpen.value = !statusFilterOpen.value; keyFilterOpen.value = false }
function selectStatusFilter(v: typeof statusFilter.value) { statusFilter.value = v; statusFilterOpen.value = false; currentPage.value = 1 }

// 过滤后列表
const filteredAll = computed(() => {
  let list = cameraList.value
  if (keyword.value.trim()) {
    const k = keyword.value.trim()
    list = list.filter(c => c.name.includes(k) || c.location.includes(k) || c.type.includes(k))
  }
  if (statusFilter.value !== 'all') list = list.filter(c => c.status === statusFilter.value)
  if (keyFilter.value === 'key') list = list.filter(c => c.keyMonitor)
  if (keyFilter.value === 'normal') list = list.filter(c => !c.keyMonitor)
  return list
})

// 分页
const pageSize = ref(8)
const pageSizeOptions = [8, 10, 15, 20]
const pageSizeOpen = ref(false)
const currentPage = ref(1)
const totalPages = computed(() => Math.max(1, Math.ceil(filteredAll.value.length / pageSize.value)))
const pagedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredAll.value.slice(start, start + pageSize.value)
})

const displayedPages = computed(() => {
  const total = totalPages.value
  const cur = currentPage.value
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
  const start = Math.max(1, Math.min(cur - 2, total - 4))
  return Array.from({ length: 5 }, (_, i) => start + i)
})

function togglePageSize() { pageSizeOpen.value = !pageSizeOpen.value }
function selectPageSize(s: number) { pageSize.value = s; pageSizeOpen.value = false; currentPage.value = 1 }

const jumpInput = ref<number | null>(null)
function doJump() {
  if (jumpInput.value && jumpInput.value >= 1 && jumpInput.value <= totalPages.value) {
    currentPage.value = jumpInput.value
  }
  jumpInput.value = null
}

// 重点监控开关
function toggleKeyMonitor(id: number) {
  const cam = cameraList.value.find(c => c.id === id)
  if (cam) cam.keyMonitor = !cam.keyMonitor
}

watch(pagedList, list => {
  emit('visibleChange', list.map(c => c.id))
}, { immediate: true })
</script>

<style lang="scss" scoped>
.camera-list {
  flex: 1;
  min-height: 0;

  &__stats {
    display: flex;
    align-items: stretch;
    gap: $spacing-sm;
    padding: $spacing-xs 0 $spacing-sm;
    flex-shrink: 0;
  }

  &__toolbar {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    padding: 0 0 $spacing-sm;
    flex-shrink: 0;
  }

  &__table {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  &__body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding-right: 2px;

    &::-webkit-scrollbar { width: 4px; }
    &::-webkit-scrollbar-thumb {
      background: rgba(0, 174, 255, 0.4);
      border-radius: 2px;
    }
  }

  &__pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: $spacing-sm 0 $spacing-xs;
    flex-shrink: 0;
    flex-wrap: nowrap;
  }
}

// 统计卡
.stat-card {
  flex: 1;
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-xs $spacing-sm;
  border-radius: $radius-sm;
  background: linear-gradient(135deg, rgba(0, 60, 120, 0.30) 0%, rgba(0, 30, 70, 0.18) 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 0; height: 0;
    border-left: 8px solid $color-primary;
    border-bottom: 8px solid transparent;
  }

  &--online { box-shadow: inset 0 0 12px rgba(68, 181, 242, 0.16); }
  &--offline { box-shadow: inset 0 0 12px rgba(249, 185, 51, 0.16); }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  &__num {
    font-family: $font-number;
    font-size: 22px;
    font-weight: bold;
    line-height: 1;

    &--cool { color: #A9E1FF; text-shadow: 0 0 10px rgba(68, 181, 242, 0.55); }
    &--warm { color: #FFE48A; text-shadow: 0 0 10px rgba(249, 185, 51, 0.55); }
  }

  &__label {
    font-size: $font-size-xxs;
    color: $color-text-2;
    white-space: nowrap;
  }
}

// 搜索框
.search-input {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: 7px 10px;
  background: rgba(0, 174, 255, 0.06);
  border: 1px solid $color-border;
  border-radius: $radius-sm;

  &__input {
    flex: 1;
    min-width: 0;
    background: transparent;
    border: 0;
    outline: 0;
    color: $color-text-1;
    font-size: $font-size-xs;
    font-family: inherit;

    &::placeholder { color: rgba(209, 237, 255, 0.45); }
  }

  &__icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
}

// 筛选下拉
.filter-select {
  position: relative;
  width: 100px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  background: rgba(0, 174, 255, 0.06);
  border: 1px solid $color-border;
  border-radius: $radius-sm;
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;

  &--sm { width: 72px; }

  &--page-size {
    width: 84px;
    height: 28px;
    font-size: $font-size-xs;
  }

  &__text {
    font-size: $font-size-xs;
    color: $color-text-2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__caret {
    width: 12px;
    height: 12px;
    flex-shrink: 0;
    transition: transform 0.18s ease;

    &--open { transform: rotate(180deg); }
  }

  &__menu {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    margin: 0;
    padding: 4px 0;
    list-style: none;
    background: rgba(10, 29, 53, 0.95);
    border: 1px solid $color-border;
    border-radius: $radius-sm;
    z-index: 20;
    box-shadow: $shadow-panel;

    &--up {
      top: auto;
      bottom: calc(100% + 4px);
    }
  }

  &__option {
    padding: 6px 10px;
    font-size: $font-size-xs;
    color: $color-text-2;
    cursor: pointer;
    white-space: nowrap;

    &:hover { background: rgba(0, 174, 255, 0.18); color: $color-text-1; }
    &--active { color: $color-primary-bright; }
  }
}

// 表格行
.camera-row {
  display: grid;
  grid-template-columns: 1.4fr 0.8fr 1.4fr 0.7fr 1fr;
  align-items: center;
  height: 40px;
  padding: 0 8px 0 12px;
  font-size: $font-size-xs;
  color: $color-text-2;

  &--header {
    color: $color-text-1;
    background: linear-gradient(89deg, rgba(0, 174, 255, 0.18) 2%, rgba(0, 174, 255, 0) 98%);
    border-bottom: 1px solid $color-line;
    flex-shrink: 0;
  }

  &:not(&--header):nth-child(odd) { background: rgba(0, 174, 255, 0.04); }

  &--selectable {
    cursor: pointer;
    outline: none;
    transition: background 0.18s ease, color 0.18s ease, box-shadow 0.18s ease;

    &:hover, &:focus-visible {
      color: $color-text-1;
      background: rgba(0, 174, 255, 0.14);
      box-shadow: inset 2px 0 0 $color-primary-bright;
    }
  }

  &--selected {
    color: $color-text-1;
    background: linear-gradient(89deg, rgba(0, 174, 255, 0.28) 0%, rgba(0, 174, 255, 0.08) 100%) !important;
    box-shadow: inset 2px 0 0 $color-primary-bright, inset 0 0 12px rgba(77, 242, 255, 0.16);
  }

  &__name, &__type, &__location, &__status { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  &__status { display: flex; align-items: center; gap: 5px; }
  &__key { display: flex; align-items: center; justify-content: center; }
}

// 状态点
.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;

  &--online  { background: $color-success; box-shadow: 0 0 4px $color-success; }
  &--offline { background: $color-warning;  box-shadow: 0 0 4px $color-warning; }
}

// 开关按钮
.toggle-btn {
  position: relative;
  width: 42px;
  height: 22px;
  border-radius: 11px;
  border: 0;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.15);
  transition: background 0.2s ease;
  flex-shrink: 0;
  padding: 0;

  &--on {
    background: linear-gradient(90deg, #0077CC 0%, #00AEFF 100%);
  }

  &__thumb {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #fff;
    transition: transform 0.2s ease;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  }

  &--on &__thumb {
    transform: translateX(20px);
  }
}

// 分页按钮
.page-btn {
  min-width: 26px;
  height: 26px;
  padding: 0 4px;
  background: rgba(0, 174, 255, 0.06);
  border: 1px solid $color-border;
  border-radius: $radius-sm;
  color: $color-text-2;
  font-size: $font-size-xs;
  font-family: $font-number;
  cursor: pointer;
  outline: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.18s ease;

  svg { width: 8px; height: 12px; }

  &:hover:not(:disabled) {
    background: rgba(0, 174, 255, 0.14);
    color: $color-text-1;
    border-color: $color-primary;
  }

  &:disabled { opacity: 0.4; cursor: not-allowed; }

  &--active {
    background: $color-primary !important;
    border-color: $color-primary !important;
    color: #fff !important;
  }

  &--arrow { color: #00AEFF; border-color: rgba(0, 174, 255, 0.4); }
}

// 跳至
.page-jump {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: $font-size-xs;
  color: $color-text-2;
  white-space: nowrap;

  &__input {
    width: 32px;
    height: 26px;
    background: rgba(0, 174, 255, 0.06);
    border: 1px solid $color-border;
    border-radius: $radius-sm;
    color: $color-text-1;
    font-size: $font-size-xs;
    font-family: $font-number;
    text-align: center;
    outline: none;
    padding: 0 2px;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button { -webkit-appearance: none; }

    &:focus { border-color: $color-primary; }
  }
}
</style>
