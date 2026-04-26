import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ActivitiesView from '../views/ActivitiesView.vue'
import AdminView from '../views/AdminView.vue'
import SocialView from '../views/SocialView.vue'
import StatisticsView from '../views/StatisticsView.vue'
import UserLogin from '../views/UserLogin.vue'
import { authState, type User } from '../store/userData'

type RouteMeta = {
  requiresAuth?: boolean
  requiresAdmin?: boolean
  guestOnly?: boolean
}

const SESSION_KEY = 'currentUser'

function restoreUserFromSession() {
  if (authState.currentUser) return

  const raw = sessionStorage.getItem(SESSION_KEY)
  if (!raw) return

  try {
    authState.currentUser = JSON.parse(raw) as User
  } catch {
    sessionStorage.removeItem(SESSION_KEY)
  }
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/activities',
    name: 'activities',
    component: ActivitiesView,
    meta: { requiresAuth: true } as RouteMeta,
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView,
    meta: { requiresAuth: true, requiresAdmin: true } as RouteMeta,
  },
  {
       path: '/social',
    name: 'social',
    component: SocialView,
    meta: { requiresAuth: true } as RouteMeta,
  },
  {
       path: '/statistics',
    name: 'statistics',
    component: StatisticsView,
    meta: { requiresAuth: true } as RouteMeta,
  },
  {
    path: '/sign-up',
    name: 'sign-up',
    component: UserLogin,
    meta: { guestOnly: true } as RouteMeta,
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  restoreUserFromSession()

  const meta = to.meta as RouteMeta
  const user = authState.currentUser

  if (meta.requiresAuth && !user) {
    return { name: 'sign-up' }
  }

  if (meta.requiresAdmin && user?.role !== 'admin') {
    return { name: 'home' }
  }

  if (meta.guestOnly && user) {
    return { name: 'home' }
  }
})

export default router