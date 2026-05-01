import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getUserActivities,
  createUserActivity,
  deleteUserActivity,
  type UserActivity,
} from '../services/UserActivity'
import { getShortcuts, saveShortcut } from '../services/userShortcuts'

// Define the Shortcut interface to avoid 'any' errors
export interface Shortcut {
  id: number;
  label: string;
  exercise_id: string;
  weight_lb: number;
  reps: number;
}

export const useUserActivityStore = defineStore('userActivity', () => {
  const activities = ref<UserActivity[]>([])
  const shortcuts = ref<Shortcut[]>([]) // Fixed initialization
  const count = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function loadActivities() {
    loading.value = true
    try {
      const res = await getUserActivities()
      activities.value = [...res.list]
      count.value = res.count
    } catch (err) {
      error.value = "Failed to load data"
    } finally {
      loading.value = false
    }
  }

  async function addActivity(payload: Omit<UserActivity, 'id' | 'created_at'>) {
    try {
      // Cast to any for the service call to allow omitting created_at
      const created = await createUserActivity(payload as any)
      activities.value.unshift(created)
      count.value += 1
      return created
    } catch (err) {
      error.value = "Failed to save to database"
      throw err
    }
  }

  async function removeActivity(id: number) {
    try {
      await deleteUserActivity(id)
      activities.value = activities.value.filter((a) => a.id !== id)
      count.value = Math.max(0, count.value - 1)
    } catch (err) {
      error.value = "Failed to delete activity"
    }
  }

  async function loadShortcuts() {
    try {
      const data = await getShortcuts()
      shortcuts.value = data as Shortcut[]
    } catch (err) {
      error.value = "Failed to load shortcuts"
    }
  }

  async function addShortcut(item: Shortcut) {
    const dataToSave: Partial<Shortcut> = { ...item }
    if (dataToSave.id > 1000000000000) {
      delete dataToSave.id 
    }
    await saveShortcut(dataToSave)
    await loadShortcuts()
  }

  return {
    activities, shortcuts, count, loading, error,
    loadActivities, addActivity, removeActivity, loadShortcuts, addShortcut
  }
})