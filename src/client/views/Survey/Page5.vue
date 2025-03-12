<template>
    <div>
        <div class="pointer-events-none absolute inset-0 overflow-hidden">
            <div class="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-purple-700 opacity-20 blur-3xl"></div>
            <div class="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-blue-700 opacity-20 blur-3xl"></div>
        </div>
        <div class="relative z-10 mx-auto max-w-3xl">
            <div class="mb-12">
                <div class="mb-10">
                    <h2 class="text-2xl text-gray-300">Question 5</h2>
                    <h3
                        class="animate-gradient-x mb-6 bg-gradient-to-r from-green-400 via-[#1DB954] to-blue-500 bg-clip-text text-2xl font-bold text-transparent md:text-3xl">
                        Which time period would you prefer your music to be released in?
                    </h3>

                    <div class="mb-4">
                        <div class="flex justify-between mb-2">
                            <span class="text-gray-400">1990</span>
                            <span class="text-gray-200 font-medium">{{ releaseYear }}</span>
                            <span class="text-gray-400">2020</span>
                        </div>
                        <input type="range" min="1990" max="2020" step="1" v-model.number="releaseYear"
                            class="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700" />
                    </div>
                    <div class="flex justify-between px-2">
                        <span class="text-gray-400 text-sm">Older</span>
                        <span class="text-gray-400 text-sm">Newer</span>
                    </div>
                </div>


                <div class="mb-10">
                    <h2 class="text-2xl text-gray-300">Question 6</h2>
                    <h3
                        class="animate-gradient-x mb-6 bg-gradient-to-r from-green-400 via-[#1DB954] to-blue-500 bg-clip-text text-2xl font-bold text-transparent md:text-3xl">
                        How long would you like a song to be?
                    </h3>

                    <div class="mb-4">
                        <div class="flex justify-between mb-2">
                            <span class="text-gray-400">2:00</span>
                            <span class="text-gray-200 font-medium">{{ formatDuration(songDuration) }}</span>
                            <span class="text-gray-400">5:00</span>
                        </div>
                        <input type="range" min="120" max="300" step="5" v-model.number="songDuration"
                            class="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700" />
                    </div>
                    <div class="flex justify-between px-2">
                        <span class="text-gray-400 text-sm">Shorter</span>
                        <span class="text-gray-400 text-sm">Longer</span>
                    </div>
                </div>


                <div class="mb-10">
                    <h2 class="text-2xl text-gray-300">Question 7</h2>
                    <h3
                        class="animate-gradient-x mb-6 bg-gradient-to-r from-green-400 via-[#1DB954] to-blue-500 bg-clip-text text-2xl font-bold text-transparent md:text-3xl">
                        What tempo would you prefer in your music?
                    </h3>

                    <div class="mb-4">
                        <div class="flex justify-between mb-2">
                            <span class="text-gray-400">80 BPM</span>
                            <span class="text-gray-200 font-medium">{{ tempo }} BPM</span>
                            <span class="text-gray-400">140 BPM</span>
                        </div>
                        <input type="range" min="80" max="140" step="1" v-model.number="tempo"
                            class="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700" />
                    </div>
                    <div class="flex justify-between px-2">
                        <span class="text-gray-400 text-sm">Slower</span>
                        <span class="text-gray-400 text-sm">Faster</span>
                    </div>
                </div>


                <div class="mt-10 flex items-center justify-between">
                    <button @click="goTopage4" class="text-gray-300 transition-colors hover:text-white ">
                        BACK
                    </button>

                    <button @click="submitAnswers"
                        class="flex items-center rounded-full bg-gradient-to-r from-green-500 to-blue-600 px-12 py-3 font-bold text-white hover:from-green-400 hover:to-blue-500 transition-all duration-300"
                        :disabled="!currentAnswer">
                        SUBMIT
                        <svg xmlns="http://www.w3.org/2000/svg" class="ml-2 h-5 w-5" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "MusicPreferencesPage",
    data() {
        return {
            releaseYear: 2005, // Default value in middle of range
            songDuration: 210, // Default value in middle of range (3:30)
            tempo: 110, // Default value in middle of range
        };
    },
    methods: {
        formatDuration(seconds) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        },
        goTopage4() {
            this.$router.push('/Survey/Page4');
        },
        submitAnswers() {
            // Store answers
            const answers = {
                releaseYear: this.releaseYear,
                songDuration: this.songDuration,
                formattedDuration: this.formatDuration(this.songDuration),
                tempo: this.tempo
            };

            console.log('Music preferences:', answers);

            // Navigate to results page
            this.$router.push('/Survey/Playlist');
        }
    }
};
</script>

<style>
/* Custom styling for the range sliders */
input[type="range"] {
    -webkit-appearance: none;
    height: 8px;
    border-radius: 5px;
    background: #4B5563;
    outline: none;
}

input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: #1DB954;
    cursor: pointer;
    transition: background 0.15s ease;
}

input[type="range"]::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #1DB954;
    cursor: pointer;
    transition: background 0.15s ease;
    border: none;
}

input[type="range"]::-webkit-slider-thumb:hover {
    background: #10A346;
}

input[type="range"]::-moz-range-thumb:hover {
    background: #10A346;
}

input[type="range"]::-webkit-slider-runnable-track {
    width: 100%;
    height: 8px;
    cursor: pointer;
    background: #4B5563;
    border-radius: 5px;
}

input[type="range"]::-moz-range-track {
    width: 100%;
    height: 8px;
    cursor: pointer;
    background: #4B5563;
    border-radius: 5px;
}

input[type="range"]:focus {
    outline: none;
}
</style>