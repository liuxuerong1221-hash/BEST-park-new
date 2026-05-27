# 安防态势 - 轨迹查询：选择人员后生成轨迹

**Date**: 2026-05-14
**Scope**: `#/security/trajectory` 路由
**Status**: Draft, awaiting review

## 背景

当前 `SecurityTrajectoryView.vue` 已经渲染好左侧 `TrajectoryQueryPanel`（人员列表 + 活动表）和顶部播放/暂停/结束三个控制按钮，但中间地图区 `security-traj__map` 是空容器，三个控制按钮也只是切换 `playState` 字符串，没有任何视觉反馈。本次需求：

- 选中人员后在中间地图区生成该人员的活动轨迹（折线 + 点位）
- 播放/暂停/结束按钮联动一个沿折线移动的高亮光点

## 目标 / 非目标

**目标**
- 选中左侧人员，立即在中间地图区显示折线 + 点位（默认全量可见，无需点播放）
- 播放按钮触发一个高亮光点沿折线从起点跑到终点（约 7s），暂停冻结，结束清除
- 不同人员对应不同活动表与不同轨迹，且对同一人员来回切换结果稳定
- 同一楼栋多次出现的活动行合并为一个点位

**非目标**
- 不接入真实地图/GeoJSON
- 不做 ECharts geo
- 不实现真实后端，所有数据为本地 mock
- 不在本次引入园区平面图底图（用占位背景，后续替换底图改一个 CSS 即可）

## 整体架构

```
SecurityTrajectoryView.vue
├── TrajectoryQueryPanel.vue        左侧 (改动)
│     v-model:selected-id  ←→  selectedId
└── TrajectoryMap.vue                中间 (新增)
      :waypoints, :play-state, @play-end

src/data/trajectoryMockData.ts       数据源 (新增)
  - mockPersons: 40 条
  - getActivitiesForPerson(id): MockActivity[]
  - LOCATION_COORDS: 楼栋名 → 归一化坐标
```

数据流：

1. `TrajectoryQueryPanel` 选中人员 → 通过 `defineModel('selectedId')` 上钻
2. `SecurityTrajectoryView` 拿到 `selectedId`，用 `computed` 派生：
   - 当前活动表 `activities = getActivitiesForPerson(selectedId)`
   - 当前 `waypoints`：按出现顺序去重 location，查 `LOCATION_COORDS` 拿到归一化坐标，附带 seq 范围与 firstTime
3. `TrajectoryMap` 接收 `waypoints` 与 `playState`，渲染折线/点位/光点动画
4. 动画跑完后 `emit('play-end')`，view 把 `playState` 切回 `'idle'`

## 详细设计

### 1. `src/data/trajectoryMockData.ts`（新建）

唯一的 mock 数据源，避免 panel 与 view 两侧数据脱节。

```ts
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
  location: string  // '1号楼' / '2号楼' / ...
  device: string
}

export const LOCATION_COORDS: Record<string, { x: number; y: number }> = {
  '1号楼': { x: 0.22, y: 0.36 },
  '2号楼': { x: 0.42, y: 0.58 },
  '3号楼': { x: 0.64, y: 0.32 },
  '4号楼': { x: 0.78, y: 0.62 },
  '5号楼': { x: 0.34, y: 0.78 },
}

export const mockPersons: MockPerson[]  // 沿用现有 panel 的 40 条生成规则
export function getActivitiesForPerson(id: number): MockActivity[]
```

`getActivitiesForPerson` 行为：
- 用 `id` 作为 seed（简单线性同余）输出确定性结果，同一 id 反复调用结果一致
- 每人 6–10 条活动行，覆盖 2–4 个楼栋，时间在 `2025-03-19` 当天递增
- 楼栋取自 `Object.keys(LOCATION_COORDS)`
- 设备名在 `['门禁设备', '摆闸', '监控']` 中循环

### 2. `src/components/panels/TrajectoryMap.vue`（新建）

**Props / Emits**

```ts
interface Waypoint {
  location: string
  x: number  // 归一化 0–1
  y: number  // 归一化 0–1
  seqRange: string  // '1-5' / '6'
  firstTime: string  // 'HH:mm'
}

defineProps<{
  waypoints: Waypoint[]
  playState: 'idle' | 'playing' | 'paused'
}>()
defineEmits<{ 'play-end': [] }>()
```

**渲染层（自下而上）**

