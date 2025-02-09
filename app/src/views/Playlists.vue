<template>
  <div class="p-5">
    <h1 class="text-3xl font-bold text-spotify-green mb-8">My Playlists</h1>
    <div v-if="loading" class="text-center text-spotify-green text-xl my-8">Loading...</div>
    <div v-else-if="error" class="text-red-500 text-center p-4 bg-red-500/10 rounded-lg">{{ error }}</div>
    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
      <div v-for="playlist in playlists" 
           :key="playlist.id" 
           class="bg-spotify-dark rounded-lg p-4 cursor-pointer transition-transform hover:-translate-y-1 hover:bg-gray-800"
           @click="viewPlaylist(playlist.id)">
        <img :src="playlist.images[0]?.url || '/default-playlist.png'" 
             :alt="playlist.name" 
             class="w-full aspect-square object-cover rounded-md mb-3">
        <div class="text-white">
          <h3 class="font-bold truncate">{{ playlist.name }}</h3>
          <p class="text-sm text-gray-400 mt-1">{{ playlist.tracks.total }} tracks</p>
          <p class="text-xs text-gray-400 mt-1">By {{ playlist.owner.display_name }}</p>
        </div>
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
  },
  methods: {
    viewPlaylist(id) {
      console.log('Viewing playlist:', id)
      // Future implementation for viewing playlist tracks
    }
  }
}
</script>

<style scoped>
</style>
