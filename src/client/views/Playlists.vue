<template>
  <div class="p-5">
    <h1
      class="animate-gradient-x mb-8 bg-gradient-to-r from-green-400 via-[#1DB954] to-blue-500 bg-clip-text text-2xl font-bold text-transparent md:text-4xl">
      My Playlists
    </h1>
    <div v-if="loading" class="text-center my-12">
      <div
        class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-spotify-green border-r-transparent align-middle">
      </div>
      <p class="mt-4 text-spotify-green text-xl">Loading music...</p>
    </div>
    <div v-else-if="error" class="text-red-500 text-center p-4 bg-red-500/10 rounded-lg">{{ error }}</div>

    <!-- Playlists Grid View -->
    <div v-if="!selectedPlaylist && !selectedAlbum"
      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
      <div v-for="playlist in playlists" :key="playlist.id"
        class="bg-gray-800/70 rounded-lg p-4 cursor-pointer transition-transform hover:-translate-y-1 hover:bg-gray-700/80"
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

    <!-- Showing songs in Playlist -->
    <div v-else-if="selectedPlaylist && !selectedAlbum">
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
          :alt="selectedPlaylist.name" class="w-40 h-40 rounded-md object-cover">
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

      <!-- Grid view of tracks - styled like song.vue -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <div v-for="track in tracks" :key="track.id"
          class="bg-gray-800/70 rounded-lg p-3 flex flex-col transition-transform hover:-translate-y-1 hover:bg-gray-700/80">
          <img :src="track.album && track.album.images && track.album.images[0]?.url || '/default-track.png'"
            class="w-full aspect-square object-cover rounded-md mb-3 cursor-pointer"
            @click="fetchAlbumTracks(track.album)">
          <div class="flex-1">
            <p class="font-bold text-white truncate">{{ track.name }}</p>
            <p class="text-sm text-gray-400 truncate mt-1">
              {{ track.artists ? displayTrackArtists(track.artists) : 'Unknown Artist' }}
            </p>
            <p class="text-xs text-gray-500 mt-1 cursor-pointer hover:underline" @click="fetchAlbumTracks(track.album)">
              {{ track.album ? track.album.name : 'Unknown Album' }}
            </p>

            <!-- Tags/Badges like in song.vue -->
            <div class="flex flex-wrap gap-1 mt-2">
              <span class="text-xs px-2 py-1 rounded-full bg-green-900 text-green-200">
                {{ formatDuration(track.duration_ms) }}
              </span>
              <span v-if="track.popularity > 70" class="text-xs px-2 py-1 rounded-full bg-yellow-900 text-yellow-200">
                Popular
              </span>
              <span v-for="(artist, idx) in (track.artists || []).slice(0, 1)" :key="idx"
                class="text-xs px-2 py-1 rounded-full bg-purple-900 text-purple-200 truncate ml-auto">
                {{ artist.name }}
              </span>
            </div>
          </div>

          <!-- Audio preview and action buttons like in song.vue -->
          <div class="mt-3 pt-3 border-t border-gray-700">
            <audio v-if="track.preview_url" controls class="w-full h-8 mt-1" :src="track.preview_url"></audio>
            <p v-else class="text-xs text-gray-500 mt-1 text-center">No preview available</p>

            <div class="flex justify-between mt-3">
              <button class="text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clip-rule="evenodd" />
                </svg>
              </button>
              <button class="px-3 py-1 bg-spotify-green text-white rounded-full text-xs hover:bg-green-600">
                Play
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Album View -->
    <div v-else-if="selectedAlbum">
      <div class="mb-6 flex items-center">
        <button @click="backFromAlbum"
          class="px-4 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clip-rule="evenodd" />
          </svg>
          Back to Playlist
        </button>
      </div>

      <!-- Album details -->
      <div class="flex flex-col md:flex-row bg-gray-800/50 rounded-lg p-4 mb-6">
        <img :src="selectedAlbum.images && selectedAlbum.images[0]?.url || '/default-album.png'"
          :alt="selectedAlbum.name" class="w-40 h-40 rounded-md object-cover">
        <div class="md:ml-6 mt-4 md:mt-0">
          <h2 class="text-white text-2xl font-bold">{{ selectedAlbum.name }}</h2>
          <p class="text-gray-400">By {{selectedAlbum.artists ? selectedAlbum.artists.map(a => a.name).join(", ") :
            'Unknown Artist' }}</p>
          <p class="text-gray-400 mt-2">{{ albumTracks.length }} tracks</p>
          <p class="text-gray-400 mt-1" v-if="selectedAlbum.release_date">Released: {{
            formatReleaseDate(selectedAlbum.release_date) }}</p>

          <div class="flex mt-4 gap-2">
            <button class="px-6 py-2 bg-spotify-green text-white rounded-full hover:bg-green-600 transition">
              Play
            </button>
            <button class="px-6 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition">
              Save to Library
            </button>
          </div>
        </div>
      </div>

      <!-- Loading album tracks state -->
      <div v-if="loadingAlbumTracks" class="text-center py-8">
        <div
          class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-spotify-green border-r-transparent align-middle">
        </div>
        <p class="mt-2 text-spotify-green">Loading album tracks...</p>
      </div>

      <!-- Album tracks - Grid View like song.vue -->
      <div v-else-if="albumTracks.length > 0" class="mb-6">
        <h3 class="text-white text-xl font-bold mb-4">Tracks</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div v-for="(track, index) in albumTracks" :key="track.id"
            class="bg-gray-800/70 rounded-lg p-3 transition-transform hover:-translate-y-1 hover:bg-gray-700/80">
            <div class="flex items-center mb-3">
              <div class="bg-gray-700 w-10 h-10 flex items-center justify-center rounded-md mr-3 text-gray-400">
                {{ index + 1 }}
              </div>
              <div class="flex-1 overflow-hidden">
                <p class="font-bold text-white truncate">{{ track.name }}</p>
                <p class="text-sm text-gray-400 truncate">
                  {{track.artists ? track.artists.map(a => a.name).join(", ") : 'Unknown Artist'}}
                </p>
              </div>
            </div>

            <div class="flex flex-wrap gap-1 mt-2">
              <span class="text-xs px-2 py-1 rounded-full bg-green-900 text-green-200">
                {{ formatDuration(track.duration_ms) }}
              </span>
              <span v-if="track.popularity > 70" class="text-xs px-2 py-1 rounded-full bg-yellow-900 text-yellow-200">
                Popular
              </span>
            </div>

            <!-- Audio preview and action buttons -->
            <div class="mt-3 pt-3 border-t border-gray-700">
              <audio v-if="track.preview_url" controls class="w-full h-8 mt-1" :src="track.preview_url"></audio>
              <p v-else class="text-xs text-gray-500 mt-1 text-center">No preview available</p>

              <div class="flex justify-between mt-3">
                <button class="text-gray-400 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clip-rule="evenodd" />
                  </svg>
                </button>
                <button class="px-3 py-1 bg-spotify-green text-white rounded-full text-xs hover:bg-green-600">
                  Play
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No tracks available message -->
      <div v-else class="text-center py-8 bg-gray-800 rounded-lg">
        <p class="text-gray-400">No tracks available for this album.</p>
      </div>
    </div>
  </div>

  <div class="mt-12 mb-4 flex justify-center">
    <button @click="goToSurvey"
      class="flex items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-blue-600 px-8 py-3 font-bold text-white hover:from-green-400 hover:to-blue-500 transition-all duration-300">
      Continue to the survey
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
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
      selectedAlbum: null,
      albumTracks: [],
      loading: true,
      loadingAlbumTracks: false,
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
      this.playlists = data.items || []
    } catch (error) {
      this.error = error.message
    } finally {
      this.loading = false
    }
  },
  methods: {
    async fetchPlaylistTracks(playlist) {
      this.selectedPlaylist = playlist;
      this.tracks = [];
      this.selectedAlbum = null;
      this.loading = true;

      try {
        const response = await fetch(`/api/playlist-tracks/${playlist.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch tracks");
        }
        const data = await response.json();
        this.tracks = data.items.map(item => {
          const track = item.track || {};
          track.added_at = item.added_at;
          return track;
        }).filter(track => track.id); // Filter out any null tracks
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchAlbumTracks(album) {
      if (!album || !album.id) {
        console.warn('Invalid album selected');
        return;
      }

      this.selectedAlbum = album;
      this.albumTracks = [];
      this.loadingAlbumTracks = true;

      try {
        const response = await fetch(`/api/albums/${album.id}/tracks`);
        if (!response.ok) {
          throw new Error(`Failed to fetch album tracks: ${response.status}`);
        }

        const data = await response.json();
        this.albumTracks = data.items || [];

        console.log('Album tracks loaded:', this.albumTracks.length);
      } catch (error) {
        console.warn('Could not fetch album tracks:', error);
        this.error = `Failed to load album tracks: ${error.message}`;
      } finally {
        this.loadingAlbumTracks = false;
      }
    },

    backFromAlbum() {
      this.selectedAlbum = null;
      this.albumTracks = [];
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

    formatReleaseDate(dateString) {
      if (!dateString) return 'Unknown date';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    },

    displayTrackArtists(artists) {
      if (!artists || !Array.isArray(artists)) return 'Unknown Artist';

      return artists
        .map(artist => artist.name || '')
        .filter(name => name)
        .join(', ');
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