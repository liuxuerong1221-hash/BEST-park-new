<template>
  <BasePanel class="personnel-panel" title="人员通行">
    <div class="personnel-panel__body">
      <div
        v-for="row in rows"
        :key="row.key"
        class="personnel-panel__row"
      >
        <div class="personnel-panel__icon" :class="`personnel-panel__icon--${row.key}`">
          <img :src="row.icon" :alt="row.label" />
        </div>
        <span class="personnel-panel__label">{{ row.label }}</span>
        <div class="personnel-panel__digits">
          <span
            v-for="(d, idx) in row.digits"
            :key="`${row.key}-${idx}`"
            class="personnel-panel__digit"
          >
            <span class="personnel-panel__digit-text">{{ d }}</span>
            <span class="personnel-panel__digit-mask" />
          </span>
        </div>
        <span class="personnel-panel__unit">人次</span>
      </div>
    </div>
  </BasePanel>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BasePanel from '@/components/common/BasePanel.vue'
import iconEnter from '@/assets/images/icon/今日进入.svg'
import iconLeave from '@/assets/images/icon/今日离开.svg'

type RowKey = 'enter' | 'leave'

const enterCount = 286
const leaveCount = 140

const formatDigits = (value: number, length = 5) =>
  String(Math.max(0, Math.floor(value))).padStart(length, '0').split('')

const rows = computed<Array<{ key: RowKey; label: string; icon: string; digits: string[] }>>(() => [
  { key: 'enter', label: '今日进入', icon: iconEnter, digits: formatDigits(enterCount) },
  { key: 'leave', label: '今日离开', icon: iconLeave, digits: formatDigits(leaveCount) },
])
</script>

<style lang="scss" scoped>
.personnel-panel {
  &__body {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  &__row {
    height: 86px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 0 12px;
    background: linear-gradient(266deg, rgba(5, 25, 49, 0) 5%, rgba(10, 44, 83, 0.29) 99%);
    border: 1px solid #0B2C52;
    border-radius: 4px;
  }

  &__icon {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 40px;
      height: 40px;
      display: block;
    }
  }

  &__label {
    font-size: 14px;
    line-height: 20px;
    color: #FFFFFF;
    white-space: nowrap;
    flex-shrink: 0;
  }

  &__digits {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__digit {
    position: relative;
    width: 28px;
    height: 40px;
    border: 1px solid #0B92FF;
    border-radius: 4px;
    background: #0D2350;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
  }

  &__digit-text {
    position: relative;
    z-index: 2;
    font-family: 'YouSheBiaoTiHei', $font-title;
    font-size: 24px;
    line-height: 34px;
    color: #FFFFFF;
    letter-spacing: 0;
  }

  &__digit-mask {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 20px;
    background: linear-gradient(180deg, #2D62D2 0%, #0D2E50 100%);
    opacity: 0.48;
    border-radius: 0 0 4px 4px;
    pointer-events: none;
    z-index: 1;
  }

  &__unit {
    flex-shrink: 0;
    font-size: 12px;
    line-height: 17px;
    color: #FFFFFF;
    white-space: nowrap;
  }
}
</style>
