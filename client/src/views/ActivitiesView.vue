<script setup lang="ts">
import { onMounted, ref } from 'vue'
import UserExInputForm from '../components/UserExInputForm.vue'
import { authState } from '../store/userData'
import {
  addUserExercise,
  deleteUserExercise,
  getUserExercises,
  type UserExerciseRow,
} from '../services/userExerciseService'
import { getExerciseBank, type ExerciseBankRow } from '../services/exerciseBankService'

const activities = ref<UserExerciseRow[]>([])
const exercises = ref<ExerciseBankRow[]>([])
const selectedExerciseId = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const loadExercises = async () => {
  const response = await getExerciseBank()
  if (response.isSuccess) {
    exercises.value = response.data ?? []
    if (!selectedExerciseId.value && exercises.value.length) {
      selectedExerciseId.value = exercises.value[0]!.id
    }
  }
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

const addActivity = async () => {
  try {
    errorMessage.value = ''

    const userId = authState.currentUser?.id
    if (!userId) {
      errorMessage.value = 'You must be logged in.'
      return
    }

    if (!selectedExerciseId.value) {
      errorMessage.value = 'Please select an exercise.'
      return
    }

    const response = await addUserExercise({
      user_id: userId,
      exercise_id: selectedExerciseId.value,
      weight_lb: null,
      reps: null,
      durations_min: null,
      distance: null,
    })

    if (!response.isSuccess) {
      errorMessage.value = response.message ?? 'Unable to add activity.'
      return
    }

    await loadActivities()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to add activity.'
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
  await loadExercises()
  await loadActivities()
})
</script>

<template>
  <div class="section">
    <h1 class="title">Activities</h1>

    <UserExInputForm v-model="selectedExerciseId" />

    <div class="mt-3">
      <button
        class="button is-primary"
        :disabled="isLoading || !selectedExerciseId"
        @click="addActivity"
      >
        Add Exercise
      </button>
    </div>

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
          <td>{{ a.exercise_id }}</td>
          <td>{{ a.created_at }}</td>
          <td>
            <button class="button is-small is-danger" @click="deleteActivity(a.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

