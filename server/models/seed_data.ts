import { config } from "dotenv"
config()

import { seed as seedExerciseBank } from "./ExerciseBank"
import { seed as seedUserExercise } from "./UserExercise"

const exerciseBankItems = [
  { name: "Bench Press", type: "Strength" },
  { name: "Running", type: "Cardio" },
  { name: "Yoga", type: "Flexibility" },
]

const userExerciseItems = [
  {
    user_id: "PUT_REAL_USER_UUID_HERE",
    exercise_id: "PUT_REAL_EXERCISE_UUID_HERE",
    weight_lb: 135,
    reps: 8,
    durations_min: null,
    distance: null,
  },
]

Promise.all([
  seedExerciseBank(exerciseBankItems),
  seedUserExercise(userExerciseItems),
])
  .then(() => {
    console.log("Seeding complete")
    process.exit(0)
  })
  .catch((err) => {
    console.error("Error seeding data:", err)
    process.exit(1)
  })