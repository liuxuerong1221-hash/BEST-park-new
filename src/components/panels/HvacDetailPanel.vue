<template>
  <section class="hvac-detail">
    <header class="hvac-detail__header">
      <div class="hvac-detail__title">
        <span class="hvac-detail__icon" aria-hidden="true">
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
            <ellipse cx="8.5" cy="8.5" rx="8" ry="8" stroke="#00AEFF" stroke-width="1"/>
            <ellipse cx="8.5" cy="8.5" rx="5.5" ry="5.5" fill="#00AEFF"/>
          </svg>
        </span>
        <h3 class="hvac-detail__title-text">{{ typeLabel }}</h3>
      </div>
      <button class="hvac-detail__close" type="button" aria-label="关闭" @click="emit('close')">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M9.57 8L15.73 1.86C16.15 1.44 16.15 0.75 15.73 0.31C15.32 -0.10 14.62 -0.10 14.19 0.31L8.02 6.48L1.86 0.31C1.44 -0.10 0.75 -0.10 0.31 0.31C-0.10 0.72 -0.10 1.42 0.31 1.86L6.48 8.02L0.31 14.19C-0.10 14.60 -0.10 15.30 0.31 15.73C0.72 16.15 1.42 16.15 1.86 15.73L8.02 9.57L14.19 15.73C14.60 16.15 15.30 16.15 15.73 15.73C16.15 15.32 16.15 14.62 15.73 14.19L9.57 8Z" fill="#FFFFFF"/>
        </svg>
      </button>
    </header>

    <div class="hvac-detail__content">
      <div class="hvac-detail__section">
        <p class="hvac-detail__section-label">基础信息</p>
        <p class="hvac-detail__text">名称：{{ device.name }}</p>
        <p class="hvac-detail__text">设备类型：{{ typeLabel }}</p>
        <p class="hvac-detail__text">设备位置：{{ device.location }}</p>
        <p class="hvac-detail__text">设备IP：{{ device.ip }}</p>
      </div>

      <div class="hvac-detail__divider"></div>

      <div class="hvac-detail__section">
        <p class="hvac-detail__section-label">运行数据</p>
        <p class="hvac-detail__text">
          运行状态：<span :class="['hvac-detail__status', `hvac-detail__status--${device.status}`]">{{ statusLabel }}</span>
        </p>

        <template v-if="device.type === 'air-conditioner'">
          <p class="hvac-detail__text">运行模式：<span class="hvac-detail__value">{{ device.mode || '-' }}</span></p>
          <p class="hvac-detail__text">设定温度：<span class="hvac-detail__value">{{ device.targetTemp ?? '-' }}℃</span></p>
          <p class="hvac-detail__text">当前温度：<span class="hvac-detail__value">{{ device.temperature ?? '-' }}℃</span></p>
          <p class="hvac-detail__text">设定湿度：<span class="hvac-detail__value">{{ device.humidity ?? '-' }}%</span></p>
          <p class="hvac-detail__text">运行功率：<span class="hvac-detail__value">{{ device.power ?? '-' }}W</span></p>
          <p class="hvac-detail__text">
            运行控制：
            <span :class="['hvac-detail__running', isRunning ? 'hvac-detail__running--on' : 'hvac-detail__running--off']">
              {{ isRunning ? '运行中' : '已停止' }}
            </span>
          </p>
        </template>

        <template v-else-if="device.type === 'fresh-air'">
          <p class="hvac-detail__text">风速档位：<span class="hvac-detail__value">{{ device.windSpeed ?? '-' }}级</span></p>
          <p class="hvac-detail__text">设定温度：<span class="hvac-detail__value">{{ device.targetTemp ?? '-' }}℃</span></p>
          <p class="hvac-detail__text">设定湿度：<span class="hvac-detail__value">{{ device.humidity ?? '-' }}%</span></p>
          <p class="hvac-detail__text">水阀开度：<span class="hvac-detail__value">{{ device.waterValve ?? '-' }}%</span></p>
          <p class="hvac-detail__text">滤网状态：<span class="hvac-detail__value">{{ device.filterStatus || '-' }}</span></p>
          <p class="hvac-detail__text">运行功率：<span class="hvac-detail__value">{{ device.power ?? '-' }}W</span></p>
          <p class="hvac-detail__text">
            运行控制：
            <span :class="['hvac-detail__running', isRunning ? 'hvac-detail__running--on' : 'hvac-detail__running--off']">
              {{ isRunning ? '运行中' : '已停止' }}
            </span>
          </p>
        </template>

        <template v-else>
          <p class="hvac-detail__text">风速档位：<span class="hvac-detail__value">{{ device.windSpeed ?? '-' }}级</span></p>
          <p class="hvac-detail__text">运行功率：<span class="hvac-detail__value">{{ device.power ?? '-' }}W</span></p>
          <p class="hvac-detail__text">
            运行控制：
            <span :class="['hvac-detail__running', isRunning ? 'hvac-detail__running--on' : 'hvac-detail__running--off']">
              {{ isRunning ? '运行中' : '已停止' }}
            </span>
          </p>
        </template>
      </div>

      <div v-if="supportsRemoteControl" class="hvac-detail__divider"></div>

      <div v-if="supportsRemoteControl" class="hvac-detail__section">
        <p class="hvac-detail__section-label">远程操控</p>
      </div>

      <div v-if="supportsRemoteControl" class="hvac-detail__rich">
        <div class="hvac-detail__row">
          <span class="hvac-detail__row-label">开关控制：</span>
          <div class="hvac-detail__hex-group">
            <button
              type="button"
              class="hvac-detail__hex-btn"
              :class="{ 'is-active': isRunning }"
              :disabled="!canControl || isRunning"
              @click="setPower(true)"
            >开启</button>
            <button
              type="button"
              class="hvac-detail__hex-btn"
              :class="{ 'is-active': !isRunning }"
              :disabled="!canControl || !isRunning"
              @click="setPower(false)"
            >关闭</button>
          </div>
        </div>

        <div v-if="isAcType" class="hvac-detail__row">
          <span class="hvac-detail__row-label">空调模式：</span>
          <div class="hvac-detail__pill-group">
            <button
              v-for="m in AC_MODES"
              :key="m"
              type="button"
              class="hvac-detail__pill-btn"
              :class="{ 'is-active': device.mode === m }"
              :disabled="!canControl"
              @click="selectMode(m)"
            >{{ m }}</button>
          </div>
        </div>

        <div v-if="supportsRichControls" class="hvac-detail__row">
          <span class="hvac-detail__row-label">温度设定：</span>
          <div class="hvac-detail__stepper">
            <button type="button" class="hvac-detail__step" :disabled="!canControl" @click="stepTemp(-1)">−</button>
            <span class="hvac-detail__num">{{ targetTempInput }}</span>
            <span class="hvac-detail__unit">℃</span>
            <button type="button" class="hvac-detail__step" :disabled="!canControl" @click="stepTemp(1)">+</button>
          </div>
          <button
            type="button"
            class="hvac-detail__apply-btn"
            :disabled="!canControl || targetTempInput === device.targetTemp"
            @click="applyTargetTemp"
          >控制</button>
        </div>

        <div v-if="supportsRichControls" class="hvac-detail__row">
          <span class="hvac-detail__row-label">湿度设定：</span>
          <div class="hvac-detail__stepper">
            <button type="button" class="hvac-detail__step" :disabled="!canControl" @click="stepHumidity(-5)">−</button>
            <span class="hvac-detail__num">{{ humidityInput }}</span>
            <span class="hvac-detail__unit">%</span>
            <button type="button" class="hvac-detail__step" :disabled="!canControl" @click="stepHumidity(5)">+</button>
          </div>
          <button
            type="button"
            class="hvac-detail__apply-btn"
            :disabled="!canControl || humidityInput === device.humidity"
            @click="applyHumidity"
          >确认</button>
          <button
            type="button"
            class="hvac-detail__reset-btn"
            :disabled="!canControl || humidityInput === (device.humidity ?? 50)"
            @click="resetHumidity"
          >返回</button>
        </div>

        <div v-if="isFreshAirType" class="hvac-detail__row">
          <span class="hvac-detail__row-label">水阀开度：</span>
          <div class="hvac-detail__stepper">
            <button type="button" class="hvac-detail__step" :disabled="!canControl" @click="stepValve(-5)">−</button>
            <span class="hvac-detail__num">{{ waterValveInput }}</span>
            <span class="hvac-detail__unit">%</span>
            <button type="button" class="hvac-detail__step" :disabled="!canControl" @click="stepValve(5)">+</button>
          </div>
          <button
            type="button"
            class="hvac-detail__apply-btn"
            :disabled="!canControl || waterValveInput === device.waterValve"
            @click="applyWaterValve"
          >控制</button>
        </div>
      </div>
    </div>

    <div class="hvac-detail__footer">
      <PanelCloseButton @close="emit('close')" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import PanelCloseButton from '@/components/common/PanelCloseButton.vue'

