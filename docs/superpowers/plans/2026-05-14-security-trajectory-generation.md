# 安防态势 - 轨迹查询：选择人员后生成轨迹 - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `#/security/trajectory` 页面，选中左侧人员后于中间地图区生成可视化轨迹（折线 + 点位），三个控制按钮联动一个沿折线移动的高亮光点。

**Architecture:** 新增共享 mock 数据模块 `trajectoryMockData.ts` 作为单一数据源；新增 `TrajectoryMap.vue` 用 SVG 渲染折线 + 光点动画并复用现有 `MapPinMarker` 组件做点位；现有 `TrajectoryQueryPanel.vue` 通过 `defineModel` 把 `selectedId` 上钻给 view；view 派生 `waypoints` 传给 map。

**Tech Stack:** Vue 3 `<script setup>` + TypeScript + SCSS scoped + 原生 SVG + `requestAnimationFrame`，复用 `MapPinMarker`。

**Verification 约定（项目无测试框架）：**
- 每个任务完成后跑 `npm run build`，要求退出码 0（vue-tsc + vite 通过）
- 涉及 UI 的任务在 `npm run dev` 启动后打开 `http://localhost:5173/#/security/trajectory` 用浏览器人工复核（控制台无报错；视觉与设计预期一致）
- 不写自动化测试

---

## File Structure

| 文件 | 操作 | 责任 |
|------|------|------|
| `src/data/trajectoryMockData.ts` | 新建 | 40 人 mock 列表、按 id 生成活动表的确定性函数、楼栋名→归一化坐标映射 |
| `src/components/panels/TrajectoryMap.vue` | 新建 | 中间地图区：背景占位 + 折线 + 点位 + 播放光点；接收 `waypoints` 与 `playState`，emit `play-end` |
| `src/components/panels/TrajectoryQueryPanel.vue` | 修改 | 改用共享 mock data；`selectedId` 改为 `defineModel`；活动表跟随 selectedId 派生 |
| `src/views/SecurityTrajectoryView.vue` | 修改 | 派生 `waypoints`、装配 `<TrajectoryMap>`、控制按钮调用 `onPlay/onPause/onStop` 并按状态置灰 |

不动 `App.vue`、`variables.scss`、`router/index.ts`、`MapPinMarker.vue` 及任何其他公共组件。

---

## Task 1: 新建共享 mock 数据模块

**Files:**
- Create: `src/data/trajectoryMockData.ts`

- [ ] **Step 1: 创建文件并写入数据模块**

```ts
// src/data/trajectoryMockData.ts

export interface MockPerson {
  id: number
  name: string
  gender: string
  workId: string
  role: 'employee' | 'visitor'
  roleLabel: string
}

export interface MockActivity {
  seq: number
  time: string
  location: string
  device: string
}

export const LOCATION_COORDS: Record<string, { x: number; y: number }> = {
  '1号楼': { x: 0.22, y: 0.36 },
  '2号楼': { x: 0.42, y: 0.58 },
  '3号楼': { x: 0.64, y: 0.32 },
  '4号楼': { x: 0.78, y: 0.62 },
  '5号楼': { x: 0.34, y: 0.78 },
}

const NAMES = ['前红军', '李明华', '王芳', '张伟', '刘强']
const DEVICES = ['门禁设备', '摆闸', '监控']
const LOCATIONS = Object.keys(LOCATION_COORDS)

export const mockPersons: MockPerson[] = Array.from({ length: 40 }, (_, i) => ({
  id: i + 1,
  name: NAMES[i % NAMES.length],
  gender: i % 3 === 2 ? '女' : '男',
  workId: String(2782782 + i * 3),
  role: i % 7 === 3 ? 'visitor' : 'employee',
  roleLabel: i % 7 === 3 ? '访客' : '员工',
}))

/** 简单线性同余 PRNG，保证同一 id 多次调用结果一致 */
function seededRand(seed: number) {
  let s = (seed * 9301 + 49297) % 233280
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

/** 给定人员 id，输出确定性活动表（6–10 条，覆盖 2–4 个楼栋，时间递增） */
export function getActivitiesForPerson(id: number): MockActivity[] {
  const rand = seededRand(id || 1)
  const rowCount = 6 + Math.floor(rand() * 5)            // 6..10
  const visitCount = 2 + Math.floor(rand() * 3)          // 2..4
  const visited = LOCATIONS.slice(0, visitCount)

  // 把 rowCount 行按访问顺序分配到 visitCount 个楼栋
  const rows: MockActivity[] = []
  let seq = 1
  let hour = 12
  let minute = 21
  for (let i = 0; i < visitCount; i++) {
    const isLast = i === visitCount - 1
    const remaining = rowCount - rows.length
    const slotsLeft = visitCount - i
    const stay = isLast ? remaining : Math.max(1, Math.floor(remaining / slotsLeft))
    for (let j = 0; j < stay; j++) {
      const time = `2025-03-19 ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:21`
      rows.push({
        seq,
        time,
        location: visited[i],
        device: DEVICES[Math.floor(rand() * DEVICES.length)],
      })
      seq++
      minute++
      if (minute >= 60) { hour++; minute = 0 }
    }
  }
  return rows
}
```

