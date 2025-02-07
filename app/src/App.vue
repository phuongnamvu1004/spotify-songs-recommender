<template>
  <div id="app">
    <h1>Spotify Songs Recommender</h1>
    <button @click="login" v-if="!isLoggedIn">Login with Spotify</button>
    <div v-else>
      <h2>Your Playlists</h2>
      <div v-for="playlist in playlists" :key="playlist.id">
        <h3>{{ playlist.name }}</h3>
        <button @click="getPlaylistTracks(playlist.id)">View Tracks</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isLoggedIn: false,
      playlists: []
    }
  },
  methods: {
    login() {
      window.location.href = '/api/login'
    },
    async getPlaylists() {
      const response = await fetch('/api/get-playlists')
      const data = await response.json()
      this.playlists = data.items
    },
    async getPlaylistTracks(playlistId) {
      const response = await fetch(`/api/playlist-tracks/${playlistId}`)
      const data = await response.json()
      console.log(data)
    }
  },
  mounted() {
    // Check if user is returning from auth flow
    if (window.location.pathname === '/callback') {
      this.isLoggedIn = true
      this.getPlaylists()
    }
  }
}
</script>
