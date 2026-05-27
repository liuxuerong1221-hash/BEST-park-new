<template>
  <button
    ref="dateButton"
    class="date-picker"
    type="button"
    @click="toggleDatePicker"
  >
    <span class="date-picker__text">{{ modelValue }}</span>
    <svg class="date-picker__icon" viewBox="0 0 13 13" fill="none">
      <path
        fill="#00AEFF"
        d="M1.625 2.16694C1.32681 2.16694 1.08306 2.40987 1.08306 2.70806L1.08306 11.375C1.08306 11.674 1.32681 11.9169 1.625 11.9169L11.375 11.9169C11.6743 11.9169 11.9169 11.6743 11.9169 11.375L11.9169 2.70806C11.9165 2.40908 11.674 2.16694 11.375 2.16694L1.625 2.16694ZM11.375 13L1.625 13C0.728813 13 0 12.2712 0 11.375L0 2.70806C0 1.81269 0.728813 1.08306 1.625 1.08306L11.375 1.08306C12.2712 1.08306 13 1.81269 13 2.70806L13 11.375C13 12.2712 12.2712 13 11.375 13ZM3.82525 3.25L3.75781 3.25C3.47754 3.24955 3.25045 3.02246 3.25 2.74219L3.25 0.507812C3.25 0.228313 3.47831 0 3.75781 0L3.82525 0C4.10475 0 4.33306 0.228313 4.33306 0.507812L4.33306 2.74219C4.33262 3.02214 4.10602 3.24911 3.82606 3.25M9.24219 3.25L9.17475 3.25C8.89448 3.24955 8.66738 3.02246 8.66694 2.74219L8.66694 0.507812C8.66694 0.228312 8.89444 0 9.17475 0L9.24219 0C9.52169 0 9.75 0.228313 9.75 0.507812L9.75 2.74219C9.74955 3.02246 9.52246 3.24955 9.24219 3.25ZM3.79194 9.20806L2.70806 9.20806C2.40976 9.20673 2.16827 8.96524 2.16694 8.66694C2.16694 8.36875 2.41069 8.125 2.70806 8.125L3.79194 8.125C4.08931 8.125 4.33306 8.36875 4.33306 8.66694C4.33306 8.96431 4.08931 9.20806 3.79194 9.20806ZM7.04194 9.20806L5.95806 9.20806C5.65976 9.20673 5.41827 8.96524 5.41694 8.66694C5.41694 8.36875 5.66069 8.125 5.95806 8.125L7.04194 8.125C7.33931 8.125 7.58306 8.36875 7.58306 8.66694C7.58306 8.96431 7.33931 9.20806 7.04194 9.20806ZM3.79194 6.5L2.70806 6.5C2.40945 6.49866 2.16783 6.25668 2.16694 5.95806C2.16694 5.66069 2.41069 5.41694 2.70806 5.41694L3.79194 5.41694C4.08931 5.41694 4.33306 5.66069 4.33306 5.95806C4.33306 6.25625 4.08931 6.5 3.79194 6.5ZM10.2919 6.5L9.20806 6.5C8.90945 6.49866 8.66783 6.25668 8.66694 5.95806C8.66694 5.66069 8.91069 5.41694 9.20806 5.41694L10.2919 5.41694C10.5893 5.41694 10.8331 5.66069 10.8331 5.95806C10.8331 6.25625 10.5893 6.5 10.2919 6.5ZM7.04194 6.5L5.95806 6.5C5.65945 6.49866 5.41783 6.25668 5.41694 5.95806C5.41694 5.66069 5.66069 5.41694 5.95806 5.41694L7.04194 5.41694C7.33931 5.41694 7.58306 5.66069 7.58306 5.95806C7.58306 6.25625 7.33931 6.5 7.04194 6.5Z"/>
    </svg>

    <Teleport to="body">
      <div
        v-if="open"
        class="date-picker-popup"
        :style="popupStyle"
        @click.stop
      >
        <div class="date-picker-popup__header">
          <button
            class="date-picker-popup__nav"
            type="button"
            @click="changeMonth(-1)"
          >&lt;</button>
          <span class="date-picker-popup__title">{{ currentYear }}年{{ currentMonth }}月</span>
          <button
            class="date-picker-popup__nav"
            type="button"
            @click="changeMonth(1)"
          >&gt;</button>
        </div>
        <div class="date-picker-popup__calendar">
          <div class="date-picker-popup__weekdays">
            <span v-for="day in weekdays" :key="day">{{ day }}</span>
          </div>
          <div class="date-picker-popup__days">
            <button
              v-for="(day, idx) in calendarDays"
              :key="idx"
              class="date-picker-popup__day"
              :class="{
                'date-picker-popup__day--empty': !day,
                'date-picker-popup__day--selected': day && isSelectedDate(day),
                'date-picker-popup__day--today': day && isToday(day),
              }"
              type="button"
              :disabled="!day"
              @click="selectDate(day)"
            >
              {{ day }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </button>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: string
  direction?: 'up' | 'down'
}>(), {
  modelValue: '',
  direction: 'up',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const open = ref(false)
const dateButton = ref<HTMLElement | null>(null)
const popupPos = ref({ top: 0, left: 0 })

// 从 modelValue 解析年月日
function parseDate(str: string) {
  const parts = str.split('-').map(Number)
  return {
    year: parts[0] || new Date().getFullYear(),
    month: parts[1] || new Date().getMonth() + 1,
    day: parts[2] || new Date().getDate(),
  }
}

const initial = parseDate(props.modelValue)
const currentYear = ref(initial.year)
const currentMonth = ref(initial.month)
const selectedDay = ref(initial.day)

watch(() => props.modelValue, (v) => {
  const d = parseDate(v)
  currentYear.value = d.year
  currentMonth.value = d.month
  selectedDay.value = d.day
})

const weekdays = ['日', '一', '二', '三', '四', '五', '六']

const popupStyle = computed(() => ({
  top: `${popupPos.value.top}px`,
  left: `${popupPos.value.left}px`,
}))

const calendarDays = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  const firstDay = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()

  const days: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }
  return days
})

