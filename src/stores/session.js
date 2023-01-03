import {defineStore} from 'pinia'
import {Notify} from 'quasar'
import {useAuth} from 'src/composables/Auth'

export const useSessionStore = defineStore('session', {
  state: () => ({
    user: null
  }),
  getters: {
    /** @type {boolean} */
    isLoggedIn(state) {
      return !!state.user
    },
  },
  actions: {
    async logout() {
      if (this.user) {
        this.user = null
        this.router.replace({ name: 'login' })
        useAuth().signOut()
        localStorage.clear()
        Notify.create({ type: 'negative', message: 'Você foi desconectado' })
      }
    },
  },
})
