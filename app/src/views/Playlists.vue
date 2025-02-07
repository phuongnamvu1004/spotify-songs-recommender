<template>
  <div>
    <h1>My Playlists</h1>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <div v-for="playlist in playlists" :key="playlist.id">
        <h3>{{ playlist.name }}</h3>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      playlists: [],
      loading: true,
      error: null
    }
  },
  async mounted() {
    try {
      const response = await fetch('/api/get-playlists')
      if (!response.ok) {
        throw new Error('Authentication required')
      }
      const data = await response.json()
      this.playlists = data.items
    } catch (error) {
      this.error = error.message
      // Redirect to home if not authenticated
      this.$router.push('/')
    } finally {
      this.loading = false
    }
  }
}
</script>
