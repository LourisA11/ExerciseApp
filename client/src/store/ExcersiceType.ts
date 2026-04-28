import useSessionStore from './session'
import { defineStore } from 'pinia'
import type { Exercise } from '../../../server/types'
import {ref} from 'vue'

export const useExerciseStore = defineStore('exercise', () => {
  const sessionStore = useSessionStore()

  const exercises = ref<Exercise[]>([])

  async function fetchExercises() {
    try {
      const data = await sessionStore.api<{ items: Exercise[] }>('exercises')
      exercises.value = data.items
    } catch (error) {
      console.error('Failed to fetch exercises:', error)
    }
  }

  return {
    exercises,
    fetchExercises,
  }
})

export default useExerciseStore