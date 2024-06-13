<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Cardlist from '../components/CardList.vue'

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
  <h1>My favorites</h1>
  <CardList :items="favorites" is-favorites />
</template>
