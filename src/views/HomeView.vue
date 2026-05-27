<template>
  <div class="dashboard">
    <!-- 背景图层 -->
    <div class="dashboard__bg" />

    <!-- 左右边框装饰（覆盖在最顶层） -->
    <img class="dashboard__frame dashboard__frame--left"  src="@/assets/images/left-左.png" alt="" />
    <img class="dashboard__frame dashboard__frame--right" src="@/assets/images/left-右.png" alt="" />

    <!-- 顶部头部 -->
    <AppHeader class="dashboard__header" />

    <!-- 主内容区 -->
    <main class="dashboard__body">

      <!-- 左侧数据面板 -->
      <aside class="dashboard__left">
        <EnergyStatsPanel />
        <EnergyBarChart />
        <EnvLineChart />
        <AlertLineChart />
      </aside>

      <FloatingEntry class="dashboard__floating-entry" />

      <!-- 中间：环境条 + 地图区 -->
      <section class="dashboard__center">
        <StatsBar class="dashboard__stats" />
        <!-- 地图区（透明，背景透出） -->
        <div class="dashboard__map">
          <!-- 指南针 + 楼层选择器（统一容器居中对齐） -->
          <div class="dashboard__map-controls">
            <Compass />
            <FloorSelector />
            <FirstPersonRoamButton />
          </div>
        </div>
      </section>

      <!-- 右侧数据面板（顺序：人员 → 车位 → 设备） -->
      <aside class="dashboard__right">
        <PersonnelPanel />
        <ParkingPanel />
        <DeviceStatusPanel />
      </aside>

    </main>

    <!-- 底部导航 -->
    <BottomNav class="dashboard__bottom" />
  </div>
</template>

<script setup lang="ts">
import AppHeader        from '@/components/common/AppHeader.vue'
import BottomNav        from '@/components/common/BottomNav.vue'
import Compass          from '@/components/common/Compass.vue'
import FloorSelector    from '@/components/common/FloorSelector.vue'
import FirstPersonRoamButton from '@/components/common/FirstPersonRoamButton.vue'
import FloatingEntry    from '@/components/common/FloatingEntry.vue'
import EnergyStatsPanel from '@/components/panels/EnergyStatsPanel.vue'
import DeviceStatusPanel from '@/components/panels/DeviceStatusPanel.vue'
import PersonnelPanel   from '@/components/panels/PersonnelPanel.vue'
import ParkingPanel     from '@/components/panels/ParkingPanel.vue'
import StatsBar         from '@/components/panels/StatsBar.vue'
import EnergyBarChart   from '@/components/charts/EnergyBarChart.vue'
import EnvLineChart     from '@/components/charts/EnvLineChart.vue'
import AlertLineChart   from '@/components/charts/AlertLineChart.vue'
</script>

<style lang="scss" scoped>
.dashboard {
  width: $screen-width;
  height: $screen-height;
  position: relative;
  overflow: hidden;
  background-color: $color-bg;
  font-family: $font-body;

  &__bg {
    position: absolute;
    inset: 0;
    background-image: url('@/assets/images/大屏背景@2x.jpg');
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

  &__center {
    display: flex;
    flex-direction: column;
  }

  &__floating-entry {
    position: absolute;
    left: calc(40px + #{$panel-left-w} + 24px);
    top: 24px;
    z-index: 12;
  }

  &__stats {
    flex-shrink: 0;
    align-self: center;
    margin-top: 10px;
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
</style>
