import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Inicio' },
    },
    {
      path: '/calendario',
      name: 'calendario',
      component: () => import('@/views/CalendarioView.vue'),
      meta: { title: 'Calendario' },
    },
    {
      path: '/registro',
      name: 'registro',
      component: () => import('@/views/RegistroView.vue'),
      meta: { title: 'Registrar peso' },
    },
    {
      path: '/ajustes',
      name: 'ajustes',
      component: () => import('@/views/AjustesView.vue'),
      meta: { title: 'Ajustes' },
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const page = to.meta.title ? `${to.meta.title} · CheckPeso` : 'CheckPeso'
  document.title = page
})

export default router
