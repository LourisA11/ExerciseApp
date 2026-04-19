import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ActivitiesView from '../views/ActivitiesView.vue'
import AdminView from '../views/AdminView.vue'
import SocialView from '../views/SocialView.vue'
import StatisticsView from '../views/StatisticsView.vue'
import UserLogin from '../views/UserLogin.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/activities',
    name: 'activities',
    component: ActivitiesView
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView
  },
  {
       path: '/social',
    name: 'social',
    component: SocialView
  },
  {
       path: '/statistics',
    name: 'statistics',
    component: StatisticsView
  },
  {
    path: '/sign-up',
    name: 'sign-up',
    component: UserLogin
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router