<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import CardList from '../components/CardList.vue'
const favorites = ref([])

onMounted(async () => {
  try {
    const { data } = await axios.get(
      'https://425a283a04aea824.mokky.dev/favorites?_relations=items'
    )
    favorites.value = data.map((obj) => obj.item)
  } catch (err) {
    console.log(err)
  }
})
</script>
<template>
  <h2 class="font-3xl font-bold mb-8">My favorites</h2>

  <CardList :items="favorites" is-favorites />
</template>
