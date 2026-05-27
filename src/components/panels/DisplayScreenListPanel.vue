<template>
  <BasePanel class="dscreen-list" title="信息发布屏列表">
    <!-- 搜索 + 筛选 -->
    <div class="dscreen-list__toolbar">
      <label class="search-input">
        <input
          v-model="keyword"
          class="search-input__input"
          placeholder="请输入关键词搜索"
        />
        <svg class="search-input__icon" viewBox="0 0 18 18" fill="none">
          <circle cx="8" cy="8" r="5.5" stroke="#4DF2FF" stroke-width="1.4"/>
          <path d="M12.5 12.5L16 16" stroke="#4DF2FF" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
      </label>

      <div class="filter-select" @click="toggleBuildingFilter">
        <span class="filter-select__text">{{ buildingLabel }}</span>
        <svg class="filter-select__caret" :class="{ 'filter-select__caret--open': buildingOpen }"
             viewBox="0 0 12 12" fill="none">
          <path d="M2 4.5L6 8.5L10 4.5" stroke="#4DF2FF" stroke-width="1.4"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <ul v-if="buildingOpen" class="filter-select__menu" @click.stop>
          <li v-for="opt in buildingOptions" :key="opt.value"
              class="filter-select__option"
              :class="{ 'filter-select__option--active': buildingFilter === opt.value }"
              @click="selectBuilding(opt.value)">
            {{ opt.label }}
          </li>
        </ul>
      </div>

      <div class="filter-select" @click="toggleStatusFilter">
        <span class="filter-select__text">{{ statusLabel }}</span>
        <svg class="filter-select__caret" :class="{ 'filter-select__caret--open': statusOpen }"
             viewBox="0 0 12 12" fill="none">
          <path d="M2 4.5L6 8.5L10 4.5" stroke="#4DF2FF" stroke-width="1.4"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <ul v-if="statusOpen" class="filter-select__menu" @click.stop>
          <li v-for="opt in statusOptions" :key="opt.value"
              class="filter-select__option"
              :class="{ 'filter-select__option--active': statusFilter === opt.value }"
              @click="selectStatus(opt.value)">
            {{ opt.label }}
          </li>
        </ul>
      </div>
    </div>

    <!-- 表格 -->
    <div class="dscreen-list__table">
      <div class="dscreen-row dscreen-row--header">
        <span class="dscreen-row__name">设备名称</span>
        <span class="dscreen-row__location">位置</span>
        <span class="dscreen-row__status">状态</span>
      </div>

      <div class="dscreen-list__body">
        <div
          v-for="d in paged"
          :key="d.id"
          class="dscreen-row dscreen-row--selectable"
          :class="{ 'dscreen-row--selected': d.id === selectedId }"
          role="button"
          tabindex="0"
          @click="emit('select', d.id)"
          @keydown.enter.prevent="emit('select', d.id)"
          @keydown.space.prevent="emit('select', d.id)"
        >
          <span class="dscreen-row__name">{{ d.name }}</span>
          <span class="dscreen-row__location">{{ d.location }}</span>
          <span class="dscreen-row__status">
            <span class="status-badge" :class="`status-badge--${d.status}`">
              {{ d.status === 'online' ? '在线' : '离线' }}
            </span>
          </span>
        </div>
      </div>
    </div>

    <!-- 分页器 -->
    <div class="dscreen-list__pagination">
      <button
        class="pagination-btn"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        上一页
      </button>
      <span class="pagination-info">{{ currentPage }} / {{ totalPages || 1 }}</span>
      <button
        class="pagination-btn"
        :disabled="currentPage === totalPages || totalPages === 0"
        @click="currentPage++"
      >
        下一页
      </button>
    </div>
  </BasePanel>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BasePanel from '@/components/common/BasePanel.vue'

type DeviceStatus = 'online' | 'offline'

interface DisplayScreen {
  id: number
  name: string
  building: string
  location: string
  status: DeviceStatus
}

const props = defineProps<{
  devices: DisplayScreen[]
  selectedId?: number | null
}>()

const emit = defineEmits<{
  select: [id: number]
  visibleChange: [ids: number[]]
}>()

const keyword = ref('')

const buildingOpen = ref(false)
const buildingFilter = ref('all')
const buildingOptions = computed(() => {
  const buildings = [...new Set(props.devices.map(d => d.building))]
  return [{ value: 'all', label: '全部楼栋' }, ...buildings.map(b => ({ value: b, label: b }))]
})
const buildingLabel = computed(() =>
  buildingOptions.value.find(o => o.value === buildingFilter.value)?.label ?? '全部楼栋',
)
function toggleBuildingFilter() { buildingOpen.value = !buildingOpen.value }
function selectBuilding(v: string) {
  buildingFilter.value = v
  buildingOpen.value = false
  currentPage.value = 1
}

