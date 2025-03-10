<template>
  <div
    class="relative min-h-screen bg-gray-800 flex items-center justify-between"
  >
    <div
      class="absolute top-0 left-0 right-0 flex justify-between items-center p-6"
    ></div>
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-700 opacity-20 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-700 opacity-20 rounded-full blur-3xl"
      ></div>
    </div>

    <div
      class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full px-6"
    >
      <h1
        class="text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-[#1DB954] to-blue-500 animate-gradient-x"
      >
        Feel The Music
      </h1>
      <p class="text-3xl text-gray-300 mb-10">
        Stream over 200 thousand songs with one click
      </p>

      <button
        class="bg-[#36ac5f] text-white px-8 py-3 rounded-full hover:bg-green-700 transition duration-300"
        @click="handleLogin"
      >
        <div v-if="isAuthenticated">
          <p class="text-white font-bold">You are logged in!</p>
          <router-link to="/playlists" class="text-spotify-green font-bold"
            >View Your Playlists</router-link
          >
        </div>
        <div v-else>
          <a
            href="http://localhost:3000/login"
            class="text-spotify-white font-bold"
            >Login with Spotify</a
          >
        </div>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      isAuthenticated: false,
    };
  },
  methods: {
    async checkAuthStatus() {
      try {
        const response = await fetch("/api/auth-status");
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
