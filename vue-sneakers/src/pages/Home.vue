<script setup>
import { onMounted, reactive, ref, watch, computed } from 'vue'
import axios from 'axios'
import { inject } from 'vue'
import CardList from '../components/CardList.vue'

const { cart, addToCart, removeFromCart } = inject('cart')
const items = ref([])

const filters = reactive({
    sortBy: 'title',
    searchQuery: ''
  }),
  onClickAddPlus = (item) => {
    if (!item.isAdded) {
      addToCart(item)
    } else {
      removeFromCart(item)
    }
  }

const onChangeSelect = (event) => {
  filters.sortBy = event.target.value
}
const onChangeSearchInput = (event) => {
  filters.searchQuery = event.target.value
}
const addToFavorite = async (item) => {
    try {
      if (!item.isFavorite) {
        const obj = {
          item_id: item.id
        }
        item.isFavorite = true
        const { data } = await axios.post(`https://425a283a04aea824.mokky.dev/favorites`, obj)
        item.favoriteId = data.id
      } else {
        item.isFavorite = false
        await axios.delete(`https://425a283a04aea824.mokky.dev/favorites/${item.favoriteId}`)
        item.favoriteId = null
      }
    } catch (err) {
      console.log('err')
    }
  },
  fetchFavorites = async () => {
    try {
      const { data: favorites } = await axios.get('https://425a283a04aea824.mokky.dev/favorites')
      items.value = items.value.map((item) => {
        const favorite = favorites.find((favorite) => favorite.item_id === item.id)

        if (!favorite) {
          return item
        }
        return {
          ...item,
          isFavorite: true,
          favoriteId: favorite.id
        }
      })
    } catch (err) {
      console.log(err)
    }
  }
const fetchItems = async () => {
  try {
    const params = {
      sortBy: filters.sortBy
    }
    if (filters.searchQuery) {
      params.title = `*${filters.searchQuery}*`
    }
    const { data } = await axios.get(' https://425a283a04aea824.mokky.dev/items', {
      params
    })
    items.value = data.map((obj) => ({
      ...obj,
      isFavorite: false,
      favoriteId: null,
      isAdded: false
    }))
  } catch (err) {
    console.log(err)
  }
}
onMounted(async () => {
  const localCart = localStorage.getItem('cart')
  cart.value = localCart ? JSON.parse(localCart) : []
  await fetchItems()
  await fetchFavorites()
  items.value = items.value.map((item) => ({
    ...item,
    isAdded: cart.value.some((cartItem) => cartItem.id === item.id)
  }))
}),
  watch(cart, () => {
    items.value = items.value.map((item) => ({
      ...item,
      isAdded: false
    }))
  }),
  watch(filters, fetchItems)
</script>

<template>
  <div class="flex justify-between items-center">
    <h2 class="font-3xl font-bold mb-8">All Sneakers</h2>
    <div class="flex gap-4">
      <select
        @change="onChangeSelect"
        class="py-2 px-3 border rounded-md outline-none"
        name=""
        id=""
      >
        <option value="name">By name</option>
        <option value="price">By price (cheap)</option>
        <option value="-price">By price (expensive)</option>
      </select>
      <div class="relative">
        <img class="absolute left-4 top-2.5" src="/search.svg" alt="SearchLoop" />
        <input
          @input="onChangeSearchInput"
          placeholder="Search"
          class="border rounded-md py-1.5 pl-12 pr-4 outlite-none focus:border-gray-400"
          type="text"
        />
      </div>
    </div>
  </div>
  <CardList :items="items" @add-to-favorite="addToFavorite" @add-to-cart="onClickAddPlus" />
</template>
