import Login from '@/views/Login.vue'
import Main from '@/views/Main.vue'
import Menu from '@/views/MenuView.vue'
import Text from '@/views/TextView.vue'
import Video from '@/views/VideoView.vue'
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
      path: '/Menu',
      name: 'Menu',
      component: Menu,
    },
    {
      path: '/Main',
      name: 'Main',
      component: Main,
    },
    {
      path: '/Text',
      name: 'Text',
      component: Text,
    },
    {
      path: '/Video',
      name: 'Video',
      component: Video,
    },
  ],
})

export default router
