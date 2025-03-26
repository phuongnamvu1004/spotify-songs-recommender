import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";
import Playlists from "../views/Playlists.vue";
import Error from "../views/Error.vue";
import Page1 from "../views/Survey/Page1.vue";
import Page2 from "../views/Survey/Page2.vue";
import Page3 from "../views/Survey/Page3.vue";
import Page4 from "../views/Survey/Page4.vue";
import Page5 from "../views/Survey/Page5.vue";
import Song from "../views/Song.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/playlists",
      name: "playlists",
      component: Playlists,
    },
    {
      path: "/survey/page1",
      name: "Page1",
      component: Page1,
    },
    {
      path: "/survey/page2",
      name: "Page2",
      component: Page2,
    },
    {
      path: "/survey/page3",
      name: "Page3",
      component: Page3,
    },
    {
      path: "/survey/page4",
      name: "Page4",
      component: Page4,
    },
    {
      path: "/survey/page5",
      name: "Page5",
      component: Page5,
    },
    {
      path: "/recommended-songs",
      name: "Song",
      component: Song,
    },
    {
      path: "/error",
      name: "error",
      component: Error,
    },
  ],
});

export default router;