- [ ] **Step 2: 跑构建确认类型正确**

Run: `npm run build`
Expected: 退出码 0，输出无新增 TS 报错（仅可能有项目原有 Sass legacy / chunk size 警告）

- [ ] **Step 3: Commit**

```bash
git add src/data/trajectoryMockData.ts
git commit -m "feat(security): add shared trajectory mock data module"
```

---

## Task 2: 新建 TrajectoryMap 组件骨架（空态 + 类型 + 背景占位）

**Files:**
- Create: `src/components/panels/TrajectoryMap.vue`

- [ ] **Step 1: 创建组件文件，定义 Props/Emits/类型与空态**

```vue
<!-- src/components/panels/TrajectoryMap.vue -->
<template>
  <div class="trajectory-map" :class="{ 'trajectory-map--empty': !waypoints.length }">
    <!-- 背景网格 -->
    <svg class="trajectory-map__grid" viewBox="0 0 1200 720" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <pattern id="traj-grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M60 0H0V60" fill="none" stroke="rgba(0,174,255,0.08)" stroke-width="0.5" />
        </pattern>
      </defs>
      <rect width="1200" height="720" fill="url(#traj-grid)" />
    </svg>

    <!-- 空态文案 -->
    <div v-if="!waypoints.length" class="trajectory-map__empty-text">
      请从左侧选择人员查看轨迹
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Waypoint {
  location: string
  /** 归一化 0–1 横向坐标 */
  x: number
  /** 归一化 0–1 纵向坐标 */
  y: number
  /** 合并后的序号范围，单点为 '1' 形式 */
  seqRange: string
  /** 第一条记录的 'HH:mm' */
  firstTime: string
}

defineProps<{
  waypoints: Waypoint[]
  playState: 'idle' | 'playing' | 'paused'
}>()

defineEmits<{
  'play-end': []
}>()
</script>

<style lang="scss" scoped>
.trajectory-map {
  position: relative;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 50%, rgba(10, 40, 80, 0.9), rgba(2, 15, 30, 1));
  border: 1px solid $color-border;
  border-radius: $radius-md;
  overflow: hidden;
}

.trajectory-map__grid {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.trajectory-map__empty-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $color-text-2;
  font-size: $font-size-sm;
  letter-spacing: 1px;
  pointer-events: none;
}
</style>
```

- [ ] **Step 2: 跑构建**

Run: `npm run build`
Expected: 退出码 0

- [ ] **Step 3: Commit**

```bash
git add src/components/panels/TrajectoryMap.vue
git commit -m "feat(security): scaffold TrajectoryMap component with grid bg and empty state"
```

---

## Task 3: TrajectoryMap 增加折线 + 点位渲染

**Files:**
- Modify: `src/components/panels/TrajectoryMap.vue`

- [ ] **Step 1: 在 `<script setup>` 末尾追加坐标 computed**

在 `Waypoint` 接口与 `defineEmits` 之间不动；在 `defineEmits<{...}>()` 调用之后追加：

```ts
import { computed } from 'vue'

const props = defineProps<{
  waypoints: Waypoint[]
  playState: 'idle' | 'playing' | 'paused'
}>()
```

> 把原来的 `defineProps<{...}>()` 调用替换为带 `const props = ` 的写法，因为后续 computed 需要引用 `props.waypoints`。

在 `defineEmits` 之后追加：

```ts
const VIEWBOX_W = 1200
const VIEWBOX_H = 720

/** waypoints 在 SVG viewBox 坐标系下的像素点 */
const points = computed(() =>
  props.waypoints.map(w => ({
    ...w,
    px: w.x * VIEWBOX_W,
    py: w.y * VIEWBOX_H,
  }))
)

/** polyline points 字符串 */
const polylinePoints = computed(() =>
  points.value.map(p => `${p.px},${p.py}`).join(' ')
)
</script>
```

