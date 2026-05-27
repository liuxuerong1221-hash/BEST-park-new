<template>
  <svg
    class="icon-visitor"
    viewBox="0 0 44.8 46.6"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
  >
    <defs>
      <linearGradient :id="`iv-base-${uid}`" x1="22.4" y1="27" x2="22.4" y2="42.8" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#7CD1FF"/>
        <stop offset="1" stop-color="#0A6FA9"/>
      </linearGradient>
      <linearGradient :id="`iv-cone-${uid}`" x1="22.4" y1="9.6" x2="22.4" y2="39.5" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#7CD1FF"/>
        <stop offset="1" stop-color="#0A6FA9"/>
      </linearGradient>
      <linearGradient :id="`iv-inner-${uid}`" x1="22.4" y1="12.8" x2="22.4" y2="36" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#A9E1FF"/>
        <stop offset="1" stop-color="#005481"/>
      </linearGradient>
      <linearGradient :id="`iv-doc-${uid}`" x1="13" y1="7" x2="31" y2="25" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#FFFFFF"/>
        <stop offset="1" stop-color="#44B5F2"/>
      </linearGradient>
    </defs>

    <!-- 阴影底盘 -->
    <ellipse cx="22.4" cy="44.5" rx="22" ry="2.1" fill="rgba(0,0,0,0.35)" opacity="0.5"/>

    <!-- 底座（梯形带）-->
    <g transform="translate(0 27)">
      <path :fill="`url(#iv-base-${uid})`"
            d="M4.07273 0L40.7273 0L44.8 15.7984L0 15.7984L4.07273 0Z"/>
      <path fill="rgba(255,255,255,0.4)" fill-rule="evenodd"
            d="M44.6969 15.3984L40.7273 0L4.07273 0L0.103117 15.3984L0 15.7984L44.8 15.7984L44.6969 15.3984ZM0.516195 15.3984L4.38269 0.4L40.4173 0.4L44.2838 15.3984L0.516195 15.3984Z"/>
    </g>

    <!-- 锥体外壳 -->
    <path transform="translate(2 9.6)" :fill="`url(#iv-cone-${uid})`" opacity="0.85"
          d="M0 0L40.7273 0L35.4327 26.1921C35.4327 26.8947 34.6528 27.5521 33.2962 28.1138Q32.2 28.6 30.5 29C27 29.7 22 30 20.36 30C18.7 30 13.7 29.7 10.2 29Q8.5 28.6 7.43 28.11C6.11 27.57 5.34 26.93 5.3 26.25L5.29 26.19L0 0Z"/>

    <!-- 内层凹槽 -->
    <path transform="translate(6.4 12.8)" :fill="`url(#iv-inner-${uid})`"
          d="M0 0L31.68 0L27.56 20.37C27.56 20.92 26.95 21.43 25.9 21.87C24 22.6 19.6 23 15.84 23C12.07 23 7.7 22.6 5.78 21.87C4.76 21.44 4.15 20.95 4.12 20.42L4.12 20.37L0 0Z"/>

    <!-- 凹陷椭圆 -->
    <ellipse transform="translate(13 28.7)" cx="9.4" cy="2.5" rx="9.4" ry="2.5"
             fill="rgba(0,0,0,0.3)" opacity="0.6"/>

    <!-- 装饰光点 -->
    <g fill="#FFFFFF">
      <circle cx="31.2" cy="27.6" r="0.6"/>
      <circle cx="33.4" cy="25.8" r="0.4"/>
      <circle cx="27.1" cy="31.8" r="0.6"/>
      <circle cx="14.6" cy="30.8" r="0.4"/>
      <circle cx="12.4" cy="27.6" r="0.6"/>
      <circle cx="16.1" cy="12.7" r="0.2"/>
      <circle cx="30.6" cy="8.8" r="0.5"/>
      <circle cx="28.1" cy="4.6" r="0.4"/>
      <circle cx="32.0" cy="0.2" r="0.2"/>
    </g>

    <!-- 中间访客标签（document + clock）-->
    <g transform="translate(13 7)">
      <path :fill="`url(#iv-doc-${uid})`"
            d="M8.99807 13.5052C8.99807 11.0228 11.0132 9.01045 13.499 9.01045C15.9849 9.01045 18 11.0228 18 13.5052C18 15.9876 15.9849 18 13.499 18C11.0132 18 8.99807 15.9876 8.99807 13.5052ZM12.856 10.9368L12.856 13.5052C12.8575 13.6758 12.9259 13.839 13.0464 13.9598L14.3324 15.2441C14.5809 15.4997 14.9918 15.4997 15.2403 15.2441C15.3637 15.1262 15.4326 14.9625 15.4306 14.792C15.4314 14.6217 15.3627 14.4585 15.2403 14.34L14.1446 13.2432L14.1446 10.9394C14.1446 10.5847 13.8567 10.2972 13.5016 10.2972C13.1465 10.2972 12.8586 10.5847 12.8586 10.9394L12.856 10.9368ZM1.04422 16.7158C0.46781 16.7151 0.000710242 16.2486 0 15.673C0.0426833 12.6123 1.98795 9.90124 4.87647 8.87689C2.70387 7.37254 2.12635 4.41385 3.57411 2.20476C5.02188 -0.00432868 7.96812 -0.660011 10.2182 0.726131C12.4683 2.11227 13.2035 5.03587 11.8761 7.31914C7.75048 8.35319 5.78817 13.0651 7.96285 16.7158L1.04422 16.7158Z"/>
    </g>
  </svg>
</template>

<script setup lang="ts">
const uid = Math.random().toString(36).slice(2, 8)
</script>

<style lang="scss" scoped>
.icon-visitor {
  display: block;
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 6px rgba(77, 242, 255, 0.45));
}
</style>
