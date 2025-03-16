<template>
  <div>
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <div class="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-purple-700 opacity-20 blur-3xl"></div>
      <div class="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-blue-700 opacity-20 blur-3xl"></div>
    </div>
    <div class="p-5 relative z-10">
      <h1
        class="animate-gradient-x mb-8 bg-gradient-to-r from-green-400 via-[#1DB954] to-blue-500 bg-clip-text text-2xl font-bold text-transparent md:text-4xl">
        My Recommended Playlists
      </h1>

      <div v-if="loading" class="text-center my-12">
        <div class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-spotify-green border-r-transparent align-middle"></div>
        <p class="mt-4 text-spotify-green text-xl">Loading music...</p>
      </div>
      
      <div v-else-if="error" class="text-red-500 text-center p-4 bg-red-500/10 rounded-lg">{{ error }}</div>

      <!-- Recommended Songs View -->
      <div v-if="!loading && !error && recommendedSongs.length > 0">
        <div class="bg-gray-800/50 rounded-lg p-6 mb-6">
          <h2 class="text-white text-2xl font-bold mb-4">Songs recommended based on your preferences</h2>
          <p class="text-gray-400 mb-4">Based on your music survey, we've found songs that match your taste.</p>
          
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
            <div v-for="song in recommendedSongs" :key="song.id" 
                 class="bg-gray-800 rounded-lg p-3 flex flex-col transition-transform hover:-translate-y-1 hover:bg-gray-700">
              <img :src="song.imgURL || '/default-track.png'" class="w-full aspect-square object-cover rounded-md mb-3">
              <div class="flex-1">
                <p class="font-bold text-white truncate">{{ song.name }}</p>
                <p class="text-sm text-gray-400 truncate mt-1">{{ song.artists }}</p>
                
                <div class="flex flex-wrap gap-1 mt-2">
                  <span class="text-xs px-2 py-1 rounded-full bg-green-900 text-green-200">
                    {{ formatDuration(song.duration_ms) }}
                  </span>
                  <span v-if="song.popularity > 70" class="text-xs px-2 py-1 rounded-full bg-yellow-900 text-yellow-200">
                    Popular
                  </span>
                </div>
              </div>
              
              <div class="mt-3 pt-3 border-t border-gray-700">
                <audio v-if="song.preview_url" controls class="w-full h-8 mt-1" :src="song.preview_url"></audio>
                <p v-else class="text-xs text-gray-500 mt-1 text-center">No preview available</p>
                
                <div class="flex justify-between mt-3">
                  <button class="px-3 py-1 bg-gray-700 text-gray-300 hover:bg-gray-600 text-xs rounded-full flex items-center">
                    ♡ Save
                  </button>
                  <button class="px-3 py-1 bg-spotify-green text-white rounded-full text-xs hover:bg-green-600 flex items-center">
                    <span>Play</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Playlists Grid View -->
      <div v-if="!selectedPlaylist" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-8">
        <div v-for="playlist in playlists" :key="playlist.id"
          class="bg-gray-800 rounded-lg p-4 cursor-pointer transition-transform hover:-translate-y-1 hover:bg-gray-700"
          @click="fetchPlaylistTracks(playlist)">
          <img :src="playlist.images && playlist.images[0]?.url || '/default-playlist.png'" :alt="playlist.name"
            class="w-full aspect-square object-cover rounded-md mb-3">
          <div class="text-white">
            <h3 class="font-bold truncate">{{ playlist.name }}</h3>
            <p class="text-sm text-gray-400 mt-1">{{ playlist.tracks ? playlist.tracks.total : 0 }} tracks</p>
            <p class="text-xs text-gray-400 mt-1">By {{ playlist.owner ? playlist.owner.display_name : 'Unknown' }}</p>

            <!-- Additional playlist info badges -->
            <div class="flex flex-wrap gap-1 mt-2">
              <span class="text-xs px-2 py-1 rounded-full bg-green-900 text-green-200">
                {{ formatPlaylistDuration(playlist) }}
              </span>
              <span v-if="playlist.public" class="text-xs px-2 py-1 rounded-full bg-blue-900 text-blue-200">
                Public
              </span>
              <span v-else class="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">
                Private
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Selected Playlist Tracks View -->
      <div v-else>
        <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <button @click="selectedPlaylist = null"
            class="mb-4 md:mb-0 px-4 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clip-rule="evenodd" />
            </svg>
            Back to Playlists
          </button>
        </div>

        <!-- Playlist details header -->
        <div class="flex flex-col md:flex-row bg-gray-800/50 rounded-lg p-4 mb-6">
          <img :src="selectedPlaylist.images && selectedPlaylist.images[0]?.url || '/default-playlist.png'" 
               :alt="selectedPlaylist.name"
               class="w-40 h-40 rounded-md object-cover">
          <div class="md:ml-6 mt-4 md:mt-0">
            <h2 class="text-white text-2xl font-bold">{{ selectedPlaylist.name }}</h2>
            <p class="text-gray-400">By {{ selectedPlaylist.owner ? selectedPlaylist.owner.display_name : 'Unknown' }}</p>
            <p class="text-gray-400 mt-2">{{ selectedPlaylist.tracks ? selectedPlaylist.tracks.total : 0 }} tracks</p>
            <p class="text-gray-400 mt-1" v-if="selectedPlaylist.description">{{ selectedPlaylist.description }}</p>

            <div class="flex mt-4 gap-2">
              <button class="px-6 py-2 bg-spotify-green text-white rounded-full hover:bg-green-600 transition">
                Play
              </button>
              <button class="px-6 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition">
                Share
              </button>
            </div>
          </div>
        </div>

        <!-- Track listing -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <div v-for="track in tracks" :key="track.id"
            class="bg-gray-800 rounded-lg p-3 flex flex-col transition-transform hover:-translate-y-1 hover:bg-gray-700">
            <img :src="track.album && track.album.images && track.album.images[0]?.url || '/default-track.png'"
              class="w-full aspect-square object-cover rounded-md mb-3">
            <div class="flex-1">
              <p class="font-bold text-white truncate">{{ track.name }}</p>
              <p class="text-sm text-gray-400 truncate mt-1">{{ track.artists ? track.artists.map(a => a.name).join(", ") : 'Unknown Artist' }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ track.album && track.album.release_date ? new Date(track.album.release_date).getFullYear() : 'Unknown' }}</p>

              <div class="flex flex-wrap gap-1 mt-2">
                <span v-for="(artist, idx) in (track.artists || []).slice(0, 1)" :key="idx"
                  class="text-xs px-2 py-1 rounded-full bg-purple-900 text-purple-200 truncate max-w-full">
                  {{ artist.name }}
                </span>
                <span class="text-xs px-2 py-1 rounded-full bg-green-900 text-green-200">
                  {{ formatDuration(track.duration_ms) }}
                </span>
                <span v-if="track.popularity > 70" class="text-xs px-2 py-1 rounded-full bg-yellow-900 text-yellow-200">
                  Popular
                </span>
              </div>
            </div>

            <div class="mt-3 pt-3 border-t border-gray-700">
              <audio v-if="track.preview_url" controls class="w-full h-8 mt-1" :src="track.preview_url"></audio>
              <p v-else class="text-xs text-gray-500 mt-1 text-center">No preview available</p>

              <div class="flex justify-between mt-3">
                <button class="px-3 py-1 text-xs rounded-full flex items-center bg-gray-700 text-gray-300 hover:bg-gray-600">
                  <span>♡ Save</span>
                </button>
                <button class="px-3 py-1 bg-spotify-green text-white rounded-full text-xs hover:bg-green-600 flex items-center">
                  <span>Play</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state when no content -->
      <div v-if="!loading && !error && playlists.length === 0 && recommendedSongs.length === 0"
        class="text-center text-white p-8 bg-gray-800/50 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 text-gray-500" fill="none"
          viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
        <p class="text-xl font-bold mb-2">No music found</p>
        <p class="text-gray-400 mb-6">Complete the survey to get personalized recommendations</p>
        <button @click="goToSurvey" class="bg-spotify-green hover:bg-green-600 text-white px-6 py-2 rounded-full transition-colors">
          Take the Survey
        </button>
      </div>
    </div>

    <div class="mt-12 mb-4 flex justify-center">
      <button @click="goToSurvey"
        class="flex items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-blue-600 px-8 py-3 font-bold text-white hover:from-green-400 hover:to-blue-500 transition-all duration-300">
        Back to the survey
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
            clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      recommendedSongs: [],
      playlists: [],
      selectedPlaylist: null,
      tracks: [],
      loading: true,
      error: null
    }
  },
  async mounted() {
    try {
      // Fetch recommended songs based on survey results
      await this.fetchRecommendedSongs();
      
      // Also fetch user's playlists
      await this.fetchPlaylists();
    } catch (error) {
      this.error = `An error occurred: ${error.message}`;
      console.error('Error loading data:', error);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async fetchRecommendedSongs() {
      try {
        const response = await fetch('/api/recommended-songs');
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        this.recommendedSongs = data;
        console.log('Recommended songs loaded:', this.recommendedSongs.length);
      } catch (error) {
        console.warn('Could not fetch recommended songs:', error);
        this.recommendedSongs = [];
      }
    },
    
    async fetchPlaylists() {
      try {
        const response = await fetch('/api/get-playlists');
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        this.playlists = data.items || [];
      } catch (error) {
        console.warn('Could not fetch playlists:', error);
        this.playlists = [];
      }
    },
    
    async fetchPlaylistTracks(playlist) {
      this.selectedPlaylist = playlist;
      this.tracks = [];
      this.loading = true;
      
      try {
        const response = await fetch(`/api/playlist-tracks/${playlist.id}`);
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        this.tracks = data.items.map(item => {
          const track = item.track || {};
          track.added_at = item.added_at;
          return track;
        }).filter(track => track.id); // Filter out any null tracks
      } catch (error) {
        console.error('Could not fetch playlist tracks:', error);
        this.tracks = [];
      } finally {
        this.loading = false;
      }
    },
    
    formatDuration(ms) {
      if (!ms) return '0:00';
      const minutes = Math.floor(ms / 60000);
      const seconds = Math.floor((ms % 60000) / 1000);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    },
    
    formatPlaylistDuration(playlist) {
      // Estimate based on average track length (3:30)
      const estimatedMinutes = Math.round((playlist.tracks?.total || 0) * 3.5);
      if (estimatedMinutes < 60) {
        return `${estimatedMinutes} min`;
      }
      const hours = Math.floor(estimatedMinutes / 60);
      const minutes = estimatedMinutes % 60;
      return `${hours} hr ${minutes} min`;
    },
    
    goToSurvey() {
      try {
        this.$router.push('/Survey/Page1');
      } catch (error) {
        window.location.href = '/Survey/Page1';
      }
    }
  }
}
</script>

<style scoped>
.animate-gradient-x {
  background-size: 200% 200%;
  animation: gradient-x 2s ease infinite;
}

@keyframes gradient-x {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Custom color for Spotify */
:root {
  --spotify-green: #1DB954;
  --spotify-dark: #191414;
}

.bg-spotify-green {
  background-color: var(--spotify-green);
}

.bg-spotify-dark {
  background-color: var(--spotify-dark);
}

.text-spotify-green {
  color: var(--spotify-green);
}

/* Add smooth scaling animation for hover effects */
.hover\:scale {
  transition: transform 0.2s ease-in-out;
}
.hover\:scale:hover {
  transform: scale(1.03);
}
</style>