<template>
  <nav class="bottom-nav">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      class="bottom-nav__tab"
      :class="{ 'bottom-nav__tab--active': activeTab === tab.key }"
      type="button"
      @click="onSelect(tab.key)"
    >
      <img class="bottom-nav__tab-bg" :src="activeTab === tab.key ? bgActive : bgInactive" alt="" />
      <span class="bottom-nav__tab-label">{{ tab.label }}</span>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import bgActive   from '@/assets/images/tab选中背景.png'
import bgInactive from '@/assets/images/tab未选中背景.png'

type TabKey = 'overview' | 'access' | 'security' | 'energy'

interface Tab {
  key: TabKey
  label: string
  routeName?: string
}

const tabs: Tab[] = [
  { key: 'overview', label: '综合态势', routeName: 'dashboard' },
  { key: 'access',   label: '通行态势', routeName: 'access' },
  { key: 'security', label: '安全态势', routeName: 'security' },
  { key: 'energy',   label: '设备能耗', routeName: 'energy' },
]

const router = useRouter()
const route = useRoute()

const activeTab = computed<TabKey>(() => {
  const routeName = route.name as string
  // 精确匹配
  const exactMatch = tabs.find(t => t.routeName === routeName)
  if (exactMatch) return exactMatch.key

  // 前缀匹配：access-gate、access-turnstile 等都归属 access；security-camera 等归属 security；energy-meter-elec 等归属 energy
  if (routeName?.startsWith('access')) return 'access'
  if (routeName?.startsWith('security')) return 'security'
  if (routeName?.startsWith('energy')) return 'energy'

  return 'overview'
})

function onSelect(key: TabKey) {
  const target = tabs.find(t => t.key === key)
  if (target?.routeName && target.routeName !== route.name) {
    router.push({ name: target.routeName })
  }
}
</script>

<style lang="scss" scoped>
.bottom-nav {
  width: 100%;
  height: $bottom-nav-h;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-xl;
  background: linear-gradient(0deg, rgba(0,15,40,0.9) 0%, transparent 100%);

  &__tab {
    position: relative;
    width: 154px;
    height: 39px;
    border: none;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    transition: filter 0.2s;

    &:hover { filter: brightness(1.2); }

    &-bg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: fill;
    }

    &-label {
      position: relative;
      z-index: 1;
      font-family: 'AlimamaShuHeiTi', 'Alimama ShuHeiTi', sans-serif;
      font-size: 1.23rem;
      font-weight: bold;
      line-height: normal;
      text-align: center;
      letter-spacing: 0.003125em;
      white-space: nowrap;
      background: linear-gradient(182deg, #FFFFFF 35%, #52C0FF 114%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-fill-color: transparent;
    }

    &--active &-label {
      background: none;
      -webkit-background-clip: unset;
      background-clip: unset;
      -webkit-text-fill-color: #FFFFFF;
      color: #FFFFFF;
      text-shadow: 0 0 8px rgba(0, 174, 255, 0.8);
    }
  }
}
</style>
