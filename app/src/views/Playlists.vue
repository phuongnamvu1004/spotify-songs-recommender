<template>
  <div class="playlists-container">
    <h1 class="page-title">My Playlists</h1>
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="playlists-grid">
      <div v-for="playlist in playlists" 
           :key="playlist.id" 
           class="playlist-box"
           @click="viewPlaylist(playlist.id)">
        <img :src="playlist.images[0]?.url || '/default-playlist.png'" 
             :alt="playlist.name" 
             class="playlist-image">
        <div class="playlist-info">
          <h3 class="playlist-name">{{ playlist.name }}</h3>
          <p class="playlist-details">
            {{ playlist.tracks.total }} tracks
          </p>
          <p class="playlist-owner">
            By {{ playlist.owner.display_name }}
          </p>
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
.playlists-container {
  padding: 20px;
}

.page-title {
  color: #1DB954;
  margin-bottom: 2rem;
}

.playlists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

.playlist-box {
  background: #282828;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
}

.playlist-box:hover {
  transform: translateY(-5px);
  background: #333333;
}

.playlist-image {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 12px;
}

.playlist-info {
  color: white;
}

.playlist-name {
  font-size: 1rem;
  margin: 8px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.playlist-details {
  color: #b3b3b3;
  font-size: 0.9rem;
  margin: 4px 0;
}

.playlist-owner {
  color: #b3b3b3;
  font-size: 0.8rem;
  margin: 4px 0;
}

.loading {
  text-align: center;
  color: #1DB954;
  font-size: 1.2rem;
  margin: 2rem 0;
}

.error {
  color: #ff5252;
  text-align: center;
  padding: 1rem;
  background: rgba(255,82,82,0.1);
  border-radius: 4px;
}
</style>
