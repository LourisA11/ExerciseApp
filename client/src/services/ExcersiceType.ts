import { api } from './myFetch'
import type { Exercise } from '../../../server/types'

export function getExercises() {
  return api<{ list: Exercise[]; count: number }>('/exercises')
}

export function getExercise(id: number) {
  return api<Exercise>(`/exercises/${id}`)
}

export function createExercise(exercise: Omit<Exercise, 'id'>) {
  return api<Exercise>('/exercises', exercise)
}

export function updateExercise(id: number, exercise: Partial<Exercise>) {
  return api<Exercise>(`/exercises/${id}`, exercise, { method: 'PUT' })
}

export function deleteExercise(id: number) {
  return api<Exercise>(`/exercises/${id}`, undefined, { method: 'DELETE' })
}