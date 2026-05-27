<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="batch-modal"
      role="dialog"
      aria-modal="true"
      aria-label="一键照明控制"
      tabindex="-1"
      @click.self="emit('close')"
      @keydown.esc="emit('close')"
    >
      <section class="batch-modal__panel">
        <header class="batch-modal__header">
          <div class="batch-modal__title">
            <span class="batch-modal__dot" />
            <span class="batch-modal__title-text">一键照明</span>
          </div>
          <button class="batch-modal__close" type="button" aria-label="关闭" @click="emit('close')">
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M9.57 8L15.73 1.86C16.15 1.44 16.15 0.75 15.73 0.31C15.32 -0.10 14.62 -0.10 14.19 0.31L8.02 6.48L1.86 0.31C1.44 -0.10 0.75 -0.10 0.31 0.31C-0.10 0.72 -0.10 1.42 0.31 1.86L6.48 8.02L0.31 14.19C-0.10 14.60 -0.10 15.30 0.31 15.73C0.72 16.15 1.42 16.15 1.86 15.73L8.02 9.57L14.19 15.73C14.60 16.15 15.30 16.15 15.73 15.73C16.15 15.32 16.15 14.62 15.73 14.19L9.57 8Z" fill="#FFFFFF"/>
            </svg>
          </button>
        </header>

        <div class="batch-modal__body">
          <!-- 控制区域 -->
          <div class="batch-modal__row">
            <span class="batch-modal__label">控制区域：</span>
            <div class="batch-modal__select" :class="{ 'batch-modal__select--open': scopeOpen }" @click.stop="toggleScope">
              <span class="batch-modal__select-text">{{ currentScopeLabel }}</span>
              <svg class="batch-modal__select-caret" :class="{ 'batch-modal__select-caret--open': scopeOpen }"
                   viewBox="0 0 12 12" fill="none">
                <path d="M2 4.5L6 8.5L10 4.5" stroke="#4DF2FF" stroke-width="1.4"
                      stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <ul v-if="scopeOpen" class="batch-modal__menu" @click.stop>
                <li
                  v-for="opt in scopeOptions"
                  :key="opt.value"
                  class="batch-modal__option"
                  :class="{ 'batch-modal__option--active': scope === opt.value }"
                  @click="selectScope(opt.value)"
                >
                  {{ opt.label }}
                </li>
              </ul>
            </div>
          </div>

          <!-- 控制类型 -->
          <div class="batch-modal__row">
            <span class="batch-modal__label">控制类型：</span>
            <div class="batch-modal__radios">
              <label class="batch-modal__radio" :class="{ 'batch-modal__radio--checked': controlType === 'on' }">
                <span class="batch-modal__radio-circle">
                  <span v-if="controlType === 'on'" class="batch-modal__radio-dot" />
                </span>
                <input
                  v-model="controlType"
                  type="radio"
                  name="batch-control-type"
                  value="on"
                  class="batch-modal__radio-input"
                />
                <span class="batch-modal__radio-text">一键全开</span>
              </label>
              <label class="batch-modal__radio" :class="{ 'batch-modal__radio--checked': controlType === 'off' }">
                <span class="batch-modal__radio-circle">
                  <span v-if="controlType === 'off'" class="batch-modal__radio-dot" />
                </span>
                <input
                  v-model="controlType"
                  type="radio"
                  name="batch-control-type"
                  value="off"
                  class="batch-modal__radio-input"
                />
                <span class="batch-modal__radio-text">一键全关</span>
              </label>
            </div>
          </div>

          <!-- 影响摘要 -->
          <div class="batch-modal__summary">
            将影响 <span class="batch-modal__summary-num">{{ affectedCount }}</span> 个在线设备
            <span v-if="offlineCount > 0" class="batch-modal__summary-tip">（{{ offlineCount }} 个离线设备将被忽略）</span>
          </div>
        </div>

        <footer class="batch-modal__footer">
          <button class="batch-modal__btn batch-modal__btn--ghost" type="button" @click="emit('close')">取消</button>
          <button
            class="batch-modal__btn batch-modal__btn--primary"
            type="button"
            :disabled="affectedCount === 0"
            @click="onConfirm"
          >
            执行
          </button>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

