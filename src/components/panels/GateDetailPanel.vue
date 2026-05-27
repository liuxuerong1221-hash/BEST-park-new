<template>
  <section class="gate-detail">
    <!-- 头部：标题 + 关闭按钮 -->
    <header class="gate-detail__header">
      <div class="gate-detail__title">
        <span class="gate-detail__dot">
          <svg viewBox="0 0 17 17" fill="none">
            <circle cx="8.5" cy="8.5" r="8" stroke="#00AEFF" stroke-width="1"/>
            <circle cx="8.5" cy="8.5" r="5.5" fill="#00AEFF"/>
          </svg>
        </span>
        <h3 class="gate-detail__title-text">实时监控</h3>
      </div>
      <button class="gate-detail__close" type="button" aria-label="关闭" @click="onClose">
        <svg viewBox="0 0 16 16" fill="none">
          <path d="M9.57 8L15.73 1.86C16.15 1.44 16.15 0.75 15.73 0.31C15.32 -0.10 14.62 -0.10 14.19 0.31L8.02 6.48L1.86 0.31C1.44 -0.10 0.75 -0.10 0.31 0.31C-0.10 0.72 -0.10 1.42 0.31 1.86L6.48 8.02L0.31 14.19C-0.10 14.60 -0.10 15.30 0.31 15.73C0.72 16.15 1.42 16.15 1.86 15.73L8.02 9.57L14.19 15.73C14.60 16.15 15.30 16.15 15.73 15.73C16.15 15.32 16.15 14.62 15.73 14.19L9.57 8Z"
            fill="#FFFFFF"/>
        </svg>
      </button>
    </header>

    <!-- 监控画面 -->
    <div class="gate-detail__feed">
      <div class="gate-detail__feed-bg">
        <span class="gate-detail__feed-scan" />
      </div>
      <button class="gate-detail__expand" type="button" aria-label="放大" @click="openExpand">
        <svg viewBox="0 0 20 20" fill="none">
          <path d="M1.67 1.67 L6.67 1.67 M1.67 1.67 L1.67 6.67 M1.67 1.67 L7 7"
                stroke="#FFFFFF" stroke-width="1.4" stroke-linecap="round"/>
          <path d="M18.33 1.67 L13.33 1.67 M18.33 1.67 L18.33 6.67 M18.33 1.67 L13 7"
                stroke="#FFFFFF" stroke-width="1.4" stroke-linecap="round"/>
          <path d="M1.67 18.33 L6.67 18.33 M1.67 18.33 L1.67 13.33 M1.67 18.33 L7 13"
                stroke="#FFFFFF" stroke-width="1.4" stroke-linecap="round"/>
          <path d="M18.33 18.33 L13.33 18.33 M18.33 18.33 L18.33 13.33 M18.33 18.33 L13 13"
                stroke="#FFFFFF" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

    <!-- 基础信息 -->
    <div class="gate-detail__info">
      <span class="gate-detail__info-label">基础信息</span>
      <div class="gate-detail__info-row">
        <span class="gate-detail__device-name">设备名称：{{ device.name }}</span>
        <span class="gate-detail__status" :class="`gate-detail__status--${device.status}`">
          {{ statusLabel }}
        </span>
      </div>
      <div class="gate-detail__info-row">
        <span class="gate-detail__device-location">设备位置：{{ device.location }}</span>
      </div>
      <div class="gate-detail__info-row">
        <span class="gate-detail__device-ip">设备IP：{{ device.ip }}</span>
      </div>
    </div>

    <!-- 分隔线 -->
    <div class="gate-detail__divider"></div>

    <!-- 控制按钮 -->
    <div class="gate-detail__controls">
      <button
        class="gate-detail__control-btn"
        type="button"
        :disabled="controlState === 'on'"
        @click="setControl('on')"
      >
        远程开启
      </button>
      <button
        class="gate-detail__control-btn"
        type="button"
        :disabled="controlState === 'off'"
        @click="setControl('off')"
      >
        远程关闭
      </button>
    </div>

    <!-- 人员进出记录 -->
    <div class="gate-detail__records">
      <PanelTitle title="人员进出记录" class="gate-detail__records-title" />

      <!-- 搜索和筛选 -->
      <div class="gate-detail__filters">
        <label class="gate-detail__search">
          <input
            v-model="searchKeyword"
            class="gate-detail__search-input"
            placeholder="请输入关键词搜索"
          />
          <svg class="gate-detail__search-icon" viewBox="0 0 18 18" fill="none">
            <circle cx="8" cy="8" r="5.5" stroke="#00AEFF" stroke-width="1.4"/>
            <path d="M12.5 12.5L16 16" stroke="#00AEFF" stroke-width="1.4" stroke-linecap="round"/>
          </svg>
        </label>
        <DatePicker v-model="selectedDate" />
      </div>

      <!-- 人员表格 -->
      <div class="gate-detail__person-table">
        <div class="gate-detail__person-row gate-detail__person-row--head">
          <span class="gate-detail__person-name">姓名</span>
          <span class="gate-detail__person-gender">性别</span>
          <span class="gate-detail__person-role">身份</span>
          <span class="gate-detail__person-time">通行时间</span>
          <span class="gate-detail__person-status-head">状态</span>
        </div>
        <div
          v-for="r in paginatedPersonRecords"
          :key="r.id"
          class="gate-detail__person-row"
        >
          <span class="gate-detail__person-name">{{ r.name }}</span>
          <span class="gate-detail__person-gender">{{ r.gender }}</span>
          <span class="gate-detail__person-role">{{ r.role }}</span>
          <span class="gate-detail__person-time">{{ r.time }}</span>
          <span
            class="gate-detail__person-status"
            :class="`gate-detail__person-status--${r.direction}`"
          >{{ r.direction === 'in' ? '进' : '出' }}</span>
        </div>
      </div>

      <!-- 分页器 -->
      <div class="gate-detail__pagination">
        <button
          class="gate-detail__pagination-btn"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          上一页
        </button>
        <span class="gate-detail__pagination-info">{{ currentPage }} / {{ totalPages }}</span>
        <button
          class="gate-detail__pagination-btn"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          下一页
        </button>
      </div>
    </div>

    <!-- 底部关闭按钮（hover 显示） -->
    <PanelCloseButton class="gate-detail__bottom-close" hover-reveal @close="emit('close')" />
  </section>

  <Teleport to="body">
    <div
      v-if="expanded"
      class="gate-modal"
      role="dialog"
      aria-modal="true"
      aria-label="监控画面"
      tabindex="-1"
      @click.self="closeExpand"
      @keydown.esc="closeExpand"
    >
      <section class="gate-modal__panel">
        <header class="gate-modal__header">
          <div class="gate-modal__title">
            <span class="gate-modal__dot" />
            <span class="gate-modal__title-text">{{ device.name }}</span>
            <span class="gate-modal__status" :class="`gate-modal__status--${device.status}`">
              {{ statusLabel }}
            </span>
          </div>
          <button class="gate-modal__close" type="button" aria-label="关闭放大画面" @click="closeExpand">
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M9.57 8L15.73 1.86C16.15 1.44 16.15 0.75 15.73 0.31C15.32 -0.10 14.62 -0.10 14.19 0.31L8.02 6.48L1.86 0.31C1.44 -0.10 0.75 -0.10 0.31 0.31C-0.10 0.72 -0.10 1.42 0.31 1.86L6.48 8.02L0.31 14.19C-0.10 14.60 -0.10 15.30 0.31 15.73C0.72 16.15 1.42 16.15 1.86 15.73L8.02 9.57L14.19 15.73C14.60 16.15 15.30 16.15 15.73 15.73C16.15 15.32 16.15 14.62 15.73 14.19L9.57 8Z" fill="#FFFFFF"/>
            </svg>
          </button>
        </header>

        <div class="gate-modal__feed">
          <div class="gate-modal__feed-bg">
            <span class="gate-modal__feed-scan" />
          </div>
          <div class="gate-modal__meta">
            <span>{{ device.location }}</span>
          </div>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import PanelTitle from '@/components/common/PanelTitle.vue'
