<template>
  <div>
    <h1>Welcome to the home page</h1>
    <a href="http://localhost:3000/login">Login with Spotify</a>
    <div v-if="isAuthenticated">
      <p>You are authenticated. Redirecting...</p>
    </div>
    <div v-else>
      <p>Please log in to continue.</p>
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
        if (this.isAuthenticated) {
          this.$router.push('/playlists')
        }
      } catch (error) {
        console.error('Error checking auth status:', error)
      }
    }
  },
  mounted() {
    this.checkAuthStatus()
  }
}
</script>
