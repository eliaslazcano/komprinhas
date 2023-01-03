<template>
  <q-page padding class="flex flex-center">
    <q-card class="q-mx-auto" style="width: 24rem; max-width: 100%" :flat="$q.screen.xs">
      <q-card-section>
        <div class="text-center">
          <q-icon name="account_circle" size="4rem" />
          <p class="text-h6 q-mt-sm">Criar conta</p>
        </div>
        <q-form @submit.prevent="onSubmit" autocorrect="off" autocapitalize="off">
          <q-input
            label="Nome"
            maxlength="32"
            v-model="form.name"
            :disable="processing"
            :rules="[v => !!v && !!v.trim() || 'Insira seu nome']"
            lazy-rules
          />
          <q-input
            label="E-mail"
            type="email"
            autocomplete="username"
            v-model="form.email"
            :disable="processing"
            :rules="[v => !!v && !!v.trim() || 'Insira seu email']"
            lazy-rules
          />
          <q-input
            label="Senha"
            :type="showPassword ? 'text' : 'password'"
            maxlength="16"
            autocomplete="new-password"
            v-model="form.password"
            :disable="processing"
            :rules="passwordRules"
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
            ></q-btn>
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

const $q = useQuasar()
const router = useRouter()

const form = reactive({name: '', email: '', password: ''})
const showPassword = ref(false)
const processing = ref(false)
const passwordRules = [
  v => !!v && !!v.trim() || 'Insira a nova senha',
  v => !!v && !/\s/g.test(v) || 'A senha não pode conter espaços',
  v => !!v && v.length >= 4 || 'Precisa ter pelo menos 4 caracteres',
  v => !!v && v.length <= 18 || 'Limite de 18 caracteres',
]

const onSubmit = async () => {
  processing.value = true
  const {error, data} = await useAuth().register(form.email, form.password, form.name)
  if (error) $q.notify({type: 'negative', message: error.message})
  else await router.push({name: 'email-confirmation', query: {email: form.email}})
  processing.value = false
}
</script>
