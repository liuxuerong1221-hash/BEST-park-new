# 设备能耗·电表二级页面 设计文档

日期: 2026-05-13
作者: 刘雪融 + Claude
范围: 设备能耗模块·电表二级页面

## 背景

设备能耗页面 `#/energy` 左侧浮层 `EnergyFloatingEntries` 已经列出 7 个胶囊按钮入口（电表、水表、摄像头、楼宇设备、照明回路、广播、信息发布屏），但点击「电表」目前仍回到 `#/energy` 自身。原型已给出电表二级页面，本次需按原型实现。

视觉规范和交互语言与通行态势二级页面（`AccessGateView`、`GateStatsPanel`、`GateListPanel`、`GateMapMarker`、`GateDetailPanel`）完全一致，本次不引入新的视觉样式，只复用现有样式或在 class 命名上替换为电表语义。

## 目标

1. 新增路由 `#/energy/meter-elec` 和视图 `EnergyMeterElecView`。
2. 从「电表」胶囊按钮跳入二级页面，显示左侧统计 + 电表列表、中间地图（含电表点位和楼栋聚合点位）、右侧电表详情。
3. 楼栋聚合点位与左侧列表联动：点击楼栋 → 左侧列表筛选该楼栋、中间地图仅高亮该楼栋电表点位。
4. 复用通行态势二级页的所有外壳样式、面板样式、表格样式、分页样式，不新增全局 token、不新增样式变量。

## 非目标

1. 右侧详情面板不做监控画面、远程控制、人员记录等通行态势特有能力。
2. 本次不沉淀楼栋聚合点位为 `common/` 组件。首先作为电表页面内的局部组件交付；后续其它能耗子页（水表、广播等）复用时再统一抽取。
3. 不接入真实 API，数据全部使用 mock。
4. 不调整 `App.vue` 缩放逻辑、`variables.scss` token、`BasePanel` 等公共组件。

## 路由

`src/router/index.ts` 新增：

```ts
{
  path: '/energy/meter-elec',
  name: 'energy-meter-elec',
  component: () => import('@/views/EnergyMeterElecView.vue'),
}
```

`src/views/EnergyView.vue` 的 `onEntrySelect` routeMap 中把 `'meter-elec': 'energy'` 改为 `'meter-elec': 'energy-meter-elec'`，其它胶囊按钮保持不变。

## 文件清单

| 文件 | 类型 | 职责 |
|---|---|---|
| `src/views/EnergyMeterElecView.vue` | 页面 | 整体布局、状态编排、返回按钮、联动逻辑 |
| `src/components/panels/MeterStatsPanel.vue` | 面板 | 左侧顶部「357 在线 / 35 离线」统计卡片 |
| `src/components/panels/MeterListPanel.vue` | 面板 | 左侧电表列表（搜索、状态筛选、表格、分页） |
| `src/components/panels/MeterDetailPanel.vue` | 面板 | 右侧电表详情（基础信息 + 运行数据 + 关闭） |
| `src/components/panels/MeterBuildingClusterPanel.vue` | 面板 | 地图右下角的楼栋聚合点位浮层 |
| `src/components/common/MeterMapMarker.vue` | 点位 | 地图上的电表点位（带数字徽章） |
| `src/components/icons/IconMeterOnline.vue` | 图标 | 在线设备统计卡片图标 |
| `src/components/icons/IconMeterOffline.vue` | 图标 | 离线设备统计卡片图标 |

## 页面布局 `EnergyMeterElecView.vue`

以 `AccessGateView.vue` 为模板：

- 外壳：`.meter-elec`，BEM 前缀 `meter-elec__`。
- `__bg`、`__frame--left/right`、`__header`、`__bottom` 完全复刻 access-gate 的尺寸和定位。
- `__body` 使用 grid `$panel-left-w 1fr $panel-right-w`。
- 返回按钮 `__back` 定位在左侧栏右侧、地图上方，复用 access-gate 的 SVG 圆形+文字样式，点击 `router.push({ name: 'energy' })`。
- 中间 `__center/__map` 承载 `MeterMapMarker` 列表 + `MeterBuildingClusterPanel`。
- 右侧 `__right` 根据 `detailVisible` 控制显隐。

