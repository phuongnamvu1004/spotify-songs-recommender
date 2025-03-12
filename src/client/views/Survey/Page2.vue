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
                  <div @click="selectAnswer('A')" :class="['relative flex cursor-pointer items-center justify-between rounded-lg border border-gray-500 p-4 transition-colors hover:bg-gray-700',
                      currentAnswer === 'A' ? 'border-green-500 bg-gray-700' : '']">
                      <span class="text-xl text-white">Taylor Swift</span>
                      <div
                          class="flex h-10 w-10 items-center justify-center rounded-full bg-white font-bold text-gray-800">
                          A
                      </div>
                  </div>

                  <div @click="selectAnswer('B')" :class="['relative flex cursor-pointer items-center justify-between rounded-lg border border-gray-500 p-4 transition-colors hover:bg-gray-700',
                      currentAnswer === 'B' ? 'border-green-500 bg-gray-700' : '']">
                      <span class="text-xl text-white">Ed Sheeran</span>
                      <div
                          class="flex h-10 w-10 items-center justify-center rounded-full bg-white font-bold text-gray-800">
                          B
                      </div>
                  </div>

                  <div @click="selectAnswer('C')" :class="['relative flex cursor-pointer items-center justify-between rounded-lg border border-gray-500 p-4 transition-colors hover:bg-gray-700',
                      currentAnswer === 'C' ? 'border-green-500 bg-gray-700' : '']">
                      <span class="text-xl text-white">Billie Eilish</span>
                      <div
                          class="flex h-10 w-10 items-center justify-center rounded-full bg-white font-bold text-gray-800">
                          C
                      </div>
                  </div>

                  <div @click="selectAnswer('D')" :class="['relative flex cursor-pointer items-center justify-between rounded-lg border border-gray-500 p-4 transition-colors hover:bg-gray-700',
                      currentAnswer === 'D' ? 'border-green-500 bg-gray-700' : '']">
                      <span class="text-xl text-white">The Weeknd</span>
                      <div
                          class="flex h-10 w-10 items-center justify-center rounded-full bg-white font-bold text-gray-800">
                          D
                      </div>
                  </div>

                  <div @click="selectAnswer('E')" :class="['relative flex cursor-pointer items-center justify-between rounded-lg border border-gray-500 p-4 transition-colors hover:bg-gray-700',
                      currentAnswer === 'E' ? 'border-green-500 bg-gray-700' : '']">
                      <span class="text-xl text-white">Beyoncé</span>
                      <div
                          class="flex h-10 w-10 items-center justify-center rounded-full bg-white font-bold text-gray-800">
                          E
                      </div>
                  </div>

                  <div @click="selectAnswer('F')" :class="['relative flex cursor-pointer items-center justify-between rounded-lg border border-gray-500 p-4 transition-colors hover:bg-gray-700',
                      currentAnswer === 'F' ? 'border-green-500 bg-gray-700' : '']">
                      <span class="text-xl text-white">Adele</span>
                      <div
                          class="flex h-10 w-10 items-center justify-center rounded-full bg-white font-bold text-gray-800">
                          F
                      </div>
                  </div>

                  <div @click="selectAnswer('G', true)" :class="['relative flex cursor-pointer items-center justify-between rounded-lg border border-gray-500 p-4 transition-colors hover:bg-gray-700',
                      currentAnswer === 'G' ? 'border-green-500 bg-gray-700' : '']">
                      <span class="text-xl text-white">Other</span>
                      <div
                          class="flex h-10 w-10 items-center justify-center rounded-full bg-white font-bold text-gray-800">
                          G
                      </div>
                  </div>
              </div>

              <!-- Custom artist input field that appears when "Other" is selected -->
              <div v-if="currentAnswer === 'G'" class="col-span-2 mt-4">
                  <div class="rounded-lg border border-gray-500 p-4">
                      <label for="custom-artist" class="mb-2 block text-lg text-white">Please specify your favorite
                          artist:</label>
                      <input type="text" id="custom-artist" v-model="customArtist"
                          class="w-full rounded-md border border-gray-600 bg-gray-800 p-3 text-white focus:border-purple-300 focus:outline-none"
                          placeholder="Enter artist name here" @input="validateCustomInput"
                          @keydown.enter="goToPage4" />
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
          currentAnswer: null,
          customArtist: '',
          isCustomValid: false
      };
  },
  computed: {
      isNextEnabled() {
          // Enable next button if any option except G is selected,
          // or if G is selected and the custom input is valid
          return (this.currentAnswer && this.currentAnswer !== 'G') ||
              (this.currentAnswer === 'G' && this.isCustomValid);
      }
  },
  methods: {
      selectAnswer(option, isCustom = false) {
          this.currentAnswer = option;

          if (!isCustom) {
              this.customArtist = '';
              this.isCustomValid = false;
          } else {
              // Focus the input field when "Other" is selected
              this.$nextTick(() => {
                  document.getElementById('custom-artist').focus();
              });
          }
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
              // Store the answer
              const answer = this.currentAnswer === 'G' ? this.customArtist : this.getAnswerText();
              console.log('Selected artist:', answer);

              this.$router.push('/Survey/Page3');
          }
      },
      getAnswerText() {
          const options = {
              'A': 'Taylor Swift',
              'B': 'Ed Sheeran',
              'C': 'Billie Eilish',
              'D': 'The Weeknd',
              'E': 'Beyoncé',
              'F': 'Adele',
              'G': this.customArtist
          };
          return options[this.currentAnswer] || '';
      }
  }
};
</script>