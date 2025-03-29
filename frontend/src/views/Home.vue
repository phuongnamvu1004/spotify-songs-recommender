<template>
  <div class="relative min-h-screen bg-gray-800 flex items-center justify-between">
    <div class="absolute top-0 left-0 right-0 flex justify-between items-center p-6"></div>
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-700 opacity-20 rounded-full blur-3xl"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-700 opacity-20 rounded-full blur-3xl"></div>
    </div>

    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full px-6">
      <h1
        class="text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-[#1DB954] to-blue-500 animate-gradient-x">
        Feel The Music
      </h1>
      <p class="text-3xl text-gray-300 mb-10">
        Stream over 200 thousand songs with one click
      </p>

      <div class="flex justify-center">
        <button v-if="isAuthenticated"
          class="flex items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-blue-600 px-8 py-3 font-bold text-white hover:from-green-400 hover:to-blue-500 transition-all duration-300">
          <router-link to="/playlists" class="font-bold text-white text-center">
            View Your Playlists
          </router-link>
        </button>

        <button v-else
          class="flex items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-blue-600 px-8 py-3 font-bold text-white hover:from-green-400 hover:to-blue-500 transition-all duration-300">
          <a :href="`${backendUrl}/login`" class="font-bold text-white text-center">
            Login with Spotify
          </a>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    console.log("[VITE DEBUG] VITE_BACKEND_URL:", import.meta.env.VITE_BACKEND_URL);
    return {
      isAuthenticated: false,
      backendUrl: import.meta.env.VITE_BACKEND_URL, // Get it from Vite env
    };
  },
  methods: {
    async checkAuthStatus() {
      try {
        const response = await fetch(`${this.backendUrl}/api/auth-status`, {
          credentials: "include",
        });
        const data = await response.json();
        this.isAuthenticated = data.isAuthenticated;
      } catch (error) {
        console.error("Error checking auth status:", error);
        this.isAuthenticated = false;
      }
    },
  },
  mounted() {
    this.checkAuthStatus();
  },
};
</script>

<style scoped>
@keyframes gradient-x {

  0%,
  100% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }
}

.animate-gradient-x {
  background-size: 200% auto;
  animation: gradient-x 3s ease infinite;
}
</style>