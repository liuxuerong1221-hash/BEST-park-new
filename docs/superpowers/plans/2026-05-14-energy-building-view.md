# 设备能耗·楼宇设备二级页面 实施计划

> 依据 spec: `docs/superpowers/specs/2026-05-14-energy-building-view-design.md`

**Goal:** 新增设备能耗模块「楼宇设备」二级页面，集成空调、新风机、排风机、送风机四种设备的统计、列表、地图点位与详情面板。

**Architecture:** 复刻 `EnergyLightingView` 三栏结构（左：统计+列表；中：地图点位；右：详情）。新建 `Hvac*` 系列组件承接 4 种设备类型混合展示，列表新增「类型」列与筛选器，地图点位组件根据 `type` 渲染对应 SVG path 与渐变。

**Tech Stack:** Vue 3 setup、TS、SCSS scoped、vue-router。无新增依赖。

---

## 文件结构

**新建：**
- `src/views/EnergyBuildingView.vue` — 页面入口，组合左/中/右三栏
- `src/components/panels/HvacStatsPanel.vue` — 在线/离线 2 卡统计
- `src/components/panels/HvacListPanel.vue` — 列表 + 搜索 + 类型/状态筛选 + 分页
- `src/components/panels/HvacDetailPanel.vue` — 设备详情，按 type 条件渲染运行数据
- `src/components/common/HvacMapMarker.vue` — 地图点位，按 type 渲染对应图标

**修改：**
- `src/router/index.ts` — 注册 `/energy/building`
- `src/views/EnergyView.vue` — `routeMap.building` 改为 `'energy-building'`

---

## 执行顺序

```
Task 1: HvacMapMarker（最底层组件，被页面使用）
Task 2: HvacStatsPanel（独立简单组件）
Task 3: HvacDetailPanel（独立组件）
Task 4: HvacListPanel（独立组件，emit 事件被页面消费）
Task 5: EnergyBuildingView（组合所有组件 + mock 数据）
Task 6: 路由注册 + EnergyView routeMap 修改
Task 7: 验证（npm run build + 手动联调）
```

---

### Task 1: HvacMapMarker

**Files:**
- Create: `src/components/common/HvacMapMarker.vue`

- [ ] **Step 1: 编写组件**

