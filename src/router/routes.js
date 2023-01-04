
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'home', alias: '/home', component: () => import('pages/HomePage.vue') },
      { path: 'change-password', name: 'change-password', component: () => import('pages/ChangePassword.vue') },
      { path: 'profile', name: 'profile', component: () => import('pages/ProfilePage.vue') },
      { path: 'shopping-lists', name: 'shopping-lists', component: () => import('pages/ShoppingLists.vue') },
      { path: 'shopping-carts', name: 'shopping-carts', component: () => import('pages/ShoppingCarts.vue') },
    ]
  },

  {
    path: '/',
    component: () => import('layouts/PublicLayout.vue'),
    children: [
      { path: 'login', name: 'login', component: () => import('pages/noauth/LoginPage.vue') },
      { path: 'register', name: 'register', component: () => import('pages/noauth/RegisterPage.vue') },
      { path: 'email-confirmation', name: 'email-confirmation', component: () => import('pages/noauth/EmailConfirmation.vue') },
      { path: 'forgot-password', name: 'forgot-password', component: () => import('pages/noauth/ForgotPassword.vue') },
    ]
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
