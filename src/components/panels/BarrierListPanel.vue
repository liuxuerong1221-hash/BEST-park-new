<template>
  <BasePanel class="barrier-list" title="道闸设备列表">
    <!-- 搜索 + 筛选 -->
    <div class="barrier-list__toolbar">
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

      <div class="filter-select" @click="toggleFilter">
        <span class="filter-select__text">{{ filterLabel }}</span>
        <svg class="filter-select__caret" :class="{ 'filter-select__caret--open': filterOpen }"
             viewBox="0 0 12 12" fill="none">
          <path d="M2 4.5L6 8.5L10 4.5" stroke="#4DF2FF" stroke-width="1.4"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <ul v-if="filterOpen" class="filter-select__menu" @click.stop>
          <li v-for="opt in filterOptions" :key="opt.value"
              class="filter-select__option"
              :class="{ 'filter-select__option--active': filter === opt.value }"
              @click="selectFilter(opt.value)">
            {{ opt.label }}
          </li>
        </ul>
      </div>
    </div>

    <!-- 表格 -->
    <div class="barrier-list__table">
      <div class="barrier-row barrier-row--header">
        <span class="barrier-row__name">设备名称</span>
        <span class="barrier-row__location">所在位置</span>
        <span class="barrier-row__status">状态</span>
      </div>

      <div class="barrier-list__body">
        <div
          v-for="g in filtered"
          :key="g.id"
          class="barrier-row barrier-row--selectable"
          :class="{ 'barrier-row--selected': g.id === selectedId }"
          role="button"
          tabindex="0"
          @click="emit('select', g.id)"
          @keydown.enter.prevent="emit('select', g.id)"
          @keydown.space.prevent="emit('select', g.id)"
        >
          <span class="barrier-row__name">{{ g.name }}</span>
          <span class="barrier-row__location">{{ g.location }}</span>
          <span class="barrier-row__status">
            <span class="status-badge" :class="`status-badge--${g.status}`">
              {{ statusLabel(g.status) }}
            </span>
          </span>
        </div>
      </div>
    </div>

    <!-- 分页器 -->
    <div class="barrier-list__pagination">
      <button
        class="pagination-btn"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        上一页
      </button>
      <span class="pagination-info">{{ currentPage }} / {{ totalPages }}</span>
      <button
        class="pagination-btn"
        :disabled="currentPage === totalPages"
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

type BarrierStatus = 'online' | 'offline'

interface Barrier {
  id: number
  name: string
  location: string
  status: BarrierStatus
}

const props = withDefaults(defineProps<{
  barriers?: Barrier[]
  selectedId?: number | null
}>(), {
  barriers: () => [],
  selectedId: null,
})

const emit = defineEmits<{
  select: [id: number]
  visibleChange: [ids: number[]]
}>()

const STATUS_TEXT: Record<BarrierStatus, string> = {
  'online': '在线',
  'offline': '离线',
}
function statusLabel(s: BarrierStatus) { return STATUS_TEXT[s] }

// 搜索
const keyword = ref('')

// 筛选
const filterOpen = ref(false)
const filter = ref<'all' | BarrierStatus>('all')
const filterOptions = [
  { value: 'all',     label: '全部状态' },
  { value: 'online',  label: '在线' },
  { value: 'offline', label: '离线' },
] as const
const filterLabel = computed(() =>
  filterOptions.find(o => o.value === filter.value)?.label ?? '全部状态',
)
function toggleFilter() { filterOpen.value = !filterOpen.value }
function selectFilter(v: 'all' | BarrierStatus) {
  filter.value = v
  filterOpen.value = false
  currentPage.value = 1
}

// 过滤后的列表
const filteredAll = computed(() => {
  let list = props.barriers
  if (keyword.value.trim()) {
    const k = keyword.value.trim()
    list = list.filter(g => g.name.includes(k) || g.location.includes(k))
  }
  if (filter.value !== 'all') {
    list = list.filter(g => g.status === filter.value)
  }
  return list
})

// 分页
const pageSize = 10
const currentPage = ref(1)
const totalPages = computed(() => Math.ceil(filteredAll.value.length / pageSize))
const filtered = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredAll.value.slice(start, start + pageSize)
})

watch(filtered, list => {
  emit('visibleChange', list.map(item => item.id))
}, { immediate: true })
</script>

<style lang="scss" scoped>
.barrier-list {
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

    &::-webkit-scrollbar {
      width: 4px;
    }

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

// 搜索框
.search-input {
  flex: 1;
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

    &::placeholder {
      color: rgba(209, 237, 255, 0.45);
    }
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
  width: 111px;
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

  &__text {
    font-size: $font-size-xs;
    color: $color-text-2;
  }

  &__caret {
    width: 12px;
    height: 12px;
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
    z-index: 10;
    box-shadow: $shadow-panel;
  }

  &__option {
    padding: 6px 10px;
    font-size: $font-size-xs;
    color: $color-text-2;
    cursor: pointer;

    &:hover {
      background: rgba(0, 174, 255, 0.18);
      color: $color-text-1;
    }

    &--active {
      color: $color-primary-bright;
    }
  }
}

// 表格行
.barrier-row {
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

// 状态徽章
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

  &--online {
    color: $color-success;
    background: rgba(46, 208, 176, 0.12);
  }

  &--offline {
    color: $color-warning;
    background: rgba(249, 185, 51, 0.12);
  }
}

// 分页按钮
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

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.pagination-info {
  font-size: $font-size-xs;
  color: $color-text-2;
  font-family: $font-number;
  min-width: 60px;
  text-align: center;
}
</style>
