import { reactive } from 'vue'
import { api } from '../services/myFetch'

export interface IExercise {
  id?: string
  name?: string
  type?: string
}

export const exerciseState = reactive({
  list: [] as IExercise[],
  loading: false,
})

export async function loadExercises() {
  exerciseState.loading = true
  try {
    const res = await api<{ data: IExercise[] }>(`/exercise-bank`)
    exerciseState.list = res.data ?? []
  } finally {
    exerciseState.loading = false
  }
}

export async function addExercise(payload: Partial<IExercise>) {
  return api<{ data: IExercise }>(`/exercise-bank`, payload, { method: 'POST' })
}

export async function updateExercise(id: string, payload: Partial<IExercise>) {
  return api<{ data: IExercise }>(`/exercise-bank/${id}`, payload, { method: 'PATCH' })
}

export async function removeExercise(id: string) {
  return api<{ data: IExercise }>(`/exercise-bank/${id}`, undefined, { method: 'DELETE' })
}

export default {
  exerciseState,
  loadExercises,
  addExercise,
  updateExercise,
  removeExercise,
}
