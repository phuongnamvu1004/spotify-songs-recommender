<template>
  <div class="p-5">
    <h1 class="text-3xl font-bold text-spotify-green mb-8">My Playlists</h1>
    <div v-if="loading" class="text-center text-spotify-green text-xl my-8">Loading...</div>
    <div v-else-if="error" class="text-red-500 text-center p-4 bg-red-500/10 rounded-lg">{{ error }}</div>
    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
      <div v-for="playlist in playlists" :key="playlist.id"
        class="bg-spotify-dark rounded-lg p-4 cursor-pointer transition-transform hover:-translate-y-1 hover:bg-gray-800"
        @click="viewPlaylist(playlist.id)">
        <img :src="playlist.images[0]?.url || '/default-playlist.png'" :alt="playlist.name"
          class="w-full aspect-square object-cover rounded-md mb-3">
        <div class="text-white">
          <h3 class="font-bold truncate">{{ playlist.name }}</h3>
          <p class="text-sm text-gray-400 mt-1">{{ playlist.tracks.total }} tracks</p>
          <p class="text-xs text-gray-400 mt-1">By {{ playlist.owner.display_name }}</p>
        </div>
      </div>
    </div>
  </div>
  <div class="mt-12 mb-4 flex justify-center">
    <button @click="goToSurvey"
      class="bg-spotify-green hover:bg-[#18a64a] text-black font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2">
      Continue to the survey
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd"
          d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
          clip-rule="evenodd" />
      </svg>
    </button>
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
    },
    goToSurvey() {
        this.$router.push('/Survey')
    }
  }
}

</script>

<style scoped></style>