最终 `<script setup lang="ts">` 应为：

```ts
import { computed } from 'vue'

export interface Waypoint {
  location: string
  x: number
  y: number
  seqRange: string
  firstTime: string
}

const props = defineProps<{
  waypoints: Waypoint[]
  playState: 'idle' | 'playing' | 'paused'
}>()

defineEmits<{
  'play-end': []
}>()

const VIEWBOX_W = 1200
const VIEWBOX_H = 720

const points = computed(() =>
  props.waypoints.map(w => ({
    ...w,
    px: w.x * VIEWBOX_W,
    py: w.y * VIEWBOX_H,
  }))
)

const polylinePoints = computed(() =>
  points.value.map(p => `${p.px},${p.py}`).join(' ')
)
```

- [ ] **Step 2: 在模板中加入折线 SVG 与点位 HTML 层**

把模板里的空态 `<div v-if="!waypoints.length">` 行**保留**；在它**前面**插入两块新内容（折线 SVG + 点位层），最终模板：

```vue
<template>
  <div class="trajectory-map" :class="{ 'trajectory-map--empty': !waypoints.length }">
    <!-- 背景网格 -->
    <svg class="trajectory-map__grid" viewBox="0 0 1200 720" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <pattern id="traj-grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M60 0H0V60" fill="none" stroke="rgba(0,174,255,0.08)" stroke-width="0.5" />
        </pattern>
      </defs>
      <rect width="1200" height="720" fill="url(#traj-grid)" />
    </svg>

    <!-- 轨迹层（折线 + 端点圆） -->
    <svg
      v-if="points.length"
      class="trajectory-map__lines"
      :viewBox="`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <polyline
        v-if="points.length > 1"
        :points="polylinePoints"
        fill="none"
        stroke="#1DEAFF"
        stroke-width="2"
        stroke-dasharray="6 4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <circle
        v-for="(p, idx) in points"
        :key="`pt-${idx}`"
        :cx="p.px"
        :cy="p.py"
        r="6"
        fill="rgba(29,234,255,0.85)"
        stroke="#0C84FF"
        stroke-width="1.5"
      />
    </svg>

    <!-- 点位层（HTML 绝对定位，复用 MapPinMarker） -->
    <div class="trajectory-map__pins">
      <MapPinMarker
        v-for="(p, idx) in points"
        :key="`pin-${idx}`"
        :x="p.x * 100"
        :y="p.y * 100"
        unit="%"
        :label="`${p.location} · ${p.seqRange}  ${p.firstTime}`"
        :active="idx === 0 || idx === points.length - 1"
      />
    </div>

    <!-- 空态文案 -->
    <div v-if="!waypoints.length" class="trajectory-map__empty-text">
      请从左侧选择人员查看轨迹
    </div>
  </div>
</template>
```

> 注意：`points.length` 与 `polylinePoints` 已经定义在 script 中。`VIEWBOX_W/H` 模板里直接用是合法的（在 `<script setup>` 顶层声明会自动暴露给模板）。

- [ ] **Step 3: 在 script 顶部 import MapPinMarker**

将 `import { computed } from 'vue'` 那行扩充为：

```ts
import { computed } from 'vue'
import MapPinMarker from '@/components/common/MapPinMarker.vue'
```

- [ ] **Step 4: 追加样式**

把现有 `<style lang="scss" scoped>` 中追加：

```scss
.trajectory-map__lines {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  filter: drop-shadow(0 0 6px rgba(29, 234, 255, 0.6));
}

.trajectory-map__pins {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;

  > * {
    pointer-events: auto;
  }
}
```

- [ ] **Step 5: 跑构建**

Run: `npm run build`
Expected: 退出码 0

- [ ] **Step 6: Commit**

```bash
git add src/components/panels/TrajectoryMap.vue
git commit -m "feat(security): render polyline and pins in TrajectoryMap"
```

---

## Task 4: TrajectoryMap 增加播放光点动画

**Files:**
- Modify: `src/components/panels/TrajectoryMap.vue`

- [ ] **Step 1: 在 script 顶部 import 扩展**

把 `import { computed } from 'vue'` 改为：

```ts
import { computed, ref, watch, onUnmounted } from 'vue'
```

- [ ] **Step 2: 在 `polylinePoints` 之后追加动画状态与函数**

```ts
// ── 段长度与累积长度 ──
const segLengths = computed(() => {
  const arr: number[] = []
  for (let i = 1; i < points.value.length; i++) {
    const a = points.value[i - 1]
    const b = points.value[i]
    arr.push(Math.hypot(b.px - a.px, b.py - a.py))
  }
  return arr
})

