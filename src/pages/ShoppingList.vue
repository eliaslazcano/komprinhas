<template>
  <q-page padding>
    <q-table
      :loading="loading"
      :columns="tableColumns"
      :rows="tableRows"
    >
      <template v-slot:top>
        <q-input
          label="Título"
          v-model="listName"
          class="full-width"
          :disable="loading"
          :loading="loading"
          readonly
          outlined
          dense
        />
      </template>
    </q-table>
    
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="positive" @click="dialogProduct = true" />
    </q-page-sticky>

    <q-dialog v-model="dialogProduct">
      <q-card style="width: 24rem; max-width: 100%">
        <q-form @submit.prevent="onSubmitProduct">
          <q-card-section>
            <div class="text-h6">Adicionar produto</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
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
              class="q-mt-sm"
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
export default defineComponent({
  name: 'ShoppingList',
  data: () => ({
    api: useApi(),
    loading: true,
    listName: '',
    tableColumns: [
      { name: 'name', label: 'Produto', field: row => row.product.name, sortable: true, align: 'left' },
      { name: 'amount', label: 'Quantidade Un/Kg', field: 'amount', sortable: true },
      //{ name: 'price', label: 'Preço unitário', field: 'price', sortable: true },
      //{ name: 'total', label: 'Total', field: 'total', sortable: true },
    ],
    tableRows: [],

    dialogProduct: false,
    dialogProductItem: null,
    dialogProductAmount: '1',

    knowProducts: [], //{label: 'Coca Cola', value: 1},{label: 'Fanta', value: 2}
    productOptions: []
  }),
  methods: {
    async loadName() {
      const {error, data} = await this.api.getById('shopping_lists', this.$route.params.list)
      if (error) throw error
      else this.listName = data.name
    },
    async loadProducts() {
      const {error, data} = await this.api.list('products')
      if (error) throw error
      else this.knowProducts = data
    },
    async loadItems() {
      const {error, data} = await this.api.list('shopping_list_items', 'id, product (id, name), amount').eq('list', this.$route.params.list)
      if (error) throw error
      else this.tableRows = data
    },

    async createProduct(name) {
      const {data, error} = await this.api.post('products', {name}).select()
      if (error) throw error
      return data[0].id
    },
    async createItem(productId, amount, listId) {
      const {error} = await this.api.post('shopping_list_items', {product: productId, amount, list: listId})
      if (error) throw error
    },

    async onSubmitProduct() {
      const productName = this.dialogProductItem.trim()

      this.loading = true
      try {
        await this.loadProducts()
        const knowProduct = this.knowProducts.find(i => i.name.toLowerCase() === productName.toLowerCase())
        const productId = knowProduct ? knowProduct.id : await this.createProduct(productName)
        await this.createItem(productId, parseFloat(this.dialogProductAmount), this.$route.params.list)
        if (!knowProduct) await this.loadProducts()
        await this.loadItems()
      } catch (e) {
        this.$q.notify({type: 'negative', message: e.message})
      } finally {
        this.loading = false
      }
    },
    filterFn (val, update) {
      update(() => {
        const needle = val.toLocaleLowerCase()
        this.productOptions = this.knowProducts.filter(v => v.name.toLocaleLowerCase().indexOf(needle) > -1)
      })
    },
  },
  async created() {
    this.loading = true
    try {
      await Promise.all([this.loadName(), this.loadProducts(), this.loadItems()])
    } catch (e) {
      this.$q.notify({type: 'negative', message: e.message})
      this.$router.push({name: 'shopping-lists'})
    } finally {
      this.loading = false
    }
  },
  watch: {
    knowProducts(v) {this.productOptions = v},
  }
})
</script>
