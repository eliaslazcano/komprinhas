<template>
  <q-page padding>
    <q-card class="q-mx-auto" style="width: 24rem; max-width: 100%" :flat="$q.screen.xs">
      <q-card-section>
        <div class="text-center">
          <q-icon name="account_circle" size="4rem" />
          <p class="text-h6 q-mt-sm">Sua conta</p>
        </div>
        <q-form @submit.prevent="onSubmit">
          <q-input
            label="Nome"
            maxlength="32"
            v-model="name"
            :disable="processing"
            :rules="[v => !!v && !!v.trim() || 'Insira seu nome']"
            lazy-rules
          />
          <q-input
            label="E-mail"
            type="email"
            autocomplete="username"
            v-model="email"
            :disable="processing"
            :rules="[v => !!v && !!v.trim() || 'Insira seu e-mail', v => !v || /.+@.+\..+/.test(v) || 'Insira um e-mail válido']"
            lazy-rules
          />
          <div class="text-center">
            <q-btn
              label="Salvar"
              color="primary"
              class="full-width q-mt-md"
              type="submit"
              unelevated
              rounded
              :loading="processing"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import {defineComponent} from 'vue'
import {useAuth} from 'src/composables/Auth'
import {useSessionStore} from 'src/stores/session'
export default defineComponent({
  name: 'ProfilePage',
  data: () => ({
    processing: false,
    email: '',
    name: '',
  }),
  created() {
    const store = useSessionStore()
    this.email = store.user.email
    this.name = store.user.user_metadata.name
  },
  methods: {
    async onSubmit() {
      this.processing = true
      const {error} = await useAuth().updateUser(this.email, this.name)
      if (error) this.$q.notify({type: 'negative', message: error.message})
      else this.$q.notify({type: 'positive', message: 'Informações enviadas'})
      this.processing = false
    },
  },
})
</script>