import DatePicker from '@/components/common/DatePicker.vue'
import PanelCloseButton from '@/components/common/PanelCloseButton.vue'

type DeviceStatus = 'online' | 'offline'
type ControlState = 'on' | 'off'
type Direction = 'in' | 'out'

interface DeviceInfo {
  name: string
  location: string
  ip: string
  status: DeviceStatus
}

interface PersonRecord {
  id: number
  name: string
  gender: string
  role: string
  time: string
  direction: Direction
}

const props = withDefaults(defineProps<{
  device?: DeviceInfo
}>(), {
  device: () => ({
    name: '门禁',
    location: '南大门',
    ip: '192.168.1.100',
    status: 'online',
  }),
})

const emit = defineEmits<{
  close: []
}>()

const STATUS_TEXT: Record<DeviceStatus, string> = {
  'online': '在线',
  'offline': '离线',
}

const device = computed(() => props.device)
const statusLabel = computed(() => STATUS_TEXT[device.value.status])
const expanded = ref(false)
const controlState = ref<ControlState>('on')
const searchKeyword = ref('')
const selectedDate = ref('2026-4-20')
const currentPage = ref(1)
const pageSize = 10

const personRecords: PersonRecord[] = [
  { id: 1, name: '张某', gender: '女', role: '员工', time: '2025-11-1 18:09:23', direction: 'out' },
  { id: 2, name: '张某', gender: '女', role: '员工', time: '2025-11-1 18:09:23', direction: 'in' },
  { id: 3, name: '张某', gender: '女', role: '员工', time: '2025-11-1 18:09:23', direction: 'out' },
  { id: 4, name: '张某', gender: '女', role: '员工', time: '2025-11-1 18:09:23', direction: 'out' },
  { id: 5, name: '张某', gender: '女', role: '员工', time: '2025-11-1 18:09:23', direction: 'out' },
  { id: 6, name: '张某', gender: '女', role: '员工', time: '2025-11-1 18:09:23', direction: 'out' },
  { id: 7, name: '李某', gender: '男', role: '员工', time: '2025-11-1 18:10:11', direction: 'in' },
  { id: 8, name: '王某', gender: '男', role: '访客', time: '2025-11-1 18:11:45', direction: 'out' },
  { id: 9, name: '赵某', gender: '女', role: '员工', time: '2025-11-1 18:12:33', direction: 'in' },
  { id: 10, name: '钱某', gender: '男', role: '员工', time: '2025-11-1 18:14:02', direction: 'out' },
  { id: 11, name: '孙某', gender: '女', role: '访客', time: '2025-11-1 18:15:17', direction: 'in' },
  { id: 12, name: '周某', gender: '男', role: '员工', time: '2025-11-1 18:16:29', direction: 'out' },
  { id: 13, name: '吴某', gender: '女', role: '员工', time: '2025-11-1 18:17:54', direction: 'in' },
  { id: 14, name: '郑某', gender: '男', role: '员工', time: '2025-11-1 18:18:40', direction: 'out' },
  { id: 15, name: '冯某', gender: '女', role: '访客', time: '2025-11-1 18:20:05', direction: 'in' },
]

