import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import UserView from '@/views/UserView.vue'
import RoadView from '@/views/RoadView.vue'
import BoxView from '@/views/BoxView.vue'
import RegionView from '@/views/RegionView.vue'
import LogView from '@/views/LogView.vue'
import AlertView from '@/views/AlertView.vue'
import DashView from '@/views/DashView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        {
          path: '/',
          name: 'dash',
          component: DashView
        },
        {
          path: '/box',
          name: 'box',
          component: BoxView
        },
        {
          path: '/log',
          name: 'log',
          component: LogView
        },
        {
          path: '/alert',
          name: 'alert',
          component: AlertView
        },
        {
          path: '/road',
          name: 'road',
          component: RoadView
        },
        {
          path: '/region',
          name: 'region',
          component: RegionView
        },
        {
          path: '/user',
          name: 'user',
          component: UserView
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: LoginView
    }
  ]
})

export default router