export type HvacType = 'air-conditioner' | 'fresh-air' | 'supply-air' | 'exhaust-air'
export type HvacStatus = 'online' | 'offline'
export type AcMode = '制冷' | '制热' | '通风'

export type HvacControlAction =
  | { kind: 'power'; running: boolean }
  | { kind: 'mode'; mode: AcMode }
  | { kind: 'targetTemp'; targetTemp: number }
  | { kind: 'humidity'; humidity: number }
  | { kind: 'waterValve'; waterValve: number }

export interface HvacDevice {
  id: number
  name: string
  type: HvacType
  location: string
  ip: string
  status: HvacStatus
  buildingId: number
  x: number
  y: number
  temperature?: number
  targetTemp?: number
  mode?: AcMode
  windSpeed?: number
  power?: number
  filterStatus?: string
  running?: boolean
  humidity?: number
  waterValve?: number
}

const props = defineProps<{
  device: HvacDevice
}>()

const emit = defineEmits<{
  close: []
  control: [payload: { id: number; action: HvacControlAction }]
}>()

const TYPE_LABEL: Record<HvacType, string> = {
  'air-conditioner': '空调',
  'fresh-air': '新风机',
  'supply-air': '送风机',
  'exhaust-air': '排风机',
}

const typeLabel = computed(() => TYPE_LABEL[props.device.type])
const statusLabel = computed(() => (props.device.status === 'online' ? '正常' : '离线'))

