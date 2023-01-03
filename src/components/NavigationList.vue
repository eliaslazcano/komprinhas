<template>
  <q-item clickable :to="to" exact>
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'NavigationList',
  props: {
    title: { type: String, required: true },
    icon: { type: String, default: '' },
    to: { type: String, required: true },
  }
})
</script>