const totalLength = computed(() =>
  segLengths.value.reduce((s, v) => s + v, 0)
)

// ── 动画状态 ──
const DURATION_MS = 7000
const progress = ref(0)            // 0..1
let rafId = 0
let lastTs = 0

const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const emit = defineEmits<{ 'play-end': [] }>()

/** 由 progress 解出光点在 SVG viewBox 下的坐标 */
const lightPoint = computed<{ cx: number; cy: number } | null>(() => {
  if (props.playState === 'idle') return null
  if (points.value.length < 2) {
    const p = points.value[0]
    return p ? { cx: p.px, cy: p.py } : null
  }
  const target = progress.value * totalLength.value
  let acc = 0
  for (let i = 0; i < segLengths.value.length; i++) {
    const segLen = segLengths.value[i]
    if (target <= acc + segLen || i === segLengths.value.length - 1) {
      const ratio = segLen === 0 ? 0 : Math.min(1, (target - acc) / segLen)
      const a = points.value[i]
      const b = points.value[i + 1]
      return { cx: a.px + (b.px - a.px) * ratio, cy: a.py + (b.py - a.py) * ratio }
    }
    acc += segLen
  }
  return null
})

function step(ts: number) {
  const dt = ts - lastTs
  lastTs = ts
  progress.value = Math.min(1, progress.value + dt / DURATION_MS)
  if (progress.value >= 1) {
    cancelRaf()
    emit('play-end')
    return
  }
  rafId = requestAnimationFrame(step)
}

function cancelRaf() {
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = 0
  }
}

watch(() => props.playState, (s, prev) => {
  if (s === 'playing') {
    if (points.value.length < 2 || prefersReduced) {
      progress.value = 1
      emit('play-end')
      return
    }
    if (prev === 'idle' || progress.value >= 1) progress.value = 0
    lastTs = performance.now()
    rafId = requestAnimationFrame(step)
  } else if (s === 'paused') {
    cancelRaf()
  } else { // idle
    cancelRaf()
    progress.value = 0
  }
})

watch(() => props.waypoints, () => {
  const wasRunning = rafId !== 0 || props.playState !== 'idle'
  cancelRaf()
  progress.value = 0
  if (wasRunning && props.playState !== 'idle') emit('play-end')
})

onUnmounted(() => cancelRaf())
```

> 删除 script 中此前那行单独的 `defineEmits<{ 'play-end': [] }>()` —— 它已被 `const emit = defineEmits...` 取代。

- [ ] **Step 3: 在折线 SVG 的 `<polyline>` 与点位 `<circle v-for>` 之间插入光点 circle**

在 `<svg class="trajectory-map__lines">` 内，紧挨着已有的 `<polyline>` 之后、点位 `<circle v-for>` **之前**追加：

```vue
<circle
  v-if="lightPoint"
  :cx="lightPoint.cx"
  :cy="lightPoint.cy"
  r="9"
  fill="#FFFFFF"
  stroke="#1DEAFF"
  stroke-width="2"
  class="trajectory-map__light"
/>
```

- [ ] **Step 4: 追加光点样式（带柔和 glow）**

在 `<style>` 末尾追加：

```scss
.trajectory-map__light {
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.9))
          drop-shadow(0 0 14px rgba(29, 234, 255, 0.8));
}
```

- [ ] **Step 5: 跑构建**

Run: `npm run build`
Expected: 退出码 0

- [ ] **Step 6: Commit**

```bash
git add src/components/panels/TrajectoryMap.vue
git commit -m "feat(security): add play/pause/stop light point animation along trajectory"
```

---

## Task 5: 改造 TrajectoryQueryPanel 使用共享 mock 与 defineModel

**Files:**
- Modify: `src/components/panels/TrajectoryQueryPanel.vue`

- [ ] **Step 1: 替换 `<script setup>` 内容**

把当前文件的整段 `<script setup lang="ts">` 替换为：

```ts
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
```

> 关键变化：
> 1. `selectedId` 从 `ref(3)` 改为 `defineModel<number>('selectedId', { default: 1 })`
> 2. `persons` 改为来自模块导入
> 3. `activities` 改为根据 `selectedId` 派生的 `computed`
> 4. 删除原来的常量 `activities` 数组

- [ ] **Step 2: 跑构建**

Run: `npm run build`
Expected: 退出码 0

- [ ] **Step 3: 启动 dev 并人工核对**

Run: `npm run dev`
打开 `http://localhost:5173/#/security/trajectory`
预期：
- 人员列表 40 条照常显示，分页可用
- 点击不同人员后右侧"活动轨迹"表格内容随之变化
- 控制台无报错

