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

                    <div class="mb-8">
                        <div class="flex justify-between mb-2">
                            <span class="text-gray-400">Selected years: <span class="text-gray-200 font-medium">{{
                                Math.min(year1, year2) }} - {{ Math.max(year1, year2) }}</span></span>
                        </div>

                        <div class="relative mt-8 mb-16">
                            <div class="base-line"></div>
                            <!-- Selected range -->
                            <div class="selected-range" :style="{
                                left: ((Math.min(year1, year2) - 1960) / 60 * 100) + '%',
                                width: (Math.abs(year1 - year2) / 60 * 100) + '%'
                            }"></div>

                            <!-- Two overlapping sliders -->
                            <div class="multi-range" ref="yearRangeContainer">
                                <!-- First slider -->
                                <input type="range" min="1960" max="2020" v-model.number="year1" class="range range1" />

                                <!-- Second slider -->
                                <input type="range" min="1960" max="2020" v-model.number="year2" class="range range2" />

                                <!-- Circle indicators (draggable) -->
                                <div class="circle circle1" :style="{
                                    left: ((year1 - 1960) / 60 * 100) + '%'
                                }" @mousedown="startDrag($event, 'year1')" @touchstart="startDrag($event, 'year1')">
                                </div>
                                <div class="circle circle2" :style="{
                                    left: ((year2 - 1960) / 60 * 100) + '%'
                                }" @mousedown="startDrag($event, 'year2')" @touchstart="startDrag($event, 'year2')">
                                </div>
                            </div>

                            <!-- Timeline year markers -->
                            <div class="year-markers">
                                <div v-for="year in yearMarkers" :key="year" class="year-marker"
                                    :style="{ left: ((year - 1960) / 60 * 100) + '%' }">
                                    <div class="tick"></div>
                                    <div class="year-label">{{ year }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mb-10">
                    <h2 class="text-2xl text-gray-300">Question 6</h2>
                    <h3
                        class="animate-gradient-x mb-6 bg-gradient-to-r from-green-400 via-[#1DB954] to-blue-500 bg-clip-text text-2xl font-bold text-transparent md:text-3xl">
                        How long would you like a song to be?
                    </h3>

                    <div class="mb-8">
                        <div class="flex justify-between mb-2">
                            <span class="text-gray-400">Selected duration: <span class="text-gray-200 font-medium">{{
                                formatDuration(Math.min(duration1, duration2)) }} - {{
                                        formatDuration(Math.max(duration1, duration2)) }}</span></span>
                        </div>

                        <div class="relative mt-8 mb-16">
                            <!-- Base line -->
                            <div class="base-line"></div>

                            <!-- Selected range -->
                            <div class="selected-range" :style="{
                                left: ((Math.min(duration1, duration2) - 60) / 360 * 100) + '%',
                                width: (Math.abs(duration1 - duration2) / 360 * 100) + '%'
                            }"></div>

                            <!-- Two overlapping sliders -->
                            <div class="multi-range" ref="durationRangeContainer">
                                <!-- First slider -->
                                <input type="range" min="60" max="420" step="10" v-model.number="duration1"
                                    class="range range1" />

                                <!-- Second slider -->
                                <input type="range" min="60" max="420" step="10" v-model.number="duration2"
                                    class="range range2" />

                                <!-- Circle indicators (draggable) -->
                                <div class="circle circle1" :style="{
                                    left: ((duration1 - 60) / 360 * 100) + '%'
                                }" @mousedown="startDrag($event, 'duration1')"
                                    @touchstart="startDrag($event, 'duration1')"></div>
                                <div class="circle circle2" :style="{
                                    left: ((duration2 - 60) / 360 * 100) + '%'
                                }" @mousedown="startDrag($event, 'duration2')"
                                    @touchstart="startDrag($event, 'duration2')"></div>
                            </div>

                            <!-- Duration markers -->
                            <div class="year-markers">
                                <div v-for="duration in durationMarkers" :key="duration" class="year-marker"
                                    :style="{ left: ((duration - 60) / 360 * 100) + '%' }">
                                    <div class="tick"></div>
                                    <div class="year-label">{{ formatDuration(duration) }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mb-10">
                    <h2 class="text-2xl text-gray-300">Question 7</h2>
                    <h3
                        class="animate-gradient-x mb-6 bg-gradient-to-r from-green-400 via-[#1DB954] to-blue-500 bg-clip-text text-2xl font-bold text-transparent md:text-3xl">
                        What tempo would you prefer in your music?
                    </h3>

                    <div class="mb-8">
                        <div class="flex justify-between mb-2">
                            <span class="text-gray-400">Selected tempo: <span class="text-gray-200 font-medium">{{
                                Math.min(tempo1, tempo2) }} - {{ Math.max(tempo1, tempo2) }} BPM</span></span>
                        </div>

                        <div class="relative mt-8 mb-16">
                            <!-- Base line -->
                            <div class="base-line"></div>

                            <!-- Selected range -->
                            <div class="selected-range" :style="{
                                left: ((Math.min(tempo1, tempo2) - 60) / 90 * 100) + '%',
                                width: (Math.abs(tempo1 - tempo2) / 90 * 100) + '%'
                            }"></div>

                            <!-- Two overlapping sliders -->
                            <div class="multi-range" ref="tempoRangeContainer">
                                <!-- First slider -->
                                <input type="range" min="60" max="150" step="1" v-model.number="tempo1"
                                    class="range range1" />

                                <!-- Second slider -->
                                <input type="range" min="60" max="150" step="1" v-model.number="tempo2"
                                    class="range range2" />

                                <!-- Circle indicators (draggable) -->
                                <div class="circle circle1" :style="{
                                    left: ((tempo1 - 60) / 90 * 100) + '%'
                                }" @mousedown="startDrag($event, 'tempo1')" @touchstart="startDrag($event, 'tempo1')">
                                </div>
                                <div class="circle circle2" :style="{
                                    left: ((tempo2 - 60) / 90 * 100) + '%'
                                }" @mousedown="startDrag($event, 'tempo2')" @touchstart="startDrag($event, 'tempo2')">
                                </div>
                            </div>

                            <!-- Tempo markers - BPM removed -->
                            <div class="year-markers">
                                <div v-for="tempo in tempoMarkers" :key="tempo" class="year-marker"
                                    :style="{ left: ((tempo - 60) / 90 * 100) + '%' }">
                                    <div class="tick"></div>
                                    <div class="year-label">{{ tempo }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-10 flex items-center justify-between">
                    <button @click="goTopage4" class="text-gray-300 transition-colors hover:text-white ">
                        BACK
                    </button>

                    <button @click="submitAnswers"
                        class="flex items-center rounded-full bg-gradient-to-r from-green-500 to-blue-600 px-12 py-3 font-bold text-white hover:from-green-400 hover:to-blue-500 transition-all duration-300">
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
            // Question 5 data
            year1: 1970,
            year2: 2000,
            yearMarkers: [1960, 1970, 1980, 1990, 2000, 2010, 2020],

            // Question 6 data
            duration1: 120, // 2:00
            duration2: 240, // 4:00
            durationMarkers: [60, 120, 180, 240, 300, 360, 420], // 1:00, 2:00, 3:00, 4:00, 5:00, 6:00, 7:00

            // Question 7 data
            tempo1: 90,
            tempo2: 120,
            tempoMarkers: [60, 75, 90, 105, 120, 135, 150],

            // Dragging state
            isDragging: false,
            currentDragTarget: null,
            activeContainer: null
        };
    },
    mounted() {
        // Add global event listeners for drag handling
        window.addEventListener('mousemove', this.onDrag);
        window.addEventListener('mouseup', this.stopDrag);
        window.addEventListener('touchmove', this.onDrag);
        window.addEventListener('touchend', this.stopDrag);
    },
    beforeUnmount() {
        // Clean up event listeners
        window.removeEventListener('mousemove', this.onDrag);
        window.removeEventListener('mouseup', this.stopDrag);
        window.removeEventListener('touchmove', this.onDrag);
        window.removeEventListener('touchend', this.stopDrag);
    },
    methods: {
        formatDuration(seconds) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        },
        goTopage4() {
            this.$router.push('/survey/page4');
        },
        async submitAnswers() {
            // Store answers with sorted values
            const answers = {
                yearRange: [Math.min(this.year1, this.year2), Math.max(this.year1, this.year2)],
                durationRange: [
                    Math.min(this.duration1, this.duration2),
                    Math.max(this.duration1, this.duration2)
                ],
                formattedDurationRange: [
                    this.formatDuration(Math.min(this.duration1, this.duration2)),
                    this.formatDuration(Math.max(this.duration1, this.duration2))
                ],
                tempoRange: [Math.min(this.tempo1, this.tempo2), Math.max(this.tempo1, this.tempo2)]
            };

            console.log('Music preferences:', answers);

            try {

                const response = await fetch("api/post-remaining-preferences", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        year: {
                            start: answers.yearRange[0],
                            end: answers.yearRange[1]
                        },
                        duration: {
                            start: answers.durationRange[0] * 1000,
                            end: answers.durationRange[1] * 1000
                        },
                        tempo: {
                            start: answers.tempoRange[0],
                            end: answers.tempoRange[1]
                        }
                    }),
                    credentials: "include"
                });

                if (response.ok) {
                    console.log('Music preferences saved successfully');
                    this.$router.push('/recommended-songs');
                } else {
                    console.error('Failed to save music preferences');
                }
            } catch (error) {
                console.error('Error', error);
            }

        },
        startDrag(event, targetProperty) {
            event.preventDefault();
            this.isDragging = true;
            this.currentDragTarget = targetProperty;

            // Determine which container is active based on the target property
            if (targetProperty.startsWith('year')) {
                this.activeContainer = this.$refs.yearRangeContainer;
            } else if (targetProperty.startsWith('duration')) {
                this.activeContainer = this.$refs.durationRangeContainer;
            } else if (targetProperty.startsWith('tempo')) {
                this.activeContainer = this.$refs.tempoRangeContainer;
            }

            // Add active class for visual feedback
            const targetElement = event.target;
            targetElement.classList.add('dragging');
        },
        stopDrag() {
            if (this.isDragging) {
                this.isDragging = false;
                this.activeContainer = null;

                // Remove active class from all circles
                document.querySelectorAll('.circle').forEach(circle => {
                    circle.classList.remove('dragging');
                });
            }
        },
        onDrag(event) {
            if (!this.isDragging || !this.currentDragTarget || !this.activeContainer) return;

            // Get container's bounding rectangle
            const containerRect = this.activeContainer.getBoundingClientRect();

            // Get X position (handle both mouse and touch events)
            let clientX;
            if (event.touches) {
                clientX = event.touches[0].clientX;
            } else {
                clientX = event.clientX;
            }

            // Calculate position relative to container
            let relativeX = clientX - containerRect.left;

            // Constrain to container bounds
            relativeX = Math.max(0, Math.min(relativeX, containerRect.width));

            // Convert to value based on the current target
            let minValue, maxValue, step;

            if (this.currentDragTarget.startsWith('year')) {
                minValue = 1960;
                maxValue = 2020;
                step = 1;
            } else if (this.currentDragTarget.startsWith('duration')) {
                minValue = 60;
                maxValue = 420;
                step = 10;
            } else if (this.currentDragTarget.startsWith('tempo')) {
                minValue = 60;
                maxValue = 150;
                step = 1;
            }

            const valueRange = maxValue - minValue;
            let newValue = minValue + (relativeX / containerRect.width) * valueRange;

            // Apply step if needed
            if (step > 1) {
                newValue = Math.round(newValue / step) * step;
            } else {
                newValue = Math.round(newValue);
            }

            // Update the appropriate property
            this[this.currentDragTarget] = newValue;
        }
    }
};
</script>

