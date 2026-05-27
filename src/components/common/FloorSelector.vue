<template>
  <div class="floor-selector">
    <div class="floor-selector__inner">

      <!-- 标题 -->
      <div class="floor-selector__header" :class="{ 'floor-selector__header--no-border': !expanded }">
        <span class="floor-selector__title">BEST园区</span>
      </div>

      <!-- 时间轴列表 -->
      <div v-show="expanded" class="floor-selector__timeline">
        <div class="floor-selector__line" />
        <div v-for="b in buildings" :key="b.key" class="floor-selector__row">
          <!-- 左侧：建筑名 -->
          <div
            class="floor-selector__left"
            :class="{ 'floor-selector__left--active': activeBuilding === b.key }"
            @click="activeBuilding = b.key"
          >
            <span class="floor-selector__name">{{ b.name }}</span>
          </div>
          <!-- 右侧：菱形 + 楼层 -->
          <div
            class="floor-selector__right"
            :class="{ 'floor-selector__right--active': activeFloor === b.key }"
            @click="selectFloor(b)"
          >
            <span class="floor-selector__diamond-wrap">
              <span class="floor-selector__diamond" />
            </span>
            <span class="floor-selector__floor">{{ b.floor }}</span>
          </div>
        </div>
      </div>

      <!-- 底部圆形按钮：收起/展开 -->
      <div class="floor-selector__footer">
        <button class="floor-selector__btn" :class="{ 'floor-selector__btn--collapsed': !expanded }" @click="expanded = !expanded">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="2"  y="2"  width="9" height="9" rx="1.5" fill="#00AEFF"/>
            <rect x="13" y="2"  width="9" height="9" rx="1.5" fill="#00AEFF"/>
            <rect x="2"  y="13" width="9" height="9" rx="1.5" fill="#00AEFF"/>
            <rect x="13" y="13" width="9" height="9" rx="1.5" fill="#00AEFF"/>
          </svg>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'

interface Building {
  key: string
  name: string
  floor: string
}

const buildings = reactive<Building[]>([
  { key: 'b1', name: '建筑楼1', floor: '5F'  },
  { key: 'b2', name: '建筑楼2', floor: '4F'  },
  { key: 'b3', name: '建筑楼3', floor: '3F'  },
  { key: 'b4', name: '建筑楼4', floor: '2F'  },
  { key: 'b5', name: '建筑楼5', floor: '1F'  },
  { key: 'b6', name: '建筑楼6', floor: 'B1F' },
])

const props = defineProps<{
  selectedFloor?: string
}>()

const emit = defineEmits<{
  floorChange: [floor: string]
}>()

const activeBuilding = ref('b2')
const activeFloor = ref('b5')
const expanded = ref(true)

watch(
  () => props.selectedFloor,
  floor => {
    if (!floor) return
    const target = buildings.find(item => item.floor === floor)
    if (target) activeFloor.value = target.key
  },
  { immediate: true },
)

function selectFloor(building: Building) {
  activeFloor.value = building.key
  emit('floorChange', building.floor)
}
</script>

<style lang="scss" scoped>
.floor-selector {
  width: 151px;
  background: rgba(5, 25, 49, 0.64);
  border: 1px solid $color-border;
  border-radius: $radius-md;
  backdrop-filter: blur(4px);

  &__inner {
    padding: $spacing-sm;
    display: flex;
    flex-direction: column;
  }

  // ── 标题 ──────────────────────────────
  &__header {
    padding: 4px 0 8px;
    text-align: center;
    border-bottom: 1px solid $color-line;
    margin-bottom: 4px;

    &--no-border {
      border-bottom: none;
      margin-bottom: 0;
    }
  }

  &__title {
    font-size: $font-size-sm;
    font-weight: 700;
    color: $color-text-1;
    white-space: nowrap;
  }

  // ── 时间轴 ────────────────────────────
  // 列宽：name(flex-1) | diamond(20px) | floor(36px)
  // 内容区宽 = 151 - 2(border) - 16(padding) = 133px
  // 菱形列中心距内容左边 = 133 - 36 - 10 = 87px
  &__timeline {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 2px 0;
  }

  &__line {
    position: absolute;
    left: 87px;
    top: 0;
    bottom: 0;
    width: 1px;
    background: rgba(0, 174, 255, 0.3);
    transform: translateX(-50%);
  }

  &__row {
    position: relative;
    display: flex;
    align-items: center;
    height: 36px;
  }

  &__left {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
    padding-left: 4px;
    border-radius: 2px 0 0 2px;
    cursor: pointer;
    transition: background 0.2s;

    &--active { background: rgba(0, 174, 255, 0.18); }
    &:hover:not(&--active) { background: rgba(0, 174, 255, 0.07); }
  }

  &__name {
    font-size: $font-size-xs;
    color: $color-text-1;
    white-space: nowrap;
    overflow: hidden;

    .floor-selector__left--active & {
      color: $color-primary;
      font-weight: 600;
    }
  }

  &__right {
    height: 100%;
    display: flex;
    align-items: center;
    border-radius: 0 2px 2px 0;
    cursor: pointer;
    transition: background 0.2s;

    &--active { background: rgba(0, 174, 255, 0.18); }
    &:hover:not(&--active) { background: rgba(0, 174, 255, 0.07); }
  }

  &__diamond-wrap {
    width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 1;
  }

  &__diamond {
    width: 8px;
    height: 8px;
    transform: rotate(45deg);
    background: rgba(150, 170, 200, 0.4);
    border: 1px solid rgba(150, 170, 200, 0.6);
    transition: all 0.2s;

    .floor-selector__right--active & {
      background: $color-primary;
      border-color: $color-primary-bright;
      box-shadow: 0 0 6px $color-primary;
    }
  }

  &__floor {
    width: 36px;
    font-family: $font-number;
    font-size: $font-size-xs;
    color: $color-text-2;
    text-align: center;
    white-space: nowrap;

    .floor-selector__right--active & {
      color: $color-primary-bright;
      font-weight: bold;
    }
  }

  // ── 底部按钮 ──────────────────────────
  &__footer {
    display: flex;
    justify-content: center;
    padding: 8px 0 2px;
    border-top: 1px solid $color-line;
    margin-top: 4px;
  }

  &__btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0, 40, 80, 0.9) 0%, rgba(0, 10, 30, 0.95) 100%);
    border: 1px solid $color-border;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 0 8px rgba(0, 174, 255, 0.2);

    &:hover {
      border-color: $color-primary;
      box-shadow: 0 0 12px rgba(0, 174, 255, 0.4);
    }

    &--collapsed {
      opacity: 0.6;
      filter: grayscale(0.4);
    }
  }
}
</style>
