<template>
    <div class="image-album">
      <div v-if="images.length < 4 || !useCollage"
        class="w-full aspect-square bg-gray-900 rounded-md overflow-hidden">
        <img 
          :src="images[0]?.url || defaultImage" 
          class="w-full h-full object-cover"
          :alt="altText"
        >
      </div>
      <div v-else
        class="w-full aspect-square bg-gray-900 rounded-md overflow-hidden grid grid-cols-2 grid-rows-2">
        <img 
          v-for="(image, i) in images.slice(0, 4)" 
          :key="i" 
          :src="image.url || defaultImage"
          class="w-full h-full object-cover" 
          :alt="`${altText} ${i+1}`"
        >
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ImageAlbum',
    props: {
      images: {
        type: Array,
        default: () => []
      },
      useAlbum: {
        type: Boolean,
        default: true
      },
      altText: {
        type: String,
        default: 'Image'
      },
      defaultImage: {
        type: String,
        default: '/default-image.png'
      }
    }
  }
  </script>
  
  <style scoped>
  .image-collage {
    transition: transform 0.2s ease;
  }
  </style>