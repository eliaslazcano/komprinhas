<template>
  <q-page padding class="flex flex-center">
    <q-card class="q-mx-auto" style="width: 24rem; max-width: 100%" :flat="$q.screen.xs">
      <q-card-section>
        <div class="text-center">
          <q-icon name="lock_reset" size="4rem" />
          <p class="text-h6 q-mt-sm">Recuperação de senha</p>
        </div>
        <q-form @submit.prevent="onSubmit" autocapitalize="off">
          <q-input
            label="E-mail"
            type="email"
            autocomplete="username"
            v-model="email"
            :disable="processing"
            :rules="[v => !!v && !!v.trim() || 'Insira seu e-mail']"
            lazy-rules
          />
          <div class="text-center">
            <q-btn
              label="Confirmar"
              color="primary"
              class="full-width q-mt-md"
              type="submit"
              unelevated
              rounded
              :loading="processing"
            />
            <q-btn
              label="Voltar"
              color="primary"
              class="q-mt-sm"
              flat
              to="/login"
              :disable="processing"
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
export default defineComponent({
  name: 'ForgotPassword',
  data: () => ({
    processing: false,
    email: '',
  }),
  methods: {
    async onSubmit() {
      this.processing = true
      const {error, data} = await useAuth().sendPasswordRestEmail(this.email)
      if (error) this.$q.notify({ type: 'negative', message: error.message })
      else {
        this.$q.notify({ type: 'info', message: 'Enviamos instruções para o seu e-mail' })
        this.$router.replace({name: 'login'})
      }
      this.processing = false
    },
  },
})
</script>
