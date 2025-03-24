<template>
  <div
    class="mt-3 pt-3 border-t border-gray-700"
  >
    <img 
      :src="track.album && track.album.images && track.album.images[0]?.url || '/default-track.png'"
      class="w-full aspect-square object-cover rounded-md mb-3"
    >
    <div class="flex-1">
      <p class="font-bold text-white truncate">{{ track.name }}</p>
      <p class="text-sm text-gray-400 truncate mt-1">
        {{ displayArtists }}
      </p>
      <p class="text-xs text-gray-500 mt-1">
        {{ track.album ? track.album.name : 'Unknown Album' }}
      </p>

      <!-- Tags/Badges -->
      <div class="flex flex-wrap gap-1 mt-2">
        <span class="text-xs px-2 py-1 rounded-full bg-green-900 text-green-200">
          {{ formattedDuration }}
        </span>
        <span v-if="track.popularity > 70" class="text-xs px-2 py-1 rounded-full bg-yellow-900 text-yellow-200">
          Popular
        </span>
        <slot name="badges"></slot>
      </div>
    </div>

    <!-- Audio preview and action buttons -->
    <div class="mt-3 pt-3 border-t border-gray-700">
      <audio v-if="track.preview_url" controls class="w-full h-8 mt-1" :src="track.preview_url"></audio>
      <p v-else class="text-xs text-gray-500 mt-1 text-center">No preview available</p>

      <div class="flex justify-between mt-3">
        <button class="text-gray-400 hover:text-white" @click="$emit('like', track)">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clip-rule="evenodd" />
          </svg>
        </button>
        <button 
          class="px-3 py-1 bg-spotify-green text-white rounded-full text-xs hover:bg-green-600"
          @click="$emit('play', track)"
        >
          Play 
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TrackCard',
  props: {
    track: {
      type: Object,
      required: true
    }
  },
  computed: {
    displayArtists() {
      if (!this.track.artists || !Array.isArray(this.track.artists)) return 'Unknown Artist';
      
      return this.track.artists
        .map(artist => artist.name || '')
        .filter(name => name)
        .join(', ');
    },
    formattedDuration() {
      return this.formatDuration(this.track.duration_ms);
    }
  },
  methods: {
    // Define the formatting functions directly in the component
    formatDuration(ms) {
      if (!ms) return '0:00';
      const minutes = Math.floor(ms / 60000);
      const seconds = Math.floor((ms % 60000) / 1000);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    },
    
    // Add other formatter functions if needed
    formatArtists(artists) {
      if (!artists || !Array.isArray(artists)) return 'Unknown Artist';
      
      return artists
        .map(artist => artist.name || '')
        .filter(name => name)
        .join(', ');
    },
    
    cleanArtistDisplay(artistString) {
      if (!artistString) return 'Unknown Artist';

      if (typeof artistString === 'string') {
        return artistString
          .replace(/\[|\]|'|"|\\|\//g, '')
          .replace(/^\s+|\s+$/g, '');
      }

      return artistString;
    }
  }
}
</script>