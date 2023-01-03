<template>
  <q-page padding class="flex flex-center">
    <q-card class="q-mx-auto" style="width: 24rem; max-width: 100%" :flat="$q.screen.xs">
      <q-card-section>
        <div class="text-center">
          <q-icon name="shopping_cart" size="4rem"></q-icon>
          <p class="text-h6 q-mt-sm">Komprinhas</p>
        </div>
        <q-form @submit.prevent="onSubmit" autocorrect="off" autocapitalize="off">
          <q-input
            label="E-mail"
            type="email"
            autocomplete="username"
            v-model="form.email"
            :disable="processing"
            :rules="[v => !!v && !!v.trim() || 'Insira seu e-mail']"
            lazy-rules
          />
          <q-input
            label="Senha"
            :type="showPassword ? 'text' : 'password'"
            class="q-mt-md"
            maxlength="16"
            autocomplete="current-password"
            v-model="form.password"
            :disable="processing"
            :rules="[v => !!v && !!v.trim() || 'Insira sua senha']"
            lazy-rules
          >
            <template v-slot:append>
              <q-btn
                flat
                round
                :icon="showPassword ? 'visibility' : 'visibility_off'"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>
          <div class="text-center">
            <q-btn
              label="Login"
              color="primary"
              class="full-width q-mt-md"
              type="submit"
              unelevated
              rounded
              :loading="processing"
            />
            <q-btn
              label="Esqueci a senha"
              color="primary"
              class="full-width q-mt-sm"
              outline
              rounded
              to="/forgot-password"
              :disable="processing"
            />
            <q-btn
              label="Registrar"
              color="primary"
              class="q-mt-sm"
              flat
              to="/register"
              :disable="processing"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import {reactive, ref} from 'vue'
import {useAuth} from 'src/composables/Auth'
import {useQuasar} from 'quasar'
import {useRouter} from 'vue-router'
import {useSessionStore} from 'stores/session'

const $q = useQuasar()
const router = useRouter()
const sessionStore = useSessionStore()

const form = reactive({email: '', password: ''})
const showPassword = ref(false)
const processing = ref(false)

const onSubmit = async () => {
  processing.value = true
  const {error, data} = await useAuth().signInWithEmail(form.email, form.password)
  if (error) $q.notify({ type: 'negative', message: error.message })
  else {
    sessionStore.user = data.user
    $q.notify({ type: 'positive', message: 'Bem vindo' })
    await router.replace({name: 'home'})
  }
  processing.value = false
}
</script>
