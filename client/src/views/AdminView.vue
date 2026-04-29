<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { authState } from '../store/userData'
import NewExercise from '../components/NewExercise.vue'
import { getExerciseBank, updateExerciseBank, type ExerciseBankRow } from '../services/exerciseBankService'
import { api } from '../services/myFetch' // Import your API helper
import type { User } from '../store/userData' // Import the User interface we made

// Exercises State
const exerciseBank = ref<ExerciseBankRow[]>([])
const isLoadingExercises = ref(false)
const exerciseErrorMessage = ref('')
const exerciseSuccessMessage = ref('')
const editingExerciseId = ref<string | null>(null)
const editName = ref('')
const editType = ref('')
const isSavingEdit = ref(false)
const exerciseTypes = ['Strength', 'Cardio', 'Flexibility', 'Mobility', 'Balance', 'Sports']

// Users State (Real DB Users)
const dbUsers = ref<User[]>([])
const isLoadingUsers = ref(false)

const loadUsers = async () => {
  isLoadingUsers.value = true
  try {
    const data = await api<User[]>('/users')
    dbUsers.value = data || []
  } catch (error) {
    console.error('Failed to load users:', error)
  } finally {
    isLoadingUsers.value = false
  }
}

const startEditExercise = (exercise: ExerciseBankRow) => {
  editingExerciseId.value = exercise.id
  editName.value = exercise.name
  editType.value = exercise.type
  exerciseErrorMessage.value = ''
  exerciseSuccessMessage.value = ''
}

const cancelEditExercise = () => {
  editingExerciseId.value = null
  editName.value = ''
  editType.value = ''
}

const saveEditExercise = async (id: string) => {
  const nextName = editName.value.trim()
  const nextType = editType.value.trim()

  if (!nextName || !nextType) {
    exerciseErrorMessage.value = 'Name and type are required.'
    return
  }

  isSavingEdit.value = true
  exerciseErrorMessage.value = ''
  exerciseSuccessMessage.value = ''

  try {
    const response = await updateExerciseBank(id, {
      name: nextName,
      type: nextType,
    })

    if (!response.isSuccess) {
      exerciseErrorMessage.value = response.message ?? 'Unable to update exercise.'
      return
    }

    exerciseSuccessMessage.value = 'Exercise updated.'
    cancelEditExercise()
    await loadExerciseBank()
  } catch (error) {
    exerciseErrorMessage.value = error instanceof Error ? error.message : 'Unable to update exercise.'
  } finally {
    isSavingEdit.value = false
  }
}

const loadExerciseBank = async () => {
  isLoadingExercises.value = true
  exerciseErrorMessage.value = ''

  try {
    const response = await getExerciseBank()
    if (!response.isSuccess) {
      exerciseErrorMessage.value = response.message ?? 'Unable to load exercise bank.'
      exerciseBank.value = []
      return
    }

    exerciseBank.value = response.data ?? []
  } catch (error) {
    exerciseErrorMessage.value = error instanceof Error ? error.message : 'Unable to load exercise bank.'
    exerciseBank.value = []
  } finally {
    isLoadingExercises.value = false
  }
}

onMounted(() => {
  loadExerciseBank()
  loadUsers() // Fetch real users on mount
})
</script>

<template>
  <div class="section">
    <div class="container">
      <h1 class="title">Admin Dashboard</h1>

      <div v-if="authState.currentUser?.role !== 'admin'" class="notification is-danger">
        Access Denied. You must be an administrator to view this page.
      </div>

      <div v-else>
        <NewExercise @exercise-created="loadExerciseBank" />

        <div class="box">
          <h2 class="title is-5">Exercise Bank</h2>
          <table v-if="exerciseBank.length" class="table is-fullwidth is-striped is-hoverable">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="exercise in exerciseBank" :key="exercise.id">
                <td>
                  <input v-if="editingExerciseId === exercise.id" v-model="editName" class="input" type="text" />
                  <span v-else>{{ exercise.name }}</span>
                </td>
                <td>
                  <div v-if="editingExerciseId === exercise.id" class="select is-fullwidth">
                    <select v-model="editType">
                      <option v-for="t in exerciseTypes" :key="t" :value="t">{{ t }}</option>
                    </select>
                  </div>
                  <span v-else>{{ exercise.type }}</span>
                </td>
                <td>
                  <div class="buttons are-small">
                    <template v-if="editingExerciseId === exercise.id">
                      <button class="button is-primary" @click="saveEditExercise(exercise.id)">Save</button>
                      <button class="button is-light" @click="cancelEditExercise">Cancel</button>
                    </template>
                    <button v-else class="button is-info is-light" @click="startEditExercise(exercise)">
                      <span class="icon"><i class="fas fa-edit"></i></span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="box">
          <h2 class="title is-5">User Management</h2>
          <div class="table-container">
            <table class="table is-fullwidth is-striped is-hoverable">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in dbUsers" :key="user.id">
                  <td>{{ user.firstName }}</td>
                  <td>{{ user.lastName }}</td>
                  <td>{{ user.email }}</td>
                  <td>
                    <span class="tag" :class="user.role === 'admin' ? 'is-danger' : 'is-info'">
                      {{ user.role }}
                    </span>
                  </td>
                  <td>
                    <div class="buttons are-small">
                      <button class="button is-warning is-light"><i class="fas fa-edit"></i></button>
                      <button class="button is-danger is-light"><i class="fas fa-trash"></i></button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <p v-if="isLoadingUsers" class="has-text-grey has-text-centered">Syncing users from database...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>