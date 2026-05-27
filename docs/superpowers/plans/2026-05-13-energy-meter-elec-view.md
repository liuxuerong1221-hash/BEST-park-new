# 设备能耗·电表二级页面 实施计划

> 依据 spec: `docs/superpowers/specs/2026-05-13-energy-meter-elec-view-design.md`

**Goal:** 基于通行态势二级页面的既有样式，新增设备能耗「电表」二级页面，支持统计/列表/地图点位/详情面板/楼栋聚合点位联动。

**Architecture:** 克隆 `AccessGateView` + 通行态势相关面板组件作为模板，裁剪不需要的监控/控制/人员记录逻辑，补上楼栋聚合点位浮层并与电表列表/地图点位双向联动。

**Tech Stack:** Vue 3 setup、TS、SCSS scoped、vue-router、Element Plus（仅用于可选 ElMessage）。

---

## 执行顺序

1. 新增电表统计图标 `IconMeterOnline.vue`、`IconMeterOffline.vue`。
2. 新增面板 `MeterStatsPanel.vue`、`MeterListPanel.vue`、`MeterDetailPanel.vue`、`MeterBuildingClusterPanel.vue`。
3. 新增地图点位 `MeterMapMarker.vue`。
4. 新增 `EnergyMeterElecView.vue`。
5. 注册路由、更新 `EnergyView` 的 `routeMap`。
6. `npm run build` 验证。