## 面板组件

### `MeterStatsPanel`

- 完全克隆 `GateStatsPanel`，仅替换：
  - 标题 `电表设备统计`
  - 图标组件改为 `IconMeterOnline` / `IconMeterOffline`
  - 默认数据 357 在线 / 35 离线
- class 命名 `meter-stats`、`meter-stats__body`，其余 `.stat-card` 复用同名 class（局部 scoped 避免跨组件干扰）。

### `MeterListPanel`

- 以 `GateListPanel` 为蓝本，同步保留搜索框、状态筛选下拉、分页器。
- Props：
  - `meters: Meter[]`
  - `selectedId?: number`
  - `filterBuildingId?: number | null`
- Emits：
  - `select(id)`
  - `visibleChange(ids)`（用于地图点位渲染）
- 列结构仍是 `设备名称 / 位置 / 状态` 三列，数据示意：
  - `name: '电表1' ... '电表392'`
  - `location` 从「南大门 / 建筑楼1 1F / 建筑楼2 2F / 建筑楼3 F3 / 建筑楼4 F1」等中循环取值
  - `status` 前 357 条 `online`，后 35 条 `offline`
- 过滤逻辑：关键字 + 状态 + `filterBuildingId`（若非空，仅展示 `meter.buildingId === filterBuildingId` 的条目，同时重置到第 1 页）。

### `MeterDetailPanel`

- 以 `GateDetailPanel` 为蓝本，去掉：
  - 监控画面、放大 Modal
  - 远程开启/关闭控制按钮
  - 人员进出记录区块
  - 底部 hover 关闭按钮
- 保留：
  - 头部「电表」标题 + 圆点装饰 + 右上角关闭按钮
  - 基础信息区：名称（电表1）、位置（建筑1二楼201房间）、IP（SD-DFEIN）、状态（在线/离线）
  - 运行数据区：当前电表值（如 `200Kwh`）
- 新增视觉细节（与原型一致）：
  - 基础信息、运行数据前加一个圆形序号标记 `01` / `02`，由 `section + span` 实现（仅用 CSS，不引入图标库）
  - 底部居中「关闭」按钮（样式复用 `gate-detail__control-btn`）
- class 前缀 `meter-detail__`，样式从 `GateDetailPanel` 中对应模块复制过来，仅删除不需要的样式分支。

### `MeterBuildingClusterPanel`

- 显示在中间地图区右下角，浮层固定定位。
- 结构：
  - 表头一行「建筑名称」
  - 数据行：`建筑楼X` + `F1/F2/F3/F4` 楼层标签
- 交互：
  - 点击行 → `emit('select', buildingId)`；已选中行再次点击 → 取消选中（emit null）。
  - 选中态复用 `gate-row--selected` 的渐变底色 + 左侧 2px 高亮条规则（在 scoped 样式中写相同效果）。
- Props：
  - `buildings: Building[]`
  - `selectedId?: number | null`
- 不使用 `BasePanel`（原型是独立浮层，而非正式面板），外壳手写 `rgba(5, 25, 49, 0.64)` 底色 + `#0B2C52` 边框 + 8px 圆角，这些值均已在 access-gate 详情面板使用过，不视作新 token。

## 地图点位

### `MeterMapMarker`

- 以 `GateMapMarker` 为骨架。
- 视觉：白色方框内含电表图标（复用 `IconMeterOnline` 的 svg path），图标上方浮标签 `21/1`（即「编号/本点位设备数」，与原型一致）。为简化，组件接收 `label`（如 `21`）和 `count`（如 `1`）两个 props，合并展示 `${label}/${count}`。
- 选中态：高亮蓝色光晕（复用 access-gate 的选中效果）。
- 灰显态：当页面存在 `activeBuildingId` 且当前点位不属于该楼栋时，整体透明度降到 `0.35`，禁用点击。

## 数据 mock

在 `EnergyMeterElecView.vue` 顶部：

