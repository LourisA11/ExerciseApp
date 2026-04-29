import { ref } from 'vue'
import { getUserExercises, deleteUserExercise, type UserExerciseRow } from '../services/userExerciseService'
import { getExerciseBank, type ExerciseBankRow } from '../services/exerciseBankService'

// We use a plain object with refs for a simple, effective store
export const activityStore = {
  activities: ref<UserExerciseRow[]>([]),
  exerciseBank: ref<ExerciseBankRow[]>([]),
  isLoading: ref(false),
  errorMessage: ref(''),

  async loadExerciseBank() {
    try {
      const response = await getExerciseBank()
      if (response.isSuccess) {
        this.exerciseBank.value = response.data ?? []
      }
    } catch {
      this.exerciseBank.value = []
    }
  },

  async loadActivities() {
    this.isLoading.value = true
    this.errorMessage.value = ''
    try {
      const response = await getUserExercises()
      if (response.isSuccess) {
        this.activities.value = response.data ?? []
      } else {
        this.errorMessage.value = response.message ?? 'Failed to load activities.'
      }
    } catch (error) {
      this.errorMessage.value = 'An unexpected error occurred.'
    } finally {
      this.isLoading.value = false
    }
  },

  async deleteActivity(id: number) {
    try {
      const response = await deleteUserExercise(id)
      if (response.isSuccess) {
        await this.loadActivities() // Refresh list after delete
      } else {
        this.errorMessage.value = response.message ?? 'Delete failed.'
      }
    } catch {
      this.errorMessage.value = 'Error deleting activity.'
    }
  },

  getExerciseLabel(exerciseId: string | null) {
    if (!exerciseId) return 'Unknown exercise'
    const exercise = this.exerciseBank.value.find((item) => item.id === exerciseId)
    return exercise ? `${exercise.name} (${exercise.type})` : 'Loading...'
  }
}