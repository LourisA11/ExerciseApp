import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getUserActivities,
  getActivitiesByUser,
  createUserActivity,
  deleteUserActivity,
  type UserActivity,
} from '../services/UserActivity'

export interface Exercise {
id: number;
  user_id: string; // Ensure this matches User[cite: 12]
  exercise_id: string;
  weight_lb?: number | null;
  reps?: number | null;
  createdAt: string;
}

export const useUserActivityStore = defineStore('userActivity', () => {
  const activities = ref<UserActivity[]>([])
const exerciseBank = ref<Exercise[]>([]);
  const count = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function loadActivities(params?: { page?: number; pageSize?: number; search?: string }) {
    loading.value = true
    try {
      const res = await getUserActivities(params)
      // Force a fresh assignment to trigger Vue's reactivity
      activities.value = [...res.list] 
      count.value = res.count
      console.log("Store updated with:", activities.value.length, "items")
    } catch (err) {
      error.value = 'Failed to fetch activities'
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
    try {
      const created = await createUserActivity(payload)
      
      // THIS IS THE TRIGGER: It pushes the new item into the reactive array
      activities.value.unshift(created) 
      
      count.value += 1
      return created
    } catch (err) {
      error.value = "Failed to save to database"
      throw err; // Throw so the component's 'catch' block can see it
    }
}

  async function removeActivity(id: number) {
    error.value = null
    await deleteUserActivity(id)
    activities.value = activities.value.filter((a) => a.id !== id)
    count.value = Math.max(0, count.value - 1)
  }
async function loadExerciseBank() {
     // Fetch your exercises from the database here
     // For now, an empty array to stop the error
     exerciseBank.value = [] 
  }

  const getExerciseLabel = (exerciseId: string | number) => {
    const exercise = exerciseBank.value.find(e => e.id === exerciseId)
    return exercise ? exercise.name : 'Unknown Exercise'
  }

  return {
    activities,
    count,
    loading,
    error,
    loadActivities,
    fetchByUser,
    addActivity,
    removeActivity,
    loadExerciseBank,
    getExerciseLabel
  }
})

export default useUserActivityStore