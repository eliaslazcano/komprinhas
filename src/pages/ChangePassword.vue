<template>
  <q-page padding>
    <q-card class="q-mx-auto" style="width: 24rem; max-width: 100%" :flat="$q.screen.xs">
      <q-card-section>
        <p class="text-h6">Trocar senha</p>
        <q-form @submit.prevent="onSubmit" autocorrect="off" autocapitalize="off">
          <q-input
            label="Nova senha"
            :type="showPassword ? 'text' : 'password'"
            maxlength="16"
            autocomplete="new-password"
            v-model="newPassword"
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
          <q-input
            label="Repita a senha"
            type="password"
            maxlength="16"
            autocomplete="none"
            v-model="newPasswordRepeat"
            :disable="processing"
            :rules="[v => !!v && !!v.trim() || 'Repita a nova senha']"
            lazy-rules
          />
          <div class="text-center">
            <q-btn
              label="Confirmar"
              type="submit"
              color="primary"
              class="full-width q-mt-md"
              :loading="processing"
              rounded
            ></q-btn>
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
  name: 'ChangePassword',
  data: () => ({
    showPassword: false,
    processing: false,
    newPassword: '',
    newPasswordRepeat: '',
    passwordRules: [
      v => !!v && !!v.trim() || 'Insira a nova senha',
      v => !!v && !/\s/g.test(v) || 'A senha não pode conter espaços',
      v => !!v && v.length >= 4 || 'Precisa ter pelo menos 4 caracteres',
      v => !!v && v.length <= 18 || 'Limite de 18 caracteres',
    ]
  }),
  methods: {
    async onSubmit() {
      if (this.newPassword !== this.newPasswordRepeat) return this.$q.notify({type: 'negative', message: 'As senhas digitadas não estão iguais'})
      this.processing = true
      const {error} = await useAuth().changePassword(this.newPassword)
      if (error) this.$q.notify({type: 'negative', message: error.message})
      else {
        this.$q.notify({ type: "positive", message: "Senha alterada" });
        this.$router.push({name: 'home'})
      }
      this.processing = false
    },
  }
})
</script>
