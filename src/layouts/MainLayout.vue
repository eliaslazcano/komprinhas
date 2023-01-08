<template>
  <q-layout view="hHh LpR fFf" v-if="sessionStore.isLoggedIn">
    <q-header
      :bordered="$q.dark.isActive"
      :elevated="!$q.dark.isActive"
      :class="{'bg-dark':$q.dark.isActive}"
    >
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-avatar square class="q-ml-sm">
          <q-icon name="shopping_cart"></q-icon>
        </q-avatar>
        <q-toolbar-title>Komprinhas</q-toolbar-title>
        <q-btn flat round dense icon="more_vert">
          <q-menu anchor="top end" self="top right" auto-close>
            <q-list>
              <q-item clickable :to="{name: 'profile'}" exact>
                <q-item-section avatar>
                  <q-icon name="person" />
                </q-item-section>
                <q-item-section>Minha conta</q-item-section>
              </q-item>
              <q-item clickable @click="$q.dark.toggle()" v-if="$q.dark.isActive">
                <q-item-section avatar>
                  <q-icon name="light_mode" />
                </q-item-section>
                <q-item-section>Modo claro</q-item-section>
              </q-item>
              <q-item clickable @click="$q.dark.toggle()" v-else>
                <q-item-section avatar>
                  <q-icon name="dark_mode" />
                </q-item-section>
                <q-item-section>Modo escuro</q-item-section>
              </q-item>
              <q-item clickable :to="{name: 'change-password'}" exact>
                <q-item-section avatar>
                  <q-icon name="lock_reset" />
                </q-item-section>
                <q-item-section>Trocar senha</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable @click="sessionStore.logout()">
                <q-item-section avatar>
                  <q-icon name="logout" color="negative" />
                </q-item-section>
                <q-item-section>Desconectar</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">
              <!--
              <img v-if="sessionStore.payload.foto" :src="sessionStore.payload.foto" alt="">
              -->
              <span>{{ sessionStore.user.user_metadata.name.substr(0,2) }}</span>
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ sessionStore.user.user_metadata.name }}</q-item-label>
            <q-item-label caption lines="1">{{ sessionStore.user.email }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />
        <navigation-list v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container :style="{ backgroundColor: !$q.dark.isActive ? '#f5f6f8' : null }">
      <transition name="fade">
        <router-view />
      </transition>
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
import {defineComponent, ref} from 'vue'
import NavigationList from 'components/NavigationList.vue'
import {useSessionStore} from 'src/stores/session'
import {version} from '../../package.json'
export default defineComponent({
  name: 'MainLayout',
  components: {NavigationList},
  setup () {
    const leftDrawerOpen = ref(false)
    const toggleLeftDrawer = () => leftDrawerOpen.value = !leftDrawerOpen.value
    const essentialLinks = [
      {
        title: 'Home',
        icon: 'home',
        to: '/home'
      },
      {
        title: 'Listas',
        icon: 'list',
        to: '/shopping-lists'
      },
      {
        title: 'Carrinhos',
        icon: 'shopping_cart',
        to: '/shopping-carts'
      },
      {
        title: 'Produtos conhecidos',
        icon: 'inventory',
        to: '/products'
      }
    ]

    const sessionStore = useSessionStore()
    return {leftDrawerOpen, toggleLeftDrawer, essentialLinks, version, sessionStore}
  }
})
</script>
