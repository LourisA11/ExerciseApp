export type UsersRow = {
  id: string
  created_at: string
  firstName: string
  lastName: string
  height: number
  weight: number
  age: number
  email: string | null
  role: "admin" | "moderator" | "user" | null
}

export type ExerciseBankRow = {
  id: string
  created_at: string
  name: string
  type: string
}

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