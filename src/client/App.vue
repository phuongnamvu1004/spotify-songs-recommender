<template>
  <div
    class="relative min-h-screen bg-gray-800 flex items-center justify-between"
  >
    <div
      class="absolute top-0 left-0 right-0 flex justify-between items-center p-6"
    >
      <div class="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 512 512"
          fill="#1DB954"
        >
          <path
            d="M256 16C123.452 16 16 123.452 16 256s107.452 240 240 240 240-107.452 240-240S388.548 16 256 16zm129.777 182.108c-48.032-28.579-127.495-31.168-173.316-17.237-9.363 2.834-19.157-2.442-21.989-11.804-2.832-9.362 2.442-19.156 11.804-21.988 54.904-16.633 141.501-13.458 197.283 19.907 8.521 5.074 11.27 16.113 6.196 24.634-5.074 8.521-16.113 11.27-24.634 6.196zm-3.447 39.007c-4.285 6.951-13.404 9.134-20.356 4.85-51.016-31.281-128.846-40.408-189.171-22.118-7.872 2.381-16.18-2.058-18.562-9.93-2.381-7.872 2.058-16.18 9.93-18.562 67.323-20.394 152.024-10.409 209.81 25.209 6.952 4.284 9.135 13.404 4.85 20.356zm-16.559 37.674c-3.417 5.539-10.685 7.285-16.223 3.869-44.407-27.243-100.206-33.387-165.857-18.283-6.356 1.438-12.783-1.653-14.221-8.009-1.438-6.356 1.653-12.783 8.009-14.221 72.337-16.471 134.725-9.534 184.874 21.07 5.539 3.417 7.285 10.685 3.869 16.223z"
          />
        </svg>
        <span class="text-white text-2xl font-bold ml-4"
          >Spotify Songs Recommender</span
        >
      </div>

      <div class="flex space-x-6 text-white">
        <router-link to="/">
          <a href="#" class="flex items-center hover:text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="mr-2"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Home
          </a>
        </router-link>
        <router-link to="/playlists"
          ><a href="#" class="flex items-center hover:text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="mr-2"
            >
              <path d="M9 18V5l12-2v13"></path>
              <circle cx="6" cy="18" r="3"></circle>
              <circle cx="18" cy="16" r="3"></circle>
            </svg>
            Playlist
          </a>
        </router-link>
      </div>
    </div>

    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-700 opacity-20 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-700 opacity-20 rounded-full blur-3xl"
      ></div>
    </div>

    <main class="container mx-auto px-6 py-8 pt-20">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>
