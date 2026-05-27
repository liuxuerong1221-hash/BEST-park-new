# 信息发布屏二级页面 设计文档

- 创建日期：2026-05-14
- 模块归属：设备能耗
- 路由：`/energy/display-screen`
- 返回入口：`/energy`

---

## 1. 背景与目标

需求文档《BEST 园区集成可视化管理平台》将信息发布屏归在“设备能耗”模块。当前项目已实现电表（`EnergyMeterElecView`）、水表（`EnergyMeterWaterView`）、摄像头（`SecurityCameraView`）等同类二级页面，本页面在视觉与交互上完全对齐既有模式：

- 沿用“左列表 + 中间地图 + 右详情”的三栏布局
- 详情面板的图片预览弹窗复用摄像头视频弹窗的视觉骨架，将动态视频替换为静态图片
- 详情面板增加“远程操控”能力，按钮与门禁详情面板（`GateDetailPanel`）对齐

---

## 2. 页面结构

```
┌─────────────────────────────────────────────────────────┐
│                    AppHeader                             │
├──────────────┬──────────────────────┬──────────────────┤
│ 列表面板      │   地图区             │ 详情面板          │
│  - 搜索/筛选  │   - 点位标记         │  - 基础信息      │
│  - 表格       │   - 返回按钮         │  - 当前播放内容  │
│  - 分页       │   - 罗盘/楼层选择    │  - 远程操控      │
├──────────────┴──────────────────────┴──────────────────┤
│                   BottomNav                              │
└─────────────────────────────────────────────────────────┘
```

栅格基线与 `EnergyMeterElecView` 保持一致：
`grid-template-columns: $panel-left-w 1fr $panel-right-w; gap: 8px; padding: 0 40px;`

---

## 3. 新增文件清单

| 文件 | 职责 |
| --- | --- |
| `src/views/EnergyDisplayScreenView.vue` | 页面编排，管理选中、可见列表、详情显隐 |
| `src/components/panels/DisplayScreenListPanel.vue` | 左栏列表（搜索/筛选/表格/分页） |
| `src/components/panels/DisplayScreenDetailPanel.vue` | 右栏详情 + 图片预览弹窗 + 远程操控 |
| `src/components/common/DisplayScreenMapMarker.vue` | 地图点位标记（在线/离线两种态） |
| `src/components/icons/IconDisplayScreenOnline.vue` | 在线图标（参考 `IconMeterOnline`） |
| `src/components/icons/IconDisplayScreenOffline.vue` | 离线图标（参考 `IconMeterOffline`） |

`src/router/index.ts` 增加路由：

```ts
{
  path: '/energy/display-screen',
  name: 'energy-display-screen',
  component: () => import('@/views/EnergyDisplayScreenView.vue'),
}
```

---

## 4. 数据结构

```ts
export interface DisplayScreenDevice {
  id: number
  name: string                       // 设备名称
  building: string                   // 楼栋
  floor: string                      // 楼层
  location: string                   // 安装位置
  ip: string                         // IP 地址
  status: 'online' | 'offline'       // 在线/离线
  currentContent: string             // 当前播放内容名称
  contentImage: string               // 当前播放内容静态图片地址
  position?: { x: number; y: number } // 地图坐标（百分比 0~1）
}
```

视图层 `EnergyDisplayScreenView.vue` 内置一组 mock 数据（10 条），与电表页保持一致量级，待接口接入后替换。

---

## 5. 列表面板（DisplayScreenListPanel）

### 5.1 顶部工具栏
- 搜索输入框：按设备名称模糊匹配
- 楼栋下拉：从设备数据汇总去重生成（“全部楼栋” + 各楼栋）
- 状态下拉：全部状态 / 在线 / 离线

### 5.2 表格
- 列：`设备名称`、`安装位置`、`状态`
- 行高、奇偶背景、选中态、左侧高亮条与电表/水表面板一致
- 行点击 emit `select(id)`；行键盘 Enter/Space 选中
- 行可见区间通过 IntersectionObserver 上报 `visibleChange(ids)` 给页面，用于地图点位高亮联动

### 5.3 分页
复用电表/水表页的分页器（上一页/下一页 + 页码 + 跳转）。每页 10 条。

### 5.4 Props/Events
```ts
defineProps<{
  devices: DisplayScreenDevice[]
  selectedId: number | null
}>()

defineEmits<{
  (e: 'select', id: number): void
  (e: 'visibleChange', ids: number[]): void
}>()
```

---

## 6. 中间地图区

- 复用 `EnergyView` 的地图底图与 `Compass`、`FloorSelector` 控件
- 点位组件 `DisplayScreenMapMarker`：在线态使用青色调，离线态使用灰色调
- 点位 hover 显示设备名称浮层；点击 emit `select(id)`，与列表联动
- 返回按钮位置：
  ```scss
  position: absolute;
  left: calc(40px + #{$panel-left-w} + 24px);
  top: 24px;
  z-index: 12;
  ```
  点击 `router.push({ name: 'energy' })`。

---

## 7. 详情面板（DisplayScreenDetailPanel）

### 7.1 结构
```
┌─────────────────────────────┐
│ ● 设备名称              [×] │   ← 标题 + 关闭
├─────────────────────────────┤
│ 设备名称：xxx               │
│ 安装位置：xxx               │
│ IP 地址：xxx                │
│ 设备状态：在线              │
├─────────────────────────────┤
│ 当前播放内容                │
│ ┌─────────┐                 │
│ │ 缩略图   │  内容名称       │
│ │         │  [展开预览]      │
│ └─────────┘                 │
├─────────────────────────────┤
│ 远程操控                    │
│  [远程开启]   [远程关闭]     │
├─────────────────────────────┤
│         [ 关闭 ]            │
└─────────────────────────────┘
```

