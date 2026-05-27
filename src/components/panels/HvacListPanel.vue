<template>
  <BasePanel class="hvac-list" title="楼宇设备列表">
    <div class="hvac-list__toolbar">
      <label class="search-input search-input--short">
        <input v-model="keyword" class="search-input__input" placeholder="搜索设备" />
        <svg class="search-input__icon" viewBox="0 0 18 18" fill="none">
          <circle cx="8" cy="8" r="5.5" stroke="#4DF2FF" stroke-width="1.4"/>
          <path d="M12.5 12.5L16 16" stroke="#4DF2FF" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
      </label>

      <div ref="typeFilterRef" class="filter-select" @click.stop="toggleTypeFilter">
        <span class="filter-select__text">{{ typeFilterLabel }}</span>
        <svg class="filter-select__caret" :class="{ 'filter-select__caret--open': typeFilterOpen }"
             viewBox="0 0 12 12" fill="none">
          <path d="M2 4.5L6 8.5L10 4.5" stroke="#4DF2FF" stroke-width="1.4"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>

      <div ref="statusFilterRef" class="filter-select" @click.stop="toggleStatusFilter">
        <span class="filter-select__text">{{ statusFilterLabel }}</span>
        <svg class="filter-select__caret" :class="{ 'filter-select__caret--open': statusFilterOpen }"
             viewBox="0 0 12 12" fill="none">
          <path d="M2 4.5L6 8.5L10 4.5" stroke="#4DF2FF" stroke-width="1.4"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>

    <!-- 类型筛选菜单 — Teleport 到 body 避免被 overflow:hidden 裁剪 -->
    <Teleport to="body">
      <ul v-if="typeFilterOpen" class="filter-menu-float"
          :style="typeMenuStyle" @click.stop>
        <li v-for="opt in typeFilterOptions" :key="opt.value"
            class="filter-menu-float__option"
            :class="{ 'filter-menu-float__option--active': typeFilter === opt.value }"
            @click.stop="selectTypeFilter(opt.value)">
          {{ opt.label }}
        </li>
      </ul>
      <ul v-if="statusFilterOpen" class="filter-menu-float"
          :style="statusMenuStyle" @click.stop>
        <li v-for="opt in statusFilterOptions" :key="opt.value"
            class="filter-menu-float__option"
            :class="{ 'filter-menu-float__option--active': statusFilter === opt.value }"
            @click.stop="selectStatusFilter(opt.value)">
          {{ opt.label }}
        </li>
      </ul>
    </Teleport>

    <div class="hvac-list__table">
      <div class="hvac-row hvac-row--header">
        <span class="hvac-row__name">设备名称</span>
        <span class="hvac-row__type">类型</span>
        <span class="hvac-row__location">位置</span>
        <span class="hvac-row__status">状态</span>
      </div>

      <div class="hvac-list__body">
        <div
          v-for="d in pageItems"
          :key="d.id"
          class="hvac-row hvac-row--selectable"
          :class="{ 'hvac-row--selected': d.id === selectedId }"
          role="button"
          tabindex="0"
          @click="emit('select', d.id)"
          @keydown.enter.prevent="emit('select', d.id)"
          @keydown.space.prevent="emit('select', d.id)"
        >
          <span class="hvac-row__name">{{ d.name }}</span>
          <span class="hvac-row__type">{{ TYPE_LABEL[d.type] }}</span>
          <span class="hvac-row__location">{{ d.location }}</span>
          <span class="hvac-row__status">
            <span class="status-badge" :class="`status-badge--${d.status}`">
              {{ d.status === 'online' ? '正常' : '故障' }}
            </span>
          </span>
        </div>
      </div>
    </div>

    <div class="hvac-list__pagination">
      <button class="pagination-btn" :disabled="currentPage === 1" @click="currentPage--">上一页</button>
      <span class="pagination-info">{{ currentPage }} / {{ totalPages || 1 }}</span>
      <button class="pagination-btn"
              :disabled="currentPage === totalPages || totalPages === 0"
              @click="currentPage++">下一页</button>
    </div>
  </BasePanel>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import BasePanel from '@/components/common/BasePanel.vue'

export type HvacType = 'air-conditioner' | 'fresh-air' | 'supply-air' | 'exhaust-air'
export type HvacStatus = 'online' | 'offline'

interface HvacDevice {
  id: number
  name: string
  type: HvacType
  location: string
  status: HvacStatus
  buildingId: number
}

const props = defineProps<{
  devices: HvacDevice[]
  selectedId?: number | null
  filterBuildingId?: number | null
}>()

const emit = defineEmits<{
  select: [id: number]
  visibleChange: [ids: number[]]
}>()

const TYPE_LABEL: Record<HvacType, string> = {
  'air-conditioner': '空调',
  'fresh-air': '新风机',
  'supply-air': '送风机',
  'exhaust-air': '排风机',
}

const keyword = ref('')

const typeFilterRef = ref<HTMLElement | null>(null)
const statusFilterRef = ref<HTMLElement | null>(null)
const typeMenuStyle = ref<Record<string, string>>({})
const statusMenuStyle = ref<Record<string, string>>({})

