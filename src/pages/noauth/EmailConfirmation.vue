<template>
  <q-page padding class="flex flex-center">
    <q-card class="q-mx-auto" style="width: 24rem; max-width: 100%" :flat="$q.screen.xs">
      <q-card-section>
        <p class="text-h6">Obrigado por se registrar!</p>
        <p class="text-body1">
          Para finalizar o cadastro, confirme seu e-mail abrindo a mensagem que
          enviamos para: <strong>{{ $route.query.email }}</strong>
        </p>
        <div class="text-center">
          <q-btn
            label="Voltar"
            color="primary"
            class="q-mt-sm"
            to="/login"
            outline
          ></q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import {defineComponent} from 'vue'
export default defineComponent({
  name: 'EmailConfirmation'
})
</script>
