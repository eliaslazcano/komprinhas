<template>
  <q-page padding>
    <div class="q-gutter-y-sm">
      <q-card flat bordered class="full-width" @click="$router.push({name: 'shopping-lists'})">
        <q-card-section>
          <div class="row items-center no-wrap">
            <div class="col">
              <div class="text-h6">Lista de compras</div>
              <div class="text-subtitle2">Lembre-se do que precisa comprar</div>
            </div>

            <div class="col-auto">
              <q-icon name="list" size="2rem"></q-icon>
            </div>
          </div>
        </q-card-section>
      </q-card>
      <q-card flat bordered class="full-width" @click="$router.push({name: 'shopping-carts'})">
        <q-card-section>
          <div class="row items-center no-wrap">
            <div class="col">
              <div class="text-h6">Carrinho de compras</div>
              <div class="text-subtitle2">Monte um carrinho e saiba o total a pagar</div>
            </div>

            <div class="col-auto">
              <q-icon name="shopping_cart" size="2rem"></q-icon>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import {defineComponent} from 'vue'
export default defineComponent({
  name: 'IndexPage',
})
</script>
