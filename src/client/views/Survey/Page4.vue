<template>
  <div>

    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <div class="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-purple-700 opacity-20 blur-3xl"></div>
      <div class="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-blue-700 opacity-20 blur-3xl"></div>
    </div>
    <div class="relative z-10 mx-auto max-w-3xl">
      <div class="mb-8">
        <h2 class="text-2xl text-gray-300" id="question-number">Question 4</h2>
        <h1
          class="animate-gradient-x mb-8 bg-gradient-to-r from-green-400 via-[#1DB954] to-blue-500 bg-clip-text text-2xl font-bold text-transparent md:text-5xl"
          id="question-text">How often do you listen to music?</h1>
      </div>
      <div class="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2" id="question-options">
        <div id="options-1" class="col-span-2 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div @click="selectAnswer('A')" :class="['relative flex cursor-pointer items-center justify-between rounded-lg border border-gray-500 p-4 transition-colors hover:bg-gray-700',
            currentAnswer === 'A' ? 'border-green-600 bg-gray-700' : '']">
            <span class="text-xl text-white">Daily</span>
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-white font-bold text-gray-800">A
            </div>
          </div>

          <div @click="selectAnswer('B')" :class="['relative flex cursor-pointer items-center justify-between rounded-lg border border-gray-500 p-4 transition-colors hover:bg-gray-700',
            currentAnswer === 'B' ? 'border-green-600 bg-gray-700' : '']">
            <span class="text-xl text-white">Weekly</span>
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-white font-bold text-gray-800">B
            </div>
          </div>

          <div @click="selectAnswer('C')" :class="['relative flex cursor-pointer items-center justify-between rounded-lg border border-gray-500 p-4 transition-colors hover:bg-gray-700',
            currentAnswer === 'C' ? 'border-green-600 bg-gray-700' : '']">
            <span class="text-xl text-white">Rarely</span>
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-white font-bold text-gray-800">C
            </div>
          </div>

          <div @click="selectAnswer('D')" :class="['relative flex cursor-pointer items-center justify-between rounded-lg border border-gray-500 p-4 transition-colors hover:bg-gray-700',
            currentAnswer === 'D' ? 'border-green-600 bg-gray-700' : '']">
            <span class="text-xl text-white">A few times a week</span>
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-white font-bold text-gray-800">D
            </div>
          </div>

          <div @click="selectAnswer('E')" :class="['relative flex cursor-pointer items-center justify-between rounded-lg border border-gray-500 p-4 transition-colors hover:bg-gray-700',
            currentAnswer === 'E' ? 'border-green-600 bg-gray-700' : '']">
            <span class="text-xl text-white">A few times a month</span>
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-white font-bold text-gray-800">E
            </div>
          </div>
        </div>
      </div>
      <div class="mt-6 flex items-center justify-between">
        <button @click="goToPage3" class="text-gray-300 transition-colors hover:text-white"
          id="skip-button">SKIP</button>

        <div class="flex gap-2">
          <button @click="goToPage3"
            class="flex h-10 w-10 items-center justify-center rounded-md bg-gray-700 transition-colors hover:bg-[#77d397]"
            id="prev-button">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button @click="goToPage5"
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
  </div>
</template>

<script>
export default {
  name: "Page4",
  data() {
    return {
      currentAnswer: null,
    };
  },
  methods: {
    selectAnswer(option) {
      this.currentAnswer = option;
    },
    goToPage3() {
      this.$router.push('/survey/page3');
    },
    goToPage5() {
      console.log('Navigating to Page5');
      this.$router.push('/survey/page5');
    }
  }
};
</script>