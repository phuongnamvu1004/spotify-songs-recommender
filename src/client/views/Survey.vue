<template>
    <div class="flex h-screen items-center justify-center">
      <div class="w-full max-w-lg rounded-lg border border-white bg-white p-6 text-black shadow-lg">
        <h2 class="mb-4 text-2xl font-bold">Music Preferences Survey</h2>
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label class="mb-2 block font-medium">Types of music you prefer:</label>
            <div class="grid grid-cols-3 gap-2">
              <input type="text" v-model="formData.musicTypes[0]" class="w-full rounded-lg border border-gray-400 bg-white p-2 text-black" placeholder="Genre 1" />
              <input type="text" v-model="formData.musicTypes[1]" class="w-full rounded-lg border border-gray-400 bg-white p-2 text-black" placeholder="Genre 2" />
              <input type="text" v-model="formData.musicTypes[2]" class="w-full rounded-lg border border-gray-400 bg-white p-2 text-black" placeholder="Genre 3" />
            </div>
          </div>
  
          <div>
            <label class="mb-2 block font-medium">Top 3 favorite singers or artists:</label>
            <div class="grid grid-cols-3 gap-2">
              <input type="text" v-model="formData.favoriteArtists[0]" class="w-full rounded-lg border border-gray-400 bg-white p-2 text-black" placeholder="Artist 1" />
              <input type="text" v-model="formData.favoriteArtists[1]" class="w-full rounded-lg border border-gray-400 bg-white p-2 text-black" placeholder="Artist 2" />
              <input type="text" v-model="formData.favoriteArtists[2]" class="w-full rounded-lg border border-gray-400 bg-white p-2 text-black" placeholder="Artist 3" />
            </div>
          </div>
            
          <div>
            <label class="mb-2 block font-medium">Top 3 favorite albums:</label>
            <div class="grid grid-cols-3 gap-2">
              <input type="text" v-model="formData.favoriteAlbums[0]" class="w-full rounded-lg border border-gray-400 bg-white p-2 text-black" placeholder="Album 1" />
              <input type="text" v-model="formData.favoriteAlbums[1]" class="w-full rounded-lg border border-gray-400 bg-white p-2 text-black" placeholder="Album 2" />
              <input type="text" v-model="formData.favoriteAlbums[2]" class="w-full rounded-lg border border-gray-400 bg-white p-2 text-black" placeholder="Album 3" />
            </div>
          </div>
          <div>
              
          </div>
          <form @submit.prevent="handleSubmit"></form>
          <button type="submit" class="w-full rounded-lg bg-[#1DB954] p-2 text-white hover:bg-[#1ed760]">Submit Survey</button>
        </form>
      </div>
    </div>
    </template>
    
    <script>
    import { ref, onMounted } from "vue";
    
    export default {
      setup() {
        const formData = ref({
          musicTypes: [ "", "", "",],
          favoriteArtists: ["", "", ""],
          favoriteAlbums: ["", "", ""],
        });
        const fetchSurveyData = async () => {
          try {
            const response = await fetch("/api/survey-data");
            if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
           }
            const data = await response.json();
            formData.value = data;
          } catch (error) {
            console.error("Error fetching survey data:", error);
          }
        };
        onMounted(() => {
          fetchSurveyData();
        });
  
        const handleSubmit = () => {
          console.log("Survey Data:", formData.value);
          alert("Survey submitted successfully!");
        };
    
        return { formData, handleSubmit };
      },
    };
    </script>
    