const statusOpen = ref(false)
const statusFilter = ref<'all' | DeviceStatus>('all')
const statusOptions = [
  { value: 'all', label: '全部状态' },
  { value: 'online', label: '在线' },
  { value: 'offline', label: '离线' },
] as const
const statusLabel = computed(() =>
  statusOptions.find(o => o.value === statusFilter.value)?.label ?? '全部状态',
)
function toggleStatusFilter() { statusOpen.value = !statusOpen.value }
function selectStatus(v: 'all' | DeviceStatus) {
  statusFilter.value = v
  statusOpen.value = false
  currentPage.value = 1
}

watch(keyword, () => { currentPage.value = 1 })

const filteredAll = computed(() => {
  let list = props.devices
  if (buildingFilter.value !== 'all') {
    list = list.filter(d => d.building === buildingFilter.value)
  }
  if (keyword.value.trim()) {
    const k = keyword.value.trim()
    list = list.filter(d => d.name.includes(k) || d.location.includes(k))
  }
  if (statusFilter.value !== 'all') {
    list = list.filter(d => d.status === statusFilter.value)
  }
  return list
})

const pageSize = 10
const currentPage = ref(1)
const totalPages = computed(() => Math.ceil(filteredAll.value.length / pageSize))
const paged = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredAll.value.slice(start, start + pageSize)
})

watch(paged, list => {
  emit('visibleChange', list.map(d => d.id))
}, { immediate: true })
</script>

<style lang="scss" scoped>
.dscreen-list {
  flex: 1;
  min-height: 0;

  &__toolbar {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-xs 0 $spacing-sm;
    flex-wrap: wrap;
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
    gap: $spacing-md;
    padding: $spacing-sm 0 $spacing-xs;
  }
}

.search-input {
  flex: 1;
  min-width: 120px;
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: 7px 10px;
  background: rgba(0, 174, 255, 0.06);
  border: 1px solid $color-border;
  border-radius: $radius-sm;

  &__input {
    flex: 1;
    background: transparent;
    border: 0;
    outline: 0;
    color: $color-text-1;
    font-size: $font-size-xs;
    font-family: inherit;

    &::placeholder { color: rgba(209, 237, 255, 0.45); }
  }

  &__icon { width: 16px; height: 16px; flex-shrink: 0; }
}

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

  &__text { font-size: $font-size-xs; color: $color-text-2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  &__caret {
    width: 12px; height: 12px;
    transition: transform 0.18s ease;
    flex-shrink: 0;
    &--open { transform: rotate(180deg); }
  }

  &__menu {
    position: absolute;
    top: calc(100% + 4px);
    left: 0; right: 0;
    margin: 0; padding: 4px 0;
    list-style: none;
    background: rgba(10, 29, 53, 0.95);
    border: 1px solid $color-border;
    border-radius: $radius-sm;
    z-index: 10;
    box-shadow: $shadow-panel;
  }

  &__option {
    padding: 6px 10px;
    font-size: $font-size-xs;
    color: $color-text-2;
    cursor: pointer;

    &:hover { background: rgba(0, 174, 255, 0.18); color: $color-text-1; }
    &--active { color: $color-primary-bright; }
  }
}

.dscreen-row {
  display: grid;
  grid-template-columns: 1.5fr 1.5fr 1fr;
  align-items: center;
  height: 40px;
  padding: 0 12px;
  font-size: $font-size-xs;
  color: $color-text-2;

  &--header {
    color: $color-text-1;
    background: linear-gradient(89deg, rgba(0, 174, 255, 0.18) 2%, rgba(0, 174, 255, 0) 98%);
    border-bottom: 1px solid $color-line;
  }

  &:not(&--header):nth-child(odd) {
    background: rgba(0, 174, 255, 0.04);
  }

  &--selectable {
    cursor: pointer;
    outline: none;
    transition: background 0.18s ease, color 0.18s ease, box-shadow 0.18s ease;

    &:hover,
    &:focus-visible {
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

  &__name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  &__location { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  &__status { text-align: left; }
}

.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 50px;
  height: 24px;
  padding: 0 8px;
  font-size: $font-size-xxs;
  border-radius: $radius-sm;
  border: 1px solid currentColor;

  &--online { color: $color-success; background: rgba(46, 208, 176, 0.12); }
  &--offline { color: $color-warning; background: rgba(249, 185, 51, 0.12); }
}

.pagination-btn {
  padding: 4px 12px;
  height: 28px;
  background: rgba(0, 174, 255, 0.06);
  border: 1px solid $color-border;
  border-radius: $radius-sm;
  color: $color-text-2;
  font-size: $font-size-xs;
  cursor: pointer;
  outline: none;
  transition: all 0.18s ease;

  &:hover:not(:disabled) {
    background: rgba(0, 174, 255, 0.14);
    color: $color-text-1;
    border-color: $color-primary;
  }

  &:disabled { opacity: 0.4; cursor: not-allowed; }
}

.pagination-info {
  font-size: $font-size-xs;
  color: $color-text-2;
  font-family: $font-number;
  min-width: 60px;
  text-align: center;
}
</style>
