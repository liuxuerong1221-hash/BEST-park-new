<template>
  <div class="metric-block" :class="classes" :style="styleVars">
    <div v-if="label && unitPlacement === 'label'" class="metric-block__label-row">
      <span class="metric-block__label">{{ label }}</span>
      <span v-if="unit" class="metric-block__unit metric-block__unit--label">{{ unit }}</span>
    </div>

    <div class="metric-block__value-row">
      <span class="metric-block__value">{{ value }}</span>
      <span v-if="unit && unitPlacement === 'value'" class="metric-block__unit metric-block__unit--value">
        {{ unit }}
      </span>
    </div>

    <span v-if="unit && unitPlacement === 'below'" class="metric-block__unit metric-block__unit--below">
      {{ unit }}
    </span>
    <span v-if="label && unitPlacement !== 'label'" class="metric-block__label">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type UnitPlacement = 'label' | 'value' | 'below'
type Tone = 'primary' | 'bright' | 'accent' | 'success' | 'warning'
type Size = 'sm' | 'md' | 'lg'
type Align = 'start' | 'center' | 'end'

const props = withDefaults(defineProps<{
  label?: string
  value: string | number
  unit?: string
  unitPlacement?: UnitPlacement
  tone?: Tone
  size?: Size
  align?: Align
  gap?: string
}>(), {
  unitPlacement: 'value',
  tone: 'bright',
  size: 'md',
  align: 'start',
})

const classes = computed(() => [
  `metric-block--${props.tone}`,
  `metric-block--${props.size}`,
  `metric-block--align-${props.align}`,
  `metric-block--unit-${props.unitPlacement}`,
])

const styleVars = computed(() => ({
  '--metric-gap': props.gap ?? (props.unitPlacement === 'below' ? '3px' : '5px'),
}))
</script>

<style lang="scss" scoped>
.metric-block {
  display: flex;
  flex-direction: column;
  gap: var(--metric-gap);
  min-width: 0;

  &--align-start { align-items: flex-start; }
  &--align-center { align-items: center; }
  &--align-end { align-items: flex-end; }

  &__label-row,
  &__value-row {
    display: flex;
    align-items: baseline;
  }

  &__label {
    font-size: $font-size-xxs;
    color: $color-text-2;
    white-space: nowrap;
  }

  &__value {
    font-family: $font-number;
    font-weight: bold;
    line-height: 1;
  }

  &--sm &__value { font-size: $font-size-lg; }
  &--md &__value { font-size: $font-size-md; }
  &--lg &__value { font-size: 26px; }

  &--primary &__value { color: $color-primary; }
  &--bright &__value { color: $color-primary-bright; }
  &--accent &__value { color: $color-accent; }
  &--success &__value { color: $color-success; }
  &--warning &__value { color: $color-warning; }

  &__unit {
    color: $color-text-2;
    white-space: nowrap;
  }

  &__unit--label {
    font-size: 10px;
  }

  &__unit--value,
  &__unit--below {
    font-size: $font-size-xxs;
    line-height: 1;
  }
}
</style>
