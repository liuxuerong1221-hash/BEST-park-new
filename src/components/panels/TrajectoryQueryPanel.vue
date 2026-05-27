<template>
  <div class="tq">
    <!-- 标题 -->
    <div class="tq__title">
      <span class="tq__title-bar" />
      人员轨迹查询
    </div>

    <!-- 工具栏 -->
    <div class="tq__toolbar">
      <DatePicker v-model="date" direction="down" />
      <label class="tq__search">
        <input
          v-model="keyword"
          class="tq__search-input"
          type="text"
          placeholder="请输入姓名和工号"
        />
        <svg class="tq__search-icon" viewBox="0 0 18 18" fill="none">
          <circle cx="8" cy="8" r="5.5" stroke="#00AEFF" stroke-width="1.4" />
          <path d="M12.5 12.5L16 16" stroke="#00AEFF" stroke-width="1.4" stroke-linecap="round" />
        </svg>
      </label>
    </div>

    <!-- 人员列表 -->
    <div class="tq__persons">
      <div
        v-for="person in pagedPersons"
        :key="person.id"
        class="tq__person"
        :class="{ 'tq__person--active': selectedId === person.id }"
        role="button"
        tabindex="0"
        @click="selectedId = person.id"
        @keydown.enter="selectedId = person.id"
      >
        <div class="tq__avatar" aria-hidden="true">
          <svg viewBox="0 0 56 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="56" height="72" fill="rgba(0,50,90,0.7)" />
            <circle cx="28" cy="24" r="12" fill="rgba(77,200,255,0.3)" />
            <path d="M2 68C2 52 13 44 28 44C43 44 54 52 54 68" fill="rgba(77,200,255,0.3)" />
          </svg>
        </div>
        <div class="tq__info">
          <div class="tq__name">{{ person.name }}</div>
          <div class="tq__meta">{{ person.gender }}</div>
          <div class="tq__meta">工号：{{ person.workId }}</div>
        </div>
        <div class="tq__badge" :class="`tq__badge--${person.role}`">
          {{ person.roleLabel }}
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="tq__pagination">
      <button class="tq__pg-btn" type="button" :disabled="currentPage <= 1" @click="currentPage--">
        <svg viewBox="0 0 6 10" fill="none" width="6" height="10">
          <path d="M5 1L1 5L5 9" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <button
        v-for="p in displayedPages"
        :key="p"
        class="tq__pg-num"
        :class="{ 'tq__pg-num--active': currentPage === p }"
        type="button"
        @click="currentPage = p"
      >{{ p }}</button>
      <button class="tq__pg-btn" type="button" :disabled="currentPage >= totalPages" @click="currentPage++">
        <svg viewBox="0 0 6 10" fill="none" width="6" height="10">
          <path d="M1 1L5 5L1 9" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <div class="tq__pg-size">
        {{ pageSize }}条/页
        <svg viewBox="0 0 10 6" fill="none" width="10" height="6">
          <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
        </svg>
      </div>
      <div class="tq__pg-jump">
        <span>跳至</span>
        <input
          v-model.number="jumpPage"
          class="tq__pg-jump-input"
          type="number"
          min="1"
          :max="totalPages"
          @keydown.enter="doJump"
        />
        <span>页</span>
      </div>
    </div>

    <!-- 分隔线 -->
    <div class="tq__divider" />

    <!-- 活动轨迹 -->
    <div class="tq__subtitle">活动轨迹</div>

    <div class="tq__table-wrap">
      <div class="tq__thead">
        <span class="tq__col--seq">序号</span>
        <span class="tq__col--time">时间</span>
        <span class="tq__col--loc">位置</span>
        <span class="tq__col--dev">设备名称</span>
      </div>
      <div class="tq__tbody">
        <div v-for="row in activities" :key="row.seq" class="tq__tr">
          <span class="tq__col--seq">{{ row.seq }}</span>
          <span class="tq__col--time">{{ row.time }}</span>
          <span class="tq__col--loc">{{ row.location }}</span>
          <span class="tq__col--dev">{{ row.device }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import DatePicker from '@/components/common/DatePicker.vue'
import {
  mockPersons,
  getActivitiesForPerson,
  type MockPerson,
  type MockActivity,
} from '@/data/trajectoryMockData'

const selectedId = defineModel<number>('selectedId', { default: 1 })

const date = ref('2025-03-19')
const keyword = ref('')
const currentPage = ref(1)
const pageSize = 8
const jumpPage = ref<number | null>(null)

const persons: MockPerson[] = mockPersons

const filteredPersons = computed(() => {
  const k = keyword.value.trim()
  if (!k) return persons
  return persons.filter(p => p.name.includes(k) || p.workId.includes(k))
})

const totalPages = computed(() => Math.ceil(filteredPersons.value.length / pageSize))

const displayedPages = computed(() => {
  const total = totalPages.value
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
  let start = Math.max(1, currentPage.value - 2)
  const end = Math.min(total, start + 4)
  start = Math.max(1, end - 4)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

const pagedPersons = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredPersons.value.slice(start, start + pageSize)
})

function doJump() {
  if (jumpPage.value && jumpPage.value >= 1 && jumpPage.value <= totalPages.value) {
    currentPage.value = jumpPage.value
  }
  jumpPage.value = null
}

const activities = computed<MockActivity[]>(() =>
  getActivitiesForPerson(selectedId.value)
)
</script>

<style lang="scss" scoped>
.tq {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: rgba(10, 29, 53, 0.4);
  border: 1px solid $color-border;
  border-radius: $radius-md;
  padding: 16px 14px 24px;
  overflow: hidden;

  // ── 标题 ──────────────────────────────────────────
  &__title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: $font-size-sm;
    font-weight: 600;
    color: $color-text-1;
    flex-shrink: 0;
  }

  &__title-bar {
    width: 3px;
    height: 16px;
    background: $color-primary;
    border-radius: 2px;
    flex-shrink: 0;
  }

  // ── 工具栏 ────────────────────────────────────────
  &__toolbar {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
  }

  &__search {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    height: 34px;
    padding: 0 10px;
    background: rgba(0, 174, 255, 0.06);
    border: 1px solid $color-border;
    border-radius: $radius-sm;
    cursor: text;
  }

  &__search-input {
    flex: 1;
    min-width: 0;
    background: transparent;
    border: 0;
    outline: 0;
    color: $color-text-1;
    font-size: $font-size-xs;
    font-family: $font-body;

    &::placeholder { color: rgba(255, 255, 255, 0.3); }
  }

  &__search-icon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  // ── 人员列表 ──────────────────────────────────────
  &__persons {
    display: flex;
    flex-direction: column;
    gap: 6px;
    overflow-y: auto;
    flex-shrink: 0;
    max-height: 376px;

    &::-webkit-scrollbar { width: 3px; }
    &::-webkit-scrollbar-thumb {
      background: rgba(0, 174, 255, 0.35);
      border-radius: 2px;
    }
  }

  &__person {
    position: relative;
    display: flex;
    align-items: center;
    gap: 12px;
    height: 88px;
    padding-right: 12px;
    background: rgba(5, 25, 49, 0.64);
    border: 1px solid rgba(0, 174, 255, 0.12);
    border-radius: $radius-sm;
    overflow: hidden;
    cursor: pointer;
    flex-shrink: 0;
    transition: border-color 0.18s, background 0.18s;

    &:hover:not(&--active) {
      border-color: rgba(0, 174, 255, 0.3);
      background: rgba(10, 38, 80, 0.85);
    }

    &--active {
      background: linear-gradient(90deg, rgba(20, 75, 170, 0.35) 0%, rgba(20, 75, 170, 0.92) 100%);
      border-color: rgba(60, 130, 255, 0.55);
    }
  }

  &__avatar {
    width: 72px;
    height: 88px;
    flex-shrink: 0;
    background: rgba(0, 40, 80, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;

    svg { width: 56px; height: 72px; display: block; }
  }

  &__info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  &__name {
    font-size: $font-size-xs;
    font-weight: 600;
    color: $color-text-1;
  }

  &__meta {
    font-size: $font-size-xxs;
    color: $color-text-2;
  }

  // 通用角色标签
  &__badge {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    padding: 2px 10px;
    border-radius: $radius-sm;
    font-size: $font-size-xxs;
    font-weight: 500;
    line-height: 22px;
    white-space: nowrap;

    &--employee {
      background: rgba(34, 197, 94, 0.12);
      border: 1px solid rgba(34, 197, 94, 0.45);
      color: #22C55E;
    }

    &--visitor {
      background: rgba(0, 174, 255, 0.12);
      border: 1px solid rgba(0, 174, 255, 0.45);
      color: $color-primary;
    }
  }

  // ── 分页 ─────────────────────────────────────────
  &__pagination {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
  }

  &__pg-btn {
    width: 26px;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(8, 39, 76, 0.6);
    border: 1px solid rgba(0, 174, 255, 0.3);
    border-radius: $radius-sm;
    color: $color-text-1;
    cursor: pointer;
    flex-shrink: 0;
    transition: opacity 0.18s;

    &:disabled { opacity: 0.3; cursor: default; }
    &:not(:disabled):hover { background: rgba(0, 174, 255, 0.15); }
  }

  &__pg-num {
    width: 26px;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(8, 39, 76, 0.6);
    border: 1px solid rgba(0, 174, 255, 0.3);
    border-radius: $radius-sm;
    color: $color-text-2;
    font-size: $font-size-xxs;
    font-family: $font-body;
    cursor: pointer;
    flex-shrink: 0;
    transition: background 0.18s, color 0.18s;

    &--active {
      background: $color-primary;
      border-color: $color-primary;
      color: #fff;
    }

    &:not(&--active):hover {
      background: rgba(0, 174, 255, 0.15);
      color: $color-text-1;
    }
  }

  &__pg-size {
    display: flex;
    align-items: center;
    gap: 4px;
    height: 26px;
    padding: 0 8px;
    background: rgba(8, 39, 76, 0.6);
    border: 1px solid rgba(0, 174, 255, 0.3);
    border-radius: $radius-sm;
    font-size: $font-size-xxs;
    color: $color-text-2;
    margin-left: 4px;
    flex-shrink: 0;
    white-space: nowrap;
  }

  &__pg-jump {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: $font-size-xxs;
    color: $color-text-2;
    margin-left: 4px;
    flex-shrink: 0;
    white-space: nowrap;
  }

  &__pg-jump-input {
    width: 32px;
    height: 26px;
    padding: 0 4px;
    background: rgba(8, 39, 76, 0.6);
    border: 1px solid rgba(0, 174, 255, 0.3);
    border-radius: $radius-sm;
    color: $color-text-1;
    font-size: $font-size-xxs;
    font-family: $font-body;
    text-align: center;
    outline: none;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button { -webkit-appearance: none; }
  }

  // ── 分隔线 ────────────────────────────────────────
  &__divider {
    height: 1px;
    background: rgba(0, 174, 255, 0.2);
    flex-shrink: 0;
  }

  // ── 活动轨迹 ──────────────────────────────────────
  &__subtitle {
    font-size: $font-size-xs;
    font-weight: 600;
    color: $color-text-1;
    flex-shrink: 0;
  }

  &__table-wrap {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    overscroll-behavior: contain;

    &::-webkit-scrollbar { width: 4px; }
    &::-webkit-scrollbar-thumb {
      background: rgba(0, 174, 255, 0.4);
      border-radius: 2px;
    }
  }

  // 共用列宽：序号 | 时间 | 位置 | 设备名称
  %row-grid {
    display: grid;
    grid-template-columns: 42px 1fr 58px 74px;
    align-items: center;
    height: 40px;
    padding: 0 12px;
    font-size: $font-size-xs;

    span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  &__thead {
    @extend %row-grid;
    background: linear-gradient(89deg, rgba(0, 174, 255, 0.18) 2%, rgba(0, 174, 255, 0) 98%);
    border-bottom: 1px solid $color-line;
    position: sticky;
    top: 0;
    z-index: 1;

    span { color: $color-text-1; }
  }

  &__tbody { display: flex; flex-direction: column; }

  &__tr {
    @extend %row-grid;
    color: $color-text-2;
    outline: none;
    transition: background 0.18s, color 0.18s, box-shadow 0.18s;

    &:nth-child(odd) { background: rgba(0, 174, 255, 0.04); }

    &:hover {
      color: $color-text-1;
      background: rgba(0, 174, 255, 0.14);
      box-shadow: inset 2px 0 0 $color-primary-bright;
    }

    span { color: inherit; }
  }

  &__col--seq { text-align: center; }
}
</style>