function calcMenuStyle(el: HTMLElement | null): Record<string, string> {
  if (!el) return {}
  const r = el.getBoundingClientRect()
  return {
    position: 'fixed',
    top: `${r.bottom + 4}px`,
    left: `${r.left}px`,
    minWidth: `${r.width}px`,
    zIndex: '99999',
  }
}

const typeFilter = ref<'all' | HvacType>('all')
const typeFilterOpen = ref(false)
const typeFilterOptions = [
  { value: 'all',              label: '全部类型' },
  { value: 'air-conditioner',  label: '空调' },
  { value: 'fresh-air',        label: '新风机' },
  { value: 'supply-air',       label: '送风机' },
  { value: 'exhaust-air',      label: '排风机' },
] as const
const typeFilterLabel = computed(() =>
  typeFilterOptions.find(o => o.value === typeFilter.value)?.label ?? '全部类型',
)
function toggleTypeFilter() {
  if (!typeFilterOpen.value) typeMenuStyle.value = calcMenuStyle(typeFilterRef.value)
  typeFilterOpen.value = !typeFilterOpen.value
  statusFilterOpen.value = false
}
function selectTypeFilter(v: 'all' | HvacType) {
  typeFilter.value = v
  typeFilterOpen.value = false
  currentPage.value = 1
}

const statusFilter = ref<'all' | HvacStatus>('all')
const statusFilterOpen = ref(false)
const statusFilterOptions = [
  { value: 'all',     label: '全部状态' },
  { value: 'online',  label: '正常' },
  { value: 'offline', label: '故障' },
] as const
const statusFilterLabel = computed(() =>
  statusFilterOptions.find(o => o.value === statusFilter.value)?.label ?? '全部状态',
)
function toggleStatusFilter() {
  if (!statusFilterOpen.value) statusMenuStyle.value = calcMenuStyle(statusFilterRef.value)
  statusFilterOpen.value = !statusFilterOpen.value
  typeFilterOpen.value = false
}
function selectStatusFilter(v: 'all' | HvacStatus) {
  statusFilter.value = v
  statusFilterOpen.value = false
  currentPage.value = 1
}

function closeAll() {
  typeFilterOpen.value = false
  statusFilterOpen.value = false
}

onMounted(() => document.addEventListener('click', closeAll))
onUnmounted(() => document.removeEventListener('click', closeAll))

watch(() => props.filterBuildingId, () => { currentPage.value = 1 })
watch(() => props.devices, () => { currentPage.value = 1 })
watch(keyword, () => { currentPage.value = 1 })

const filteredAll = computed(() => {
  let list = props.devices
  if (props.filterBuildingId != null) {
    list = list.filter(d => d.buildingId === props.filterBuildingId)
  }
  if (keyword.value.trim()) {
    const k = keyword.value.trim()
    list = list.filter(d => d.name.includes(k) || d.location.includes(k))
  }
  if (typeFilter.value !== 'all') {
    list = list.filter(d => d.type === typeFilter.value)
  }
  if (statusFilter.value !== 'all') {
    list = list.filter(d => d.status === statusFilter.value)
  }
  return list
})

const pageSize = 10
const currentPage = ref(1)
const totalPages = computed(() => Math.ceil(filteredAll.value.length / pageSize))
const pageItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredAll.value.slice(start, start + pageSize)
})

watch(pageItems, list => {
  emit('visibleChange', list.map(d => d.id))
}, { immediate: true })
</script>

<style lang="scss" scoped>
.hvac-list {
  flex: 1;
  min-height: 0;

  &__toolbar {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-xs 0 $spacing-sm;
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
    &::-webkit-scrollbar-thumb { background: rgba(0, 174, 255, 0.4); border-radius: 2px; }
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
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: 7px 10px;
  background: rgba(0, 174, 255, 0.06);
  border: 1px solid $color-border;
  border-radius: $radius-sm;

  &--short { flex: 0 0 100px; }

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
  width: auto;
  min-width: 90px;
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

  &__text { font-size: $font-size-xs; color: $color-text-2; white-space: nowrap; }
  &__caret {
    width: 12px;
    height: 12px;
    transition: transform 0.18s ease;
    &--open { transform: rotate(180deg); }
  }

}

.hvac-row {
  display: grid;
  grid-template-columns: 1.4fr 0.8fr 1.4fr 0.9fr;
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

  &__name, &__type, &__location { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
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
  &--offline { color: #FF4848; background: rgba(255, 72, 72, 0.12); }
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

<style lang="scss">
/* 非 scoped：Teleport 渲染在 body，需要全局样式 */
.filter-menu-float {
  position: fixed;
  margin: 0;
  padding: 4px 0;
  list-style: none;
  background: rgba(10, 29, 53, 0.97);
  border: 1px solid rgba(0, 174, 255, 0.35);
  border-radius: 4px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.55);

  &__option {
    padding: 6px 14px;
    font-size: 12px;
    color: rgba(209, 237, 255, 0.75);
    cursor: pointer;
    white-space: nowrap;

    &:hover { background: rgba(0, 174, 255, 0.18); color: #fff; }
    &--active { color: #4DF2FF; }
  }
}
</style>
