<template>
  <BasePanel class="energy-camera-stats" title="摄像头设备统计">
    <div class="energy-camera-stats__body">
      <div class="stat-card stat-card--online">
        <IconCameraOnlineNew :size="60" />
        <div class="stat-card__info">
          <span class="stat-card__num stat-card__num--cool">142</span>
          <span class="stat-card__label">在线(台)</span>
        </div>
      </div>
      <div class="stat-card stat-card--offline">
        <IconCameraOfflineNew :size="60" />
        <div class="stat-card__info">
          <span class="stat-card__num stat-card__num--warm">8</span>
          <span class="stat-card__label">离线(台)</span>
        </div>
      </div>
    </div>
  </BasePanel>
</template>

<script setup lang="ts">
import BasePanel from '@/components/common/BasePanel.vue'
import IconCameraOnlineNew from '@/components/icons/IconCameraOnlineNew.vue'
import IconCameraOfflineNew from '@/components/icons/IconCameraOfflineNew.vue'
</script>

<style lang="scss" scoped>
.energy-camera-stats {
  &__body {
    display: flex;
    align-items: stretch;
    gap: $spacing-sm;
    padding: $spacing-xs 0 $spacing-sm;
  }
}

.stat-card {
  flex: 1;
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-sm $spacing-md;
  border-radius: $radius-sm;
  background: linear-gradient(135deg, rgba(0, 60, 120, 0.30) 0%, rgba(0, 30, 70, 0.18) 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    border-left: 8px solid $color-primary;
    border-bottom: 8px solid transparent;
  }

  &--online  { box-shadow: inset 0 0 12px rgba(68, 181, 242, 0.16); }
  &--offline { box-shadow: inset 0 0 12px rgba(249, 185, 51, 0.16); }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  &__num {
    font-family: $font-number;
    font-size: 26px;
    font-weight: bold;
    line-height: 1;

    &--cool {
      color: #A9E1FF;
      text-shadow: 0 0 10px rgba(68, 181, 242, 0.55);
    }

    &--warm {
      color: #FFE48A;
      text-shadow: 0 0 10px rgba(249, 185, 51, 0.55);
    }
  }

  &__label {
    font-size: $font-size-xxs;
    color: $color-text-2;
    white-space: nowrap;
  }
}
</style>