- [ ] **Step 4: Commit**

```bash
git add src/components/panels/TrajectoryQueryPanel.vue
git commit -m "refactor(security): TrajectoryQueryPanel uses shared mock and v-model selectedId"
```

---

## Task 6: SecurityTrajectoryView 装配 TrajectoryMap 与控制按钮联动

**Files:**
- Modify: `src/views/SecurityTrajectoryView.vue`

- [ ] **Step 1: 替换 `<script setup>` 内容**

把当前文件的整段 `<script setup lang="ts">` 替换为：

```ts
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/common/AppHeader.vue'
import TrajectoryQueryPanel from '@/components/panels/TrajectoryQueryPanel.vue'
import TrajectoryMap, { type Waypoint } from '@/components/panels/TrajectoryMap.vue'
import {
  getActivitiesForPerson,
  LOCATION_COORDS,
} from '@/data/trajectoryMockData'

const router = useRouter()
function goBack() {
  router.push({ name: 'security' })
}

type PlayState = 'idle' | 'playing' | 'paused'
const playState = ref<PlayState>('idle')
const selectedId = ref<number>(1)

const activities = computed(() => getActivitiesForPerson(selectedId.value))

const waypoints = computed<Waypoint[]>(() => {
  const groups = new Map<string, ReturnType<typeof getActivitiesForPerson>>()
  for (const a of activities.value) {
    const list = groups.get(a.location) ?? []
    list.push(a)
    groups.set(a.location, list)
  }
  return [...groups.entries()].map(([location, rows]) => {
    const coord = LOCATION_COORDS[location] ?? { x: 0.5, y: 0.5 }
    const seqs = rows.map(r => r.seq)
    const min = Math.min(...seqs)
    const max = Math.max(...seqs)
    return {
      location,
      x: coord.x,
      y: coord.y,
      seqRange: min === max ? String(min) : `${min}-${max}`,
      firstTime: rows[0].time.slice(11, 16),
    }
  })
})

const canPlay = computed(() => waypoints.value.length >= 1)

function onPlay()  { if (canPlay.value) playState.value = 'playing' }
function onPause() { if (playState.value === 'playing') playState.value = 'paused' }
function onStop()  { playState.value = 'idle' }

function handlePlayEnd() {
  playState.value = 'idle'
}
</script>
```

- [ ] **Step 2: 改模板：左栏面板加 v-model；中间装配 TrajectoryMap；按钮换函数与 disabled**

定位到模板中：
1. `<TrajectoryQueryPanel />` → 替换为 `<TrajectoryQueryPanel v-model:selected-id="selectedId" />`
2. 三个控制按钮的 `@click="playState = '...'"` 分别替换为 `@click="onPlay"`、`@click="onPause"`、`@click="onStop"`，并都加 `:disabled="!canPlay"`
3. `<section class="security-traj__center"><div class="security-traj__map" /></section>` → 替换为 `<section class="security-traj__center"><TrajectoryMap :waypoints="waypoints" :play-state="playState" class="security-traj__map" @play-end="handlePlayEnd" /></section>`

最终模板对应片段：

```vue
<aside class="security-traj__left">
  <TrajectoryQueryPanel v-model:selected-id="selectedId" />
</aside>

<!-- 返回 -->
<button class="security-traj__back" type="button" @click="goBack">
  <!-- ... 保持原样 ... -->
</button>

<!-- 轨迹播放控制 -->
<div class="security-traj__controls">
  <button
    class="security-traj__ctrl-btn"
    :class="{ 'security-traj__ctrl-btn--active': playState === 'playing' }"
    type="button"
    :disabled="!canPlay"
    @click="onPlay"
  >
    <!-- ... 保持原样 ... -->
  </button>

  <button
    class="security-traj__ctrl-btn"
    :class="{ 'security-traj__ctrl-btn--active': playState === 'paused' }"
    type="button"
    :disabled="!canPlay"
    @click="onPause"
  >
    <!-- ... 保持原样 ... -->
  </button>

  <button
    class="security-traj__ctrl-btn"
    :class="{ 'security-traj__ctrl-btn--active': playState === 'idle' }"
    type="button"
    :disabled="!canPlay"
    @click="onStop"
  >
    <!-- ... 保持原样 ... -->
  </button>
</div>

<section class="security-traj__center">
  <TrajectoryMap
    :waypoints="waypoints"
    :play-state="playState"
    class="security-traj__map"
    @play-end="handlePlayEnd"
  />
</section>
```

