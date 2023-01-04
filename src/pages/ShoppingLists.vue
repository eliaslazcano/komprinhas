<template>
  <q-page padding>
    <q-table
      title="Listas de compras"
      :loading="loading"
      :columns="columns"
      :rows="rows"
      :pagination="{sortBy: 'id', descending: true}"
      row-key="id"
    ></q-table>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="positive" @click="createList" />
    </q-page-sticky>
  </q-page>
</template>

<script>
import {defineComponent} from 'vue'
import {useApi} from 'src/composables/Api'
import {useMoment} from 'src/composables/Moment'
export default defineComponent({
  name: 'ShoppingLists',
  data: () => ({
    loading: true,
    columns: [
      { name: 'id', label: 'Cod.', field: 'id', sortable: true, align: 'left' },
      { name: 'name', label: 'Nome', field: 'name', sortable: true },
      { name: 'date', label: 'Criada em', field: 'created_at', sortable: true, format: val => useMoment(val).format('DD/MM/YYYY') },
    ],
    rows: [],
  }),
  methods: {
    async loadData() {
      this.loading = true
      const { error, data } = await useApi().list('shopping_lists')
      if (error) this.$q.notify({type: 'negative', message: error.message})
      else this.rows = data
      this.loading = false
    },
    createList() {
      this.$q.dialog({
        title: 'Criar lista',
        message: 'Quer dar um nome a lista?',
        prompt: {
          model: '',
          isValid: v => !!v && !!v.trim()
        },
        cancel: 'Sem nome',
        ok: 'Confirmar',
      })
        .onOk(async data => {
          const {error} = await useApi().post('shopping_lists', {name: data.trim()})
          if (error) this.$q.notify({type: 'negative', message: error.message})
          //TODO - Abrir a lista
        })
        .onCancel(async () => {
          const {error} = await useApi().post('shopping_lists', {})
          if (error) this.$q.notify({type: 'negative', message: error.message})
          //TODO - Abrir a lista
        })
    },
  },
  created() {
    this.loadData()
  }
})
</script>