```ts
interface Meter {
  id: number
  name: string
  location: string
  ip: string
  status: 'online' | 'offline'
  buildingId: number
  x: number
  y: number
}

interface Building {
  id: number
  name: string
  floors: string  // 'F1' | 'F2' | 'F3' | 'F4' 等
}
```

- `meters`: 392 条，status 同上面规则。`buildingId` 在 1~4 之间循环，让每楼栋都有若干点位。
- `buildings`: 4 条，分别对应原型右下角浮层中的 4 行。

## 联动与状态

`EnergyMeterElecView` 持有：

- `selectedMeterId: number | null` — 控制右侧详情和列表高亮
- `detailVisible: boolean`
- `visibleMeterIds: number[]` — 列表当前页要显示的点位，来自 `MeterListPanel` emit
- `selectedBuildingId: number | null` — 楼栋联动状态

数据流：

- 点击胶囊入口进入页面 → 初始 `selectedBuildingId = null`、列表第一页、地图显示该页 10 个点位。
- 点击某条电表行 → 更新 `selectedMeterId` + `detailVisible = true` + 右侧详情显示。
- 点击某个楼栋行 → 更新 `selectedBuildingId` → `MeterListPanel` 内部根据 `filterBuildingId` 重新分页 → 通过 `visibleChange` emit 更新 `visibleMeterIds` → 地图中该楼栋下的点位高亮、其它楼栋点位灰显。
- 再次点击已选楼栋行 → `selectedBuildingId = null` → 返回全园区视图。
- 点击右侧详情关闭按钮 → `detailVisible = false`。
- 点击左上角返回按钮 → `router.push({ name: 'energy' })`。

## 验收清单

- [ ] `npm run build` 通过（vue-tsc + Vite）。
- [ ] `#/` `#/meeting-room` `#/access` 三个已有页面无视觉/控制台回归。
- [ ] `#/energy` 点击「电表」胶囊按钮跳到 `#/energy/meter-elec`，其它胶囊按钮仍维持原逻辑。
- [ ] `#/energy/meter-elec` 打开时：
  - [ ] 左上顶部统计卡片正常显示在线/离线数
  - [ ] 左下电表列表渲染，支持关键词搜索、状态筛选、分页
  - [ ] 中间地图显示当前页电表点位
  - [ ] 右下角楼栋聚合浮层显示 4 行楼栋数据
  - [ ] 点击楼栋行 → 左侧列表只显示该楼栋电表，地图点位灰/亮变化，右上角详情面板（若已打开）同步保持
  - [ ] 再点一次 → 筛选取消，回到全量显示
  - [ ] 点击电表行或点位 → 右侧详情面板显示该电表基础信息 + 当前电表值
  - [ ] 右侧详情面板「关闭」按钮和右上角关闭按钮都能收起面板
  - [ ] 左上角返回按钮跳回 `#/energy`
- [ ] 页面整体视觉（背景、边框、顶部、底部导航、面板外壳、分页、状态徽章）与 `#/access/gate` 完全一致。

## 风险与缓解

- **风险**：从 `GateDetailPanel` 裁剪监控/控制/人员记录时误删 CSS 依赖。**缓解**：`MeterDetailPanel` 从零新建并按需复制需要的块，不做继承；每个样式块复制前先读原文件确认闭合。
- **风险**：楼栋聚合浮层定位在地图区内，容易与地图控件（指南针/楼层选择器）在其它页面复用时冲突。**缓解**：本次仅在电表页面内部使用，后续抽取公共组件时再统一在 `common/` 下处理定位冲突。
- **风险**：电表列表改为按楼栋筛选时，分页状态未重置导致出现空白页。**缓解**：`MeterListPanel` watch `filterBuildingId` 的变化，变化时将 `currentPage` 重置为 1。

## 后续工作（不在本次范围）

- 水表、广播、信息发布屏、楼宇设备、照明回路的同形二级页面，可基于本次产物扩展（必要时将 `MeterStatsPanel` / `MeterListPanel` / `MeterBuildingClusterPanel` 抽象为通用「设备列表二级页」组件）。
- 楼栋聚合点位在地图中「切层」查看某楼层内设备点位的二层下钻（需求文档提到），当前仅完成「筛选」一层。