const isAcType = computed(() => props.device.type === 'air-conditioner')
const isFreshAirType = computed(() => props.device.type === 'fresh-air')
const isFanType = computed(
  () => props.device.type === 'supply-air' || props.device.type === 'exhaust-air',
)
const supportsRemoteControl = computed(
  () => isAcType.value || isFreshAirType.value || isFanType.value,
)
const supportsRichControls = computed(() => isAcType.value || isFreshAirType.value)
const isRunning = computed(() => props.device.running === true)
const canControl = computed(() => supportsRemoteControl.value && props.device.status === 'online')

const AC_MODES: AcMode[] = ['制冷', '制热', '通风']
const TEMP_MIN = 16
const TEMP_MAX = 30
const HUM_MIN = 30
const HUM_MAX = 70
const VALVE_MIN = 0
const VALVE_MAX = 100

const targetTempInput = ref(props.device.targetTemp ?? 24)
const humidityInput = ref(props.device.humidity ?? 50)
const waterValveInput = ref(props.device.waterValve ?? 20)

watch(
  () => props.device.id,
  () => {
    targetTempInput.value = props.device.targetTemp ?? 24
    humidityInput.value = props.device.humidity ?? 50
    waterValveInput.value = props.device.waterValve ?? 20
  },
)
watch(() => props.device.targetTemp, v => { if (v != null) targetTempInput.value = v })
watch(() => props.device.humidity, v => { if (v != null) humidityInput.value = v })
watch(() => props.device.waterValve, v => { if (v != null) waterValveInput.value = v })

interface ActionLabel {
  verb: string
  desc: string
}

function describeAction(action: HvacControlAction): ActionLabel {
  switch (action.kind) {
    case 'power':
      return { verb: action.running ? '开启' : '关闭', desc: action.running ? '开启' : '关闭' }
    case 'mode':
      return { verb: '切换模式', desc: `运行模式切换为「${action.mode}」` }
    case 'targetTemp':
      return { verb: '设定温度', desc: `设定温度调整为 ${action.targetTemp}℃` }
    case 'humidity':
      return { verb: '设定湿度', desc: `设定湿度调整为 ${action.humidity}%` }
    case 'waterValve':
      return { verb: '设定水阀', desc: `水阀开度调整为 ${action.waterValve}%` }
  }
}

