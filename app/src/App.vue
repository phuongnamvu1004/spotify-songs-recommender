<template>
  <div class="min-h-screen bg-[#121212]">
    <nav class="bg-[#282828] shadow-lg">
      <div class="container mx-auto px-3 py-2">
        <div class="flex items-center space-x-8">
          <router-link to="/" class="text-white font-bold px-3 py-2 rounded hover:bg-[#323232]">Home</router-link>
          <router-link to="/playlists" class="text-white font-bold px-3 py-2 rounded hover:bg-[#323232]">Playlists</router-link>
        </div>
      </div>
    </nav>
    <main class="container mx-auto px-6 py-8">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
