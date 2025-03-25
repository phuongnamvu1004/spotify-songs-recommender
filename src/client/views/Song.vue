<template>
  <div>
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <div class="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-purple-700 opacity-20 blur-3xl"></div>
      <div class="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-blue-700 opacity-20 blur-3xl"></div>
    </div>
    
    <div class="p-5 relative z-10">
      <!-- User preferences display -->
      <div v-if="userPreferences.artists.length > 0 || userPreferences.acousticness !== null"
        class="bg-gray-800/50 rounded-lg p-4 mb-6">
        <h2 class="text-white text-xl font-bold mb-3">Your Music Preferences</h2>

        <div v-if="userPreferences.artists.length > 0" class="mb-3">
          <p class="text-gray-400 mb-2">Selected Artists:</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="(artist, index) in userPreferences.artists" :key="index"
              class="px-3 py-1 bg-purple-900 text-purple-200 rounded-full text-sm">
              {{ cleanArtistDisplay(artist) }}
            </span>
          </div>
        </div>

        <div v-if="userPreferences.acousticness !== null" class="mb-1">
          <p class="text-gray-400 mb-2">Instruments Preference:</p>
          <span class="px-3 py-1 bg-blue-900 text-blue-200 rounded-full text-sm">
            {{ userPreferences.acousticness === true ? 'Include instruments' : 'No instruments' }}
          </span>
        </div>
      </div>

      <h1 class="animate-gradient-x mb-8 bg-gradient-to-r from-green-400 via-[#1DB954] to-blue-500 bg-clip-text text-2xl font-bold text-transparent md:text-4xl">
        My Recommended Music
      </h1>

      <!-- Loading state -->
      <div v-if="loading" class="text-center my-12">
        <div class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-spotify-green border-r-transparent align-middle"></div>
        <p class="mt-4 text-spotify-green text-xl">Loading music...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="text-red-500 text-center p-4 bg-red-500/10 rounded-lg">{{ error }}</div>

      <!-- Main content -->
      <div v-else>
        <!-- Artists grid (main view) -->
        <div v-if="!selectedArtist && !selectedPlaylist">
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            <div v-for="(artist, index) in artistAlbums" :key="index"
                class="bg-gray-800/70 rounded-lg p-4 cursor-pointer transition-transform hover:-translate-y-1 hover:bg-gray-700/80"
                @click="selectArtist(artist)">
              <!-- Album cover - single image if less than 4 songs, collage if 4+ songs -->
              <div v-if="artist.songs.length < 4"
                class="w-full aspect-square bg-gray-900 rounded-md mb-3 overflow-hidden">
                <img :src="artist.songs[0]?.imgURL || '/default-track.png'" class="w-full h-full object-cover"
                  :alt="`${artist.artist} album cover`">
              </div>
              <div v-else
                class="w-full aspect-square bg-gray-900 rounded-md mb-3 overflow-hidden grid grid-cols-2 grid-rows-2">
                <img v-for="(song, i) in artist.songs.slice(0, 4)" :key="i" :src="song.imgURL || '/default-track.png'"
                  class="w-full h-full object-cover" :alt="`${artist.artist} song cover`">
              </div>

              <div class="text-white">
                <h3 class="font-bold truncate text-lg">{{ artist.artist }}</h3>
                <p class="text-sm text-gray-400 mt-1">{{ artist.songs.length }} songs</p>

                <!-- Artist badges -->
                <div class="flex flex-wrap gap-1 mt-2">
                  <span class="text-xs px-2 py-1 rounded-full bg-purple-900 text-purple-200">Artist</span>
                  <span class="text-xs px-2 py-1 rounded-full bg-green-900 text-green-200">
                    {{ formatArtistDuration(artist) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Selected Artist View -->
        <div v-if="selectedArtist && !selectedPlaylist">
          <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <button @click="selectedArtist = null"
              class="mb-4 md:mb-0 px-4 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clip-rule="evenodd" />
              </svg>
              Back
            </button>
          </div>

          <!-- Artist header with album art collage background -->
          <div class="relative w-full h-48 md:h-64 bg-gradient-to-b from-gray-800 to-gray-900 mb-4 overflow-hidden">
            <div v-if="selectedArtist.songs.length < 4" class="w-full h-full opacity-50">
              <img :src="selectedArtist.songs[0]?.imgURL || '/default-track.png'" class="w-full h-full object-cover"
                :alt="`${selectedArtist.artist} album cover`">
            </div>
            <div v-else class="w-full h-full opacity-50 flex">
              <img v-for="(song, i) in selectedArtist.songs.slice(0, 4)" :key="i"
                :src="song.imgURL || '/default-track.png'" class="flex-1 object-cover"
                :alt="`${selectedArtist.artist} song cover`">
            </div>

            <div class="absolute bottom-0 left-0 p-4 md:p-6 w-full bg-gradient-to-t from-gray-900 to-transparent">
              <h2 class="text-white text-3xl font-bold">{{ selectedArtist.artist }}</h2>
              <p class="text-gray-400 mt-1">{{ selectedArtist.songs.length }} recommended songs • {{ formatArtistDuration(selectedArtist) }}</p>
            </div>
          </div>

          <div class="flex space-x-4 my-3">
            <button @click="playAll" class="px-6 py-2 bg-spotify-green text-white rounded-full hover:bg-green-600 transition">
              Play All
            </button>
            <button @click="saveToLibrary" class="px-6 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition">
              Save to Library
            </button>
          </div>

          <!-- Artist's songs grid -->
          <div class="mb-6 mt-6">
            <h3 class="text-white text-xl font-bold mb-4">Songs</h3>

            <!-- Grid layout -->
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              <TrackCard 
                v-for="(song, index) in selectedArtist.songs" 
                :key="index"
                :track="formatSongToTrack(song)"
                @play="playSong(song)"
                @like="likeSong(song)"
              />
            </div>
          </div>

          <!-- Audio previews section -->
          <div v-if="selectedArtist.songs.some(s => s.preview_url)" class="mt-6 bg-gray-800/30 rounded-lg p-4">
            <h3 class="text-white text-xl font-bold mb-4">Preview Tracks</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="(song, index) in selectedArtist.songs.filter(s => s.preview_url)" :key="`preview-${index}`"
                class="bg-gray-800/80 rounded-lg p-3 hover:bg-gray-700 transition-colors">
                <div class="flex items-center mb-2">
                  <img :src="song.imgURL || '/default-track.png'" class="w-12 h-12 rounded-md object-cover"
                    :alt="song.name">
                  <div class="ml-3 overflow-hidden">
                    <p class="font-bold text-white truncate">{{ song.name }}</p>
                    <p class="text-xs text-gray-400">{{ formatDuration(song.duration_ms) }}</p>
                  </div>
                </div>

                <audio v-if="song.preview_url" controls class="w-full h-8 mt-1" :src="song.preview_url"></audio>
              </div>
            </div>
          </div>
        </div>

        <!-- Playlists Grid View -->
        <div v-if="!selectedArtist && !selectedPlaylist" class="mt-10">
          <h2 class="animate-gradient-x mb-4 bg-gradient-to-r from-green-400 via-[#1DB954] to-blue-500 bg-clip-text text-2xl font-bold text-transparent md:text-4xl">
            My Playlists
          </h2>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            <div v-for="playlist in playlists" :key="playlist.id"
              class="bg-gray-800 rounded-lg p-4 cursor-pointer transition-transform hover:-translate-y-1 hover:bg-gray-700"
              @click="fetchPlaylistTracks(playlist)">
              <img :src="playlist.images && playlist.images[0]?.url || '/default-playlist.png'" :alt="playlist.name"
                class="w-full aspect-square object-cover rounded-md mb-3">
              <div class="text-white">
                <h3 class="font-bold truncate">{{ playlist.name }}</h3>
                <p class="text-sm text-gray-400 mt-1">{{ playlist.tracks ? playlist.tracks.total : 0 }} tracks</p>
                <p class="text-xs text-gray-400 mt-1">By {{ playlist.owner ? playlist.owner.display_name : 'Unknown' }}</p>

                <!-- Playlist badges -->
                <div class="flex flex-wrap gap-1 mt-2">
                  <span class="text-xs px-2 py-1 rounded-full bg-green-900 text-green-200">
                    {{ formatPlaylistDuration(playlist) }}
                  </span>
                  <span v-if="playlist.public" class="text-xs px-2 py-1 rounded-full bg-blue-900 text-blue-200">Public</span>
                  <span v-else class="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">Private</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Selected Playlist View -->
        <div v-if="selectedPlaylist">
          <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <button @click="selectedPlaylist = null"
              class="mb-4 md:mb-0 px-4 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clip-rule="evenodd" />
              </svg>
              Back
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
                <button @click="playPlaylist" class="px-6 py-2 bg-spotify-green text-white rounded-full hover:bg-green-600 transition">
                  Play
                </button>
                <button @click="sharePlaylist" class="px-6 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition">
                  Share
                </button>
              </div>
            </div>
          </div>

          <!-- Tracks grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <TrackCard
              v-for="track in tracks" 
              :key="track.id"
              :track="track"
              @play="playTrack(track)"
              @like="likeTrack(track)"
            />
          </div>
        </div>

        <!-- Empty state when no content -->
        <div v-if="artistAlbums.length === 0 && playlists.length === 0"
          class="text-center text-white p-8 bg-gray-800/50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 text-gray-500" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          <p class="text-xl font-bold mb-2">No music found</p>
          <p class="text-gray-400 mb-6">Complete the survey to get personalized recommendations</p>
          <button @click="goToSurvey"
            class="bg-spotify-green hover:bg-green-600 text-white px-6 py-2 rounded-full transition-colors">
            Take the Survey
          </button>
        </div>
      </div>
    </div>

    <!-- Footer button -->
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
import ContentHeader from '../components/layout/ContentHeader.vue'
import TrackCard from '../components/music/TrackCard.vue'
import {formatDuration,formatPlaylistDuration,formatReleaseDate,formatArtists,cleanArtistDisplay} from '../utils/formatters.js'

export default {
  name: 'Song',
  components: {
    ContentHeader,
    TrackCard
  },
  data() {
    return {
      recommendedSongs: [],
      artistAlbums: [],
      selectedArtist: null,
      playlists: [],
      selectedPlaylist: null,
      tracks: [],
      loading: true,
      error: null,
      userPreferences: {
        artists: [],
        acousticness: null
      }
    }
  },
  async mounted() {
    try {
      this.processQueryParams();
      await this.fetchRecommendedSongs();
      this.organizeByArtist();
      await this.fetchPlaylists();
    } catch (error) {
      this.error = `An error occurred: ${error.message}`;
      console.error('Error loading data:', error);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    formatDuration,
    formatPlaylistDuration, 
    formatReleaseDate,
    formatArtists,
    cleanArtistDisplay,

    selectArtist(artist) {
      this.selectedArtist = artist;
    },
    
    getMainArtist(artists) {
      if (!artists) return 'Unknown';

      if (typeof artists === 'string') {
        return cleanArtistDisplay(artists);
      }

      if (Array.isArray(artists)) {
        if (artists.length === 0) return 'Unknown';

        if (typeof artists[0] === 'string') {
          return cleanArtistDisplay(artists[0]);
        } else if (typeof artists[0] === 'object' && artists[0].name) {
          return artists[0].name;
        }
      }

      return 'Unknown';
    },
    
    displayArtist(artists) {
      if (!artists) return 'Unknown Artist';

      if (typeof artists === 'string') {
        return cleanArtistDisplay(artists);
      }
      if (Array.isArray(artists)) {
        return artists.map(artist => {
          if (typeof artist === 'string') {
            return cleanArtistDisplay(artist);
          } else if (typeof artist === 'object' && artist.name) {
            return artist.name;
          }
          return '';
        }).filter(name => name).join(', ');
      }

      return 'Unknown Artist';
    },
    
    displayTrackArtists(artists) {
      if (!artists || !Array.isArray(artists)) return 'Unknown Artist';

      return artists
        .map(artist => artist.name || '')
        .filter(name => name)
        .join(', ');
    },
    
    formatSongToTrack(song) {
      return {
        id: song.id,
        name: song.name,
        artists: Array.isArray(song.artists) 
          ? song.artists.map(artist => typeof artist === 'string' 
              ? { name: cleanArtistDisplay(artist) } 
              : artist)
          : [{ name: cleanArtistDisplay(song.artists || 'Unknown Artist') }],
        album: {
          name: song.album || 'Unknown Album',
          images: song.imgURL ? [{ url: song.imgURL }] : null
        },
        duration_ms: song.duration_ms,
        preview_url: song.preview_url,
        popularity: song.popularity || 0
      };
    },
    
    formatArtistDuration(artist) {
      const totalMs = artist.songs.reduce((sum, song) => sum + (song.duration_ms || 0), 0);
      const minutes = Math.floor(totalMs / 60000);

      if (minutes < 60) {
        return `${minutes} min`;
      }

      const hours = Math.floor(minutes / 60);
      const remainingMins = minutes % 60;
      return `${hours} hr ${remainingMins} min`;
    },
    
    // Process query parameters for user preferences
    processQueryParams() {
      if (this.$route && this.$route.query) {
        if (this.$route.query.artists) {
          const artistString = this.$route.query.artists;
          console.log('Raw artist data received:', artistString);

          if (artistString.match(/^\[.*\]$/)) {
            this.userPreferences.artists = this.extractArtistsFromArrayString(artistString);
          } else if (artistString.includes('|')) {
            this.userPreferences.artists = artistString.split('|').map(item => item.trim());
          } else {
            this.userPreferences.artists = [this.cleanArtistName(artistString)];
          }

          console.log('Processed artists:', this.userPreferences.artists);
        }
        if (this.$route.query.acousticness) {
          const acousticnessValue = this.$route.query.acousticness;
          if (acousticnessValue === 'yes') {
            this.userPreferences.acousticness = true;
          } else if (acousticnessValue === 'no') {
            this.userPreferences.acousticness = false;
          }
        }
      }
    },

    extractArtistsFromArrayString(str) {
      const regex = /['"]([^'"]+)['"]/g;
      const matches = [];
      let match;

      while ((match = regex.exec(str)) !== null) {
        matches.push(match[1]);
      }
      if (matches.length > 0) {
        return matches;
      } else {
        return this.cleanArrayString(str);
      }
    },

    cleanArrayString(str) {
      str = str.replace(/^\[|\]$/g, '');

      const result = [];
      let current = '';
      let inQuotes = false;
      let quoteChar = '';

      for (let i = 0; i < str.length; i++) {
        const char = str[i];

        if ((char === "'" || char === '"') && (i === 0 || str[i - 1] !== '\\')) {
          if (!inQuotes) {
            inQuotes = true;
            quoteChar = char;
          } else if (char === quoteChar) {
            inQuotes = false;
          } else {
            current += char;
          }
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim().replace(/^['"]|['"]$/g, ''));
          current = '';
        } else {
          current += char;
        }
      }

      if (current) {
        result.push(current.trim().replace(/^['"]|['"]$/g, ''));
      }

      return result.filter(item => item.length > 0);
    },

    cleanArtistName(name) {
      return name.replace(/^\['|'\]$|^"|"$|^'|'$/g, '');
    },
    
    // Group songs by artist
    organizeByArtist() {
      const artistMap = new Map();

      this.recommendedSongs.forEach(song => {
        let artistName = 'Unknown Artist';

        if (Array.isArray(song.artists) && song.artists.length > 0) {
          if (typeof song.artists[0] === 'string') {
            artistName = cleanArtistDisplay(song.artists[0]);
          } else if (typeof song.artists[0] === 'object' && song.artists[0].name) {
            artistName = song.artists[0].name;
          }
        } else if (typeof song.artists === 'string') {
          artistName = cleanArtistDisplay(song.artists);
        }

        if (!artistMap.has(artistName)) {
          artistMap.set(artistName, []);
        }
        artistMap.get(artistName).push(song);
      });

      this.artistAlbums = Array.from(artistMap, ([artist, songs]) => ({
        artist,
        songs
      })).sort((a, b) => b.songs.length - a.songs.length);
    },
   
    async fetchRecommendedSongs() {
      try {
        let url = 'http://localhost:3000/api/recommended-songs';
        if (this.userPreferences.artists.length > 0 || this.userPreferences.acousticness !== null) {
          const queryParams = new URLSearchParams();

          if (this.userPreferences.artists.length > 0) {
            queryParams.append('artists', JSON.stringify(
              this.userPreferences.artists.map(artist => cleanArtistDisplay(artist))
            ));
          }

          if (this.userPreferences.acousticness !== null) {
            queryParams.append('acousticness', this.userPreferences.acousticness);
          }

          url += `?${queryParams.toString()}`;
        }

        const response = await fetch(url);
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
        const response = await fetch('http://localhost:3000/api/get-playlists', {
          credentials: 'include'
        });
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
        const response = await fetch(`http://localhost:3000/api/playlist-tracks/${playlist.id}`, {
          credentials: "include"
        });
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
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Custom Spotify colors */
:root {
  --spotify-green: #1DB954;
  --spotify-dark: #191414;
}

.bg-spotify-green { background-color: var(--spotify-green); }
.bg-spotify-dark { background-color: var(--spotify-dark); }
.text-spotify-green { color: var(--spotify-green); }

/* Add smooth scaling animation for hover effects */
.hover\:scale {
 transition: transform 0.2s ease-in-out;
}

.hover\:scale:hover {
 transform: scale(1.03);
}
</style>