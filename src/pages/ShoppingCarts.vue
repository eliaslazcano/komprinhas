<template>
  <q-page padding>
    <q-table
      title="Carrinhos de compras"
      :loading="loading"
      :columns="columns"
      :rows="rows"
      :pagination="{sortBy: 'created_at', descending: true, rowsPerPage: 10}"
      :dense="$q.screen.lt.sm"
      row-key="id"
      no-data-label="Nenhum carrinho de compras.."
    >
      <template v-slot:body-cell-actions="{row}">
        <q-td class="text-center" style="width: 7rem">
          <q-btn icon="edit" color="primary" flat round dense :to="'shopping-cart/' + row.id" />
          <q-btn icon="delete" color="negative" flat round dense @click="deleteCart(row.id)" />
        </q-td>
      </template>
    </q-table>
    <q-page-sticky position="bottom-right" :offset="[18, 18]" class="z-fab">
      <q-btn fab icon="add" color="positive" @click="createCart" />
    </q-page-sticky>
  </q-page>
</template>

<script>
import {defineComponent} from 'vue'
import { useMoment } from "src/composables/Moment";
import { useApi } from "src/composables/Api";
export default defineComponent({
  name: 'ShoppingCarts',
  data: () => ({
    loading: true,
    columns: [
      { name: 'created_at', label: 'Criado em', field: 'created_at', sortable: true, align: 'left', format: val => useMoment(val).format('DD/MM/YYYY'), style: 'width: 7rem', },
      { name: 'name', label: 'Nome', field: 'name', sortable: true, align: 'left' },
      { name: 'actions', label: 'Botões', field: 'actions', sortable: false, align: 'center' }
    ],
    rows: [],
  }),
  methods: {
    async loadData() {
      this.loading = true
      const { error, data } = await useApi().list('shopping_carts')
      if (error) this.$q.notify({type: 'negative', message: error.message})
      else this.rows = data
      this.loading = false
    },
    createCart() {
      this.$q.dialog({
        title: 'Criar carrinho',
        message: 'Dê um nome ao carrinho',
        prompt: {
          model: 'Carrinho de Compras',
          isValid: v => !!v && !!v.trim()
        },
        cancel: 'Cancelar',
        ok: 'Confirmar',
      })
        .onOk(async data => {
          const {error, data: rows} = await useApi().post('shopping_carts', {name: data.trim()}).select()
          if (error) this.$q.notify({type: 'negative', message: error.message})
          else {
            this.$q.notify({type: 'positive', message: 'Carrinho registrado'})
            this.$router.push("shopping-cart/" + rows[0].id);
          }
        })
    },
    deleteCart(id) {
      this.$q.dialog({
        title: 'Confirme',
        message: 'Você quer mesmo apagar o carrinho?',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        const { error } = await useApi().remove('shopping_carts', id)
        if (error) this.$q.notify({ type: 'negative', message: error.message })
        else await this.loadData()
      })
    },
  },
  created() {
    this.loadData()
  }
})
</script>
