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

// 1. Define routes FIRST
const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/activities', name: 'activities', component: ActivitiesView },
  { path: '/admin', name: 'admin', component: AdminView },
  { path: '/social', name: 'social', component: SocialView },
  { path: '/statistics', name: 'statistics', component: StatisticsView },
  { path: '/sign-up', name: 'sign-up', component: UserLogin }
]

// 2. Pass them into the router
const router = createRouter({
  history: createWebHistory(),
  routes: routes // or just 'routes' using shorthand
})



export default router