<script setup>
const emit = defineEmits(['onClickRemove'])
defineProps({
  id: Number,
  title: String,
  imageUrl: String,
  price: Number
})
</script>
<template>
  <div class="flex border border-slate-300 p-3 rounded-xl items-center gap-4 mb-3">
    <img class="w-16 h-16" :src="imageUrl" :alt="title" />
    <div class="flex flex-col flex-1">
      <p>{{ title }}</p>
      <div class="flex justify-between mt-2">
        <b class="flex-1">{{ price }}</b>
        <img
          @click="emit('onClickRemove')"
          class="stroke-black opacity-30 hover:opacity-100 cursor-pointer transition"
          src="/close.svg"
          alt="Close"
        />
      </div>
    </div>
  </div>
</template>
