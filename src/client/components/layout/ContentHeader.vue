<template>
    <div class="mb-6 flex flex-col md:flex-row bg-gray-800/50 rounded-lg p-4">
      <div class="flex-shrink-0">
        <slot name="image">
          <img 
            :src="imageUrl || '/default-cover.png'"
            :alt="title"
            class="w-40 h-40 rounded-md object-cover"
          />
        </slot>
      </div>
      <div class="md:ml-6 mt-4 md:mt-0">
        <h2 class="text-white text-2xl font-bold">{{ title }}</h2>
        <slot name="subtitle"></slot>
        <slot name="description"></slot>
  
        <div class="flex mt-4 gap-2">
          <button 
            class="px-6 py-2 bg-spotify-green text-white rounded-full hover:bg-green-600 transition"
            @click="$emit('primary-action')"
          >
            {{ primaryActionText }}
          </button>
          <button 
            v-if="showSecondaryAction"
            class="px-6 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition"
            @click="$emit('secondary-action')"
          >
            {{ secondaryActionText }}
          </button>
          <slot name="extra-actions"></slot>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ContentHeader',
    props: {
      title: {
        type: String,
        required: true
      },
      imageUrl: {
        type: String,
        default: ''
      },
      primaryActionText: {
        type: String,
        default: 'Play'
      },
      secondaryActionText: {
        type: String,
        default: 'Share'
      },
      showSecondaryAction: {
        type: Boolean,
        default: true
      }
    }
  }
  </script>