function toggleDatePicker() {
  open.value = !open.value
  if (open.value) {
    requestAnimationFrame(updatePopupPos)
  }
}

function updatePopupPos() {
  const el = dateButton.value
  if (!el) return
  const r = el.getBoundingClientRect()

  const popupWidth = 280
  const popupHeight = 320

  const top = props.direction === 'down'
    ? r.bottom + 8
    : r.top - popupHeight - 8
  let left = r.left

  const maxLeft = window.innerWidth - popupWidth - 8
  if (left > maxLeft) left = maxLeft
  if (left < 8) left = 8

  popupPos.value = { top, left }
}

function changeMonth(delta: number) {
  let newMonth = currentMonth.value + delta
  let newYear = currentYear.value

  if (newMonth < 1) {
    newMonth = 12
    newYear--
  } else if (newMonth > 12) {
    newMonth = 1
    newYear++
  }

  currentMonth.value = newMonth
  currentYear.value = newYear
}

function selectDate(day: number | null) {
  if (!day) return
  selectedDay.value = day
  const value = `${currentYear.value}-${currentMonth.value}-${day}`
  emit('update:modelValue', value)
  open.value = false
}

function isSelectedDate(day: number): boolean {
  const d = parseDate(props.modelValue)
  return day === d.day && currentMonth.value === d.month && currentYear.value === d.year
}

function isToday(day: number): boolean {
  const today = new Date()
  return day === today.getDate() &&
         currentMonth.value === today.getMonth() + 1 &&
         currentYear.value === today.getFullYear()
}

function onDocClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.date-picker') &&
      !target.closest('.date-picker-popup')) {
    open.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', onDocClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
})
</script>

<style lang="scss" scoped>
.date-picker {
  width: 132px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  background: rgba(8, 39, 76, 0.6);
  border: 1px solid rgba(0, 174, 255, 0.4);
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: rgba(8, 39, 76, 0.8);
  }

  &__text {
    font-size: $font-size-xs;
    color: $color-text-1;
  }

  &__icon {
    width: 13px;
    height: 13px;
    flex-shrink: 0;
  }
}

.date-picker-popup {
  position: fixed;
  z-index: 9999;
  width: 280px;
  padding: 16px;
  background: linear-gradient(180deg, rgba(5, 25, 49, 0.95) 0%, rgba(10, 44, 83, 0.95) 100%);
  border: 1px solid rgba(0, 174, 255, 0.4);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  &__nav {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 174, 255, 0.1);
    border: 1px solid rgba(0, 174, 255, 0.3);
    border-radius: 4px;
    color: #00AEFF;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
      background: rgba(0, 174, 255, 0.2);
    }
  }

  &__title {
    font-size: 14px;
    color: #FFFFFF;
    font-weight: 600;
  }

  &__calendar {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
    margin-bottom: 4px;

    span {
      text-align: center;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
      padding: 4px 0;
    }
  }

  &__days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
  }

  &__day {
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 174, 255, 0.05);
    border: 1px solid transparent;
    border-radius: 4px;
    color: rgba(255, 255, 255, 0.8);
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      background: rgba(0, 174, 255, 0.15);
      border-color: rgba(0, 174, 255, 0.4);
    }

    &--empty {
      background: transparent;
      cursor: default;
    }

    &--selected {
      background: rgba(77, 242, 255, 0.25);
      border-color: #4DF2FF;
      color: #4DF2FF;
      font-weight: 600;
    }

    &--today {
      border-color: rgba(0, 174, 255, 0.6);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.3;
    }
  }
}
</style>
