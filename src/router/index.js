// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  // 可以添加更多的路由配置
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
