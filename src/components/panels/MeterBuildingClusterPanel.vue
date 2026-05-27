<template>
  <section class="meter-cluster" aria-label="楼栋聚合点位">
    <header class="meter-cluster__header">
      <span class="meter-cluster__header-cell">建筑名称</span>
    </header>

    <div class="meter-cluster__list">
      <div
        v-for="b in buildings"
        :key="b.id"
        class="meter-cluster__row"
        :class="{ 'meter-cluster__row--active': b.id === selectedId }"
        role="button"
        tabindex="0"
        @click="onSelect(b.id)"
        @keydown.enter.prevent="onSelect(b.id)"
        @keydown.space.prevent="onSelect(b.id)"
      >
        <span class="meter-cluster__name">{{ b.name }}</span>
        <span class="meter-cluster__divider" aria-hidden="true" />
        <span class="meter-cluster__floor">{{ b.floor }}</span>
      </div>
    </div>

    <span class="meter-cluster__stack" aria-hidden="true" />
    <span class="meter-cluster__stack meter-cluster__stack--two" aria-hidden="true" />
  </section>
</template>

<script setup lang="ts">
interface Building {
  id: number
  name: string
  floor: string
}

defineProps<{
  buildings: Building[]
  selectedId?: number | null
}>()

const emit = defineEmits<{
  select: [id: number | null]
}>()

function onSelect(id: number) {
  emit('select', id)
}
</script>

<style lang="scss" scoped>
.meter-cluster {
  position: relative;
  width: 240px;
  background: rgba(5, 25, 49, 0.78);
  border: 1px solid #0B2C52;
  border-radius: $radius-md;
  padding: 0;
  box-shadow: 0 4px 20px rgba(0, 20, 50, 0.45);

  &__header {
    height: 38px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    background: linear-gradient(89deg, rgba(0, 174, 255, 0.22) 0%, rgba(0, 174, 255, 0) 100%);
    border-bottom: 1px solid $color-line;
    border-top-left-radius: $radius-md;
    border-top-right-radius: $radius-md;
  }

  &__header-cell {
    font-size: $font-size-xs;
    font-weight: 600;
    color: $color-text-1;
  }

  &__list {
    display: flex;
    flex-direction: column;
  }

  &__row {
    display: flex;
    align-items: center;
    height: 36px;
    padding: 0 16px;
    gap: 12px;
    cursor: pointer;
    outline: none;
    color: $color-text-2;
    font-size: $font-size-xs;
    transition: background 0.18s ease, color 0.18s ease, box-shadow 0.18s ease;

    &:not(:last-of-type) {
      border-bottom: 1px solid rgba(0, 174, 255, 0.12);
    }

    &:hover,
    &:focus-visible {
      color: $color-text-1;
      background: rgba(0, 174, 255, 0.14);
      box-shadow: inset 2px 0 0 $color-primary-bright;
    }

    &--active {
      color: $color-text-1;
      background: linear-gradient(89deg, rgba(0, 174, 255, 0.28) 0%, rgba(0, 174, 255, 0.08) 100%);
      box-shadow: inset 2px 0 0 $color-primary-bright, inset 0 0 12px rgba(77, 242, 255, 0.16);

      .meter-cluster__name { color: $color-primary-bright; }
    }
  }

  &__name {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__divider {
    width: 1px;
    height: 14px;
    background: rgba(77, 242, 255, 0.45);
  }

  &__floor {
    width: 28px;
    text-align: center;
    font-family: $font-number;
    color: $color-primary-bright;
  }

  // 多层堆叠装饰，模拟楼栋图层叠层效果
  &__stack {
    position: absolute;
    left: 12px;
    right: 12px;
    bottom: -4px;
    height: 4px;
    background: rgba(5, 25, 49, 0.55);
    border: 1px solid #0B2C52;
    border-top: 0;
    border-bottom-left-radius: $radius-md;
    border-bottom-right-radius: $radius-md;

    &--two {
      left: 22px;
      right: 22px;
      bottom: -8px;
      opacity: 0.55;
    }
  }
}
</style>
