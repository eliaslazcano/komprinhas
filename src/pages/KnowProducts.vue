<template>
  <q-page padding>
    <q-table
      title="Produtos"
      :loading="loading"
      :rows="tableRows"
      :columns="tableColumns"
      :pagination="{sortBy: 'name', rowsPerPage: 10}"
      :dense="$q.screen.lt.sm"
    ></q-table>
  </q-page>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {useApi} from 'src/composables/Api'
import {useQuasar} from 'quasar'
import {useMoment} from 'src/composables/Moment'

const api = useApi()
const quasar = useQuasar()

const loading = ref(true)
const tableRows = ref([])
const tableColumns = [
  {name: 'name', label: 'Nome', field: 'name', sortable: true, align: 'left'},
  {name: 'created_at', label: 'Criado em', field: 'created_at', sortable: true, format: val => useMoment(val).format('DD/MM/YYYY')},
]

onMounted(async () => {
  const {error, data} = await api.list('products')
  if (error) quasar.notify({type: 'negative', message: error.message})
  tableRows.value = data
  loading.value = false
})
</script>
