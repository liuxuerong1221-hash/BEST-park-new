# 设备能耗·楼宇设备二级页面 设计规格

> 日期：2026-05-14
> 状态：已确认

## 概述

新增设备能耗模块的「楼宇设备」二级页面，集成空调、新风机、排风机、送风机四种 HVAC 设备的统计、列表、地图点位和详情面板。

## 路由

| 路径 | 名称 | 组件 |
|------|------|------|
| `/energy/building` | `energy-building` | `EnergyBuildingView.vue` |

入口：`EnergyView` 的 `EnergyFloatingEntries` 中 `building` 按钮，routeMap 从 `'energy'` 改为 `'energy-building'`。

## 页面布局

与 `EnergyLightingView` 完全一致的三栏结构：

```
┌─────────────────────────────────────────────────────────┐
│                      AppHeader                          │
├──────────┬──────────────────────────────┬───────────────┤
│ 左栏      │         中间地图区            │   右栏(条件)  │
│ ┌──────┐ │  [返回按钮]                   │ ┌───────────┐│
│ │Stats │ │                              │ │  Detail   ││
│ └──────┘ │   HvacMapMarker × N          │ │  Panel    ││
│ ┌──────┐ │                              │ │           ││
│ │List  │ │              [Compass]       │ └───────────┘│
│ │Panel │ │              [FloorSelector] │              │
│ └──────┘ │                              │              │
├──────────┴──────────────────────────────┴───────────────┤
│                      BottomNav                          │
└─────────────────────────────────────────────────────────┘
```

## 数据模型

```ts
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
  temperature?: number      // 空调：当前温度
  targetTemp?: number       // 空调：设定温度
  mode?: string             // 空调：运行模式（制冷/制热/送风）
  windSpeed?: number        // 新风机/送风机/排风机：风速
  power?: number            // 所有类型：运行功率 W
  filterStatus?: string     // 新风机：滤网状态
}
```

设备类型中文映射：

| type | 中文 | 图标组件 |
|------|------|----------|
| `air-conditioner` | 空调 | `IconAirConditioner` |
| `fresh-air` | 新风机 | `IconFreshAir` |
| `supply-air` | 送风机 | `IconSupplyAir` |
| `exhaust-air` | 排风机 | `IconExhaustAir` |

## 组件设计

### 1. HvacStatsPanel

- 位置：左栏顶部
- 结构：与 `LightingStatsPanel` 一致，2 张卡片（在线/离线）
- 数据：4 种设备合计在线数 / 离线数
- 图标：复用 `IconAirConditioner` 作为在线图标，新建 `IconHvacOffline`（或复用 `IconAirConditioner` 加灰色处理）
- 实际做法：直接复用 `IconAirConditioner` 并通过 CSS 色调区分在线/离线

### 2. HvacListPanel

- 位置：左栏下方，flex: 1 填满剩余空间
- 标题：「楼宇设备列表」
- 工具栏：
  - 搜索框（按名称/位置搜索）
  - 类型筛选下拉：全部类型 / 空调 / 新风机 / 送风机 / 排风机
  - 状态筛选下拉：全部状态 / 在线 / 离线
- 表格列：设备名称 | 类型 | 位置 | 状态
- 分页：每页 10 条
- 交互：
  - 点击行 → 选中设备 → 右侧显示详情面板
  - 列表可见项变化 → emit `visibleChange` → 地图只显示当前页点位

### 3. HvacDetailPanel

- 位置：右栏，选中设备时显示
- 结构：与 `LightingDetailPanel` 一致
- 基础信息区：名称、设备类型、位置、IP
- 运行数据区（按类型条件渲染）：
  - 空调：运行状态、设定温度、当前温度、运行模式、功率
  - 新风机：运行状态、风速、滤网状态、功率
  - 送风机：运行状态、风速、功率
  - 排风机：运行状态、风速、功率
- 底部关闭按钮

### 4. HvacMapMarker

- 基于 `MapPinMarker` 组件
- Props: `x`, `y`, `label`, `active`, `dimmed`, `type: HvacType`
- 根据 `type` 渲染不同图标 path（从现有 Icon 组件提取 SVG path）
- 不同类型使用不同渐变色区分：
  - 空调：蓝色系
  - 新风机：绿色系
  - 送风机：青色系
  - 排风机：橙色系

## EnergyView 改动

`src/views/EnergyView.vue` 中 `routeMap`：

```ts
building: 'energy-building',  // 原来是 'energy'
```

## 路由注册

`src/router/index.ts` 新增：

```ts
{
  path: '/energy/building',
  name: 'energy-building',
  component: () => import('@/views/EnergyBuildingView.vue'),
}
```

## Mock 数据

页面内生成 mock 数据（与现有 MeterElec/Lighting 页面一致的做法）：
- 总设备数：120 台（空调 40、新风机 30、送风机 25、排风机 25）
- 在线率约 90%
- 位置按 4 栋建筑分配
- 坐标使用 pseudoRandom 生成

## 新增文件清单

| 文件 | 类型 |
|------|------|
| `src/views/EnergyBuildingView.vue` | 页面 |
| `src/components/panels/HvacStatsPanel.vue` | 面板 |
| `src/components/panels/HvacListPanel.vue` | 面板 |
| `src/components/panels/HvacDetailPanel.vue` | 面板 |
| `src/components/common/HvacMapMarker.vue` | 地图点位 |

## 修改文件清单

| 文件 | 改动 |
|------|------|
| `src/router/index.ts` | 新增 `/energy/building` 路由 |
| `src/views/EnergyView.vue` | routeMap `building` 指向 `'energy-building'` |

## 验收标准

- `npm run build` 通过
- `#/energy/building` 可正常打开
- 左上统计面板显示在线/离线合计
- 列表支持搜索、类型筛选、状态筛选、分页
- 点击列表项 → 地图对应点位高亮 + 右侧详情面板展开
- 详情面板根据设备类型展示不同运行数据字段
- 从 EnergyView 点击「楼宇设备」入口可跳转到新页面
- 返回按钮可回到 EnergyView
