<template>
  <div class="security">
    <!-- 背景图层 -->
    <div class="security__bg" />

    <!-- 左右边框装饰 -->
    <img class="security__frame security__frame--left"  src="@/assets/images/left-左.png" alt="" />
    <img class="security__frame security__frame--right" src="@/assets/images/left-右.png" alt="" />

    <!-- 顶部头部 -->
    <AppHeader class="security__header" />

    <!-- 主内容区 -->
    <main class="security__body">
      <!-- 左侧 -->
      <aside class="security__left">
        <CameraTypeStatsPanel />
        <KeyMonitoringPanel />
      </aside>

      <!-- 浮动入口：与通行态势同层级，绝对定位于 body -->
      <SecurityFloatingEntries class="security__floating-entries" />

      <!-- 中间:入侵告警 + 地图区 + 指南针 / 楼层 -->
      <section class="security__center">
        <IntrusionAlertBar class="security__alert" />
        <div class="security__map">
          <div class="security__map-controls">
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
      <aside class="security__right">
        <AlertHandlingPanel />
        <AlertLineChart />
        <AlertListPanel />
      </aside>
    </main>

    <!-- 底部导航 -->
    <BottomNav class="security__bottom" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SecurityFloatingEntries from '@/components/common/SecurityFloatingEntries.vue'
import AppHeader            from '@/components/common/AppHeader.vue'
import BottomNav            from '@/components/common/BottomNav.vue'
import Compass              from '@/components/common/Compass.vue'
import FloorSelector        from '@/components/common/FloorSelector.vue'
import FirstPersonRoamButton from '@/components/common/FirstPersonRoamButton.vue'
import IntrusionAlertBar    from '@/components/common/IntrusionAlertBar.vue'
import CameraTypeStatsPanel from '@/components/panels/CameraTypeStatsPanel.vue'
import KeyMonitoringPanel   from '@/components/panels/KeyMonitoringPanel.vue'
import AlertHandlingPanel   from '@/components/panels/AlertHandlingPanel.vue'
import AlertListPanel       from '@/components/panels/AlertListPanel.vue'
import AlertLineChart       from '@/components/charts/AlertLineChart.vue'

const selectedFloor = ref('1F')
</script>

<style lang="scss" scoped>
.security {
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
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 0;
  }

  &__alert {
    position: relative;
    z-index: 12;
    margin-top: 24px;
    flex-shrink: 0;
  }

  &__map {
    flex: 1;
    width: 100%;
    position: relative;
  }

  &__floating-entries {
    position: absolute;
    left: calc(40px + #{$panel-left-w} + 24px);
    top: 24px;
    z-index: 12;
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
