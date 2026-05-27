<template>
  <BasePanel class="parking-panel" title="车位统计">
    <div class="parking-panel__body">

      <div class="parking-panel__col parking-panel__col--used">
        <img class="parking-panel__icon" :src="iconUsed" alt="已使用" />
        <MetricBlock label="已使用" value="275" unit-placement="below" tone="accent" size="lg" align="center" gap="8px" />
      </div>

      <div class="parking-panel__col parking-panel__col--total">
        <AnimatedIconFrame :src="iconTotal" effect="none" tone="cyan" :size="58" />
        <MetricBlock label="车位总数" value="278" unit-placement="below" tone="bright" size="lg" align="center" gap="8px" />
      </div>

      <div class="parking-panel__col parking-panel__col--free">
        <img class="parking-panel__icon" :src="iconFree" alt="空闲中" />
        <MetricBlock label="空闲中" value="3" unit-placement="below" tone="success" size="lg" align="center" gap="8px" />
      </div>

    </div>
  </BasePanel>
</template>

<script setup lang="ts">
import BasePanel from '@/components/common/BasePanel.vue'
import AnimatedIconFrame from '@/components/common/AnimatedIconFrame.vue'
import MetricBlock from '@/components/common/MetricBlock.vue'
import iconUsed from '@/assets/images/icon/车位-已使用.svg'
import iconTotal from '@/assets/images/车位总数.svg'
import iconFree from '@/assets/images/icon/车位-空闲.svg'
</script>

<style lang="scss" scoped>
.parking-panel {
  gap: $spacing-md;

  &__body {
    display: flex;
    gap: $spacing-xs;
    padding: 0 $spacing-xs;
  }

  &__col {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: $spacing-md $spacing-xs;
    border-radius: $radius-sm;

    &--used, &--free {
      background: linear-gradient(198deg, rgba(10, 44, 83, 0.7) 21%, rgba(5, 25, 49, 0) 90%);
    }

    &--total {
      background: linear-gradient(198deg, #133E72 19%, rgba(5, 25, 49, 0) 90%);
    }
  }

  &__icon {
    width: 58px;
    height: 58px;
    flex-shrink: 0;
    object-fit: contain;
    display: block;
  }
}
</style>
