<template>
  <q-page padding>
    <q-table
      :loading="loading"
      :columns="tableColumns"
      :rows="tableRowsComputed"
      :dense="$q.screen.lt.sm"
      :pagination="{sortBy: 'name', rowsPerPage: 10}"
      no-data-label="Carrinho vazio.. adicione um produto"
    >
      <template v-slot:top="props">
        <q-input
          label="Título"
          v-model="name"
          class="full-width"
          :disable="loading"
          :loading="loading"
          readonly
          outlined
          dense
        >
          <template v-slot:after>
            <q-btn
              flat round dense
              :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
              @click="props.toggleFullscreen"
            />
          </template>
        </q-input>
      </template>
      <template v-slot:body-cell-amount="props">
        <q-td class="text-right">
          <q-badge color="blue">{{ props.row.amount }}</q-badge>
          <q-popup-edit
            v-model="props.row.amount"
            v-slot="scope"
            title="Quantidade"
            @save="updateItem(props.row.id, parseFloat($event), props.row.price)"
            buttons
            max-width="16rem"
            touch-position
          >
            <q-input type="tel" v-model="scope.value" dense autofocus />
          </q-popup-edit>
        </q-td>
      </template>
      <template v-slot:body-cell-price="props">
        <q-td class="text-right">
          <q-badge color="green">{{ props.row.price }}</q-badge>
          <q-popup-edit
            v-model="props.row.price"
            v-slot="scope"
            title="Preço"
            @save="updateItem(props.row.id, props.row.amount, parseFloat($event))"
            buttons
            max-width="16rem"
            touch-position
          >
            <q-input type="tel" v-model="scope.value" dense autofocus />
          </q-popup-edit>
        </q-td>
      </template>
      <template v-slot:body-cell-actions="{row}">
        <q-td class="text-right">
          <q-btn icon="delete" color="negative" flat round dense @click="deleteItem(row.id)" />
        </q-td>
      </template>
      <template v-slot:bottom-row>
        <q-tr>
          <q-td colspan="5">
            <p class="q-my-xs" style="font-weight: bolder">Total R$ {{ totalPrice }}</p>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <q-page-sticky position="bottom-right" :offset="[18, 18]" class="z-fab">
      <q-btn fab icon="add" color="positive" @click="dialogProduct = true" />
    </q-page-sticky>

    <q-dialog v-model="dialogProduct">
      <q-card style="width: 24rem; max-width: 100%">
        <q-form @submit.prevent="onSubmitProduct">
          <q-card-section>
            <div class="text-h6">Adicionar produto</div>
          </q-card-section>
          <q-card-section class="q-pt-none q-gutter-y-sm">
            <q-select
              label="Produto"
              :model-value="dialogProductItem"
              use-input
              hide-selected
              fill-input
              :input-debounce="100"
              :options="productOptions"
              option-label="name"
              option-value="id"
              :rules="[v => !!v && !!v.trim() || 'Informe o produto']"
              @filter="filterFn"
              @input-value="(val) => dialogProductItem = val"
            />
            <q-input
              label="Quantidade (Un/Kg)"
              v-model="dialogProductAmount"
              type="tel"
              :rules="[v => !!v && !!v.trim() || 'Informe a quantidade', v => !!v && !v.includes(',') || 'Use ponto ao invés de virgula']"
            />
            <q-input
              label="Preço unitário"
              v-model="dialogProductPrice"
              type="tel"
              :rules="[v => !!v && !!v.trim() || 'Informe o preço', v => !!v && !v.includes(',') || 'Use ponto ao invés de virgula']"
              hint="Preço por Un. ou Kg"
            />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancelar" color="primary" v-close-popup />
            <q-btn flat label="Ok" color="primary" type="submit" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import {defineComponent} from 'vue'
import {useApi} from 'src/composables/Api'
export default defineComponent ({
  name: 'ShoppingCart',
  data: () => ({
    api: useApi(),
    loading: true,
    name: '',
    tableColumns: [
      {name: 'name', label: 'Produto', field: row => row.product.name, sortable: true, align: 'left'},
      {name: 'amount', label: 'Quantidade Un/Kg', field: 'amount', sortable: true},
      { name: 'price', label: 'Preço unitário', field: 'price', sortable: true },
      { name: 'total', label: 'Total', field: 'total', sortable: true },
      { name: 'actions', label: 'Botões', field: 'actions', sortable: false, align: 'right' }
    ],
    tableRows: [],

    dialogProduct: false,
    dialogProductItem: null,
    dialogProductAmount: '1',
    dialogProductPrice: '1',

    knowProducts: [],
    productOptions: []
  }),
  methods: {
    async loadName() {
      const {error, data} = await this.api.getById('shopping_carts', this.$route.params.cart)
      if (error) throw error
      else this.name = data.name
    },
    async loadProducts() {
      const {error, data} = await this.api.list('products')
      if (error) throw error
      else this.knowProducts = data
    },
    async loadItems() {
      const {error, data} = await this.api.list('shopping_cart_items', 'id, product (id, name), amount, price').eq('cart', this.$route.params.cart)
      if (error) throw error
      else this.tableRows = data
    },

    async createProduct(name) {
      const {data, error} = await this.api.post('products', {name}).select()
      if (error) throw error
      return data[0].id
    },

    async createItem(productId, amount, price) {
      const {error} = await this.api.post('shopping_cart_items', {product: productId, amount, price, cart: this.$route.params.cart})
      if (error) throw error
    },
    async updateItem(itemId, amount, price) {
      const {error} = await this.api.update('shopping_cart_items', {id: itemId, amount, price})
      if (error) throw error
    },
    async deleteItem(itemId) {
      const {error} = await this.api.remove('shopping_cart_items', itemId)
      if (error) this.$q.notify({type: 'negative', message: error.message})
      else await this.loadItems()
    },

    filterFn (val, update) {
      update(() => {
        const needle = val.toLocaleLowerCase()
        this.productOptions = this.knowProducts.filter(v => v.name.toLocaleLowerCase().indexOf(needle) > -1)
      })
    },
    async onSubmitProduct() {
      const product = {
        id: null,
        name: this.dialogProductItem.trim(),
        amount: parseFloat(this.dialogProductAmount),
        price: parseFloat(this.dialogProductPrice)
      }
      this.loading = true
      try {
        await this.loadProducts()
        const knowProduct = this.knowProducts.find(i => i.name.toLowerCase() === product.name.toLowerCase())
        product.id = knowProduct ? knowProduct.id : await this.createProduct(product.name)

        const productInUse = this.tableRows.find(i => i.product.id === product.id)
        if (productInUse) await this.updateItem(productInUse.id, productInUse.amount + product.amount, product.price)
        else await this.createItem(product.id, product.amount, product.price)

        if (!knowProduct) await this.loadProducts()
        await this.loadItems()
        this.dialogProduct = false
      } catch (e) {
        this.$q.notify({type: 'negative', message: e.message})
      } finally {
        this.loading = false
      }
    },
  },
  computed: {
    tableRowsComputed() {
      return this.tableRows.map(i => {
        i.total = Math.ceil(i.amount * i.price * 100) / 100
        return i
      });
    },
    totalPrice() {
      return this.tableRowsComputed.reduce((previousValue, currentValue) => previousValue + currentValue.total, 0);
    },
  },
  async created() {
    this.loading = true
    try {
      await Promise.all([this.loadName(), this.loadProducts(), this.loadItems()])
    } catch (e) {
      this.$q.notify({type: 'negative', message: e.message})
      this.$router.push({name: 'shopping-carts'})
    } finally {
      this.loading = false
    }
  }
})
</script>
