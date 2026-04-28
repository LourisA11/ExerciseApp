import { api } from './myFetch'

export type UserExerciseRow = {
  id: number
  created_at: string
  user_id: string | null
  exercise_id: string | null
  weight_lb: number | null
  reps: number | null
  durations_min: number | null
  distance: number | null
}

type ListResponse = {
  isSuccess: boolean
  message?: string
  data: UserExerciseRow[]
  total: number
}

type ItemResponse = {
  isSuccess: boolean
  message?: string
  data: UserExerciseRow | null
}

export function getUserExercises() {
  return api<ListResponse>('/user-exercises')
}

export function updateUserExercise(id: number, payload: Record<string, unknown>) {
  return api<ItemResponse>(`/user-exercises/${id}`, payload, { method: 'PATCH' })
}

export function addUserExercise(payload: Record<string, unknown>) {
  return api<ItemResponse>('/user-exercises', payload)
}

export function deleteUserExercise(id: number) {
  return api<ItemResponse>(`/user-exercises/${id}`, undefined, { method: 'DELETE' })
}