<style>
/* Multi-range slider */
.multi-range {
    position: relative;
    height: 30px;
    margin-bottom: 10px;
}

.base-line {
    position: absolute;
    width: 100%;
    height: 8px;
    background-color: #4B5563;
    border-radius: 4px;
    top: 11px;
    z-index: 1;
}

.selected-range {
    position: absolute;
    height: 8px;
    background: linear-gradient(to right, #3B82F6, #10B981);
    border-radius: 4px;
    top: 11px;
    z-index: 2;
}

.range {
    appearance: none;
    -webkit-appearance: none;
    position: absolute;
    width: 100%;
    height: 8px;
    background: transparent;
    top: 11px;
    z-index: 3;
}

.range::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: transparent;
    cursor: pointer;
    z-index: 10;
}

.range::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: transparent;
    cursor: pointer;
    border: none;
    z-index: 10;
}

.range:focus {
    outline: none;
}

/* Circle indicators */
.circle {
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    top: 5px;
    transform: translateX(-50%);
    z-index: 5;
    cursor: grab;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.circle.dragging {
    cursor: grabbing;
    transform: translateX(-50%) scale(1.1);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.circle1 {
    background-color: #3B82F6;
    /* Blue */
}

.circle2 {
    background-color: #10B981;
    /* Green */
}

/* Year/Value markers */
.year-markers {
    position: absolute;
    width: 100%;
    top: 32px;
    left: 0;
    z-index: 1;
}

.year-marker {
    position: absolute;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
}

.tick {
    width: 1px;
    height: 8px;
    background-color: #6B7280;
    margin-bottom: 4px;
}

.year-label {
    font-size: 12px;
    color: #9CA3AF;
}
</style>