```vue
<template>
  <MapPinMarker
    :x="x"
    :y="y"
    :label="label"
    :active="active"
    class="hvac-map-marker"
    :class="[`hvac-map-marker--${type}`, { 'hvac-map-marker--dimmed': dimmed }]"
    @select="$emit('select')"
  >
    <template #icon="{ gradientId }">
      <defs>
        <linearGradient :id="gradientId" x1="20" y1="12" x2="20" y2="28" gradientUnits="userSpaceOnUse">
          <stop :stop-color="gradient.from"/>
          <stop offset="1" :stop-color="gradient.to"/>
        </linearGradient>
      </defs>
      <path :fill="`url(#${gradientId})`" :transform="iconTransform" :d="iconPath"/>
    </template>
  </MapPinMarker>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MapPinMarker from './MapPinMarker.vue'

export type HvacType = 'air-conditioner' | 'fresh-air' | 'supply-air' | 'exhaust-air'

const props = defineProps<{
  x: number
  y: number
  type: HvacType
  label?: string
  active?: boolean
  dimmed?: boolean
}>()

defineEmits<{ select: [] }>()

const TYPE_CONFIG: Record<HvacType, { path: string; transform: string; from: string; to: string }> = {
  'air-conditioner': {
    path: 'M19.29 0H0.71C0.32 0 0 0.32 0 0.71V8.57C0 8.97 0.32 9.29 0.71 9.29H19.29C19.68 9.29 20 8.97 20 8.57V0.71C20 0.32 19.68 0 19.29 0ZM8.93 4.64H12.5C13.09 4.64 13.57 4.16 13.57 3.57C13.57 2.98 13.09 2.5 12.5 2.5H8.93C8.34 2.5 7.86 2.98 7.86 3.57C7.86 4.16 8.34 4.64 8.93 4.64ZM16.07 4.64H16.79C17.38 4.64 17.86 4.16 17.86 3.57C17.86 2.98 17.38 2.5 16.79 2.5H16.07C15.48 2.5 15 2.98 15 3.57C15 4.16 15.48 4.64 16.07 4.64ZM2.14 12.5C2.14 11.91 2.62 11.43 3.21 11.43C3.81 11.43 4.29 11.91 4.29 12.5V14.64C4.29 15.23 3.81 15.71 3.21 15.71C2.62 15.71 2.14 15.23 2.14 14.64V12.5ZM8.93 12.5C8.93 11.91 9.41 11.43 10 11.43C10.59 11.43 11.07 11.91 11.07 12.5V14.64C11.07 15.23 10.59 15.71 10 15.71C9.41 15.71 8.93 15.23 8.93 14.64V12.5ZM16.79 11.43C16.19 11.43 15.71 11.91 15.71 12.5V14.64C15.71 15.23 16.19 15.71 16.79 15.71C17.38 15.71 17.86 15.23 17.86 14.64V12.5C17.86 11.91 17.38 11.43 16.79 11.43Z',
    transform: 'translate(10 12)',
    from: '#FFFFFF',
    to: '#0083CC',
  },
  'fresh-air': {
    path: 'M8.22 16.94C12.88 17.11 16.8 13.43 16.94 8.75C16.94 8.16 16.89 7.57 16.77 7.01L20 7.01V0H8.47C3.9 0 0.17 3.65 0 8.22C-0.14 12.9 3.54 16.8 8.22 16.94ZM1.85 8.64C1.91 4.99 4.88 2.08 8.5 2.08C12.2 2.1 15.2 5.13 15.18 8.86C15.12 12.54 12.09 15.48 8.39 15.42C4.72 15.34 1.77 12.31 1.85 8.64ZM3.31 8.83C3.37 11.69 5.73 13.99 8.59 13.94C11.47 13.88 13.77 11.53 13.72 8.67C13.66 5.83 11.36 3.56 8.53 3.56C5.64 3.56 3.31 5.95 3.31 8.83Z',
    transform: 'translate(10 11.5)',
    from: '#A9F0E0',
    to: '#0E8A6E',
  },
  'supply-air': {
    path: 'M8.17 14.58C10.08 12.64 9.46 10.01 9.46 10.01C9.46 10.01 11.85 12.03 10.06 14.48C9.42 15.37 8.46 16.07 7.99 17.21C7.57 18.23 7.84 19.55 8.07 20C8.07 20 8.33 20.04 9.27 19.74C10.53 19.35 13.94 17.32 12.82 13.39C12.08 10.8 9.46 10.01 9.46 10.01C9.46 10.01 12.43 8.97 13.69 11.73C14.14 12.71 14.29 13.89 15.04 14.86C15.73 15.73 17.02 16.17 17.53 16.19C17.53 16.19 17.7 15.99 17.91 15.04C18.2 13.77 18.12 9.83 14.12 8.82C11.47 8.16 9.46 10.01 9.46 10.01C9.46 10.01 10.04 6.95 13.08 7.25C14.18 7.36 15.28 7.82 16.51 7.66C17.61 7.51 18.65 6.62 18.92 6.2C18.92 6.2 18.83 5.95 18.09 5.29C17.14 4.42 13.63 2.51 10.76 5.43C8.85 7.37 9.46 10.01 9.46 10.01C9.46 10.01 7.08 7.98 8.86 5.52C9.49 4.64 10.46 3.93 10.93 2.79C11.35 1.78 11.09 0.45 10.86 0C10.86 0 10.59-0.04 9.64 0.25C8.4 0.65 4.98 2.69 6.1 6.61C6.84 9.2 9.46 10.01 9.46 10.01C9.46 10.01 6.5 11.03 5.23 8.28C4.78 7.3 4.64 6.12 3.88 5.14C3.2 4.27 1.9 3.83 1.4 3.81C1.4 3.81 1.23 4.02 1.01 4.97C0.72 6.24 0.8 10.18 4.81 11.18C7.45 11.84 9.46 10.01 9.46 10.01C9.46 10.01 8.88 13.05 5.84 12.76C4.75 12.65 3.64 12.19 2.41 12.35C1.3 12.5 0.28 13.38 0 13.81C0 13.81 0.1 14.06 0.83 14.71C1.79 15.6 5.29 17.5 8.17 14.58Z',
    transform: 'translate(10 10)',
    from: '#B0F0FF',
    to: '#1DEAFF',
  },
  'exhaust-air': {
    path: 'M19.77 10.44C19.86 7.38 18.58 4.6 16.5 2.67L12.7 6.8C12.13 6.3 11.43 5.94 10.67 5.79V0.02C10.47 0.01 10.28 0 10.09 0C7.02 0.01 4.27 1.36 2.4 3.5L6.59 7.14C5.96 7.82 5.55 8.7 5.46 9.67L0.09 9.51C0.02 9.71 0.01 9.89 0 10.09C-0.08 13.16 1.2 15.94 3.28 17.87L7.21 13.6C7.75 14 8.45 14.3 9.2 14.41V19.98C9.4 19.99 9.58 20 9.78 20C12.85 19.99 15.6 18.64 17.46 16.5L13.22 12.81C13.68 12.25 13.98 11.58 14.11 10.87L19.69 11.03C19.76 10.83 19.77 10.65 19.78 10.45ZM6.97 10.08C6.97 8.51 8.24 7.24 9.81 7.24C11.38 7.24 12.65 8.51 12.65 10.08C12.65 11.65 11.38 12.92 9.81 12.92C8.24 12.92 6.97 11.65 6.97 10.08Z',
    transform: 'translate(10 10)',
    from: '#FFD2A1',
    to: '#FF8A3C',
  },
}

const cfg = computed(() => TYPE_CONFIG[props.type])
const iconPath = computed(() => cfg.value.path)
const iconTransform = computed(() => cfg.value.transform)
const gradient = computed(() => ({ from: cfg.value.from, to: cfg.value.to }))
</script>

<style lang="scss" scoped>
.hvac-map-marker {
  &--dimmed {
    opacity: 0.32;
    filter: grayscale(0.4);
    pointer-events: none;
  }
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add src/components/common/HvacMapMarker.vue
git commit -m "feat(hvac): add HvacMapMarker for building device map markers"
```

---

### Task 2: HvacStatsPanel

**Files:**
- Create: `src/components/panels/HvacStatsPanel.vue`

- [ ] **Step 1: 编写组件**

```vue
<template>
  <BasePanel class="hvac-stats" title="楼宇设备统计">
    <div class="hvac-stats__body">
      <div class="stat-card stat-card--online">
        <IconAirConditioner :size="60" />
        <div class="stat-card__info">
          <span class="stat-card__num stat-card__num--cool">{{ onlineCount }}</span>
          <span class="stat-card__label">在线(台)</span>
        </div>
      </div>
      <div class="stat-card stat-card--offline">
        <IconAirConditioner :size="60" />
        <div class="stat-card__info">
          <span class="stat-card__num stat-card__num--warm">{{ offlineCount }}</span>
          <span class="stat-card__label">离线(台)</span>
        </div>
      </div>
    </div>
  </BasePanel>
</template>

<script setup lang="ts">
import BasePanel from '@/components/common/BasePanel.vue'
import IconAirConditioner from '@/components/icons/IconAirConditioner.vue'

defineProps<{
  onlineCount: number
  offlineCount: number
}>()
</script>

<style lang="scss" scoped>
.hvac-stats {
  &__body {
    display: flex;
    align-items: stretch;
    gap: $spacing-sm;
    padding: $spacing-xs 0 $spacing-sm;
  }
}

.stat-card {
  flex: 1;
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-sm $spacing-md;
  border-radius: $radius-sm;
  background: linear-gradient(135deg, rgba(0, 60, 120, 0.30) 0%, rgba(0, 30, 70, 0.18) 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    border-left: 8px solid $color-primary;
    border-bottom: 8px solid transparent;
  }

  &--online  { box-shadow: inset 0 0 12px rgba(68, 181, 242, 0.16); }
  &--offline {
    box-shadow: inset 0 0 12px rgba(249, 185, 51, 0.16);
    filter: grayscale(0.6) brightness(0.85);
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  &__num {
    font-family: $font-number;
    font-size: 26px;
    font-weight: bold;
    line-height: 1;

    &--cool {
      color: #A9E1FF;
      text-shadow: 0 0 10px rgba(68, 181, 242, 0.55);
    }

    &--warm {
      color: #FFE48A;
      text-shadow: 0 0 10px rgba(249, 185, 51, 0.55);
    }
  }

  &__label {
    font-size: $font-size-xxs;
    color: $color-text-2;
    white-space: nowrap;
  }
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add src/components/panels/HvacStatsPanel.vue
git commit -m "feat(hvac): add HvacStatsPanel for online/offline summary"
```

---

### Task 3: HvacDetailPanel

**Files:**
- Create: `src/components/panels/HvacDetailPanel.vue`

- [ ] **Step 1: 编写组件 template + script**

```vue
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
          <p class="hvac-detail__text">运行功率：<span class="hvac-detail__value">{{ device.power ?? '-' }}W</span></p>
        </template>

        <template v-else-if="device.type === 'fresh-air'">
          <p class="hvac-detail__text">风速档位：<span class="hvac-detail__value">{{ device.windSpeed ?? '-' }}级</span></p>
          <p class="hvac-detail__text">滤网状态：<span class="hvac-detail__value">{{ device.filterStatus || '-' }}</span></p>
          <p class="hvac-detail__text">运行功率：<span class="hvac-detail__value">{{ device.power ?? '-' }}W</span></p>
        </template>

        <template v-else>
          <p class="hvac-detail__text">风速档位：<span class="hvac-detail__value">{{ device.windSpeed ?? '-' }}级</span></p>
          <p class="hvac-detail__text">运行功率：<span class="hvac-detail__value">{{ device.power ?? '-' }}W</span></p>
        </template>
      </div>
    </div>

    <div class="hvac-detail__footer">
      <button class="hvac-detail__btn" type="button" @click="emit('close')">关闭</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export type HvacType = 'air-conditioner' | 'fresh-air' | 'supply-air' | 'exhaust-air'
export type HvacStatus = 'online' | 'offline'

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
  mode?: string
  windSpeed?: number
  power?: number
  filterStatus?: string
}

const props = defineProps<{
  device: HvacDevice
}>()

const emit = defineEmits<{ close: [] }>()

const TYPE_LABEL: Record<HvacType, string> = {
  'air-conditioner': '空调',
  'fresh-air': '新风机',
  'supply-air': '送风机',
  'exhaust-air': '排风机',
}

const typeLabel = computed(() => TYPE_LABEL[props.device.type])
const statusLabel = computed(() => (props.device.status === 'online' ? '正常' : '离线'))
</script>

<style lang="scss" scoped>
.hvac-detail {
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

  &__btn {
    width: 100px;
    height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0.63px solid rgba(0, 174, 255, 0.5);
    background: linear-gradient(0deg, rgba(1, 158, 244, 0.5) -19%, rgba(14, 33, 56, 0) 100%);
    color: #FFFFFF;
    font-family: 'PingFangSC', sans-serif;
    font-size: 16px;
    font-weight: 600;
    border-radius: 4px;
    cursor: pointer;
    text-shadow: 0 0 6.3px #4CADFF;

    &:hover { filter: brightness(1.15); }
  }
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add src/components/panels/HvacDetailPanel.vue
git commit -m "feat(hvac): add HvacDetailPanel with type-conditional running data"
```

---

### Task 4: HvacListPanel

**Files:**
- Create: `src/components/panels/HvacListPanel.vue`

- [ ] **Step 1: 编写组件 template**

```vue
<template>
  <BasePanel class="hvac-list" title="楼宇设备列表">
    <div class="hvac-list__toolbar">
      <label class="search-input">
        <input v-model="keyword" class="search-input__input" placeholder="请输入关键词搜索" />
        <svg class="search-input__icon" viewBox="0 0 18 18" fill="none">
          <circle cx="8" cy="8" r="5.5" stroke="#4DF2FF" stroke-width="1.4"/>
          <path d="M12.5 12.5L16 16" stroke="#4DF2FF" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
      </label>

      <div class="filter-select" @click="toggleTypeFilter">
        <span class="filter-select__text">{{ typeFilterLabel }}</span>
        <svg class="filter-select__caret" :class="{ 'filter-select__caret--open': typeFilterOpen }"
             viewBox="0 0 12 12" fill="none">
          <path d="M2 4.5L6 8.5L10 4.5" stroke="#4DF2FF" stroke-width="1.4"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <ul v-if="typeFilterOpen" class="filter-select__menu" @click.stop>
          <li v-for="opt in typeFilterOptions" :key="opt.value"
              class="filter-select__option"
              :class="{ 'filter-select__option--active': typeFilter === opt.value }"
              @click="selectTypeFilter(opt.value)">
            {{ opt.label }}
          </li>
        </ul>
      </div>
    </div>

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
              {{ d.status === 'online' ? '在线' : '离线' }}
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
import { ref, computed, watch } from 'vue'
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
function toggleTypeFilter() { typeFilterOpen.value = !typeFilterOpen.value }
function selectTypeFilter(v: 'all' | HvacType) {
  typeFilter.value = v
  typeFilterOpen.value = false
  currentPage.value = 1
}

watch(() => props.filterBuildingId, () => { currentPage.value = 1 })
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

  &__text { font-size: $font-size-xs; color: $color-text-2; }
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
    &:hover { background: rgba(0, 174, 255, 0.18); color: $color-text-1; }
    &--active { color: $color-primary-bright; }
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
```

- [ ] **Step 2: 提交**

```bash
git add src/components/panels/HvacListPanel.vue
git commit -m "feat(hvac): add HvacListPanel with type/keyword filter and pagination"
```

---

### Task 5: EnergyBuildingView

**Files:**
- Create: `src/views/EnergyBuildingView.vue`

- [ ] **Step 1: 编写 template**

```vue
<template>
  <div class="building">
    <div class="building__bg" />
    <img class="building__frame building__frame--left"  src="@/assets/images/left-左.png" alt="" />
    <img class="building__frame building__frame--right" src="@/assets/images/left-右.png" alt="" />

    <AppHeader class="building__header" />

    <main class="building__body">
      <aside class="building__left">
        <HvacStatsPanel :online-count="onlineCount" :offline-count="offlineCount" />
        <HvacListPanel
          :devices="devices"
          :selected-id="selectedDeviceId"
          :filter-building-id="selectedBuildingId"
          @select="selectDevice"
          @visible-change="updateVisibleDeviceIds"
        />
      </aside>

      <button class="building__back" type="button" @click="goBack">
        <span class="building__back-icon" aria-hidden="true">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="building-back-stroke" x1="20" y1="0" x2="20" y2="40" gradientUnits="userSpaceOnUse">
                <stop stop-color="#0C84FF" />
                <stop offset="1" stop-color="#1DEAFF" />
              </linearGradient>
            </defs>
            <circle cx="20" cy="20" r="19.5" fill="rgba(2, 37, 79, 0.6)" stroke="url(#building-back-stroke)" />
            <path d="M22.5 13L15.5 20L22.5 27" stroke="#4DF2FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
        <span class="building__back-text">返回</span>
      </button>

      <section class="building__center">
        <div class="building__map">
          <HvacMapMarker
            v-for="marker in visibleMarkers"
            :key="marker.id"
            :x="marker.x"
            :y="marker.y"
            :type="marker.type"
            :label="marker.name"
            :active="selectedDeviceId === marker.id"
            :dimmed="selectedBuildingId != null && marker.buildingId !== selectedBuildingId"
            @select="selectDevice(marker.id)"
          />

          <div class="building__map-controls">
            <Compass />
            <FloorSelector
              :selected-floor="selectedFloor"
              @floor-change="onFloorChange"
            />
          </div>
        </div>
      </section>

      <aside v-if="detailVisible && selectedDevice" class="building__right">
        <HvacDetailPanel :device="selectedDevice" @close="detailVisible = false" />
      </aside>
    </main>

    <BottomNav class="building__bottom" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/common/AppHeader.vue'
import BottomNav from '@/components/common/BottomNav.vue'
import Compass from '@/components/common/Compass.vue'
import FloorSelector from '@/components/common/FloorSelector.vue'
import HvacStatsPanel from '@/components/panels/HvacStatsPanel.vue'
import HvacListPanel from '@/components/panels/HvacListPanel.vue'
import HvacDetailPanel from '@/components/panels/HvacDetailPanel.vue'
import HvacMapMarker from '@/components/common/HvacMapMarker.vue'

const router = useRouter()

type HvacType = 'air-conditioner' | 'fresh-air' | 'supply-air' | 'exhaust-air'
type HvacStatus = 'online' | 'offline'

interface HvacDevice {
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
  mode?: string
  windSpeed?: number
  power?: number
  filterStatus?: string
}

const selectedFloor = ref('1F')
function onFloorChange(floor: string) { selectedFloor.value = floor }

const LOCATION_BY_BUILDING: Record<number, string> = {
  1: '建筑1一楼大厅',
  2: '建筑2二楼办公区',
  3: '建筑3三楼会议区',
  4: '建筑4一楼机房',
}

const TYPE_PREFIX: Record<HvacType, string> = {
  'air-conditioner': '空调',
  'fresh-air': '新风机',
  'supply-air': '送风机',
  'exhaust-air': '排风机',
}

const TYPE_IP_PREFIX: Record<HvacType, string> = {
  'air-conditioner': 'AC',
  'fresh-air': 'FA',
  'supply-air': 'SA',
  'exhaust-air': 'EA',
}

function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

const TYPE_COUNTS: Array<{ type: HvacType; count: number }> = [
  { type: 'air-conditioner', count: 40 },
  { type: 'fresh-air', count: 30 },
  { type: 'supply-air', count: 25 },
  { type: 'exhaust-air', count: 25 },
]

function buildDevices(): HvacDevice[] {
  const list: HvacDevice[] = []
  let id = 1
  for (const { type, count } of TYPE_COUNTS) {
    for (let i = 0; i < count; i++) {
      const buildingId = (i % 4) + 1
      const isOnline = i % 10 !== 0
      const dev: HvacDevice = {
        id,
        name: `${TYPE_PREFIX[type]}${i + 1}`,
        type,
        location: LOCATION_BY_BUILDING[buildingId],
        ip: `SD-${TYPE_IP_PREFIX[type]}${String(id).padStart(3, '0')}`,
        status: isOnline ? 'online' : 'offline',
        buildingId,
        x: 160 + Math.floor(pseudoRandom(id * 12.9898) * 760),
        y: 100 + Math.floor(pseudoRandom(id * 78.233) * 460),
        power: 80 + ((id * 13) % 600),
      }
      if (type === 'air-conditioner') {
        dev.mode = ['制冷', '制热', '送风'][id % 3]
        dev.targetTemp = 22 + (id % 6)
        dev.temperature = 20 + (id % 10)
      } else if (type === 'fresh-air') {
        dev.windSpeed = 1 + (id % 3)
        dev.filterStatus = id % 7 === 0 ? '需更换' : '正常'
      } else {
        dev.windSpeed = 1 + (id % 3)
      }
      list.push(dev)
      id++
    }
  }
  return list
}

const devices: HvacDevice[] = buildDevices()

const selectedDeviceId = ref<number | null>(null)
const detailVisible = ref(false)
const visibleDeviceIds = ref<number[]>(devices.slice(0, 10).map(d => d.id))
const selectedBuildingId = ref<number | null>(null)

const selectedDevice = computed(() => {
  if (selectedDeviceId.value == null) return undefined
  return devices.find(d => d.id === selectedDeviceId.value)
})

const visibleMarkers = computed(() =>
  devices.filter(d => visibleDeviceIds.value.includes(d.id)),
)

const onlineCount = computed(() => devices.filter(d => d.status === 'online').length)
const offlineCount = computed(() => devices.filter(d => d.status === 'offline').length)

function updateVisibleDeviceIds(ids: number[]) {
  visibleDeviceIds.value = ids
}

function selectDevice(id: number) {
  selectedDeviceId.value = id
  detailVisible.value = true
}

function goBack() {
  router.push({ name: 'energy' })
}
</script>

<style lang="scss" scoped>
.building {
  width: $screen-width;
  height: $screen-height;
  position: relative;
  overflow: hidden;
  background-color: $color-bg;
  font-family: $font-body;

  &__bg {
    position: absolute;
    inset: 0;
    background-image: url('@/assets/images/bg图@2x.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    z-index: 0;
  }

  &__frame {
    position: absolute;
    top: 8px;
    bottom: 8px;
    height: calc(100% - 16px);
    width: auto;
    pointer-events: none;
    z-index: 30;

    &--left  { left: 0; }
    &--right { right: 0; }
  }

  &__header {
    position: relative;
    z-index: 10;
    height: $header-h;
  }

  &__body {
    position: relative;
    z-index: 10;
    display: grid;
    grid-template-columns: $panel-left-w 1fr $panel-right-w;
    height: calc($screen-height - $header-h - $bottom-nav-h);
    padding: 0 40px;
    gap: 8px;
  }

  &__left,
  &__right {
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow: hidden;
    padding: 24px 0 8px;
  }

  &__right {
    position: relative;
    z-index: 20;
  }

  &__center {
    display: flex;
    flex-direction: column;
  }

  &__back {
    position: absolute;
    left: calc(40px + #{$panel-left-w} + 24px);
    top: 24px;
    z-index: 12;
    width: 105px;
    height: 40px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0 16px 0 0;
    border: 0;
    border-radius: 20px;
    background: rgba(10, 15, 21, 0.5);
    color: $color-text-1;
    cursor: pointer;
    outline: none;
    transition: transform 0.18s ease, filter 0.18s ease;

    &:hover {
      transform: translateY(-1px);
      filter: drop-shadow(0 0 10px rgba(29, 234, 255, 0.34));
    }

    &:focus-visible {
      box-shadow: 0 0 0 2px rgba(77, 242, 255, 0.45);
    }
  }

  &__back-icon {
    width: 40px;
    height: 40px;
    flex-shrink: 0;

    svg { width: 40px; height: 40px; display: block; }
  }

  &__back-text {
    font-size: $font-size-xs;
    font-weight: 600;
    line-height: 20px;
    color: $color-text-1;
    white-space: nowrap;
  }

  &__map {
    flex: 1;
    position: relative;
  }

  &__map-controls {
    position: absolute;
    right: 8px;
    bottom: 8px;
    z-index: 5;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  &__bottom {
    position: relative;
    z-index: 10;
    height: $bottom-nav-h;
    padding-bottom: 24px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .building__back { transition: none; }
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add src/views/EnergyBuildingView.vue
git commit -m "feat(hvac): add EnergyBuildingView combining stats/list/map/detail"
```

---

### Task 6: 路由注册 + EnergyView routeMap

**Files:**
- Modify: `src/router/index.ts`
- Modify: `src/views/EnergyView.vue`

- [ ] **Step 1: 路由注册**

在 `src/router/index.ts` 的 `routes` 数组中新增（紧跟在 `energy-broadcast` 之后）：

```ts
    {
      path: '/energy/building',
      name: 'energy-building',
      component: () => import('@/views/EnergyBuildingView.vue'),
    },
```

- [ ] **Step 2: 修改 EnergyView routeMap**

将 `src/views/EnergyView.vue` 中：

```ts
building: 'energy',
```

改为：

```ts
building: 'energy-building',
```

- [ ] **Step 3: 提交**

```bash
git add src/router/index.ts src/views/EnergyView.vue
git commit -m "feat(hvac): wire energy-building route and EnergyView entry"
```

---

### Task 7: 验证

- [ ] **Step 1: 构建验证**

Run: `npm run build`

Expected: `vue-tsc` 与 Vite build 都退出 0；可能出现 Sass legacy API、chunk size 警告（已知问题，可忽略）。

- [ ] **Step 2: 运行 dev 并联调**

Run: `npm run dev`

逐项检查：
- 打开 `http://localhost:5173/#/energy`，确认页面正常
- 点击右下浮动入口「楼宇设备」，应跳转到 `#/energy/building`
- 左上统计面板显示在线/离线合计（在线 ≈ 108、离线 ≈ 12）
- 列表显示前 10 条，地图显示对应 10 个点位
- 点击列表行：右侧出现详情面板，地图对应点位高亮
- 详情面板按设备类型显示不同字段（空调有温度/模式，新风机有滤网状态等）
- 工具栏「类型」筛选切换：列表 + 地图点位都按类型过滤
- 搜索框输入「空调5」：列表过滤生效
- 翻页：地图点位跟随翻页变化
- 左上「返回」按钮回到 `#/energy`
- 控制台无报错

- [ ] **Step 3: 视觉一致性自查**

- 三栏布局与 `EnergyLightingView` 间距、padding 一致
- 地图点位浮起动画与其他二级页面一致
- 详情面板宽度与照明二级页面一致

- [ ] **Step 4: 提交（如有微调）**

如有视觉微调：

```bash
git add -A
git commit -m "fix(hvac): polish building view spacing"
```

---

## Self-Review

- ✅ Spec 中每一节都有任务覆盖：路由 (Task 6)、统计面板 (Task 2)、列表面板 (Task 4)、详情面板 (Task 3)、地图点位 (Task 1)、页面 (Task 5)、Mock 数据 (Task 5)、EnergyView 改动 (Task 6)、验收 (Task 7)。
- ✅ 无 TBD/TODO/占位符，所有代码完整可粘贴。
- ✅ 类型一致：`HvacType`、`HvacStatus`、`HvacDevice` 在 Task 3、4、5 中使用同一签名；`devices` prop 在 List/View 同名同结构。
- ✅ 事件名一致：`select`、`visibleChange`、`close` 在所有任务中保持。
- ✅ 文件路径全部完整。


