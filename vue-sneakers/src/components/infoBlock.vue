<script setup>
import { inject } from 'vue'
const { closeDrawer } = inject('cart')
defineProps({
  title: String,
  description: String,
  imageUrl: String,
  buttonBack: Boolean
})
</script>
<template>
  <div class="flex flex-col items-center text-center w-72 mx-auto">
    <img height="80" width="80" :src="imageUrl" alt="err" />
    <h2 class="mt-4 text-2xl font-medium">{{ title }}</h2>
    <p class="text-gray-400">{{ description }}</p>
  </div>
  <div>
    <button
      @click="closeDrawer"
      class="flex flex-col items-center text-center mx-28 mt-4 bg-black text-white font-medium p-2 border rounded-md"
    >
      {{ buttonBack }}
    </button>
  </div>
</template>
