<template>
  <div class="app">
    <nav class="nav-bar">
      <div class="nav-content">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/playlists" class="nav-link">Playlists</router-link>
      </div>
    </nav>
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
.app {
  font-family: Arial, sans-serif;
}

.nav-bar {
  background-color: #1ED760; /* Spotify green */
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: rgba(255,255,255,0.1);
}

.router-link-active {
  background-color: rgba(255,255,255,0.2);
}

.main-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
