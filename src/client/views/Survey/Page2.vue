<template>
    <div>
        <div class="pointer-events-none absolute inset-0 overflow-hidden">
            <div class="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-purple-700 opacity-20 blur-3xl"></div>
            <div class="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-blue-700 opacity-20 blur-3xl"></div>
        </div>
        <div class="relative z-10 mx-auto max-w-3xl">
            <div class="mb-8">
                <h2 class="text-2xl text-gray-300" id="question-number">Question 2</h2>
                <h1 class="animate-gradient-x mb-8 bg-gradient-to-r from-green-400 via-[#1DB954] to-blue-500 bg-clip-text text-2xl font-bold text-transparent md:text-5xl"
                    id="question-text">Who is your favorite artist?</h1>
            </div>
            <div class="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2" id="question-options">
                <div id="options-1" class="col-span-2 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div v-for="(option, index) in options" :key="index" 
                        @click="option.value !== 'G' ? selectAnswer(option.value) : selectCustomAnswer(option.value)" 
                        :class="['relative flex cursor-pointer items-center justify-between rounded-lg border border-gray-500 p-4 transition-colors hover:bg-gray-700',
                        isSelected(option.value) ? 'border-green-500 bg-gray-700' : '']">
                        <span class="text-xl text-white">{{ option.label }}</span>
                        <div
                            class="flex h-10 w-10 items-center justify-center rounded-full bg-white font-bold text-gray-800">
                            {{ option.value }}
                        </div>
                    </div>
                </div>
  
                <!-- Custom artist input field that appears when "Other" is selected -->
                <div v-if="isSelected('G')" class="col-span-2 mt-4">
                    <div class="rounded-lg border border-gray-500 p-4">
                        <label for="custom-artist" class="mb-2 block text-lg text-white">Please specify your favorite
                            artist:</label>
                        <input type="text" id="custom-artist" v-model="customArtist"
                            class="w-full rounded-md border border-gray-600 bg-gray-800 p-3 text-white focus:border-purple-300 focus:outline-none"
                            placeholder="Enter artist name here" @input="validateCustomInput"
                            @keydown.enter="goToPage3" />
                    </div>
                </div>
            </div>
            <div class="mt-6 flex items-center justify-between">
                <button @click="goToPage1" class="text-gray-300 transition-colors hover:text-white"
                    id="skip-button">SKIP</button>
  
                <div class="flex gap-2">
                    <button @click="goToPage1"
                        class="flex h-10 w-10 items-center justify-center rounded-md bg-gray-700 transition-colors hover:bg-[#77d397]"
                        id="prev-button">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                        </svg>
                    </button>
                    <button @click="goToPage3"
                        class="flex h-10 w-10 items-center justify-center rounded-md bg-gray-700 transition-colors hover:bg-[#77d397]"
                        :class="{ 'opacity-50 cursor-not-allowed': !isNextEnabled }" :disabled="!isNextEnabled"
                        id="next-button">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "Page2",
    data() {
        return {
            selectedAnswers: [],
            customArtist: '',
            isCustomValid: false,
            options: [
                { label: "Taylor Swift", value: "A" },
                { label: "Ed Sheeran", value: "B" },
                { label: "Billie Eilish", value: "C" },
                { label: "The Weeknd", value: "D" },
                { label: "Beyoncé", value: "E" },
                { label: "Adele", value: "F" },
                { label: "Other", value: "G" }
            ]
        };
    },
    computed: {
        isNextEnabled() {
            // Enable next button if any option except G is selected,
            // or if G is selected and the custom input is valid
            return (this.selectedAnswers.length > 0 && !this.isSelected('G')) ||
                (this.isSelected('G') && this.isCustomValid);
        }
    },
    methods: {
        selectAnswer(option) {
            const index = this.selectedAnswers.indexOf(option);
            if (index === -1) {
                this.selectedAnswers.push(option);
            } else {
                this.selectedAnswers.splice(index, 1);
            }
        },
        selectCustomAnswer(option) {
            // If G is already selected, just toggle it off
            if (this.isSelected(option)) {
                const index = this.selectedAnswers.indexOf(option);
                this.selectedAnswers.splice(index, 1);
                this.customArtist = '';
                this.isCustomValid = false;
            } else {
                // If G is being selected, add it and focus the input
                this.selectedAnswers.push(option);
                this.$nextTick(() => {
                    document.getElementById('custom-artist').focus();
                });
            }
        },
        isSelected(option) {
            return this.selectedAnswers.includes(option);
        },
        validateCustomInput() {
            // Enable the next button only if there's text in the custom field
            this.isCustomValid = this.customArtist.trim().length > 0;
        },
        goToPage1() {
            this.$router.push('/Survey/Page1');
        },
        goToPage3() {
            // Only proceed if the next button is enabled
            if (this.isNextEnabled) {
                // Store the answers
                const answers = this.getSelectedArtists();
                console.log('Selected artists:', answers);
  
                // Pass the selected answers as a comma-separated string in the query parameters
                this.$router.push({
                    path: '/Survey/Page3',
                    query: { answers: answers.join(',') }
                });
            }
        },
        getSelectedArtists() {
            const artistMap = {
                'A': 'Taylor Swift',
                'B': 'Ed Sheeran',
                'C': 'Billie Eilish',
                'D': 'The Weeknd',
                'E': 'Beyoncé',
                'F': 'Adele'
            };
            
            const selectedArtists = this.selectedAnswers.map(option => {
                if (option === 'G') {
                    return this.customArtist;
                }
                return artistMap[option];
            });
            
            return selectedArtists;
        }
    }
  };
  </script>