<template>
    <div>
        <div class="pointer-events-none absolute inset-0 overflow-hidden">
            <div class="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-purple-700 opacity-20 blur-3xl"></div>
            <div class="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-blue-700 opacity-20 blur-3xl"></div>
        </div>

        <div class="relative z-10 mx-auto max-w-3xl">
            <div class="mb-8">
                <h2 class="text-2xl text-gray-300" id="question-number">Question 1</h2>
                <h1 class="animate-gradient-x mb-8 bg-gradient-to-r from-green-400 via-[#1DB954] to-blue-500 bg-clip-text text-2xl font-bold text-transparent md:text-5xl"
                    id="question-text">
                    What is your favorite music genre?
                </h1>
            </div>

            <div class="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2" id="question-options">
                <div id="options-1" class="col-span-2 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div v-for="(option, index) in options" :key="index" @click="selectAnswer(option.value)" :class="['relative flex cursor-pointer items-center justify-between rounded-lg border border-gray-500 p-4 transition-colors hover:bg-gray-700',
                        isSelected(option.value) ? 'border-green-500 bg-gray-700' : ''
                    ]">
                        <span class="text-xl text-white">{{ option.label }}</span>
                        <div
                            class="flex h-10 w-10 items-center justify-center rounded-full bg-white font-bold text-gray-800">
                            {{ option.value }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-6 flex items-center justify-between">
                <button @click="goToPage2"
                    class="flex items-center rounded-full bg-gradient-to-r from-green-500 to-blue-600 px-12 py-3 font-bold text-white hover:from-green-400 hover:to-blue-500 transition-all duration-300"
                    :disabled="selectedAnswers.length === 0">
                    NEXT
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
</template>

<script>
export default {
    name: "Page1",
    data() {
        return {
            selectedAnswers: [],
            options: [
                { label: "Pop", value: "A" },
                { label: "Hip-Hop/Rap", value: "B" },
                { label: "Ballad", value: "C" },
                { label: "Electronic/Dance", value: "D" },
                { label: "Rock", value: "E" },
                { label: "Jazz", value: "F" },
                { label: "Classical", value: "G" },
                { label: "Country", value: "H" }
            ]
        };
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
        isSelected(option) {
            return this.selectedAnswers.includes(option);
        },
        goToPage2() {
            this.$router.push({
                path: "/Survey/Page2",
                query: { answers: this.selectedAnswers.join(',') }
            });
        }
    }
};
</script>