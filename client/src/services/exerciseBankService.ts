import { myFetch } from './myFetch'

export type ExerciseBankRow = {
  id: string
  created_at: string
  name: string
  type: string
}

type ListResponse = {
  isSuccess: boolean
  message?: string
  data: ExerciseBankRow[]
  total: number
}

export function getExerciseBank() {
  return myFetch('/exercise-bank')
}

export function addExerciseBank(payload: { name: string; type: string }) {
  return myFetch('/exercise-bank', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}