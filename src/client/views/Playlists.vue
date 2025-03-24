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

    <!-- Playlists Grid View  -->
    <div v-if="!selectedPlaylist"
      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
      <div v-for="playlist in playlists" :key="playlist?.id || index"
        class="bg-gray-800/70 rounded-lg p-4 cursor-pointer transition-transform hover:-translate-y-1 hover:bg-gray-700/80"
        @click="fetchPlaylistTracks(playlist)">
        <img 
          :src="playlist?.images && playlist.images[0]?.url || '/default-playlist.png'" 
          :alt="playlist?.name || 'Playlist'"
          class="w-full aspect-square object-cover rounded-md mb-3"
        >
        <div class="text-white">
          <h3 class="font-bold truncate">{{ playlist?.name || 'Untitled Playlist' }}</h3>
          <p class="text-sm text-gray-400 mt-1">{{ playlist?.tracks ? playlist.tracks.total : 0 }} tracks</p>
          <p class="text-xs text-gray-400 mt-1">By {{ playlist?.owner ? playlist.owner.display_name : 'Unknown' }}</p>

          <!-- Additional playlist info badges -->
          <div class="flex flex-wrap gap-1 mt-2">
            <span class="text-xs px-2 py-1 rounded-full bg-green-900 text-green-200">
              {{ formatPlaylistDuration(playlist) }}
            </span>
            <span v-if="playlist?.public" class="text-xs px-2 py-1 rounded-full bg-blue-900 text-blue-200">
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

      <!-- Playlist details header - Using ContentHeader component -->
      <ContentHeader
        :title="selectedPlaylist.name"
        :imageUrl="selectedPlaylist.images && selectedPlaylist.images[0]?.url"
        primaryActionText="Play"
        secondaryActionText="Share"
        @primary-action="playPlaylist"
        @secondary-action="sharePlaylist"
      >
        <template #subtitle>
          <p class="text-gray-400">By {{ selectedPlaylist.owner ? selectedPlaylist.owner.display_name : 'Unknown' }}</p>
          <p class="text-gray-400 mt-2">{{ selectedPlaylist.tracks ? selectedPlaylist.tracks.total : 0 }} tracks</p>
        </template>
        <template #description v-if="selectedPlaylist.description">
          <p class="text-gray-400 mt-1">{{ selectedPlaylist.description }}</p>
        </template>
      </ContentHeader>

      <!-- Grid view of tracks - Using TrackCard component -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <TrackCard 
          v-for="track in tracks" 
          :key="track.id"
          :track="track"
          @play="playTrack"
          @like="likeTrack"
        >
          <template #badges>
            <span v-for="(artist, idx) in (track.artists || []).slice(0, 1)" :key="idx"
              class="text-xs px-2 py-1 rounded-full bg-purple-900 text-purple-200 truncate ml-auto">
              {{ artist.name }}
            </span>
          </template>
        </TrackCard>
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
import ContentHeader from '../components/layout/ContentHeader.vue';
import TrackCard from '../components/music/TrackCard.vue';
import { formatDuration, formatArtists, formatPlaylistDuration } from '../utils/formatters';

export default {
  components: {
    ContentHeader,
    TrackCard
  },
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

    // imported formatters
    formatDuration,
    formatArtists,
    formatPlaylistDuration,
  
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