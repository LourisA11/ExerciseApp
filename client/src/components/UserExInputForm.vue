<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { addUserExercise } from '../services/userExerciseService'
import { getExerciseBank, type ExerciseBankRow } from '../services/exerciseBankService'
import { authState } from '../store/userData'

const model = defineModel<string>({ default: '' })
const emit = defineEmits<{
  activityAdded: []
}>()

const exercises = ref<ExerciseBankRow[]>([])
const isLoading = ref(false)
const isSaving = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const weightLb = ref('')
const reps = ref('')
const durationMin = ref('')
const distance = ref('')

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

const selectExercise = (exerciseId: string) => {
  model.value = exerciseId
}

const toNullableNumber = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) return null

  const numericValue = Number(trimmed)
  return Number.isFinite(numericValue) ? numericValue : null
}

const submitActivity = async () => {
  const userId = authState.currentUser?.id
  if (!userId) {
    errorMessage.value = 'You must be logged in.'
    successMessage.value = ''
    return
  }

  if (!model.value) {
    errorMessage.value = 'Please select an exercise.'
    successMessage.value = ''
    return
  }

  isSaving.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const response = await addUserExercise({
      user_id: userId,
      exercise_id: model.value,
      weight_lb: toNullableNumber(weightLb.value),
      reps: toNullableNumber(reps.value),
      durations_min: toNullableNumber(durationMin.value),
      distance: toNullableNumber(distance.value),
    })

    if (!response.isSuccess) {
      errorMessage.value = response.message ?? 'Unable to add activity.'
      return
    }

    successMessage.value = 'Exercise saved.'
    weightLb.value = ''
    reps.value = ''
    durationMin.value = ''
    distance.value = ''
    emit('activityAdded')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to add activity.'
  } finally {
    isSaving.value = false
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

    <div class="field">
      <label class="label">Weight (lb)</label>
      <div class="control">
        <input
          v-model="weightLb"
          class="input"
          type="number"
          min="0"

          placeholder="Optional"
        />
      </div>
    </div>

    <div class="field">
      <label class="label">Reps</label>
      <div class="control">
        <input
          v-model="reps"
          class="input"
          type="number"
          min="0"
          step="1"
          placeholder="Optional"
        />
      </div>
    </div>

    <div class="field">
      <label class="label">Duration (min)</label>
      <div class="control">
        <input
          v-model="durationMin"
          class="input"
          type="number"
          min="0"
          step="1"
          placeholder="Optional"
        />
      </div>
    </div>

    <div class="field">
      <label class="label">Distance (mile)</label>
      <div class="control">
        <input
          v-model="distance"
          class="input"
          type="number"
          min="0"
          step="0.1"
          placeholder="Optional"
        />
      </div>
    </div>

    <p v-if="isLoading" class="has-text-grey">Loading exercises...</p>
    <p v-if="errorMessage" class="has-text-danger">{{ errorMessage }}</p>
    <p v-if="successMessage" class="has-text-success">{{ successMessage }}</p>
    <p v-if="selectedExerciseLabel" class="mt-3 has-text-grey">Selected: {{ selectedExerciseLabel }}</p>

    <button class="button is-primary mt-3" :disabled="isLoading || isSaving || !model" @click="submitActivity">
      {{ isSaving ? 'Saving...' : 'Add Exercise' }}
    </button>
  </div>
</template>
