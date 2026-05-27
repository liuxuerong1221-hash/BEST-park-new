<template>
  <BasePanel class="meeting-stats" title="会议室统计列表">
    <div class="meeting-stats__body">
      <div class="stat-card stat-card--in-use">
        <IconMeetingInUse :size="60" />
        <div class="stat-card__info">
          <span class="stat-card__num stat-card__num--warm">35</span>
          <span class="stat-card__label">使用中(个)</span>
        </div>
      </div>
      <div class="stat-card stat-card--idle">
        <IconMeetingIdle :size="60" />
        <div class="stat-card__info">
          <span class="stat-card__num stat-card__num--cool">12</span>
          <span class="stat-card__label">空闲中(个)</span>
        </div>
      </div>
    </div>
  </BasePanel>
</template>

<script setup lang="ts">
import BasePanel        from '@/components/common/BasePanel.vue'
import IconMeetingInUse from '@/components/icons/IconMeetingInUse.vue'
import IconMeetingIdle  from '@/components/icons/IconMeetingIdle.vue'
</script>

<style lang="scss" scoped>
.meeting-stats {
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

  &--in-use { box-shadow: inset 0 0 12px rgba(249, 185, 51, 0.16); }
  &--idle   { box-shadow: inset 0 0 12px rgba(68, 181, 242, 0.16); }

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

    &--warm {
      color: #FFE48A;
      text-shadow: 0 0 10px rgba(249, 185, 51, 0.55);
    }

    &--cool {
      color: #A9E1FF;
      text-shadow: 0 0 10px rgba(68, 181, 242, 0.55);
    }
  }

  &__label {
    font-size: $font-size-xxs;
    color: $color-text-2;
    white-space: nowrap;
  }
}
</style>
