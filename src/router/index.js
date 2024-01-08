import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import '../assets/global.css'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/app',
    name: 'app',
    component: () => import('../views/AppView.vue')
  },
  // {
  //   path: '/gallery',
  //   name: 'gallery',
  //   component: () => import('../views/GalleryView.vue')
  // },
  // {
  //   path: '/reportbug',
  //   name: 'reportbug',
  //   component: () => import('../views/ReportBugView.vue')
  // },
  // {
  //   path: '/about',
  //   name: 'about',
  //   component: () => import('../views/AboutView.vue')
  // },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