const filteredPersonRecords = computed(() => {
  if (!searchKeyword.value.trim()) return personRecords
  const k = searchKeyword.value.trim()
  return personRecords.filter(r =>
    r.name.includes(k) ||
    r.gender.includes(k) ||
    r.role.includes(k) ||
    r.time.includes(k),
  )
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredPersonRecords.value.length / pageSize)))

const paginatedPersonRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredPersonRecords.value.slice(start, start + pageSize)
})

function openExpand() {
  expanded.value = true
}

function closeExpand() {
  expanded.value = false
}

function setControl(state: ControlState) {
  if (controlState.value === state) return

  const actionLabel = state === 'on' ? '开启' : '关闭'

  ElMessageBox.confirm(
    `确定要${actionLabel}「${device.value.name}」吗？`,
    `${actionLabel}确认`,
    {
      confirmButtonText: `确定${actionLabel}`,
      cancelButtonText: '取消',
      type: 'warning',
      customClass: 'screen-confirm-box',
    },
  )
    .then(() => {
      controlState.value = state
      ElMessage({
        type: 'success',
        message: `${device.value.name}已${actionLabel}`,
        customClass: 'screen-message',
      })
    })
    .catch(() => {
      // 用户取消，保持原状态
    })
}

function onClose() {
  if (expanded.value) {
    expanded.value = false
    return
  }
  emit('close')
}
</script>

