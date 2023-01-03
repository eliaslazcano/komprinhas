import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import {useSessionStore} from 'stores/session'
export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  Router.beforeEach((to) => {
    const isAuthenticated = useSessionStore().isLoggedIn
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    if (requiresAuth && !isAuthenticated) return { name: 'login', query: { next: to.fullPath } }
    else if (!requiresAuth && isAuthenticated) return { name: 'home' }
  })

  return Router
})
