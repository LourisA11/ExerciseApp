<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getExerciseBank, type ExerciseBankRow } from '../services/exerciseBankService'
import { useUserActivityStore } from '../store/UserActivity'
import { authState } from '../store/userData'


const emit = defineEmits<{'added': []}>()  
const model = defineModel<string>({ default: '' })
const exercises = ref<ExerciseBankRow[]>([])
const isLoading = ref(false)
const isSaving = ref(false)
const errorMessage = ref('')
const activityStore = useUserActivityStore()

const weight = ref('')
const reps = ref('')
const duration = ref('')
const distance = ref('')
const showSuccess = ref(false)



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
const handleAddActivity = async () => {
  if (!model.value || !authState.currentUser) return
  
  isSaving.value = true
  try {
    // Find the name for the 'action' field
    const selectedEx = exercises.value.find(ex => ex.id === model.value)
    
await activityStore.addActivity({
  user_id: authState.currentUser.id, 
  exercise_id: model.value,     
  weight_lb: Number(weight.value), 
  reps: Number(reps.value),        
  durations_min: Number(duration.value),
  distance: Number(distance.value)
})
    showSuccess.value = true
    setTimeout(() => showSuccess.value = false, 3000)
    emit('added')
  } catch (error) {
    errorMessage.value = "Failed to add to log."
  } finally {
    isSaving.value = false
  }
}

onMounted(loadExercises)
</script>

<template>
  <div class="exercise-input-form box">
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
        <div class="field">
  <label class="label">Weight (lb)</label>
  <div class="control">
    <input v-model="weight" class="input" type="number">
  </div>
</div>

<div class="field">
  <label class="label">Reps</label>
  <div class="control">
    <input v-model="reps" class="input" type="number" >
  </div>
</div>
<div class="field">
  <label class="label">Duration (min)</label>
  <div class="control">
    <input v-model="duration" class="input" type="number">
  </div>
</div>
<div class="field">
  <label class="label">Distance (mi)</label>
  <div class="control">
    <input v-model="distance" class="input" type="number">
  </div>
</div>
      </div>
    </div>

    <div class="control mt-3">
      <button 
        class="button is-primary" 
        :class="{ 'is-loading': isSaving }"
        @click="handleAddActivity"
        :disabled="!model"
      >
        Add Exercise
      </button>
    </div> <!-- Added missing closing div for control -->

    <p v-if="isLoading" class="has-text-grey mt-2">Loading exercises...</p>
    <p v-if="errorMessage" class="has-text-danger mt-2">{{ errorMessage }}</p>
    <p v-if="selectedExerciseLabel" class="mt-3 has-text-grey">Selected: {{ selectedExerciseLabel }}</p>
    <p v-if="showSuccess" class="has-text-success mt-2">
      Exercise added successfully!
    </p>
  </div>
</template>
