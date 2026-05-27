<template>
  <MapPinMarker
    :x="x"
    :y="y"
    :label="label"
    :active="active"
    class="broadcast-map-marker"
    :class="{ 'broadcast-map-marker--dimmed': dimmed }"
    @select="$emit('select')"
  >
    <template #icon="{ gradientId }">
      <defs>
        <linearGradient :id="gradientId" x1="11" y1="12" x2="11" y2="27.65" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FFFFFF"/>
          <stop offset="1" stop-color="#0083CC"/>
        </linearGradient>
      </defs>
      <path :fill="`url(#${gradientId})`"
        transform="translate(11 12)"
        d="M14.4835 5.01605L18.7383 1.72251C18.9326 1.57117 18.9084 1.21324 18.6834 0.923044C18.4584 0.632426 18.1179 0.519395 17.9235 0.669891L13.6686 3.96364C13.4739 4.11498 13.498 4.4727 13.7236 4.76311C13.9484 5.05331 14.2888 5.16655 14.4835 5.01605ZM19.1732 7.28936L13.7935 7.30798C13.5471 7.30989 13.3482 7.60855 13.349 7.97558C13.3505 8.34282 13.5509 8.64064 13.7971 8.63916L19.1777 8.62095C19.4236 8.61947 19.6228 8.32081 19.6213 7.95399C19.6203 7.58633 19.4192 7.28936 19.1732 7.28936ZM18.5664 14.1768L14.2228 11.0018C14.0238 10.8564 13.6866 10.9793 13.4694 11.2759C13.2527 11.572 13.2379 11.9312 13.4366 12.0758L17.7802 15.2514C17.9792 15.396 18.3162 15.2734 18.5338 14.9765C18.7503 14.6799 18.7645 14.3211 18.5664 14.1768ZM11.2914 0.808533C11.1295 -0.0781403 10.5251 0.00186996 10.5251 0.00186996L4.24668 4.17425C4.17577 4.16684 4.10592 4.15541 4.03247 4.15541L1.93591 4.15541C0.990602 4.15541 0.205105 4.83254 0.0353485 5.7281L0 5.7281L0 10.3653L0.0427568 10.3653C0.228389 11.2408 1.005 11.8976 1.9357 11.8976L4.03205 11.8976C4.25924 11.8977 4.48466 11.8577 4.69795 11.7795L9.91978 15.5672C11.3312 15.9705 11.2912 14.801 11.2912 14.801L11.2914 0.808533Z"
      />
    </template>
  </MapPinMarker>
</template>

<script setup lang="ts">
import MapPinMarker from './MapPinMarker.vue'

defineProps<{
  x: number
  y: number
  label?: string
  active?: boolean
  dimmed?: boolean
}>()

defineEmits<{
  select: []
}>()
</script>

<style lang="scss" scoped>
.broadcast-map-marker {
  &--dimmed {
    opacity: 0.32;
    filter: grayscale(0.4);
    pointer-events: none;
  }
}
</style>
