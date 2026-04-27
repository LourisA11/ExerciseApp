<script setup lang="ts">
import { computed, ref } from 'vue'
import { authState } from '../store/userData'
import { addExerciseBank } from '../services/exerciseBankService'

const emit = defineEmits<{
  exerciseCreated: []
}>()

const name = ref('')
const type = ref('')
const isSaving = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const isAdmin = computed(() => {
  const user = authState.currentUser as Record<string, unknown> | null
  if (!user) return false
  return (
    user.role === 'admin' ||
    user.isAdmin === true ||
    user.userType === 'admin'
  )
})

const canSubmit = computed(() => {
  return isAdmin.value && name.value.trim().length > 0 && type.value.trim().length > 0 && !isSaving.value
})

const submitNewExercise = async () => {
  if (!canSubmit.value) return

  isSaving.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const response = await addExerciseBank({
      name: name.value.trim(),
      type: type.value.trim(),
    })

    if (!response.isSuccess) {
      errorMessage.value = response.message ?? 'Failed to create exercise.'
      return
    }

    successMessage.value = 'Exercise created.'
    name.value = ''
    type.value = ''
    emit('exerciseCreated')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to create exercise.'
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <section class="box">
    <h2 class="title is-5">Create Exercise (Admin)</h2>

    <p v-if="!isAdmin" class="has-text-danger">
      Admin access required.
    </p>

    <form v-else @submit.prevent="submitNewExercise">
      <div class="field">
        <label class="label">Exercise Name</label>
        <div class="control">
          <input v-model="name" class="input" type="text" placeholder="Bench Press" required />
        </div>
      </div>

      <div class="field">
        <label class="label">Type</label>
        <div class="control">
          <input v-model="type" class="input" type="text" placeholder="Strength" required />
        </div>
      </div>

      <p v-if="errorMessage" class="has-text-danger mb-3">{{ errorMessage }}</p>
      <p v-if="successMessage" class="has-text-success mb-3">{{ successMessage }}</p>

      <button class="button is-primary" :disabled="!canSubmit">
        {{ isSaving ? 'Saving...' : 'Add Exercise' }}
      </button>
    </form>
  </section>
</template>