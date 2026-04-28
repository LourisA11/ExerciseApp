<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getExerciseBank, type ExerciseBankRow } from '../services/exerciseBankService'

const model = defineModel<string>({ default: '' })

const exercises = ref<ExerciseBankRow[]>([])
const isLoading = ref(false)
const errorMessage = ref('')
const selectExercise = (exerciseId: string) => {
  model.value = exerciseId
}

const selectedExerciseLabel = computed(() => {
  const found = exercises.value.find((ex) => ex.id === model.value)
  return found ? `${found.name} (${found.type})` : ''
})

const loadExercises = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await getExerciseBank()
    if (!response.isSuccess) {
      errorMessage.value = response.message ?? 'Unable to load exercises.'
      exercises.value = []
      return
    }

    exercises.value = response.data ?? []

    if (!model.value && exercises.value.length) {
      model.value = exercises.value[0]!.id
    }
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to load exercises.'
  } finally {
    isLoading.value = false
  }
}

onMounted(loadExercises)
</script>

<template>
  <div class="exercise-input-form">
    <h2 class="title is-4">Add Exercise</h2>

    <div class="field">
      <label class="label">Exercise</label>
      <div class="control">
        <div class="select is-fullwidth">
          <select :value="model" @change="selectExercise(($event.target as HTMLSelectElement).value)">
            <option disabled value="">Select an exercise</option>
            <option v-for="exercise in exercises" :key="exercise.id" :value="exercise.id">
              {{ exercise.name }} — {{ exercise.type }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <p v-if="isLoading" class="has-text-grey">Loading exercises...</p>
    <p v-if="errorMessage" class="has-text-danger">{{ errorMessage }}</p>
    <p v-if="selectedExerciseLabel" class="mt-3 has-text-grey">Selected: {{ selectedExerciseLabel }}</p>
  </div>
</template>
