<template>
    <div class="relative z-10 mx-auto max-w-3xl">
        <div class="mb-8">
            <h2 class="text-2xl text-gray-300" id="question-number">Question 3</h2>
            <h1 class="animate-gradient-x mb-8 bg-gradient-to-r from-green-400 via-[#1DB954] to-blue-500 bg-clip-text text-2xl font-bold text-transparent md:text-4xl"
                id="question-text">Do you want your list of songs contained any musical instruments?</h1>
        </div>
        <div class="grid grid-cols-2 gap-4 mb-16">
            <div class="flex flex-col items-center justify-center p-6 bg-gray-600 rounded-lg cursor-pointer hover:bg-gray-500 transition-colors border-2 border-transparent hover:border-green-600"
                @click="selectOption('yes')">
                <div class="mb-5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-14 text-white" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                </div>
                <div class="text-white text-xl font-medium mb-3">Yes</div>
                <div class="w-8 h-8 rounded-full flex items-center justify-center"
                    :class="{ 'bg-white': selectedOption === 'yes', 'bg-transparent border-2 border-white': selectedOption !== 'yes' }">
                    <span v-if="selectedOption === 'yes'" class="text-base font-bold">Y</span>
                </div>
            </div>

            <div class="flex flex-col items-center justify-center p-6 bg-gray-600 rounded-lg cursor-pointer hover:bg-gray-500 transition-colors border-2 border-transparent hover:border-green-600"
                @click="selectOption('no')">
                <div class="mb-5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-14 text-white" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2" />
                    </svg>
                </div>
                <div class="text-white text-xl font-medium mb-3">No</div>
                <div class="w-8 h-8 rounded-full flex items-center justify-center"
                    :class="{ 'bg-white': selectedOption === 'no', 'bg-transparent border-2 border-white': selectedOption !== 'no' }">
                    <span v-if="selectedOption === 'no'" class="text-base font-bold">N</span>
                </div>
            </div>
        </div>

        <div class="flex items-center justify-between">
            <button @click="skipQuestion" class="px-4 py-2 font-semibold text-gray-400 hover:text-white">SKIP</button>
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
                    id="next-button">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            selectedOption: null
        };
    },
    methods: {
        selectOption(option) {
            this.selectedOption = option;
            setTimeout(() => {
                this.nextQuestion();
            }, 500);
        },
        nextQuestion() {
            console.log('Selected option:', this.selectedOption);
            this.$router.push('/Survey/Page4');
        },
        skipQuestion() {
            console.log('Question skipped');
            this.$router.push('/Survey/Page4');
        },
        goToPage2() {
            this.$router.push('/Survey/Page2');
        },
        goToPage4() {
            this.$router.push('/Survey/Page4');
        }
    }
};
</script>
