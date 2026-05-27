<template>
  <div class="segmented-tabs" role="group" :aria-label="ariaLabel">
    <button
      v-for="item in options"
      :key="item.value"
      class="segmented-tabs__item"
      :class="{ 'segmented-tabs__item--active': modelValue === item.value }"
      :style="{ width: `${itemWidth}px` }"
      type="button"
      @click="$emit('update:modelValue', item.value)"
    >
      {{ item.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  modelValue: string
  options: Array<{
    label: string
    value: string
  }>
  ariaLabel?: string
  itemWidth?: number
}>(), {
  ariaLabel: '切换选项',
  itemWidth: 46,
})

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<style lang="scss" scoped>
.segmented-tabs {
  display: flex;
  gap: 0;

  &__item {
    height: 24px;
    border: 1px solid rgba(0, 174, 255, 0.4);
    background: rgba(0, 174, 255, 0.06);
    color: $color-text-2;
    font-size: $font-size-xxs;
    line-height: 22px;
    cursor: pointer;
    transition: background 0.18s ease, color 0.18s ease, box-shadow 0.18s ease;
    padding: 0;
    white-space: nowrap;

    &:first-child {
      border-radius: $radius-sm 0 0 $radius-sm;
    }

    &:last-child {
      border-radius: 0 $radius-sm $radius-sm 0;
      border-left: none;
    }

    &--active {
      background: rgba(0, 174, 255, 0.28);
      color: $color-text-1;
      box-shadow: inset 0 0 6px rgba(77, 242, 255, 0.45);
    }

    &:hover:not(&--active) {
      color: $color-text-1;
      background: rgba(0, 174, 255, 0.18);
    }
  }
}
</style>
