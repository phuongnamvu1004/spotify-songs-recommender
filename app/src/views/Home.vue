<template>
  <div>
    <h1>Welcome to the home page</h1>
    <div v-if="isAuthenticated">
      <p>You are logged in!</p>
      <router-link to="/playlists" class="nav-link">View Your Playlists</router-link>
    </div>
    <div v-else>
      <p>Please log in to continue.</p>
      <a href="http://localhost:3000/login">Login with Spotify</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      isAuthenticated: false
    }
  },
  methods: {
    async checkAuthStatus() {
      try {
        const response = await fetch('/api/auth-status')
        const data = await response.json()
        this.isAuthenticated = data.isAuthenticated
      } catch (error) {
        console.error('Error checking auth status:', error)
        this.isAuthenticated = false
      }
    }
  },
  mounted() {
    this.checkAuthStatus()
  }
}
</script>
