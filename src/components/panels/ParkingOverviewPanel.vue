<template>
  <BasePanel class="parking-overview" title="车位概况">
    <div class="parking-overview__body">
      <!-- 数据行：图标 + 三组指标 -->
      <div class="parking-overview__row">
        <img class="parking-overview__icon" :src="iconCar" alt="" />

        <div class="parking-overview__metrics">
          <div
            v-for="m in metrics"
            :key="m.label + m.value"
            class="parking-overview__metric"
          >
            <div class="parking-overview__metric-value">
              <span class="parking-overview__num" :style="{ color: m.color }">{{ m.value }}</span>
              <span class="parking-overview__unit">{{ m.unit }}</span>
            </div>
            <span class="parking-overview__metric-label">{{ m.label }}</span>
          </div>
        </div>
      </div>

      <!-- 停车场进度条 -->
      <div class="parking-overview__lots">
        <div
          v-for="lot in lots"
          :key="lot.name"
          class="parking-overview__lot"
        >
          <div
            class="parking-overview__lot-fill"
            :style="{ width: ((lot.total - lot.remaining) / lot.total * 100) + '%', background: getLotColor(lot) }"
          />
          <div class="parking-overview__lot-content">
            <span class="parking-overview__lot-label">{{ lot.name }}</span>
            <span class="parking-overview__lot-value">
              {{ lot.remaining }}<span class="parking-overview__lot-total">/{{ lot.total }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </BasePanel>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BasePanel from '@/components/common/BasePanel.vue'
import iconCar from '@/assets/images/icon/icon_车.svg'

interface Metric {
  label: string
  value: string
  unit: string
  color: string
}

const totalSpots = 1000
const remainingSpots = 200

// 车位占用率 ≥ 90% 红色，80%~90% 黄色，< 80% 蓝色
function getUsageColor(rate: number): string {
  if (rate > 90) return '#FF1414'
  if (rate >= 80) return '#F9B933'
  return '#0081FF'
}

const metrics = computed<Metric[]>(() => {
  const usageRate = Math.round((totalSpots - remainingSpots) / totalSpots * 100)
  return [
    { label: '车位总数', value: String(totalSpots), unit: '个', color: '#FFFFFF' },
    { label: '剩余车位', value: String(remainingSpots), unit: '个', color: '#0CF92C' },
    { label: '车位占用率', value: String(usageRate), unit: '%', color: getUsageColor(usageRate) },
  ]
})

interface ParkingLot {
  name: string
  remaining: number
  total: number
}

const lots: ParkingLot[] = [
  { name: '地下负二层', remaining: 6, total: 500 },
  { name: '地下停车场', remaining: 194, total: 500 },
]

// 各停车场占用率：>80% 红色，50%<x≤80% 黄色，≤50% 绿色
function getLotColor(lot: ParkingLot): string {
  const usageRate = (lot.total - lot.remaining) / lot.total
  if (usageRate > 0.80) return 'rgba(255, 20, 20, 0.5)'
  if (usageRate > 0.50) return 'rgba(249, 185, 51, 0.5)'
  return 'rgba(12, 249, 44, 0.5)'
}
</script>

<style lang="scss" scoped>
.parking-overview {
  flex: 0 0 auto;
  height: 198px;

  // body：垂直 flex
  &__body {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px 10px 0;
  }

  // 数据行：icon + 指标，gap 22
  &__row {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 0 4px;
  }

  &__icon {
    width: 56px;
    height: 46px;
    flex-shrink: 0;
    object-fit: contain;
    display: block;
  }

  &__metrics {
    flex: 1;
    min-width: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  }

  &__metric {
    display: flex;
    flex-direction: column;
    gap: 0;
    min-width: 0;
    flex-shrink: 0;
  }

  &__metric-value {
    display: flex;
    align-items: baseline;
    gap: 4px;
    height: 34px;
  }

  &__num {
    font-family: 'PingFang SC', $font-body;
    font-size: 24px;
    font-weight: 800;
    line-height: 1.4;
  }

  &__unit {
    font-size: $font-size-xs;
    color: #FFFFFF;
    line-height: 20px;
  }

  &__metric-label {
    font-size: $font-size-xs;
    color: #FFFFFF;
    line-height: 20px;
    white-space: nowrap;
  }

  // 停车场进度条
  &__lots {
    display: flex;
    gap: 10px;
  }

  &__lot {
    flex: 1;
    height: 40px;
    position: relative;
    background: rgba(0, 174, 255, 0.1);
    border-radius: 8px;
    overflow: hidden;
  }

  &__lot-fill {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    border-radius: 8px 0 0 8px;
    transition: width 0.3s ease;
  }

  &__lot-content {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px;
  }

  &__lot-label {
    font-family: 'PingFang SC', $font-body;
    font-size: 14px;
    font-weight: 800;
    color: #FFFFFF;
  }

  &__lot-value {
    font-family: 'PingFang SC', $font-body;
    font-size: 16px;
    font-weight: 800;
    color: #FFFFFF;
    display: inline-flex;
    align-items: baseline;
    gap: 2px;
  }

  &__lot-total {
    font-size: 10px;
    font-weight: 400;
    color: #FFFFFF;
  }
}
</style>