function requestAction(action: HvacControlAction) {
  if (!canControl.value) return
  const { verb, desc } = describeAction(action)
  const deviceName = props.device.name
  const deviceId = props.device.id

  ElMessageBox.confirm(
    `确定要${desc}「${deviceName}」吗？`,
    `${verb}确认`,
    {
      confirmButtonText: `确定${verb}`,
      cancelButtonText: '取消',
      type: 'warning',
      customClass: 'screen-confirm-box',
    },
  )
    .then(() => {
      emit('control', { id: deviceId, action })
      ElMessage({
        type: 'success',
        message: `「${deviceName}」${verb}已下发`,
        customClass: 'screen-message',
      })
    })
    .catch(() => {
      // 用户取消，保持原状态
    })
}

function togglePower() {
  requestAction({ kind: 'power', running: !isRunning.value })
}
function setPower(running: boolean) {
  if (isRunning.value === running) return
  requestAction({ kind: 'power', running })
}
function selectMode(mode: AcMode) {
  if (props.device.mode === mode) return
  requestAction({ kind: 'mode', mode })
}
function applyTargetTemp() {
  const v = Math.max(TEMP_MIN, Math.min(TEMP_MAX, Math.round(targetTempInput.value)))
  if (v === props.device.targetTemp) return
  requestAction({ kind: 'targetTemp', targetTemp: v })
}
function applyHumidity() {
  const v = Math.max(HUM_MIN, Math.min(HUM_MAX, Math.round(humidityInput.value)))
  if (v === props.device.humidity) return
  requestAction({ kind: 'humidity', humidity: v })
}
function applyWaterValve() {
  const v = Math.max(VALVE_MIN, Math.min(VALVE_MAX, Math.round(waterValveInput.value)))
  if (v === props.device.waterValve) return
  requestAction({ kind: 'waterValve', waterValve: v })
}
function stepTemp(delta: number) {
  targetTempInput.value = Math.max(TEMP_MIN, Math.min(TEMP_MAX, targetTempInput.value + delta))
}
function stepHumidity(delta: number) {
  humidityInput.value = Math.max(HUM_MIN, Math.min(HUM_MAX, humidityInput.value + delta))
}
function stepValve(delta: number) {
  waterValveInput.value = Math.max(VALVE_MIN, Math.min(VALVE_MAX, waterValveInput.value + delta))
}
function resetHumidity() {
  humidityInput.value = props.device.humidity ?? 50
}
</script>

