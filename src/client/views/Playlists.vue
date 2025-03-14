<template>
  <div class="p-5">
    <h1 class="animate-gradient-x mb-8 bg-gradient-to-r from-green-400 via-[#1DB954] to-blue-500 bg-clip-text text-2xl font-bold text-transparent md:text-4xl">
      My Playlists
    </h1>
    <div v-if="loading" class="text-center text-spotify-green text-xl my-8">Loading...</div>
    <div v-else-if="error" class="text-red-500 text-center p-4 bg-red-500/10 rounded-lg">{{ error }}</div>
    <div v-if="!selectedPlaylist" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
      <div v-for="playlist in playlists" :key="playlist.id"
        class="bg-spotify-dark rounded-lg p-4 cursor-pointer transition-transform hover:-translate-y-1 hover:bg-gray-800"
        @click="fetchPlaylistTracks(playlist)">
        <img :src="playlist.images[0]?.url || '/default-playlist.png'" :alt="playlist.name"
          class="w-48 h-48 object-cover rounded-md mb-3">
        <div class="text-white">
          <h3 class="font-bold truncate">{{ playlist.name }}</h3>
          <p class="text-sm text-gray-400 mt-1">{{ playlist.tracks.total }} tracks</p>
          <p class="text-xs text-gray-400 mt-1">By {{ playlist.owner.display_name }}</p>
        </div>
      </div>
    </div>

    <!--Showing songs in Playlist -->
    <div v-else>
      <button @click="selectedPlaylist = null"
        class="mb-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition">
        Back to Playlists
      </button>
      <h2 class="text-white text-xl font-bold mb-4">{{ selectedPlaylist.name }} - Tracks</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <div v-for="track in tracks" :key="track.id" class="bg-gray-800 p-3 rounded-lg flex flex-col items-center">
          <img :src="track.album.images[0]?.url || '/default-track.png'" class="w-32 h-32 rounded-md">
          <div class="text-center mt-2">
            <p class="font-bold text-white truncate w-32">{{ track.name }}</p>
            <p class="text-sm text-gray-400 truncate w-32">{{ track.artists.map(a => a.name).join(", ") }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="mt-12 mb-4 flex justify-center">
    <button @click="goToSurvey"
      class="flex items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-blue-600 px-8 py-3 font-bold text-white hover:from-green-400 hover:to-blue-500 transition-all duration-300">
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
      tracks: [],
      selectedPlaylist: null,
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
      this.$router.push('/')
    } finally {
      this.loading = false
    }
  },
  methods: {
    async fetchPlaylistTracks(playlist) {
      this.selectedPlaylist = playlist;
      this.tracks = [];
      try {
        const response = await fetch(`/api/playlist-tracks/${playlist.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch tracks");
        }
        const data = await response.json();
        this.tracks = data.items.map(item => item.track);
      } catch (error) {
        this.error = error.message;
      }
    },
    goToSurvey() {
      this.$router.push('/Survey/Page1');
    }
  }
}
</script>
