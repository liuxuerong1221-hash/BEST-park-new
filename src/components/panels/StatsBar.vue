<template>
  <div class="stats-bar">
    <div class="stats-bar__items">
      <template v-for="(item, idx) in stats" :key="item.label">
        <div class="stats-bar__item">
          <img class="stats-bar__icon" :src="item.icon" :alt="item.label" />
          <div class="stats-bar__info">
            <span class="stats-bar__label">{{ item.label }}</span>
            <span class="stats-bar__value" :style="{ color: item.color }">{{ item.value }}</span>
          </div>
        </div>
        <div v-if="idx < stats.length - 1" class="stats-bar__sep" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import iconTemp  from '@/assets/images/温度.svg'
import iconHumid from '@/assets/images/湿度.svg'
import iconPm25  from '@/assets/images/PM2.5.svg'
import iconCo2   from '@/assets/images/CO2.svg'
import iconCo    from '@/assets/images/co.svg'

const stats = [
  { label: '温度',   value: '27℃',     color: '#00AEFF', icon: iconTemp  },
  { label: '湿度',   value: '27%',      color: '#4DF2FF', icon: iconHumid },
  { label: 'PM2.5', value: '25μg/m³',  color: '#F9B933', icon: iconPm25  },
  { label: 'CO2',   value: '27ppm',    color: '#2ED0B0', icon: iconCo2   },
  { label: 'CO',    value: '27ppm',    color: '#EDD505', icon: iconCo    },
]
</script>

<style lang="scss" scoped>
.stats-bar {
  flex-shrink: 0;

  &__items {
    display: flex;
    align-items: center;
    padding: 0;
    height: 68px;
    margin-top: 10px;
    border-radius: 0.25rem;
    background: linear-gradient(96deg, rgba(8, 38, 74, 0.6) 0%, rgba(3, 21, 43, 0.6) 95%);
    box-sizing: border-box;
    border: 0.06rem solid rgba(11, 182, 255, 0.3);
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 $spacing-lg;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  &__sep {
    width: 1px;
    height: 28px;
    background: rgba(0, 174, 255, 0.3);
    flex-shrink: 0;
  }

  &__icon {
    width: 26px;
    height: 26px;
    object-fit: contain;
    flex-shrink: 0;
  }

  &__label {
    font-size: $font-size-xs;
    color: $color-text-1;
    line-height: 1;
    white-space: nowrap;
  }

  &__value {
    font-family: $font-number;
    font-size: $font-size-sm;
    font-weight: bold;
    line-height: 1;
    white-space: nowrap;
  }
}
</style>