1. **背景占位**（CSS）
   - 径向渐变 `radial-gradient(rgba(10,40,80,0.9), rgba(2,15,30,1))`
   - 上叠一层 `<svg>` 网格纹（60px × 60px，描边 `rgba(0,174,255,0.08)`）
   - 后续替换设计稿底图：把背景改为 `background-image: url(...)` 即可

2. **轨迹层**：单个 `<svg>`，`viewBox="0 0 1200 720"`，`preserveAspectRatio="xMidYMid meet"`，`width: 100%; height: 100%`
   - 真实坐标 = 归一化坐标 × (1200, 720)
   - `<polyline>` 串起所有 waypoints，`stroke="#1DEAFF"`，`stroke-width="2"`，`stroke-dasharray="6 4"`，`filter` 加一层 drop-shadow 发光
   - `<circle r="6">` 动画光点（仅 playing/paused 渲染）

3. **点位层**：HTML 绝对定位
   - 复用 `MapPinMarker`（项目现有），位置按 `left: x*100%; top: y*100%`
   - 点位旁附小标签卡片：`location · seqRange` + 第二行 `firstTime`
   - 起点/终点用 `MapPinMarker` 的 `active` 状态高亮

4. **空状态**：`waypoints.length === 0` 时只渲染背景 + 居中文字"请从左侧选择人员查看轨迹"

**动画逻辑**

```ts
// 预计算
const segLengths = computed(() => 段长度数组)
const totalLength = computed(() => sum(segLengths.value))

// 状态
const progress = ref(0)  // 0..1
let rafId = 0
let lastTs = 0
const DURATION_MS = 7000

function step(ts: number) {
  const dt = ts - lastTs; lastTs = ts
  progress.value = Math.min(1, progress.value + dt / DURATION_MS)
  if (progress.value >= 1) {
    cancelAnimationFrame(rafId); rafId = 0
    emit('play-end')
    return
  }
  rafId = requestAnimationFrame(step)
}

// playState 监听
watch(() => props.playState, (s, prev) => {
  if (s === 'playing') {
    if (prev === 'idle' || progress.value >= 1) progress.value = 0
    lastTs = performance.now()
    rafId = requestAnimationFrame(step)
  } else if (s === 'paused') {
    if (rafId) { cancelAnimationFrame(rafId); rafId = 0 }
  } else { // idle
    if (rafId) { cancelAnimationFrame(rafId); rafId = 0 }
    progress.value = 0
  }
})

// waypoints 变更：取消动画并重置；如果当时正在播放，emit play-end 让 view 切回 idle
watch(() => props.waypoints, () => {
  const wasRunning = rafId !== 0 || props.playState !== 'idle'
  if (rafId) { cancelAnimationFrame(rafId); rafId = 0 }
  progress.value = 0
  if (wasRunning && props.playState !== 'idle') emit('play-end')
})
```

光点坐标：根据 `progress * totalLength` 找到落在哪一段，再在该段内线性插值。

**Reduced motion**：`window.matchMedia('(prefers-reduced-motion: reduce)')` 命中时跳过 RAF，光点直接放在终点，并立刻 `emit('play-end')`。

**单点退化**：`waypoints.length === 1` 时不画折线；按下播放立即 `emit('play-end')`。

**清理**：`onUnmounted` 取消 rafId。

### 3. `SecurityTrajectoryView.vue`（修改）

```vue
<aside class="security-traj__left">
  <TrajectoryQueryPanel v-model:selected-id="selectedId" />
</aside>

<section class="security-traj__center">
  <TrajectoryMap
    :waypoints="waypoints"
    :play-state="playState"
    @play-end="playState = 'idle'"
  />
</section>
```

新增 `computed`：

```ts
const activities = computed(() => getActivitiesForPerson(selectedId.value))

const waypoints = computed<Waypoint[]>(() => {
  const groups = new Map<string, MockActivity[]>()
  for (const a of activities.value) {
    if (!groups.has(a.location)) groups.set(a.location, [])
    groups.get(a.location)!.push(a)
  }
  return [...groups.entries()].map(([location, rows]) => {
    const coord = LOCATION_COORDS[location] ?? { x: 0.5, y: 0.5 }
    const seqs = rows.map(r => r.seq)
    const min = Math.min(...seqs), max = Math.max(...seqs)
    return {
      location,
      x: coord.x,
      y: coord.y,
      seqRange: min === max ? String(min) : `${min}-${max}`,
      firstTime: rows[0].time.slice(11, 16),  // 'HH:mm'
    }
  })
})
```

