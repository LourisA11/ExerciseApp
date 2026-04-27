<script setup lang="ts">
import { onMounted, ref } from 'vue'
import UserExInputForm from '../components/UserExInputForm.vue'
import {
  deleteUserExercise,
  getUserExercises,
  type UserExerciseRow,
} from '../services/userExerciseService'
import { getExerciseBank, type ExerciseBankRow } from '../services/exerciseBankService'

const activities = ref<UserExerciseRow[]>([])
const exerciseBank = ref<ExerciseBankRow[]>([])
const isLoading = ref(false)
const errorMessage = ref('')

const loadExerciseBank = async () => {
  try {
    const response = await getExerciseBank()
    if (response.isSuccess) {
      exerciseBank.value = response.data ?? []
    }
  } catch {
    exerciseBank.value = []
  }
}

const getExerciseLabel = (exerciseId: string | null) => {
  if (!exerciseId) return 'Unknown exercise'

  const exercise = exerciseBank.value.find((item) => item.id === exerciseId)
  if (!exercise) return exerciseId

  return `${exercise.name} (${exercise.type})`
}

const loadActivities = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await getUserExercises()
    if (!response.isSuccess) {
      errorMessage.value = response.message ?? 'Unable to load activities.'
      activities.value = []
      return
    }

    activities.value = response.data ?? []
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to load activities.'
  } finally {
    isLoading.value = false
  }
}

const deleteActivity = async (id: number) => {
  try {
    const response = await deleteUserExercise(id)
    if (!response.isSuccess) {
      errorMessage.value = response.message ?? 'Unable to delete activity.'
      return
    }
    await loadActivities()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to delete activity.'
  }
}

onMounted(async () => {
  await loadExerciseBank()
  await loadActivities()
})
</script>

<template>
  <div class="section">
    <h1 class="title">Activities</h1>

    <UserExInputForm @activity-added="loadActivities" />

    <p v-if="errorMessage" class="has-text-danger mt-3">{{ errorMessage }}</p>

    <table v-if="activities.length" class="table is-fullwidth mt-4">
      <thead>
        <tr>
          <th>ID</th>
          <th>Exercise</th>
          <th>Created</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="a in activities" :key="a.id">
          <td>{{ a.id }}</td>
          <td>{{ getExerciseLabel(a.exercise_id) }}</td>
          <td>{{ a.created_at }}</td>
          <td>
            <button class="button is-small is-danger" @click="deleteActivity(a.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

