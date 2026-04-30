<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserActivityStore } from '../store/UserActivity'
import { authState } from '../store/userData'
import { exerciseState } from '../store/exerciseBank'
import { saveShortcut } from '../services/userShortcuts'

const props = defineProps<{
  config: {
    id: any;
    exercise_id: string;
    weight_lb: number;
    reps: number;
    label: string;
    durations_min?: number;
    distance?: number;
  }
}>()

const emit = defineEmits(['added', 'refresh'])
const activityStore = useUserActivityStore()

const isEditing = ref(false)
const isLogging = ref(false)
const showSuccess = ref(false)

// Local copy for editing to avoid mutating props directly
const editBuffer = ref({ ...props.config })

const exerciseName = computed(() => {
  // Check if list exists and is an array before calling .find()
  if (!exerciseState.list || !Array.isArray(exerciseState.list)) {
    return 'Loading...';
  }
  
  const found = exerciseState.list.find(e => e.id === props.config.exercise_id);
  return found ? found.name : 'Select Exercise';
});

const handleSaveEdit = async () => {
  try {
    const payload = { ...editBuffer.value, user_id: authState.currentUser?.id }
    
    // Convert empty strings to null for UUID compatibility
    if (!payload.exercise_id) payload.exercise_id = null;
    
    // Clean temporary IDs
    if (payload.id && payload.id > 1000000000000) delete payload.id;

    await saveShortcut(payload)
    isEditing.value = false
    emit('refresh') // Tell parent to reload data from DB
  } catch (err) {
    console.error("Update failed", err)
  }
}

const handleQuickLog = async () => {
  if (!authState.currentUser || !props.config.exercise_id) return
  
  isLogging.value = true
  try {
    await activityStore.addActivity({
      user_id: authState.currentUser.id,
      exercise_id: props.config.exercise_id,
      weight_lb: props.config.weight_lb || 0,
      reps: props.config.reps || 0,
      durations_min: props.config.durations_min || 0,
      distance: props.config.distance || 0,
      created_at: new Date().toISOString() 
    })
    
    showSuccess.value = true
    emit('added')
    setTimeout(() => showSuccess.value = false, 2000)
  } catch (err) {
    console.error("Quick log failed", err)
  } finally {
    isLogging.value = false
  }
}


</script>

<template>
  <div class="box has-background-white-bis">
    <div v-if="isEditing">
      <div class="field">
        <input v-model="editBuffer.label" class="input is-small" placeholder="Label">
      </div>
      
      <div class="field">
        <div class="select is-small is-fullwidth">
          <select v-model="editBuffer.exercise_id">
            <option value="">Select Exercise</option>
            <option v-for="ex in exerciseState.list" :key="ex.id" :value="ex.id">
        {{ ex.name }}
            </option>
          </select>
        </div>
      </div>

      <div class="columns is-mobile mb-0">
        <div class="column py-1"><input v-model.number="editBuffer.weight_lb" class="input is-small" type="number" placeholder="Lbs"></div>
        <div class="column py-1"><input v-model.number="editBuffer.reps" class="input is-small" type="number" placeholder="Reps"></div>
      </div>
      <div class="columns is-mobile mb-2">
        <div class="column py-1"><input v-model.number="editBuffer.durations_min" class="input is-small" type="number" placeholder="Min"></div>
        <div class="column py-1"><input v-model.number="editBuffer.distance" class="input is-small" type="number" placeholder="Dist"></div>
      </div>

      <div class="buttons">
        <button class="button is-success is-small is-fullwidth" @click="handleSaveEdit">Save</button>
        <button class="button is-light is-small is-fullwidth" @click="isEditing = false">Cancel</button>
      </div>
    </div>

    <div v-else>
      <div class="level is-mobile mb-2">
        <div class="level-left">
          <div>
            <p class="heading mb-0">{{ config.label || 'Unnamed' }}</p>
            <p class="title is-6">{{ exerciseName }}</p>
          </div>
        </div>
        <div class="level-right">
          <button class="button is-small is-ghost" @click="isEditing = true">
            <span class="icon"><i class="fas fa-edit"></i></span>
          </button>
        </div>
      </div>

      <div class="tags mb-3">
        <span v-if="config.weight_lb" class="tag is-dark">{{ config.weight_lb }} lbs</span>
        <span v-if="config.reps" class="tag is-primary">{{ config.reps }} reps</span>
        <span v-if="config.durations_min" class="tag is-info">{{ config.durations_min }}m</span>
        <span v-if="config.distance" class="tag is-link">{{ config.distance }}mi</span>
      </div>

      <button 
        class="button is-fullwidth" 
        :class="{ 'is-primary': !showSuccess, 'is-success': showSuccess, 'is-loading': isLogging }"
        @click="handleQuickLog"
        :disabled="!config.exercise_id || isLogging"
      >
        {{ showSuccess ? 'Logged!' : 'Log Now' }}
      </button>
    </div>
  </div>
</template>