- [ ] **Step 3: 给 disabled 状态补样式**

在 `<style>` 中找到 `&__ctrl-btn { ... }` 块，在 `&--active { ... }` 之前追加：

```scss
&:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

&:disabled:hover {
  transform: none;
  filter: none;
}
```

- [ ] **Step 4: 跑构建**

Run: `npm run build`
Expected: 退出码 0

- [ ] **Step 5: 启动 dev 全流程人工复核**

Run: `npm run dev`
打开 `http://localhost:5173/#/security/trajectory`，按以下清单逐项检查：

- [ ] 默认进入页面：中间地图区显示 ID=1 的轨迹（折线 + 点位 + 起点终点高亮）
- [ ] 控制台无 Vue/DOM/资源加载报错
- [ ] 点击左侧第二位人员：右侧活动表与中间轨迹同步刷新
- [ ] 切到第三位人员再切回第一位：轨迹形状一致（确定性）
- [ ] 点击"轨迹播放"：白色光点从起点出发沿折线移动，约 7s 到终点，按钮自动回到 idle
- [ ] 播放进行中点"暂停"：光点冻结在当前位置；再点"播放"从冻结处续播
- [ ] 点击"结束"：光点消失，三按钮 active 高亮回到"结束"
- [ ] 播放进行中切换人员：光点消失、轨迹立即换为新人员，按钮自动回 idle
- [ ] 浏览器 DevTools 切到 1080p 分辨率全屏显示，点位与折线对齐不偏移
- [ ] DevTools Rendering → Emulate CSS media feature `prefers-reduced-motion: reduce`，点击"播放"光点不动直接回 idle

- [ ] **Step 6: Commit**

```bash
git add src/views/SecurityTrajectoryView.vue
git commit -m "feat(security): wire TrajectoryMap and play controls in SecurityTrajectoryView"
```

---

## Task 7: 最终回归与跨页验证

**Files:**
- 无修改，仅验证

- [ ] **Step 1: 跑一次完整 build**

Run: `npm run build`
Expected: 退出码 0；无新增 TS / 模板报错

- [ ] **Step 2: dev 模式访问其他路由确认未被波及**

Run: `npm run dev`
依次打开：
- `http://localhost:5173/#/`
- `http://localhost:5173/#/meeting-room`
- `http://localhost:5173/#/access`
- `http://localhost:5173/#/security`
- `http://localhost:5173/#/security/trajectory`

每个路由确认：
- 页面正常渲染
- 控制台无报错
- 与改动前视觉一致（除轨迹页中间区域）

- [ ] **Step 3: 若一切正常，无需再 commit**

---

## Self-Review

**Spec coverage:**
- "选中人员后立即生成折线 + 点位" → Task 3（渲染）+ Task 6（waypoints 派生与传入）
- "播放/暂停/结束控制光点" → Task 4（动画）+ Task 6（按钮调用）
- "同楼合并 + seq 范围" → Task 6 `waypoints` computed
- "确定性 mock 数据" → Task 1 `seededRand`
- "归一化 0–1 坐标 / 后续替换底图" → Task 1 `LOCATION_COORDS` + Task 2 容器背景
- "prefers-reduced-motion" → Task 4 watch 内分支
- "切换人员中断播放" → Task 4 watch waypoints 内 emit `play-end`
- "空态文案" → Task 2
- "按钮 disabled 当无 waypoints" → Task 6

无遗漏。

**Type consistency:**
- `Waypoint` 接口在 Task 2 定义并 `export`，Task 6 通过 `import { type Waypoint }` 引用，命名一致
- `MockPerson` / `MockActivity` 在 Task 1 定义并 `export`，Task 5 引用一致
- `LOCATION_COORDS` / `getActivitiesForPerson` / `mockPersons` 在 Task 1 命名，Task 5、Task 6 引用一致
- `playState` 在 Task 2/4/6 都是 `'idle' | 'playing' | 'paused'`

**Placeholder scan:** 无 TBD/TODO，所有代码块完整。
