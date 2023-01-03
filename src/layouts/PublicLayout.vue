<template>
  <q-layout>
    <q-page-sticky position="top-right" :offset="[16,16]" class="z-fab">
      <q-btn
        fab
        color="primary"
        @click="$q.dark.toggle()"
        :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
      />
    </q-page-sticky>
    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer bordered :class="{'bg-dark':$q.dark.isActive}" class="q-pa-xs">
      <div class="flex justify-between">
        <span class="text-caption">&copy; Elias L. C. Neto</span>
        <span class="text-caption">versão {{ version }}</span>
      </div>
    </q-footer>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'
import { version } from '../../package.json'
export default defineComponent({
  name: 'PublicLayout',
  setup() {
    return { version }
  }
})
</script>
