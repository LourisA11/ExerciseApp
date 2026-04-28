<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { authState } from '../store/userData'
import { addUserExercise } from '../services/userExerciseService'
import { getExerciseBank, type ExerciseBankRow } from '../services/exerciseBankService'
import { getUsersByEmail } from '../services/usersService'

const emit = defineEmits<{
  added: []
}>()

const exercises = ref<ExerciseBankRow[]>([])
const selectedExerciseId = ref('')
const weightLb = ref('')
const reps = ref('')
const durationMin = ref('')
const distance = ref('')
const isLoading = ref(false)
const isSaving = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const selectedExerciseLabel = computed(() => {
  const exercise = exercises.value.find((item) => item.id === selectedExerciseId.value)
  return exercise ? `${exercise.name} (${exercise.type})` : ''
})

const toNullableNumber = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) return null

  const n = Number(trimmed)
  return Number.isFinite(n) ? n : null
}

const getCurrentUserEmail = () => {
  const user = authState.currentUser as Record<string, unknown> | null
  if (typeof user?.email === 'string' && user.email.trim()) {
    return user.email.trim()
  }

  try {
    const raw = sessionStorage.getItem('currentUser')
    if (!raw) return ''
    const savedUser = JSON.parse(raw) as Record<string, unknown>
    return typeof savedUser.email === 'string' ? savedUser.email.trim() : ''
  } catch {
    return ''
  }
}

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
    if (!selectedExerciseId.value && exercises.value.length) {
      selectedExerciseId.value = exercises.value[0]!.id
    }
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to load exercises.'
    exercises.value = []
  } finally {
    isLoading.value = false
  }
}

const submitExercise = async () => {
  const userEmail = getCurrentUserEmail()

  if (!userEmail) {
    errorMessage.value = 'You must be logged in with a valid email.'
    successMessage.value = ''
    return
  }

  if (!selectedExerciseId.value) {
    errorMessage.value = 'Please select an exercise.'
    successMessage.value = ''
    return
  }

  isSaving.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const identityResponse = await getUsersByEmail(userEmail)
    if (!identityResponse.isSuccess || !identityResponse.data.length) {
      errorMessage.value =
        identityResponse.message ??
        `No Supabase Auth user found for email ${userEmail}.`
      return
    }

    const userId = identityResponse.data[0]!.id

    const response = await addUserExercise({
      user_id: String(userId),
      exercise_id: selectedExerciseId.value,
      weight_lb: toNullableNumber(weightLb.value),
      reps: toNullableNumber(reps.value),
      durations_min: toNullableNumber(durationMin.value),
      distance: toNullableNumber(distance.value),
    })

    if (!response.isSuccess) {
      errorMessage.value = response.message ?? 'Unable to add exercise.'
      return
    }

    successMessage.value = 'Exercise added to your profile.'
    weightLb.value = ''
    reps.value = ''
    durationMin.value = ''
    distance.value = ''
    emit('added')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to add exercise.'
  } finally {
    isSaving.value = false
  }
}

onMounted(loadExercises)
</script>

<template>
  <section class="box">
    <h2 class="title is-5">Add Exercise</h2>

    <div class="field">
      <label class="label">Exercise</label>
      <div class="control">
        <div class="select is-fullwidth">
          <select v-model="selectedExerciseId">
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
        <input v-model="weightLb" class="input" type="number" min="0" step="0.1" placeholder="Optional" />
      </div>
    </div>

    <div class="field">
      <label class="label">Reps</label>
      <div class="control">
        <input v-model="reps" class="input" type="number" min="0" step="1" placeholder="Optional" />
      </div>
    </div>

    <div class="field">
      <label class="label">Duration (min)</label>
      <div class="control">
        <input v-model="durationMin" class="input" type="number" min="0" step="1" placeholder="Optional" />
      </div>
    </div>

    <div class="field">
      <label class="label">Distance</label>
      <div class="control">
        <input v-model="distance" class="input" type="number" min="0" step="0.1" placeholder="Optional" />
      </div>
    </div>

    <p v-if="isLoading" class="has-text-grey">Loading exercises...</p>
    <p v-if="errorMessage" class="has-text-danger">{{ errorMessage }}</p>
    <p v-if="successMessage" class="has-text-success">{{ successMessage }}</p>
    <p v-if="selectedExerciseLabel" class="mt-3 has-text-grey">Selected: {{ selectedExerciseLabel }}</p>

    <button class="button is-primary mt-3" :disabled="isLoading || isSaving || !selectedExerciseId" @click="submitExercise">
      {{ isSaving ? 'Saving...' : 'Add Exercise' }}
    </button>
  </section>
</template>
