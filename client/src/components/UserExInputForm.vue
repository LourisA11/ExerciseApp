<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getExerciseBank, type ExerciseBankRow } from '../services/exerciseBankService'
import { useUserActivityStore } from '../store/UserActivity'

const emit = defineEmits<{'added': []}>()  
const model = defineModel<string>({ default: '' })
const exercises = ref<ExerciseBankRow[]>([])
const isLoading = ref(false)
const errorMessage = ref('')
const activityStore = useUserActivityStore()

// Input refs
const weight = ref('')
const reps = ref('')
const duration = ref('')
const distance = ref('')
const showSuccess = ref(false)

const loadExercises = async () => {
  isLoading.value = true
  try {
    const response = await getExerciseBank()
    exercises.value = response.isSuccess ? (response.data ?? []) : []
    if (!model.value && exercises.value.length) model.value = exercises.value[0]!.id
  } catch {
    errorMessage.value = 'Unable to load exercises.'
  } finally {
    isLoading.value = false
  }
}

const handleAddActivity = async () => {
  if (!model.value) return
  
  const payload = {
    exercise_id: model.value,
    weight_lb: Number(weight.value) || 0,
    reps: Number(reps.value) || 0,
    durations_min: Number(duration.value) || 0,
    distance: Number(distance.value) || 0
  }

  try {
    await activityStore.addActivity(payload)
    showSuccess.value = true // Now used
    emit('added')            // Now used
    setTimeout(() => showSuccess.value = false, 3000)
  } catch (err) {
    errorMessage.value = "Failed to add to log."
    console.error(err)
  }
}

onMounted(loadExercises)
</script>

<template>
  <div class="exercise-input-form box">
    <h2 class="title is-4">Add Exercise</h2>
    
    <div class="field">
      <div class="control">
        <div class="select is-fullwidth">
          <select v-model="model">
            <option v-for="ex in exercises" :key="ex.id" :value="ex.id">
              {{ ex.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <button class="button is-primary" @click="handleAddActivity">Add</button>
    <p v-if="showSuccess" class="has-text-success">Added!</p>
    <p v-if="errorMessage" class="has-text-danger">{{ errorMessage }}</p>
  </div>
</template>