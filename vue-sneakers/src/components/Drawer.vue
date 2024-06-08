<script setup>
import DrawerHead from './DrawerHead.vue'
import CartItemList from './CartItemList.vue'
import infoBlock from './infoBlock.vue'
const emit = defineEmits('openDrawer')
defineProps({
  totalPrice: Number,
  vatPrice: Number,
  cartButtonDisabled: Boolean
})
</script>
<template>
  <div class="fixed top-0 left-0 h-full w-full bg-black opacity-70 z-10"></div>
  <div class="bg-white w-96 h-full fixed right-0 top-0 z-20 p-8">
    <DrawerHead />

    <div class="flex flex-col h-full justify-center" v-if="!totalPrice">
      <infoBlock
        title="The cart is empty"
        description="add al least one pair of sneakers to make an order "
        imageUrl="/package-icon.png"
        buttonBack="Get back"
      />
    </div>

    <div v-else>
      <CartItemList v-if="totalPrice" />
      <div v-if="totalPrice" class="flex flex-col gap-5 mb-7">
        <div class="flex gap-2">
          <span>In total:</span>
          <div class="flex-1 border-b border-dushed"></div>
          <b>{{ totalPrice }}</b>
        </div>

        <div class="flex gap-2">
          <span>Taxes 5%</span>
          <div class="flex-1 border-b border-dushed"></div>
          <b>{{ vatPrice }}</b>
        </div>
        <button
          :disabled="buttonDisabled"
          @click="() => emit('createOrder')"
          class="bg-lime-500 w-full rounded-xl py-3 text-white disabled:bg-slate-400 hover:bg-lime-600 active:bg-lime-700 transition cursor-pointer"
        >
          Place the order
        </button>
      </div>
    </div>
  </div>
</template>
