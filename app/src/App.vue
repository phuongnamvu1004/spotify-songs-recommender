<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/playlists">Playlists</router-link>
  </nav>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'App'
}
</script>