<style lang="scss" scoped>
.gate-detail {
  width: 100%;
  height: 100%;
  min-height: 0;
  background: rgba(5, 25, 49, 0.64);
  border: 1px solid #0B2C52;
  border-radius: 8px;
  padding: 8px $spacing-lg;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  overflow: hidden;
  box-sizing: border-box;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 26px;
  }

  &__title {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__dot {
    width: 17px;
    height: 17px;
    display: inline-flex;
  }
  &__dot svg { width: 100%; height: 100%; }

  &__title-text {
    margin: 0;
    font-family: 'PingFang SC', sans-serif;
    font-size: $font-size-sm;
    font-weight: bold;
    color: $color-text-1;
    line-height: 20px;
  }

  &__close {
    width: 26px;
    height: 26px;
    border: 0;
    background: transparent;
    cursor: pointer;
    padding: 5px;
    color: $color-text-1;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &:hover { opacity: 0.75; }

    svg { width: 16px; height: 16px; }
  }

  // 监控画面区
  &__feed {
    position: relative;
    width: 100%;
    height: 226px;
    border-radius: $radius-sm;
    overflow: hidden;
  }

  &__feed-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at center, rgba(0, 174, 255, 0.18) 0%, rgba(2, 16, 36, 0) 70%),
      linear-gradient(135deg, #0E2647 0%, #061328 100%);

    &::before,
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    &::before {
      background:
        repeating-linear-gradient(0deg, transparent 0 23px, rgba(0, 174, 255, 0.08) 23px 24px),
        repeating-linear-gradient(90deg, transparent 0 23px, rgba(0, 174, 255, 0.08) 23px 24px);
      mix-blend-mode: screen;
    }

    &::after {
      background: linear-gradient(180deg, rgba(0,0,0,0.45) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.5) 100%);
    }
  }

  &__feed-scan {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 60px;
    background: linear-gradient(180deg, rgba(0, 174, 255, 0) 0%, rgba(0, 174, 255, 0.28) 50%, rgba(0, 174, 255, 0) 100%);
    animation: feed-scan 4s linear infinite;
    pointer-events: none;
  }

  &__expand {
    position: absolute;
    bottom: 10px;
    right: 10px;
    width: 20px;
    height: 20px;
    background: transparent;
    border: 0;
    padding: 0;
    cursor: pointer;
    z-index: 1;

    &:hover { opacity: 0.75; }
    svg { width: 100%; height: 100%; }
  }

  // 信息区
  &__info {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__info-label {
    font-size: $font-size-sm;
    color: #00AEFF;
    line-height: 20px;
  }

  &__info-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__device-name,
  &__device-location,
  &__device-ip {
    font-family: 'PingFang SC', sans-serif;
    font-size: $font-size-sm;
    font-weight: bold;
    color: $color-text-1;
    line-height: 22px;
  }

  &__status {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 33px;
    padding: 4px 9px;
    font-size: 18px;
    font-weight: bold;
    border-radius: $radius-md;

    &--online {
      color: $color-success;
      background: rgba(12, 249, 44, 0.2);
    }
    &--offline {
      color: #FF1414;
      background: rgba(255, 72, 72, 0.2);
    }
  }

  // 分隔线
  &__divider {
    height: 1px;
    background: $color-line;
    margin: 0;
  }

  // 控制按钮
  &__controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }

  &__control-btn {
    min-width: 100px;
    height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 16px;
    border: 1px solid rgba(0, 174, 255, 0.5);
    background: linear-gradient(0deg, rgba(1, 158, 244, 0.5) -19%, rgba(14, 33, 56, 0) 100%);
    color: $color-text-1;
    font-size: $font-size-sm;
    font-weight: 600;
    border-radius: $radius-sm;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.2s ease;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(0deg, rgba(1, 158, 244, 0.5) -19%, rgba(14, 33, 56, 0) 100%);
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    &:hover:not(:disabled)::before {
      opacity: 1;
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      border-color: rgba(0, 174, 255, 0.2);
      background: rgba(8, 39, 76, 0.3);
      color: rgba(255, 255, 255, 0.4);
    }
  }

  // 记录列表
  &__records {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__records-title {
    // 使用 PanelTitle 通用组件，这里只是标记类名保持 BEM 约定
  }

  // 筛选区
  &__filters {
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
    background: rgba(8, 39, 76, 0.6);
    border: 1px solid rgba(0, 174, 255, 0.4);
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

  // 人员表格
  &__person-table {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    overscroll-behavior: contain;
    padding-right: 2px;
    display: flex;
    flex-direction: column;

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
    background: rgba(8, 39, 76, 0.6);
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
      color: #0CF92C;
      background: rgba(12, 249, 44, 0.3);
    }

    &--out {
      color: #FF1414;
      background: rgba(255, 72, 72, 0.3);
    }
  }

  // 分页器
  &__pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-md;
    padding: $spacing-sm 0 0;
    flex-shrink: 0;
  }

  &__pagination-btn {
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

  &__pagination-info {
    font-size: $font-size-xs;
    color: $color-text-2;
    font-family: $font-number;
    min-width: 60px;
    text-align: center;
  }

  // 底部关闭按钮（hover 显示）—— 通过 PanelCloseButton 的 hover-reveal 样式
  &__bottom-close {
    flex-shrink: 0;
  }

  &:hover :deep(.panel-close-btn.is-hover-reveal) {
    opacity: 1;
    max-height: 36px;
    padding-top: 0;
    padding-bottom: 0;
    margin-top: $spacing-sm;
  }
}

