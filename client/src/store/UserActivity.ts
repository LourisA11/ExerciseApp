import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getUserActivities,
  getActivitiesByUser,
  createUserActivity,
  deleteUserActivity,
  type UserActivity,
} from '../services/UserActivity'

export const useUserActivityStore = defineStore('userActivity', () => {
  const activities = ref<UserActivity[]>([])
  const count = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll(params?: { page?: number; pageSize?: number; search?: string }) {
    loading.value = true
    error.value = null
    try {
      const res = await getUserActivities(params)
      activities.value = res.list
      count.value = res.count
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch activities'
    } finally {
      loading.value = false
    }
  }

  async function fetchByUser(userId: number) {
    loading.value = true
    error.value = null
    try {
      const res = await getActivitiesByUser(userId)
      activities.value = res.list
      count.value = res.count
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch user activities'
    } finally {
      loading.value = false
    }
  }

  async function addActivity(payload: Omit<UserActivity, 'id' | 'createdAt'>) {
    error.value = null
    const created = await createUserActivity(payload)
    activities.value.unshift(created)
    count.value += 1
    return created
  }

  async function removeActivity(id: number) {
    error.value = null
    await deleteUserActivity(id)
    activities.value = activities.value.filter((a) => a.id !== id)
    count.value = Math.max(0, count.value - 1)
  }

  return {
    activities,
    count,
    loading,
    error,
    fetchAll,
    fetchByUser,
    addActivity,
    removeActivity,
  }
})

export default useUserActivityStore