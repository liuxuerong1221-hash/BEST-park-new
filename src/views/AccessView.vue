<template>
  <div class="access">
    <!-- 鑳屾櫙鍥惧眰 -->
    <div class="access__bg" />

    <!-- 宸﹀彸杈规瑁呴グ -->
    <img class="access__frame access__frame--left" src="@/assets/images/left-左.png" alt="" />
    <img class="access__frame access__frame--right" src="@/assets/images/left-右.png" alt="" />

    <!-- 椤堕儴澶撮儴 -->
    <AppHeader class="access__header" />

    <!-- 涓诲唴瀹瑰尯 -->
    <main class="access__body">
      <!-- 宸︿晶锛氳溅杈嗗嚭鍏ョ洃鎺?-->
      <aside class="access__left">
        <VehicleMonitorPanel />
        <AccessTrendPanel title="人员出入趋势" unit="人次" tone="blue" />
        <AccessTrendPanel title="车辆出入趋势" unit="辆" tone="green" />
      </aside>

      <AccessFloatingEntries class="access__floating-entries" />

      <!-- 涓棿锛氬湴鍥?+ 椤堕儴缁熻鏉?+ 鎵撶偣 -->
      <section class="access__center">
        <AccessStatsBar class="access__stats" />

        <div class="access__map">
          <div class="access__map-controls">
            <Compass />
            <FloorSelector
              :selected-floor="selectedFloor"
              @floor-change="selectedFloor = $event"
            />
            <FirstPersonRoamButton />
          </div>
        </div>
      </section>

      <!-- 鍙充晶锛氳瀹㈢粺璁?+ 杞︿綅姒傚喌 + 閫氳璁板綍 -->
      <aside class="access__right">
        <VisitorStatsPanel />
        <ParkingOverviewPanel />
        <AccessRecordPanel />
      </aside>
    </main>

    <!-- 搴曢儴瀵艰埅 -->
    <BottomNav class="access__bottom" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppHeader            from '@/components/common/AppHeader.vue'
import BottomNav            from '@/components/common/BottomNav.vue'
import Compass              from '@/components/common/Compass.vue'
import FloorSelector        from '@/components/common/FloorSelector.vue'
import FirstPersonRoamButton from '@/components/common/FirstPersonRoamButton.vue'
import AccessFloatingEntries from '@/components/common/AccessFloatingEntries.vue'
import VehicleMonitorPanel  from '@/components/panels/VehicleMonitorPanel.vue'
import AccessTrendPanel     from '@/components/panels/AccessTrendPanel.vue'
import VisitorStatsPanel    from '@/components/panels/VisitorStatsPanel.vue'
import ParkingOverviewPanel from '@/components/panels/ParkingOverviewPanel.vue'
import AccessRecordPanel    from '@/components/panels/AccessRecordPanel.vue'
import AccessStatsBar       from '@/components/panels/AccessStatsBar.vue'

const selectedFloor = ref('1F')
</script>

<style lang="scss" scoped>
.access {
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
    align-items: center;
    gap: 0;
    min-width: 0;
  }

  &__floating-entries {
    position: absolute;
    left: calc(40px + #{$panel-left-w} + 24px);
    top: 24px;
    z-index: 12;
  }

  &__stats {
    flex-shrink: 0;
  }

  &__map {
    flex: 1;
    width: 100%;
    position: relative;
    margin-top: 8px;
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