### 7.2 当前播放内容区
- 左侧缩略图：固定宽 120px、高 80px，`object-fit: cover`，`border: 1px solid rgba(0,174,255,0.3)`
- 右侧文本：内容名称 + “展开预览”链接按钮
- 点击缩略图或“展开预览” → 打开图片预览弹窗

### 7.3 远程操控区
按钮样式与 `GateDetailPanel` 一致：

```scss
.display-screen-detail__control-btn {
  min-width: 100px;
  height: 36px;
  border: 1px solid rgba(0, 174, 255, 0.5);
  background: linear-gradient(0deg, rgba(1, 158, 244, 0.5) -19%, rgba(14, 33, 56, 0) 100%);
  color: #ffffff;
  font-weight: 700;
  font-size: 14px;
  border-radius: 4px;
}
```

行为：
- 两个按钮：`远程开启`、`远程关闭`，居中、间距 12px
- 状态联动：`status === 'online'` 时禁用“远程开启”，`status === 'offline'` 时禁用“远程关闭”
- 禁用态：40% 透明度
- 点击触发二次确认：
  ```ts
  ElMessageBox.confirm(
    `确定要${action === 'open' ? '开启' : '关闭'}「${device.name}」吗？`,
    '远程操控确认',
    {
      type: 'warning',
      confirmButtonText: action === 'open' ? '确定开启' : '确定关闭',
      cancelButtonText: '取消',
      customClass: 'screen-confirm-box',
    },
  )
  ```
- 确认成功后：`ElMessage.success(\`${device.name}已${action === 'open' ? '开启' : '关闭'}\`)`，并将本地 `controlState` 切换。后端接口接入前不持久化设备 `status`，只在面板内态切换以反馈交互。

### 7.4 图片预览弹窗
通过 `<Teleport to="body">` 渲染：

- 全屏遮罩：`background: rgba(0,12,30,0.78); backdrop-filter: blur(8px)`
- 主体卡片：最大宽度 1280px、最大高度 80vh、`border: 1px solid rgba(0,174,255,0.45)`
- 图片区：`object-fit: contain`，保留摄像头弹窗的网格叠加 `::before`，**去掉扫描线**
- 底部条：左侧「设备名称 · 安装位置」，右侧「当前播放内容：xxx」
- 关闭：右上角 X 按钮 + 遮罩点击 + ESC 键
- 打开/关闭使用淡入淡出过渡（200ms）

可访问性：弹窗根节点 `role="dialog" aria-modal="true"`，关闭按钮 `aria-label="关闭预览"`。

### 7.5 Props/Events
```ts
defineProps<{ device: DisplayScreenDevice }>()
defineEmits<{ (e: 'close'): void }>()
```

---

## 8. 视图编排（EnergyDisplayScreenView）

```ts
const screens = ref<DisplayScreenDevice[]>(mockScreens)
const selectedId = ref<number | null>(null)
const detailVisible = ref(false)
const visibleIds = ref<number[]>(screens.value.slice(0, 10).map(s => s.id))

const selectedScreen = computed(() =>
  selectedId.value == null ? undefined : screens.value.find(s => s.id === selectedId.value)
)

function selectScreen(id: number) {
  selectedId.value = id
  detailVisible.value = true
}
```

模板结构：

```vue
<div class="display-screen-view">
  <AppHeader />
  <div class="display-screen-view__body">
    <DisplayScreenListPanel
      :devices="screens"
      :selected-id="selectedId"
      @select="selectScreen"
      @visible-change="ids => visibleIds = ids"
    />
    <section class="display-screen-view__center">
      <BackButton @click="router.push({ name: 'energy' })" />
      <MapCanvas>
        <DisplayScreenMapMarker
          v-for="s in screens"
          :key="s.id"
          :device="s"
          :selected="s.id === selectedId"
          :visible="visibleIds.includes(s.id)"
          @select="selectScreen"
        />
      </MapCanvas>
      <Compass />
      <FloorSelector />
    </section>
    <aside v-if="detailVisible && selectedScreen" class="display-screen-view__right">
      <DisplayScreenDetailPanel
        :device="selectedScreen"
        @close="detailVisible = false"
      />
    </aside>
  </div>
  <BottomNav />
</div>
```

---

## 9. 样式与设计 Token

- 颜色、间距、面板外壳全部走 `BasePanel` 与 `variables.scss`
- 不在本页面新增颜色 token；按钮渐变直接以字面量沿用门禁样式
- 弹窗与摄像头弹窗共用网格叠加思路，但本页面单独维护一份样式（避免耦合）

---

## 10. 验收清单

- 路由 `/energy/display-screen` 可正常打开，`npm run build` 通过
- 列表搜索、楼栋筛选、状态筛选生效，分页可翻页
- 点击列表行 → 右侧详情显示；点击地图点位 → 列表选中并联动
- 缩略图/展开链接 → 弹窗显示静态图片，ESC、点击遮罩、右上角 X 均可关闭
- 远程开启/关闭按钮按状态正确禁用；点击有二次确认弹窗，确认后 `ElMessage` 成功提示并切换内态
- 返回按钮回到 `/energy`
- 控制台无 Vue/资源加载报错
