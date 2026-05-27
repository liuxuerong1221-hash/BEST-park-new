<template>
  <BasePanel class="building-device" title="楼宇设备监测">
    <div class="building-device__grid">
      <div
        v-for="device in devices"
        :key="device.type"
        class="building-device__card"
      >
        <div class="building-device__card-corner" />
        <div class="building-device__card-body">
          <div class="building-device__icon-row">
            <div class="building-device__icon-wrapper">
              <component :is="device.icon" class="building-device__icon" />
              <span class="building-device__particle building-device__particle--1" />
              <span class="building-device__particle building-device__particle--2" />
              <span class="building-device__particle building-device__particle--3" />
              <span class="building-device__particle building-device__particle--4" />
              <span class="building-device__particle building-device__particle--5" />
            </div>
            <span class="building-device__name">{{ device.label }}</span>
          </div>
          <div class="building-device__stats-col">
            <div class="building-device__stat">
              <span class="building-device__stat-label">开启</span>
              <div class="building-device__stat-value-row">
                <span class="building-device__stat-num building-device__stat-num--open">{{ device.open }}</span>
                <span class="building-device__stat-unit">个</span>
              </div>
            </div>
            <div class="building-device__stat building-device__stat--close">
              <span class="building-device__stat-label">关闭</span>
              <div class="building-device__stat-value-row">
                <span class="building-device__stat-num building-device__stat-num--close">{{ device.close }}</span>
                <span class="building-device__stat-unit building-device__stat-unit--close">个</span>
              </div>
            </div>
            <div class="building-device__stat building-device__stat--fault">
              <span class="building-device__stat-label">故障</span>
              <div class="building-device__stat-value-row">
                <span class="building-device__stat-num building-device__stat-num--fault">{{ device.fault }}</span>
                <span class="building-device__stat-unit building-device__stat-unit--fault">个</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BasePanel>
</template>

<script setup lang="ts">
import BasePanel from '@/components/common/BasePanel.vue'
import IconAirConditioner from '@/components/icons/IconAirConditioner.vue'
import IconFreshAir from '@/components/icons/IconFreshAir.vue'
import IconSupplyAir from '@/components/icons/IconSupplyAir.vue'
import IconExhaustAir from '@/components/icons/IconExhaustAir.vue'

const devices = [
  { type: 'fresh-air', label: '新风机', icon: IconFreshAir, open: 10, close: 20, fault: 1 },
  { type: 'air-conditioner', label: '空调', icon: IconAirConditioner, open: 10, close: 20, fault: 1 },
  { type: 'supply-air', label: '送风机', icon: IconSupplyAir, open: 10, close: 20, fault: 1 },
  { type: 'exhaust-air', label: '排风机', icon: IconExhaustAir, open: 10, close: 20, fault: 1 },
]
</script>

<style lang="scss" scoped>
.building-device {
  flex: 1;
  min-height: 0;
  overflow: hidden;

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 8px;
    flex: 1;
    min-height: 0;
    margin-top: 6px;
  }

  &__card {
    position: relative;
    border: 1px solid rgba(68, 181, 242, 0.2);
    background: linear-gradient(180deg, rgba(2, 28, 66, 0) 0%, #011C4C 99%);
    overflow: hidden;
    min-height: 0;
    display: flex;
  }

  &__card-corner {
    position: absolute;
    top: 1px;
    left: 1px;
    width: 4px;
    height: 4px;
    background: #43C6EA;
  }

  &__card-body {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 10px 12px;
    flex: 1;
    min-height: 0;
  }

  &__icon-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  &__icon-wrapper {
    position: relative;
    flex-shrink: 0;
    width: 56px;
    height: 58px;
  }

  &__icon {
    width: 56px;
    height: 56px;
  }

  &__particle {
    position: absolute;
    border-radius: 50%;
    background: #EDD505;
    opacity: 0;
    pointer-events: none;
    will-change: transform, opacity;
    animation: particle-float linear infinite;

    &--1 {
      width: 2px;
      height: 2px;
      left: 30%;
      bottom: 22%;
      animation-duration: 2s;
      animation-delay: 0s;
    }

    &--2 {
      width: 2.5px;
      height: 2.5px;
      left: 40%;
      bottom: 18%;
      animation-duration: 2.2s;
      animation-delay: 0.4s;
    }

    &--3 {
      width: 2px;
      height: 2px;
      left: 50%;
      bottom: 24%;
      background: #4DF2FF;
      animation-duration: 2.1s;
      animation-delay: 0.8s;
    }

    &--4 {
      width: 1.5px;
      height: 1.5px;
      left: 60%;
      bottom: 20%;
      animation-duration: 2.4s;
      animation-delay: 1.2s;
    }

    &--5 {
      width: 2px;
      height: 2px;
      left: 70%;
      bottom: 26%;
      animation-duration: 1.8s;
      animation-delay: 1.6s;
    }
  }

  &__name {
    font-size: 14px;
    font-weight: 500;
    color: #FFFFFF;
    line-height: 20px;
  }

  &__stats-col {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 6px;
    flex: 1;
    min-width: 0;
    min-height: 0;
  }

  &__stat {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 3px 8px;
    border-radius: $radius-sm;
    background: linear-gradient(90deg, rgba(0, 174, 255, 0.1) 0%, rgba(0, 174, 255, 0) 100%);
    border-left: 2px solid rgba(0, 174, 255, 0.5);

    &--fault {
      background: linear-gradient(90deg, rgba(255, 72, 72, 0.14) 0%, rgba(255, 72, 72, 0) 100%);
      border-left-color: #FF4848;
    }

    &--close {
      background: linear-gradient(90deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0) 100%);
      border-left-color: rgba(255, 255, 255, 0.3);
    }
  }

  &__stat-label {
    font-size: 12px;
    color: $color-text-2;
  }

  &__stat-value-row {
    display: inline-flex;
    align-items: baseline;
    gap: 2px;
  }

  &__stat-num {
    font-family: DINPro, $font-number;
    font-size: 16px;
    font-weight: 500;
    color: $color-primary-bright;
    line-height: 1;

    &--open {
      color: $color-primary-bright;
    }

    &--close {
      color: rgba(255, 255, 255, 0.5);
    }

    &--fault {
      color: #FF4848;
    }
  }

  &__stat-unit {
    font-size: 10px;
    color: $color-text-2;

    &--close {
      color: rgba(255, 255, 255, 0.5);
    }

    &--fault {
      color: #FF4848;
    }
  }
}

@keyframes particle-float {
  0% {
    opacity: 0;
    transform: translateY(0);
  }
  10% {
    opacity: 0.8;
  }
  70% {
    opacity: 0.4;
  }
  100% {
    opacity: 0;
    transform: translateY(-34px);
  }
}
</style>