type PowerState = 'on' | 'off'
type FloorId = 'B1F' | '1F' | '2F' | '3F'
type ScopeValue = 'all' | `b${number}-${FloorId}`

interface DeviceLite {
  id: number
  status: 'online' | 'offline'
  buildingId: number
  floorId: FloorId
}

const props = defineProps<{
  visible: boolean
  devices: DeviceLite[]
  buildings: number[]
  floors: FloorId[]
}>()

const emit = defineEmits<{
  close: []
  apply: [{ scope: ScopeValue; action: PowerState; ids: number[] }]
}>()

const scope = ref<ScopeValue>('all')
const scopeOpen = ref(false)
const controlType = ref<PowerState>('on')

// 弹窗每次打开时重置选择
watch(
  () => props.visible,
  v => {
    if (v) {
      scope.value = 'all'
      controlType.value = 'on'
      scopeOpen.value = false
    }
  },
)

const scopeOptions = computed(() => {
  const opts: Array<{ value: ScopeValue; label: string }> = [
    { value: 'all', label: '全部照明控制' },
  ]
  for (const b of props.buildings) {
    for (const f of props.floors) {
      opts.push({
        value: `b${b}-${f}` as ScopeValue,
        label: `建筑${b} - ${f}`,
      })
    }
  }
  return opts
})

const currentScopeLabel = computed(
  () => scopeOptions.value.find(o => o.value === scope.value)?.label ?? '全部照明控制',
)

function matchesScope(d: DeviceLite): boolean {
  if (scope.value === 'all') return true
  const m = scope.value.match(/^b(\d+)-(.+)$/)
  if (!m) return true
  const b = Number(m[1])
  const f = m[2] as FloorId
  return d.buildingId === b && d.floorId === f
}

const scopedDevices = computed(() => props.devices.filter(matchesScope))
const affectedCount = computed(() => scopedDevices.value.filter(d => d.status === 'online').length)
const offlineCount = computed(() => scopedDevices.value.filter(d => d.status === 'offline').length)

function toggleScope() {
  scopeOpen.value = !scopeOpen.value
}

function selectScope(v: ScopeValue) {
  scope.value = v
  scopeOpen.value = false
}

function onConfirm() {
  if (affectedCount.value === 0) return
  const actionLabel = controlType.value === 'on' ? '全开' : '全关'
  const scopeLabel = currentScopeLabel.value

  ElMessageBox.confirm(
    `确定要${actionLabel}「${scopeLabel}」下的 ${affectedCount.value} 个照明设备吗？`,
    `一键${actionLabel}确认`,
    {
      confirmButtonText: `确定${actionLabel}`,
      cancelButtonText: '取消',
      type: 'warning',
      customClass: 'screen-confirm-box',
    },
  )
    .then(() => {
      const ids = scopedDevices.value.filter(d => d.status === 'online').map(d => d.id)
      emit('apply', { scope: scope.value, action: controlType.value, ids })
      ElMessage({
        type: 'success',
        message: `已${actionLabel} ${ids.length} 个设备（${scopeLabel}）`,
        customClass: 'screen-message',
      })
      emit('close')
    })
    .catch(() => {
      // 用户取消，保持弹窗
    })
}
</script>

