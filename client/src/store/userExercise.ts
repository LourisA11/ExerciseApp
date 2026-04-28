import { reactive } from 'vue'
import { api } from '../services/myFetch'

export interface IUserExercise {
  id?: number
  user_id?: string
  exercise_id?: string
  weight_lb?: number | null
  reps?: number | null
  durations_min?: number | null
  distance?: number | null
}

export const userExerciseState = reactive({
  list: [] as IUserExercise[],
  loading: false,
})

export async function loadUserExercises() {
  userExerciseState.loading = true
  try {
    const res = await api<{ data: IUserExercise[] }>(`/user-exercises`)
    userExerciseState.list = res.data ?? []
  } finally {
    userExerciseState.loading = false
  }
}

export async function addUserExercise(payload: Partial<IUserExercise>) {
  return api<{ data: IUserExercise }>(`/user-exercises`, payload, { method: 'POST' })
}

export async function updateUserExercise(id: number, payload: Partial<IUserExercise>) {
  return api<{ data: IUserExercise }>(`/user-exercises/${id}`, payload, { method: 'PATCH' })
}

export async function removeUserExercise(id: number) {
  return api<{ data: IUserExercise }>(`/user-exercises/${id}`, undefined, { method: 'DELETE' })
}

export default {
  userExerciseState,
  loadUserExercises,
  addUserExercise,
  updateUserExercise,
  removeUserExercise,
}