@keyframes feed-scan {
  0%   { transform: translateY(-100%); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { transform: translateY(226px); opacity: 0; }
}

@keyframes modal-feed-scan {
  0%   { transform: translateY(-100%); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { transform: translateY(680px); opacity: 0; }
}

.gate-modal {
  position: fixed;
  inset: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
  background: rgba(0, 8, 18, 0.72);
  backdrop-filter: blur(6px);

  &__panel {
    width: min(1120px, calc(100vw - 96px));
    height: min(680px, calc(100vh - 96px));
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid rgba(77, 242, 255, 0.35);
    border-radius: $radius-md;
    background: rgba(5, 25, 49, 0.92);
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

  &__status {
    height: 24px;
    display: inline-flex;
    align-items: center;
    padding: 0 8px;
    border-radius: $radius-sm;
    font-size: $font-size-xxs;
    font-weight: bold;

    &--online {
      color: #0CF92C;
      background: rgba(12, 249, 44, 0.2);
    }

    &--offline {
      color: #FF1414;
      background: rgba(255, 72, 72, 0.2);
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

  &__feed {
    position: relative;
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  &__feed-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at center, rgba(0, 174, 255, 0.2) 0%, rgba(2, 16, 36, 0) 72%),
      linear-gradient(135deg, #0E2647 0%, #061328 100%);

    &::before,
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    &::before {
      background:
        repeating-linear-gradient(0deg, transparent 0 31px, rgba(0, 174, 255, 0.08) 31px 32px),
        repeating-linear-gradient(90deg, transparent 0 31px, rgba(0, 174, 255, 0.08) 31px 32px);
      mix-blend-mode: screen;
    }

    &::after {
      background: linear-gradient(180deg, rgba(0,0,0,0.42) 0%, transparent 28%, transparent 72%, rgba(0,0,0,0.52) 100%);
    }
  }

  &__feed-scan {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 96px;
    background: linear-gradient(180deg, rgba(0, 174, 255, 0) 0%, rgba(0, 174, 255, 0.26) 50%, rgba(0, 174, 255, 0) 100%);
    animation: modal-feed-scan 4.6s linear infinite;
    pointer-events: none;
  }

  &__meta {
    position: absolute;
    left: 20px;
    right: 20px;
    bottom: 18px;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    color: $color-text-2;
    font-size: $font-size-xs;
  }
}

@media (prefers-reduced-motion: reduce) {
  .gate-detail__feed-scan,
  .gate-modal__feed-scan {
    animation: none;
  }
}
</style>
