<template>
    <div>
        <div class="pointer-events-none absolute inset-0 overflow-hidden">
            <div class="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-purple-700 opacity-20 blur-3xl"></div>
            <div class="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-blue-700 opacity-20 blur-3xl"></div>
        </div>
        <div class="relative z-10 mx-auto max-w-3xl p-5">
            <div class="mb-8">
                <h2 class="text-2xl text-gray-300" id="question-number">Question 3</h2>
                <h1 class="animate-gradient-x mb-8 bg-gradient-to-r from-green-400 via-[#1DB954] to-blue-500 bg-clip-text text-2xl font-bold text-transparent md:text-5xl"
                    id="question-text">
                    Do you want to have an accousticness in your songs?
                </h1>
            </div>
            <div class="grid grid-cols-2 gap-4 mb-16">
                <div class="flex flex-col items-center justify-center p-6 bg-gray-600 rounded-lg cursor-pointer hover:bg-gray-500 transition-colors border-2"
                    :class="selectedOption === 'yes' ? 'border-green-600' : 'border-transparent hover:border-green-600'"
                    @click="selectOption('yes')">
                    <div class="mb-5">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-14 text-white" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                    </div>
                    <div class="text-white text-xl font-medium mb-3">Yes</div>
                    <div class="w-8 h-8 rounded-full flex items-center justify-center" :class="{
                        'bg-white': selectedOption === 'yes',
                        'bg-transparent border-2 border-white': selectedOption !== 'yes',
                    }">
                        <span v-if="selectedOption === 'yes'" class="text-base font-bold">Y</span>
                    </div>
                </div>

                <div class="flex flex-col items-center justify-center p-6 bg-gray-600 rounded-lg cursor-pointer hover:bg-gray-500 transition-colors border-2"
                    :class="selectedOption === 'no' ? 'border-green-600' : 'border-transparent hover:border-green-600'"
                    @click="selectOption('no')">
                    <div class="mb-5">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-14 text-white" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2" />
                        </svg>
                    </div>
                    <div class="text-white text-xl font-medium mb-3">No</div>
                    <div class="w-8 h-8 rounded-full flex items-center justify-center" :class="{
                        'bg-white': selectedOption === 'no',
                        'bg-transparent border-2 border-white': selectedOption !== 'no',
                    }">
                        <span v-if="selectedOption === 'no'" class="text-base font-bold">N</span>
                    </div>
                </div>
            </div>

            <div class="flex items-center justify-between">
                <button @click="skipQuestion" class="px-4 py-2 font-semibold text-gray-400 hover:text-white">
                    SKIP
                </button>
                <div class="flex gap-2">
                    <button @click="goToPage2"
                        class="flex h-10 w-10 items-center justify-center rounded-md bg-gray-700 transition-colors hover:bg-[#77d397]"
                        id="prev-button">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                        </svg>
                    </button>
                    <button @click="goToPage4"
                        class="flex h-10 w-10 items-center justify-center rounded-md bg-gray-700 transition-colors hover:bg-[#77d397]"
                        :class="{ 'opacity-50 cursor-not-allowed': isLoading }" :disabled="isLoading" id="next-button">
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
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7" />
                            </svg>
                        </template>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Page3",
    data() {
        return {
            selectedOption: null,
            isLoading: false,
            error: null
        };
    },
    methods: {
        selectOption(option) {
            this.selectedOption = option;
            // Automatically go to next page after a short delay to give visual feedback of selection
            setTimeout(() => {
                this.nextQuestion();
            }, 500);
        },
        async nextQuestion() {
            if (this.isLoading) return;
            this.isLoading = true;

            try {
                console.log('Selected option:', this.selectedOption);

                try {
                    const response = await fetch("/api/post-acousticness-preferences", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            acousticness: this.selectedOption === 'yes'
                        })
                    });

                    if (!response.ok) {
                        console.warn(`API request failed with status: ${response.status}`);
                    } else {
                        console.log('Successfully posted acousticness preference');
                    }
                } catch (apiError) {
                    console.warn('API request failed:', apiError);
                    // Continue to next page despite API error
                }

                this.goToPage4();
            } catch (error) {
                console.error('Error in nextQuestion:', error);
                this.error = `An error occurred: ${error.message}`;
            } finally {
                this.isLoading = false;
            }
        },
        skipQuestion() {
            console.log('Question skipped');
            this.goToPage4();
        },
        goToPage2() {
            try {
                this.$router.push('/survey/page2');
            } catch (error) {
                console.error('Navigation error:', error);
                // Fallback if router isn't available
                window.location.href = '/survey/page2';
            }
        },
        goToPage4() {
            try {
                this.$router.push('/survey/page4');
            } catch (error) {
                console.error('Navigation error:', error);
                // Fallback if router isn't available
                window.location.href = '/survey/page4';
            }
        }
    }
};
</script>

<style scoped>
.animate-gradient-x {
    background-size: 200% 200%;
    animation: gradient-x 2s ease infinite;
}

@keyframes gradient-x {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}
</style>