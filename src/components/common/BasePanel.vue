<template>
  <section class="base-panel">
    <div v-if="$slots.actions" class="base-panel__header">
      <PanelTitle :title="title" />
      <div class="base-panel__actions">
        <slot name="actions" />
      </div>
    </div>
    <PanelTitle v-else :title="title" />
    <slot />
  </section>
</template>

<script setup lang="ts">
import PanelTitle from '@/components/common/PanelTitle.vue'

defineProps<{ title: string }>()
</script>

<style lang="scss" scoped>
.base-panel {
  width: 100%;
  background: $color-bg-panel;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  overflow: hidden;
  padding: $spacing-sm $spacing-md;
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
  }

  &__header :deep(.panel-title) {
    flex: 1;
    min-width: 0;
  }

  &__actions {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    margin-left: $spacing-sm;
  }
}
</style>
