import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Playlists from '../views/Playlists.vue'
import Error from '../views/Error.vue'
import Page1 from '../views/Survey/Page1.vue'
import Page2 from '../views/Survey/Page2.vue'
import Page3 from '../views/Survey/Page3.vue'

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
      path: '/Survey/Page1',
      name: 'Page1',
      component: Page1 
    },
    {
      path: '/Survey/Page2',
      name:'Page2',
      component: Page2,
    },
    {
      path: '/Survey/Page3',
      name:'Page3',
      component: Page3,
    },
    {
      path: '/error',
      name: 'error',
      component: Error
    }
  ]
})

export default router