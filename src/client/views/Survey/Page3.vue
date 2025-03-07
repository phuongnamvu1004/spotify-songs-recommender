<template>
    <div class="relative z-10 mx-auto max-w-3xl">
        <div class="mb-8">
            <h2 class="text-2xl text-gray-300" id="question-number">Question 3</h2>
            <h1 class="animate-gradient-x mb-8 bg-gradient-to-r from-green-400 via-[#1DB954] to-blue-500 bg-clip-text text-2xl font-bold text-transparent md:text-5xl"
                id="question-text">Who is your favorite artist or band?</h1>
        </div>
        <div class="mb-8">
            <input v-model="currentAnswer" type="text"
                class="w-full border-b-2 border-gray-500 bg-transparent py-2 text-2xl text-white focus:border-purple-300 focus:outline-none"
                placeholder="Please enter your response" />
        </div>
        <div class="flex items-center justify-between">
            <button @click="nextQuestion"
                class="flex items-center rounded-full bg-green-500 px-12 py-3 font-bold text-gray-900 hover:bg-green-400"
                :disabled="!currentAnswer">
                NEXT
                <svg xmlns="http://www.w3.org/2000/svg" class="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clip-rule="evenodd" />
                </svg>
            </button>
            <button @click="skipQuestion" class="px-4 py-2 font-semibold text-gray-400 hover:text-white">SKIP</button>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            currentAnswer: ''
        };
    },
    methods: {
        nextQuestion() {
            // Logic for handling the next question
            console.log('Next question clicked');
        },
        skipQuestion() {
            // Logic for skipping the question
            console.log('Skip question clicked');
        }
    }
};
</script>
