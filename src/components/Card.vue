<script setup>
import { inject } from 'vue'
defineProps({
  id: Number,
  title: String,
  imageUrl: String,
  price: Number,
  isFavorite: Boolean,
  isAdded: Boolean,
  onClickAdd: Function,
  onClickFavorite: Function
})
</script>
<template>
  <div
    class="relative bg-white border border-slatet-100 rounded-3xl p-8 cursor-pointer hover:-translate-y-2 hover:shadow-xl transition"
  >
    <img src="/like-1.svg" alt="Like-1" class="absolute top-8 left-8" />
    <img
      :src="!isFavorite ? '/like-1.svg' : '/like-2.svg'"
      alt="Like-1"
      class="absolute top-8 left-8"
      @click="onClickFavorite"
    />
    <img :src="imageUrl" alt="Sneaker" />
    <p class="mt-2">{{ title }}</p>

    <div class="flex justify-between mt-5x">
      <div class="flex flex-col">
        <span>Price</span>
        <b>{{ price }}</b>
      </div>
      <img :src="!isAdded ? '/plus.svg' : '/checked.svg'" alt="Plus" @click="onClickAdd" />
    </div>
  </div>
</template>
