import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Playlists from '../views/Playlists.vue'
import Error from '../views/Error.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/playlists',
      name: 'playlists',
      component: Playlists
    },
    {
      path: '/error',
      name: 'error',
      component: Error
    }
  ]
})

export default router