<style lang="scss" scoped>
.hvac-detail {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  background: rgba(5, 25, 49, 0.64);
  border: 1px solid #0B2C52;
  border-radius: 4px;
  padding: 10px 9px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow: hidden;
  box-sizing: border-box;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  &__title { display: flex; align-items: center; gap: 6px; }
  &__icon { width: 17px; height: 17px; display: inline-flex; flex-shrink: 0; }
  &__title-text {
    margin: 0;
    font-family: 'PingFang SC', sans-serif;
    font-size: 16px;
    font-weight: bold;
    color: #FFFFFF;
    line-height: 20px;
  }

  &__close {
    width: 26px;
    height: 26px;
    border: 0;
    background: transparent;
    cursor: pointer;
    padding: 5px;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &:hover { opacity: 0.75; }
  }

  &__content { display: flex; flex-direction: column; gap: 20px; width: 100%; }
  &__section { display: flex; flex-direction: column; gap: 10px; }
  &__section-label {
    margin: 0;
    font-family: 'PingFang SC', sans-serif;
    font-size: 16px;
    font-weight: 400;
    color: #00AEFF;
    line-height: 20px;
  }
  &__text {
    margin: 0;
    font-family: 'PingFang SC', sans-serif;
    font-size: 16px;
    font-weight: bold;
    color: #FFFFFF;
    line-height: 22px;
  }
  &__status {
    font-weight: bold;
    &--online { color: #0CF92C; }
    &--offline { color: #FF1414; }
  }
  &__value { color: #FFFFFF; }
  &__divider { height: 1px; background: #0B2C52; width: 100%; }
  &__footer { margin-top: auto; display: flex; justify-content: center; padding-top: 10px; }

  &__running {
    font-weight: bold;
    &--on  { color: #0CF92C; }
    &--off { color: rgba(255, 255, 255, 0.55); }
  }

  &__rich {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-top: 4px;
  }

  &__row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  &__row-label {
    flex-shrink: 0;
    font-size: 14px;
    font-weight: 600;
    color: #FFFFFF;
    line-height: 22px;
    min-width: 80px;
  }

  &__hex-group,
  &__pill-group {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  &__hex-btn {
    min-width: 88px;
    height: 36px;
    padding: 0 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(0, 174, 255, 0.5);
    background: linear-gradient(0deg, rgba(1, 158, 244, 0.5) -19%, rgba(14, 33, 56, 0) 100%);
    color: #FFFFFF;
    font-weight: 700;
    font-size: 14px;
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.2s ease;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(0deg, rgba(1, 158, 244, 0.7) -19%, rgba(14, 33, 56, 0) 100%);
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    &:hover:not(:disabled):not(.is-active)::before { opacity: 1; }

    &.is-active {
      border-color: rgba(77, 242, 255, 0.85);
      background: linear-gradient(0deg, rgba(1, 158, 244, 0.85) -19%, rgba(14, 33, 56, 0) 100%);
      color: #4DF2FF;
      text-shadow: 0 0 6px rgba(77, 242, 255, 0.6);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      color: rgba(255, 255, 255, 0.5);
      background: rgba(14, 33, 56, 0.5);
    }
  }

  &__pill-btn {
    height: 28px;
    min-width: 64px;
    padding: 0 14px;
    font-size: 13px;
    font-weight: 600;
    color: #FFFFFF;
    border-radius: 14px;
    border: 1px solid rgba(0, 174, 255, 0.6);
    background: rgba(0, 174, 255, 0.16);
    cursor: pointer;
    transition: background 0.18s ease, color 0.18s ease;

    &:hover:not(:disabled):not(.is-active) {
      background: rgba(0, 174, 255, 0.28);
    }

    &.is-active {
      background: linear-gradient(180deg, #4DF2FF 0%, #1FBCD0 100%);
      color: #03253F;
      border-color: #4DF2FF;
      box-shadow: 0 0 8px rgba(77, 242, 255, 0.55);
    }

    &:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
  }

  &__stepper {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 2px 6px;
    height: 28px;
    border: 1px solid rgba(0, 174, 255, 0.5);
    border-radius: 4px;
    background: rgba(0, 174, 255, 0.08);
  }

  &__step {
    width: 22px;
    height: 22px;
    border: 0;
    background: rgba(0, 174, 255, 0.22);
    color: #FFFFFF;
    font-size: 16px;
    font-weight: bold;
    border-radius: 3px;
    cursor: pointer;
    line-height: 1;

    &:hover:not(:disabled) { background: rgba(0, 174, 255, 0.4); }
    &:disabled { opacity: 0.4; cursor: not-allowed; }
  }

  &__num {
    min-width: 32px;
    text-align: center;
    font-family: $font-number;
    font-size: 15px;
    font-weight: 600;
    color: #FFFFFF;
  }

  &__unit {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
  }

  &__apply-btn {
    height: 28px;
    min-width: 56px;
    padding: 0 14px;
    font-size: 13px;
    font-weight: 600;
    color: #FFFFFF;
    background: linear-gradient(180deg, #1F8FE8 0%, #0560B0 100%);
    border: 1px solid rgba(77, 242, 255, 0.55);
    border-radius: 4px;
    cursor: pointer;
    text-shadow: 0 0 4px rgba(77, 242, 255, 0.6);

    &:hover:not(:disabled) { filter: brightness(1.15); }
    &:disabled { opacity: 0.45; cursor: not-allowed; }
  }

  &__reset-btn {
    height: 28px;
    min-width: 56px;
    padding: 0 14px;
    font-size: 13px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.85);
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.35);
    border-radius: 4px;
    cursor: pointer;

    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.12);
      border-color: rgba(255, 255, 255, 0.6);
    }
    &:disabled { opacity: 0.45; cursor: not-allowed; }
  }

  &__btn { display: none; }
}
</style>
