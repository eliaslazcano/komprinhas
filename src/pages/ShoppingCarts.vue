<template>
  <q-page padding>
    <q-table
      title="Carrinhos de compras"
      :dense="$q.screen.lt.sm"
    ></q-table>
  </q-page>
</template>

<script>
import {defineComponent} from 'vue'
export default defineComponent({
  name: 'ShoppingCarts',
})
</script>
