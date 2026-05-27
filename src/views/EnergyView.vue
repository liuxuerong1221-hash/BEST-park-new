<template>
  <div class="energy">
    <!-- 背景图层 -->
    <div class="energy__bg" />

    <!-- 左右边框装饰 -->
    <img class="energy__frame energy__frame--left"  src="@/assets/images/left-左.png" alt="" />
    <img class="energy__frame energy__frame--right" src="@/assets/images/left-右.png" alt="" />

    <!-- 顶部头部 -->
    <AppHeader class="energy__header" />

    <!-- 主内容区 -->
    <main class="energy__body">
      <!-- 左侧 -->
      <aside class="energy__left">
        <EnergyCompareChart />
        <EnergyTrendChart title="用电能耗变化趋势" type="elec" />
        <EnergyTrendChart title="用水能耗变化趋势" type="water" />
      </aside>

      <EnergyFloatingEntries
        class="energy__floating-entries"
        @select="onEntrySelect"
      />

      <!-- 中间：地图区 + 指南针 / 楼层 -->
      <section class="energy__center">
        <div class="energy__map">
          <div class="energy__map-controls">
            <Compass />
            <FloorSelector
              :selected-floor="selectedFloor"
              @floor-change="selectedFloor = $event"
            />
            <FirstPersonRoamButton />
          </div>
        </div>
      </section>

      <!-- 右侧 -->
      <aside class="energy__right">
        <TodayEnergyStats />
        <LightingMonitorPanel />
        <BuildingDevicePanel />
      </aside>
    </main>

    <!-- 底部导航 -->
    <BottomNav class="energy__bottom" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader           from '@/components/common/AppHeader.vue'
import BottomNav           from '@/components/common/BottomNav.vue'
import Compass             from '@/components/common/Compass.vue'
import FloorSelector       from '@/components/common/FloorSelector.vue'
import FirstPersonRoamButton from '@/components/common/FirstPersonRoamButton.vue'
import EnergyFloatingEntries from '@/components/common/EnergyFloatingEntries.vue'
import type { EnergyEntryKind } from '@/components/common/EnergyFloatingEntries.vue'
import TodayEnergyStats    from '@/components/panels/TodayEnergyStats.vue'
import EnergyCompareChart  from '@/components/charts/EnergyCompareChart.vue'
import EnergyTrendChart    from '@/components/charts/EnergyTrendChart.vue'
import LightingMonitorPanel from '@/components/panels/LightingMonitorPanel.vue'
import BuildingDevicePanel from '@/components/panels/BuildingDevicePanel.vue'

const router = useRouter()

const selectedFloor = ref('1F')

function onEntrySelect(kind: EnergyEntryKind) {
  const routeMap: Record<EnergyEntryKind, string> = {
    camera: 'energy-camera',
    'meter-elec': 'energy-meter-elec',
    'meter-water': 'energy-meter-water',
    building: 'energy-building',
    lighting: 'energy-lighting',
    broadcast: 'energy-broadcast',
    display: 'energy-display-screen',
  }
  const target = routeMap[kind]
  if (target && target !== router.currentRoute.value.name) {
    router.push({ name: target })
  }
}

</script>

<style lang="scss" scoped>
.energy {
  width: $screen-width;
  height: $screen-height;
  position: relative;
  overflow: hidden;
  background-color: $color-bg;
  font-family: $font-body;

  &__bg {
    position: absolute;
    inset: 0;
    background-image: url('@/assets/images/大屏背景@2x.png');
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
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 0;
  }

  &__floating-entries {
    position: absolute;
    left: calc(40px + #{$panel-left-w} + 24px);
    top: 24px;
    z-index: 12;
  }

  &__map {
    flex: 1;
    width: 100%;
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
