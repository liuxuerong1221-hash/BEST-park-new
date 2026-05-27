import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/meeting-room',
      name: 'meeting-room',
      component: () => import('@/views/MeetingRoomView.vue'),
    },
    {
      path: '/access',
      name: 'access',
      component: () => import('@/views/AccessView.vue'),
    },
    {
      path: '/access/gate',
      name: 'access-gate',
      component: () => import('@/views/AccessGateView.vue'),
    },
    {
      path: '/access/turnstile',
      name: 'access-turnstile',
      component: () => import('@/views/AccessTurnstileView.vue'),
    },
    {
      path: '/access/barrier',
      name: 'access-barrier',
      component: () => import('@/views/AccessBarrierView.vue'),
    },
    {
      path: '/security',
      name: 'security',
      component: () => import('@/views/SecurityView.vue'),
    },
    {
      path: '/security/camera',
      name: 'security-camera',
      component: () => import('@/views/SecurityCameraView.vue'),
    },
    {
      path: '/security/trajectory',
      name: 'security-trajectory',
      component: () => import('@/views/SecurityTrajectoryView.vue'),
    },
    {
      path: '/security/machinery',
      name: 'security-machinery',
      component: () => import('@/views/SecurityMachineryView.vue'),
    },
    {
      path: '/security/machinery/cabinet',
      name: 'security-cabinet',
      component: () => import('@/views/SecurityCabinetView.vue'),
    },
    {
      path: '/security/alert/:id',
      name: 'security-alert',
      component: () => import('@/views/AlertDetailView.vue'),
    },
    {
      path: '/energy',
      name: 'energy',
      component: () => import('@/views/EnergyView.vue'),
    },
    {
      path: '/energy/meter-elec',
      name: 'energy-meter-elec',
      component: () => import('@/views/EnergyMeterElecView.vue'),
    },
    {
      path: '/energy/meter-water',
      name: 'energy-meter-water',
      component: () => import('@/views/EnergyMeterWaterView.vue'),
    },
    {
      path: '/energy/lighting',
      name: 'energy-lighting',
      component: () => import('@/views/EnergyLightingView.vue'),
    },
    {
      path: '/energy/broadcast',
      name: 'energy-broadcast',
      component: () => import('@/views/EnergyBroadcastView.vue'),
    },
    {
      path: '/energy/building',
      name: 'energy-building',
      component: () => import('@/views/EnergyBuildingView.vue'),
    },
    {
      path: '/energy/camera',
      name: 'energy-camera',
      component: () => import('@/views/EnergyCameraView.vue'),
    },
    {
      path: '/energy/display-screen',
      name: 'energy-display-screen',
      component: () => import('@/views/EnergyDisplayScreenView.vue'),
    },
  ],
})

export default router
