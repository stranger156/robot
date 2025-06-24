import Login from '@/views/Login.vue'
import Main from '@/views/Main.vue'
import { createRouter, createWebHistory } from 'vue-router'

// import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login,
    },
 
    {
      path: '/Main',
      name: 'Main',
      component: Main,
    },
  ],
})

export default router