**控制按钮逻辑微调**

```ts
const canPlay = computed(() => waypoints.value.length >= 1)

function onPlay()  { if (canPlay.value) playState.value = 'playing' }
function onPause() { if (playState.value === 'playing') playState.value = 'paused' }
function onStop()  { playState.value = 'idle' }
```

按钮 `:disabled="!canPlay"`，模板中 `@click` 改为对应函数。

> 注：当前模板 `playState !== ...` 仅用于视觉高亮 active；改动只新增 disabled 与函数封装，不破坏现有样式。

### 4. `TrajectoryQueryPanel.vue`（修改）

最小侵入：

- `import { mockPersons, getActivitiesForPerson } from '@/data/trajectoryMockData'`
- 删除当前文件内 `persons` 数组和静态 `activities` 数组
- `const selectedId = defineModel<number>('selectedId', { default: 1 })`
- `const activities = computed(() => getActivitiesForPerson(selectedId.value))`
- 模板里 `selectedId === person.id`、`@click="selectedId = person.id"` 等保持不变

默认 `selectedId = 1` 保证页面初次进入就能看到一条样例轨迹。

### 5. 样式

`TrajectoryMap` 根节点：

```scss
.trajectory-map {
  position: relative;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 50%, rgba(10,40,80,0.9), rgba(2,15,30,1));
  border: 1px solid $color-border;
  border-radius: $radius-md;
  overflow: hidden;
}
```

折线发光通过 `filter: drop-shadow(0 0 6px rgba(29,234,255,0.6))`。所有颜色尽量复用 `variables.scss` 已有 token；轨迹专属的 `#1DEAFF` 与 `#4DF2FF` 复用现有 trajectory view 内已有色值，不进 `variables.scss`。

## 错误处理 / 边界

- 楼栋名不在 `LOCATION_COORDS` 中：fallback 到 `{x: 0.5, y: 0.5}`，不报错
- `selectedId` 不在 `mockPersons` 中：`getActivitiesForPerson` 仍返回稳定数组（用 id 直接 seed）
- `waypoints` 为空：地图区显示空态文案；播放按钮 disabled
- 切换人员时正在播放：watch waypoints 取消 RAF、重置 progress，并 emit `play-end`，view 把 `playState` 切回 idle，按钮自然复位
- 容器尺寸变化：SVG `preserveAspectRatio` 自适应；点位用百分比定位无需测量

## 测试 / 验收

- `npm run build` 退出码 0（vue-tsc + vite）
- 打开 `#/security/trajectory`：
  - 默认显示 ID 为 1 的人员的活动表与轨迹
  - 控制台无报错
  - 切换不同人员，活动表与轨迹同步变化
  - 同一人员切到别人再切回来，轨迹保持一致
- 三个控制按钮：
  - 播放：光点从起点出发跑到终点（约 7s），跑完自动回 idle
  - 暂停（仅 playing 时）：光点冻结
  - 结束：光点消失，progress 归零
  - 没选人员或单点轨迹时按钮表现合理
- 全屏（`App.vue` 缩放）下点位与折线对齐
- 控制台 prefers-reduced-motion 模拟开启时光点直接落在终点

## 影响范围

| 文件 | 改动 |
|------|------|
| `src/data/trajectoryMockData.ts` | 新建 |
| `src/components/panels/TrajectoryMap.vue` | 新建 |
| `src/components/panels/TrajectoryQueryPanel.vue` | 改用共享 mock data，`selectedId` 改为 `defineModel` |
| `src/views/SecurityTrajectoryView.vue` | 派生 waypoints、装配 `<TrajectoryMap>`、控制按钮逻辑微调 |

不动公共组件（`BasePanel`、`MetricBlock`、`AnimatedIconFrame`、`MapPinMarker` 等）。
不动 `App.vue`、`variables.scss`、`router/index.ts`。

## 风险与缓解

- **风险**：临时背景与最终设计稿底图比例不一致，导致替换底图后点位坐标错位
  - 缓解：归一化坐标 0–1，未来替换底图后只需要调 `LOCATION_COORDS` 中 5 个值
- **风险**：RAF 动画长时间运行 CPU 占用
  - 缓解：仅在 `playState === 'playing'` 时启动 rafId，其他状态全部 cancel；progress 跑到 1 自动停止
- **风险**：`MapPinMarker` 在小尺寸地图区内 hover 标签溢出
  - 缓解：地图容器 `overflow: hidden`，标签做截断
