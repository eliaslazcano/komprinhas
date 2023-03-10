<template>
  <q-page padding>
    <q-table
      title="Listas de compras"
      :loading="loading"
      :columns="columns"
      :rows="rows"
      :pagination="{sortBy: 'created_at', descending: true, rowsPerPage: 10}"
      :dense="$q.screen.lt.sm"
      row-key="id"
      no-data-label="Nenhuma lista de compras.."
    >
      <template v-slot:body-cell-name="props">
        <q-td class="text-left">
          {{ props.row.name }}
          <q-popup-edit
            v-model="props.row.name"
            v-slot="scope"
            title="Renomear"
            @save="updateList(props.row.id, $event)"
            buttons
            label-set="Ok"
            max-width="16rem"
            touch-position
          >
            <q-input type="tel" v-model="scope.value" dense autofocus />
          </q-popup-edit>
        </q-td>
      </template>
      <template v-slot:body-cell-actions="{row}">
        <q-td class="text-center" style="width: 7rem">
          <q-btn icon="edit" color="primary" flat round dense :to="'shopping-list/' + row.id" />
          <q-btn icon="delete" color="negative" flat round dense @click="deleteList(row.id)" />
        </q-td>
      </template>
    </q-table>
    <q-page-sticky position="bottom-right" :offset="[18, 18]" class="z-fab">
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
    api: useApi(),
    loading: true,
    columns: [
      //{ name: 'id', label: 'Cod.', field: 'id', sortable: true, align: 'left' },
      { name: 'created_at', label: 'Criado em', field: 'created_at', sortable: true, align: 'left', format: val => useMoment(val).format('DD/MM/YYYY'), style: 'width: 7rem', },
      { name: 'name', label: 'Nome', field: 'name', sortable: true, align: 'left' },
      { name: 'actions', label: 'Botões', field: 'actions', sortable: false, align: 'center' }
    ],
    rows: [],
  }),
  methods: {
    async loadData() {
      this.loading = true
      const { error, data } = await this.api.list('shopping_lists')
      if (error) this.$q.notify({type: 'negative', message: error.message})
      else this.rows = data
      this.loading = false
    },
    createList() {
      this.$q.dialog({
        title: 'Criar lista',
        message: 'Dê um nome a lista',
        prompt: {
          model: 'Lista de Compras',
          isValid: v => !!v && !!v.trim()
        },
        cancel: 'Cancelar',
        ok: 'Confirmar',
      })
        .onOk(async data => {
          const {error, data: rows} = await this.api.post('shopping_lists', {name: data.trim()}).select()
          if (error) this.$q.notify({type: 'negative', message: error.message})
          else {
            this.$q.notify({type: 'positive', message: 'Lista registrada'})
            this.$router.push("shopping-list/" + rows[0].id);
          }
        })
    },
    async updateList(id, name) {
      const {error} = await this.api.update('shopping_lists', {id, name})
      if (error) throw error
    },
    deleteList(id) {
      this.$q.dialog({
        title: 'Confirme',
        message: 'Você quer mesmo apagar a lista?',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        const { error } = await this.api.remove('shopping_lists', id)
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
