<template>
  <div class="access-floating-entries" aria-label="通行二级入口">
    <button
      v-for="entry in entries"
      :key="entry.kind"
      class="access-floating-entries__item"
      type="button"
      :aria-label="entry.label"
      @click="selectEntry(entry.kind)"
    >
      <span class="access-floating-entries__icon" aria-hidden="true">
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient :id="`access-entry-stroke-${entry.kind}`" x1="20" y1="0" x2="20" y2="40" gradientUnits="userSpaceOnUse">
              <stop stop-color="#0C84FF" />
              <stop offset="1" stop-color="#1DEAFF" />
            </linearGradient>
            <linearGradient :id="`access-entry-icon-${entry.kind}`" x1="20" y1="11" x2="20" y2="29" gradientUnits="userSpaceOnUse">
              <stop stop-color="#FFFFFF" />
              <stop offset="1" stop-color="#0083CC" />
            </linearGradient>
          </defs>
          <circle cx="20" cy="20" r="19.5" fill="rgba(2, 37, 79, 0.6)" :stroke="`url(#access-entry-stroke-${entry.kind})`" />
          <path :d="entry.path" :fill="`url(#access-entry-icon-${entry.kind})`" />
        </svg>
      </span>
      <span class="access-floating-entries__text">{{ entry.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

type EntryKind = 'gate' | 'turnstile' | 'barrier'

interface EntryItem {
  kind: EntryKind
  label: string
  path: string
}

const router = useRouter()

const entries: EntryItem[] = [
  {
    kind: 'gate',
    label: '门禁',
    path: 'M18.6 14.1H14.2C13.6 14.1 13.1 14.6 13.1 15.2V26.8C13.1 27.4 13.6 27.9 14.2 27.9H23.8C24.4 27.9 24.9 27.4 24.9 26.8V25.2H22.2C20.7 25.2 19.5 24 19.5 22.5V18.2C19.5 16.7 20.7 15.5 22.2 15.5H24.9V15.2C24.9 14.6 24.4 14.1 23.8 14.1H20.3C20 14.1 19.7 14 19.5 13.8L17.8 12.2H15.5C15 12.2 14.6 11.8 14.6 11.3C14.6 10.8 15 10.4 15.5 10.4H18.2C18.5 10.4 18.8 10.5 19 10.7L20.7 12.3H24C25.5 12.3 26.7 13.5 26.7 15V17.3H22.2C21.7 17.3 21.3 17.7 21.3 18.2V22.5C21.3 23 21.7 23.4 22.2 23.4H26.7V26.8C26.7 28.4 25.4 29.7 23.8 29.7H14.2C12.6 29.7 11.3 28.4 11.3 26.8V15.2C11.3 13.6 12.6 12.3 14.2 12.3H18.6V14.1ZM24.1 18.9L28.6 20.4L24.1 21.9V20.9H22.6V19.9H24.1V18.9Z',
  },
  {
    kind: 'turnstile',
    label: '摆闸',
    path: 'M14.4 11H18.6C19.3 11 19.8 11.5 19.8 12.2V29H13.2V19.4H11V15.8H13.2V12.2C13.2 11.5 13.7 11 14.4 11ZM18 14.6H15V13.4H18V14.6ZM21 15.8H29V19.4H21V15.8Z',
  },
  {
    kind: 'barrier',
    label: '道闸',
    path: 'M18.3 14.9H14.3V12.5C14.3 12.2 14.1 12 13.8 12H11.5C11.2 12 11 12.2 11 12.5V24.5C11 24.8 11.2 25 11.5 25H13.8C14.1 25 14.3 24.8 14.3 24.5V22.1H18.3C18.9 22.1 19.3 21.6 19.3 21.1V15.9C19.3 15.4 18.9 14.9 18.3 14.9ZM15 21.1L14.3 20.4L16.9 18.6L14.3 16.7L14.9 16L18.4 18.5L15 21.1ZM28.5 12H26.2C25.9 12 25.7 12.2 25.7 12.5V14.9H21.7C21.1 14.9 20.7 15.4 20.7 15.9V21.1C20.7 21.6 21.1 22.1 21.7 22.1H25.7V24.5C25.7 24.8 25.9 25 26.2 25H28.5C28.8 25 29 24.8 29 24.5V12.5C29 12.2 28.8 12 28.5 12ZM25.7 20.4L25 21.1L21.6 18.5L25.1 16L25.7 16.7L23.1 18.5L25.7 20.4Z',
  },
]

function selectEntry(kind: EntryKind) {
  const routeMap: Record<EntryKind, string> = {
    gate: 'access-gate',
    turnstile: 'access-turnstile',
    barrier: 'access-barrier',
  }
  router.push({ name: routeMap[kind] })
}
</script>

<style lang="scss" scoped>
.access-floating-entries {
  width: 105px;
  height: 160px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 20px;

  &__item {
    width: 105px;
    height: 40px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0 16px 0 0;
    border: 0;
    border-radius: 20px;
    background: rgba(10, 15, 21, 0.5);
    color: $color-text-1;
    cursor: pointer;
    outline: none;
    transition: transform 0.18s ease, filter 0.18s ease;

    &:hover {
      transform: translateY(-1px);
      filter: drop-shadow(0 0 10px rgba(29, 234, 255, 0.34));
    }

    &:focus-visible {
      box-shadow: 0 0 0 2px rgba(77, 242, 255, 0.45);
    }
  }

  &__icon {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
  }

  &__icon svg {
    width: 40px;
    height: 40px;
    display: block;
  }

  &__text {
    font-size: $font-size-xs;
    font-weight: 600;
    line-height: 20px;
    color: $color-text-1;
    white-space: nowrap;
  }
}

@media (prefers-reduced-motion: reduce) {
  .access-floating-entries__item {
    transition: none;
  }
}
</style>
