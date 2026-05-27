<template>
  <BasePanel class="meeting-list" title="会议室列表">
    <!-- 搜索 + 筛选 -->
    <div class="meeting-list__toolbar">
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
    <div class="meeting-list__table">
      <div class="meeting-row meeting-row--header">
        <span class="meeting-row__name">会议室名称</span>
        <span class="meeting-row__capacity">容纳人数</span>
        <span class="meeting-row__location">楼栋楼层</span>
        <span class="meeting-row__status">使用状态</span>
      </div>

      <div class="meeting-list__body">
        <div
          v-for="m in filtered"
          :key="m.id"
          class="meeting-row meeting-row--selectable"
          :class="{ 'meeting-row--selected': m.id === selectedId }"
          role="button"
          tabindex="0"
          @click="emit('select', m.id)"
          @keydown.enter.prevent="emit('select', m.id)"
          @keydown.space.prevent="emit('select', m.id)"
        >
          <span class="meeting-row__name">{{ m.name }}</span>
          <span class="meeting-row__capacity meeting-row__num">{{ m.capacity }}</span>
          <span class="meeting-row__location">{{ m.location }}</span>
          <span class="meeting-row__status">
            <span class="status-badge" :class="`status-badge--${m.status}`">
              {{ statusLabel(m.status) }}
            </span>
          </span>
        </div>
      </div>
    </div>
  </BasePanel>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import BasePanel from '@/components/common/BasePanel.vue'

type MeetingStatus = 'in-use' | 'idle' | 'reserved'

interface Meeting {
  id: number
  name: string
  capacity: number
  location: string
  status: MeetingStatus
}

const props = withDefaults(defineProps<{
  meetings?: Meeting[]
  selectedId?: number
}>(), {
  meetings: () => Array.from({ length: 47 }, (_, i) => ({
    id: i + 1,
    name: i % 3 === 0 ? '一楼101会议室' : i % 3 === 1 ? '二楼会议厅' : '三楼小会议室',
    capacity: [23, 12, 8, 16, 30][i % 5],
    location: `${(i % 4) + 1}号楼-${(i % 6) + 1}层`,
    status: (['in-use', 'idle', 'reserved'] as const)[i % 3],
  })),
  selectedId: undefined,
})

const emit = defineEmits<{
  select: [id: number]
}>()

const STATUS_TEXT: Record<MeetingStatus, string> = {
  'in-use': '使用中',
  'idle': '空闲中',
  'reserved': '已预约',
}
function statusLabel(s: MeetingStatus) { return STATUS_TEXT[s] }

// 搜索
const keyword = ref('')
const filtered = computed(() => {
  let list = props.meetings
  if (keyword.value.trim()) {
    const k = keyword.value.trim()
    list = list.filter(m => m.name.includes(k) || m.location.includes(k))
  }
  if (filter.value !== 'all') {
    list = list.filter(m => m.status === filter.value)
  }
  return list
})

// 筛选
const filterOpen = ref(false)
const filter = ref<'all' | MeetingStatus>('all')
const filterOptions = [
  { value: 'all',      label: '全部状态' },
  { value: 'in-use',   label: '使用中' },
  { value: 'idle',     label: '空闲中' },
  { value: 'reserved', label: '已预约' },
] as const
const filterLabel = computed(() =>
  filterOptions.find(o => o.value === filter.value)?.label ?? '全部状态',
)
function toggleFilter() { filterOpen.value = !filterOpen.value }
function selectFilter(v: 'all' | MeetingStatus) {
  filter.value = v
  filterOpen.value = false
}
</script>

<style lang="scss" scoped>
.meeting-list {
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
.meeting-row {
  display: grid;
  grid-template-columns: 1.4fr 0.85fr 1fr 0.85fr;
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

  &--selected &__num {
    color: $color-primary-bright;
  }

  &__name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  &__capacity { text-align: left; }
  &__location { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  &__status { text-align: left; }

  &__num {
    font-family: $font-number;
    color: $color-text-num;
    font-weight: bold;
  }
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

  &--in-use {
    color: $color-warning;
    background: rgba(249, 185, 51, 0.12);
  }

  &--idle {
    color: $color-success;
    background: rgba(46, 208, 176, 0.12);
  }

  &--reserved {
    color: $color-primary-bright;
    background: rgba(77, 242, 255, 0.12);
  }
}
</style>
