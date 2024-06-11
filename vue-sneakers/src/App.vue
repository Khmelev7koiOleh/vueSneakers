<script setup>
import { onMounted, reactive, ref, provide, watch, computed } from 'vue'
import axios from 'axios'

import Header from './components/Header.vue'
import CardList from './components/CardList.vue'
import Drawer from './components/Drawer.vue'
import CartItem from './components/CartItem.vue'

const items = ref([])
const cart = ref([])
const isCreatingOrder = ref(false)
const drawerOpen = ref(false)
const totalPrice = computed(() => cart.value.reduce((acc, item) => acc + item.price, 0))
const vatPrice = computed(() => Math.round((totalPrice.value * 5) / 100))

const cartIsEempty = computed(() => cart.value.length === 0)
const cartButtonDisabled = computed(() => isCreatingOrder.value || cartIsEempty.value)

const closeDrawer = () => {
  drawerOpen.value = false
}

const openDrawer = () => {
  drawerOpen.value = true
}

const filters = reactive({
    sortBy: 'title',
    searchQuery: ''
  }),
  addToCart = (item) => {
    cart.value.push(item)
    item.isAdded = true
    console.log(item)
  },
  removeFromCart = (item) => {
    cart.value.splice(cart.value.indexOf(item), 1)
    item.isAdded = false
  }
const createOrder = async () => {
    try {
      isCreatingOrder.value = true
      const { data } = await axios.post(`https://425a283a04aea824.mokky.dev/orders`, {
        items: cart.value,
        totalPrice: totalPrice.value
      })
      cart.value = []
      return data
    } catch (err) {
      console.log(err)
    } finally {
      isCreatingOrders.value = false
    }
  },
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
  },
  fetchFavorites = async () => {
    try {
      const { data: favorites } = await axios.get('https://425a283a04aea824.mokky.dev/favorites')
      items.value = items.value.map((item) => {
        const favorite = favorites.find((favorite) => favorite.parentId === item.id)

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
const addToFavorite = async (item) => {
  try {
    if (!item.isFavorite) {
      const obj = {
        parentId: item.id
      }

      const { data } = await axios.post(`https://425a283a04aea824.mokky.dev/favorites`, obj)
      item.isFavorite = true
      item.favoriteId = data.id
    } else {
      item.isFavorite = false
      await axios.delete(`https://425a283a04aea824.mokky.dev/favorites/${item.favoriteId}`)
      item.favoriteId = null
    }
  } catch (err) {
    console.log('err')
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
  watch(filters, fetchItems)
watch(cart, () => {
  items.value = items.value.map((item) => ({
    ...item,
    isAdded: false
  }))
})
watch(
  cart,
  () => {
    localStorage.setItem('cart', JSON.stringify(cart.value))
  },
  { deep: true }
)
provide('cart', { cart, closeDrawer, openDrawer, addToCart, removeFromCart })
</script>

<template>
  <div>
    <Drawer
      :total-price="totalPrice"
      :vat-price="vatPrice"
      @create-order="createOrder"
      :cart-button-disabled="cartButtonDisabled"
      v-if="drawerOpen"
    />
  </div>
  <div class="m-auto w-4/5 bg-white rounded-xl shadow-xl mt-10">
    <Header :total-price="totalPrice" @open-drawer="openDrawer" />
    <div class="p-10">
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
    </div>
  </div>
</template>
