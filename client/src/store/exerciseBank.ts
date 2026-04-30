import { reactive } from 'vue'
import { api } from '../services/myFetch'

export interface IExercise {
  id?: string
  name?: string
  type?: string
}

export const exerciseState = reactive({
    list: [] as any[], // Must be an array
    async load() {
        try {
            const response = await api('/exercise-bank');
            // Check if response is the array itself or an object containing the array
            this.list = Array.isArray(response) ? response : (response.data || []);
        } catch (err) {
            this.list = []; 
            console.error(err);
        }
    }
});

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
