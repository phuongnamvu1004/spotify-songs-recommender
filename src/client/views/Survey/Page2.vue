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
                    id="question-text">
                    Who is your favorite artist?
                </h1>
            </div>
            <div class="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2" id="question-options">
                <div id="options-1" class="col-span-2 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div v-for="(option, index) in options" :key="index" @click="
                        option.value !== 'G'
                            ? selectAnswer(option.value)
                            : selectCustomAnswer(option.value)
                        " :class="[
                            'relative flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-700',
                            isSelected(option.value) ? 'border-green-600 bg-gray-700' : 'border-gray-500',
                        ]">
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
                            artists:</label>

                        <!-- Artist chips/tags display -->
                        <div v-if="customArtists.length > 0" class="mb-3 flex flex-wrap gap-2">
                            <div v-for="(artist, index) in customArtists" :key="index"
                                class="flex items-center rounded-full bg-gray-700 px-3 py-1 text-white transition-colors hover:bg-gray-600">
                                <span>{{ artist }}</span>
                                <button @click="removeArtist(index)" class="ml-2 text-gray-300 hover:text-white"
                                    title="Remove artist">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <!-- Counter for artists -->
                        <div v-if="customArtists.length > 0" class="mb-2 text-sm text-gray-400">
                            {{ customArtists.length }} {{ customArtists.length === 1 ? 'artist' : 'artists' }} added
                        </div>

                        <!-- Input with add button -->
                        <div class="flex">
                            <input type="text" id="custom-artist" v-model="currentArtist"
                                class="flex-grow rounded-l-md border border-gray-600 bg-gray-800 p-3 text-white focus:border-purple-300 focus:outline-none"
                                placeholder="Enter artist name here" @keydown.enter.prevent="addArtist" />

                            <button @click="addArtist"
                                class="rounded-r-md bg-gray-700 px-4 text-white transition-colors hover:bg-gray-600 disabled:opacity-50"
                                :disabled="!isCurrentArtistValid" title="Add artist">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-6 flex items-center justify-between">
                <button @click="goToPage1" class="text-gray-300 transition-colors hover:text-white" id="skip-button">
                    SKIP
                </button>

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
                        :class="{ 'opacity-50 cursor-not-allowed': !isNextEnabled || isLoading }"
                        :disabled="!isNextEnabled || isLoading" id="next-button">
                        <template v-if="isLoading">
                            <!-- Loading spinner -->
                            <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
                                    fill="none" />
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        </template>
                        <template v-else>
                            <!-- Your existing SVG -->
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7" />
                            </svg>
                        </template>
                    </button>
                </div>
            </div>
            <!-- Error message -->
            <div v-if="error" class="mt-4 text-red-500 text-sm">
                {{ error }}
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
            customArtists: [], // Array to store multiple artists
            currentArtist: '', // Current input value
            isLoading: false,
            error: null,
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
            // Enable next button if any option is selected
            // If G is one of the selected options, make sure there's at least one custom artist
            const hasStandardSelection = this.selectedAnswers.some(option => option !== 'G');
            const hasValidCustomSelection = this.isSelected('G') && this.customArtists.length > 0;

            return hasStandardSelection || hasValidCustomSelection;
        },
        isCurrentArtistValid() {
            return this.currentArtist.trim().length > 0;
        },
        totalSelectedArtists() {
            // Count standard selections (excluding G) plus custom artists
            const standardCount = this.selectedAnswers.filter(option => option !== 'G').length;
            const customCount = this.isSelected('G') ? this.customArtists.length : 0;
            return standardCount + customCount;
        }
    },
    methods: {
        selectAnswer(option) {
            const index = this.selectedAnswers.indexOf(option);
            if (index === -1) {
                // Add this option to the selection (allowing multiple)
                this.selectedAnswers.push(option);
            } else {
                // Remove this option from selection
                this.selectedAnswers.splice(index, 1);
            }
        },
        selectCustomAnswer(option) {
            // If G is already selected, just toggle it off
            if (this.isSelected(option)) {
                const index = this.selectedAnswers.indexOf(option);
                this.selectedAnswers.splice(index, 1);
                this.customArtists = [];
                this.currentArtist = '';
            } else {
                // If G is being selected, add it to the selection (not replacing)
                this.selectedAnswers.push(option);
                this.$nextTick(() => {
                    document.getElementById('custom-artist').focus();
                });
            }
        },
        isSelected(option) {
            return this.selectedAnswers.includes(option);
        },
        addArtist() {
            if (this.isCurrentArtistValid) {
                const artistName = this.currentArtist.trim();

                // Check for duplicates before adding
                if (!this.customArtists.includes(artistName)) {
                    // Add current artist to the array
                    this.customArtists.push(artistName);
                    // Clear the input
                    this.currentArtist = '';
                    // Focus back on the input for convenience
                    this.$nextTick(() => {
                        document.getElementById('custom-artist').focus();
                    });
                } else {
                    // Briefly show an error and highlight the duplicate
                    this.error = `"${artistName}" is already in your list`;
                    setTimeout(() => {
                        if (this.error === `"${artistName}" is already in your list`) {
                            this.error = null;
                        }
                    }, 2000);

                    // Clear the input
                    this.currentArtist = '';
                }
            }
        },
        removeArtist(index) {
            this.customArtists.splice(index, 1);
        },
        goToPage1() {
            this.$router.push('/survey/page1');
        },
        async goToPage3() {
            if (!this.isNextEnabled || this.isLoading) return;

            try {
                this.isLoading = true;
                this.error = null;
                console.log('Starting goToPage3...');

                const answers = this.getSelectedArtists();
                console.log('Selected artists:', answers);

                const response = await fetch('http://localhost:3000/api/post-artists-preferences', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ artists: answers }),
                    credentials: 'include' // Include cookies with the request
                });

                console.log('Response status:', response.status);

                if (!response.ok) {
                    const errorData = await response.text();
                    console.error('Server response:', errorData);
                    throw new Error(`Failed to post artist preferences: ${response.status}`);
                }

                console.log('Successfully posted preferences, navigating to Page3...');
                await this.$router.push({
                    path: '/survey/page3',
                    query: { answers: answers.join(',') }
                });
            } catch (error) {
                console.error('Error in goToPage3:', error);
                this.error = `An error occurred: ${error.message}`;
            } finally {
                this.isLoading = false;
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

            // Collect all standard artists from selections
            const standardArtists = this.selectedAnswers
                .filter(option => option !== 'G')
                .map(option => artistMap[option]);

            // Get custom artists if "Other" is selected
            const otherArtists = this.isSelected('G') ? this.customArtists : [];

            // Combine both lists
            return [...standardArtists, ...otherArtists];
        },

        // Add method to check if current input matches an existing entry
        isDuplicateArtist() {
            if (!this.currentArtist) return false;
            return this.customArtists.some(artist =>
                artist.toLowerCase() === this.currentArtist.trim().toLowerCase()
            );
        }
    }
};
</script>