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
  created_at: string;
}

export const useUserActivityStore = defineStore('userActivity', () => {
  const activities = ref<UserActivity[]>([])
const exerciseBank = ref<Exercise[]>([]);
  const count = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const page = ref(1)
const limit = 10
const hasMore = ref(true)
const isFetchingMore = ref(false)

 async function loadActivities(reset = false) {
  if (loading.value || isFetchingMore.value) return
  if (!hasMore.value && !reset) return

  if (reset) loading.value = true
  else isFetchingMore.value = true

  try {
    if (reset) {
      page.value = 1
      activities.value = []
      hasMore.value = true
    }

    const res = await getUserActivities({
      page: page.value,
      pageSize: limit
    })

    activities.value.push(...res.list)
    count.value = res.count
    hasMore.value = res.hasMore
    page.value++

  } finally {
    loading.value = false
    isFetchingMore.value = false
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
  try {

    await deleteUserActivity(id) 
    activities.value = activities.value.filter((a) => a.id !== id)
    
    count.value = Math.max(0, count.value - 1)
  } catch (err) {
    error.value = "Failed to delete activity"
  }
}
async function loadExerciseBank() {
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
    getExerciseLabel,
    isFetchingMore
  }
})

export default useUserActivityStore