<style lang="scss" scoped>
.batch-modal {
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
    width: 560px;
    max-width: calc(100vw - 96px);
    display: flex;
    flex-direction: column;
    border: 1px solid rgba(77, 242, 255, 0.35);
    border-radius: 8px;
    background: #14365E;
    box-shadow: 0 0 32px rgba(0, 174, 255, 0.24), inset 0 0 24px rgba(0, 174, 255, 0.08);
    overflow: hidden;
  }

  &__header {
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    border-bottom: 1px solid rgba(0, 174, 255, 0.24);
  }

  &__title {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #00AEFF;
    box-shadow: 0 0 10px rgba(0, 174, 255, 0.75);
  }

  &__title-text {
    font-size: 16px;
    font-weight: 700;
    color: #FFFFFF;
  }

  &__close {
    width: 28px;
    height: 28px;
    border: 0;
    background: transparent;
    cursor: pointer;
    padding: 6px;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &:hover { opacity: 0.75; }
    svg { width: 14px; height: 14px; }
  }

  &__body {
    padding: 28px 32px 12px;
    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  &__row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__label {
    flex-shrink: 0;
    width: 80px;
    font-size: 16px;
    color: #FFFFFF;
  }

  &__select {
    position: relative;
    flex: 1;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
    background: rgba(8, 39, 76, 0.6);
    border: 1px solid rgba(0, 174, 255, 0.4);
    border-radius: 4px;
    cursor: pointer;
    user-select: none;
    transition: border-color 0.18s ease, background 0.18s ease;

    &:hover {
      border-color: rgba(77, 242, 255, 0.6);
      background: rgba(8, 39, 76, 0.8);
    }

    &--open {
      border-color: #4DF2FF;
      background: rgba(8, 39, 76, 0.85);
      box-shadow: 0 0 0 1px rgba(77, 242, 255, 0.25), 0 0 12px rgba(77, 242, 255, 0.18);
    }
  }

  &__select-text {
    font-size: 14px;
    color: #FFFFFF;
    font-weight: 500;
  }

  &__select-caret {
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
    background: rgba(10, 29, 53, 0.96);
    border: 1px solid rgba(0, 174, 255, 0.4);
    border-radius: 4px;
    z-index: 10;
    max-height: 280px;
    overflow-y: auto;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);

    &::-webkit-scrollbar { width: 4px; }
    &::-webkit-scrollbar-thumb {
      background: rgba(0, 174, 255, 0.4);
      border-radius: 2px;
    }
  }

  &__option {
    padding: 8px 12px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.85);
    cursor: pointer;

    &:hover {
      background: rgba(0, 174, 255, 0.18);
      color: #FFFFFF;
    }

    &--active {
      color: #4DF2FF;
      font-weight: 600;
    }
  }

  &__radios {
    display: flex;
    align-items: center;
    gap: 64px;
  }

  &__radio {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    user-select: none;
    color: #FFFFFF;
    font-size: 16px;
  }

  &__radio-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  &__radio-circle {
    width: 16px;
    height: 16px;
    border: 1.5px solid rgba(255, 255, 255, 0.7);
    border-radius: 50%;
    background: transparent;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: border-color 0.18s ease;
  }

  &__radio--checked &__radio-circle {
    border-color: #4DF2FF;
  }

  &__radio-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #4DF2FF;
    box-shadow: 0 0 6px rgba(77, 242, 255, 0.7);
  }

  &__summary {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.75);
    padding-left: 88px;
  }

  &__summary-num {
    color: #4DF2FF;
    font-weight: 700;
    margin: 0 2px;
  }

  &__summary-tip {
    color: rgba(249, 185, 51, 0.85);
    margin-left: 4px;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    padding: 16px 24px 20px;
    border-top: 1px solid rgba(0, 174, 255, 0.18);
  }

  &__btn {
    min-width: 96px;
    height: 36px;
    padding: 0 18px;
    font-size: 14px;
    font-weight: 600;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.18s ease;

    &--ghost {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.4);
      color: rgba(255, 255, 255, 0.85);

      &:hover {
        border-color: #4DF2FF;
        color: #FFFFFF;
      }
    }

    &--primary {
      border: 1px solid rgba(0, 174, 255, 0.6);
      background: linear-gradient(0deg, rgba(1, 158, 244, 0.6) -19%, rgba(14, 33, 56, 0) 100%);
      color: #FFFFFF;

      &:hover:not(:disabled) {
        background: linear-gradient(0deg, rgba(1, 158, 244, 0.8) -19%, rgba(14, 33, 56, 0.2) 100%);
      }

      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
    }
  }
}
</style>
