<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { mockUsers, authState } from '../store/userData'
import NewExercise from '../components/NewExercise.vue'
import { getExerciseBank, updateExerciseBank, type ExerciseBankRow } from '../services/exerciseBankService'

const exerciseBank = ref<ExerciseBankRow[]>([])
const isLoadingExercises = ref(false)
const exerciseErrorMessage = ref('')
const exerciseSuccessMessage = ref('')
const editingExerciseId = ref<string | null>(null)
const editName = ref('')
const editType = ref('')
const isSavingEdit = ref(false)
const exerciseTypes = ['Strength', 'Cardio', 'Flexibility', 'Mobility', 'Balance', 'Sports']

const deleteUser = (id: number) => {
  // Not implemented, but UI ready
  console.log(`Delete user with ID: ${id} (Admin functionality)`)
}

const editUser = (name: string) => {
  console.log(`Edit user: ${name} (Admin functionality)`)
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

onMounted(loadExerciseBank)
</script>

<template>
  <div class="section">
    <div class="container">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <h1 class="title">Admin Dashboard</h1>
          </div>
        </div>
        <div class="level-right">
          
        </div>
      </div>

      <div v-if="authState.currentUser?.role !== 'admin'" class="notification is-danger">
        Access Denied. You must be an administrator to view this page.
      </div>

      <div v-else>
        <NewExercise @exercise-created="loadExerciseBank" />

        <div class="box">
          <h2 class="title is-5">Exercise Bank</h2>
          <p v-if="isLoadingExercises" class="has-text-grey">Loading exercises...</p>
          <p v-if="exerciseErrorMessage" class="has-text-danger">{{ exerciseErrorMessage }}</p>
          <p v-if="exerciseSuccessMessage" class="has-text-success">{{ exerciseSuccessMessage }}</p>

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
                  <template v-if="editingExerciseId === exercise.id">
                    <input v-model="editName" class="input" type="text" />
                  </template>
                  <template v-else>
                    {{ exercise.name }}
                  </template>
                </td>
                <td>
                  <template v-if="editingExerciseId === exercise.id">
                    <div class="select is-fullwidth">
                      <select v-model="editType">
                        <option v-for="exerciseType in exerciseTypes" :key="exerciseType" :value="exerciseType">
                          {{ exerciseType }}
                        </option>
                      </select>
                    </div>
                  </template>
                  <template v-else>
                    {{ exercise.type }}
                  </template>
                </td>
                <td>
                  <div class="buttons are-small">
                    <template v-if="editingExerciseId === exercise.id">
                      <button class="button is-primary is-light" :disabled="isSavingEdit" @click="saveEditExercise(exercise.id)">
                        Save
                      </button>
                      <button class="button is-light" :disabled="isSavingEdit" @click="cancelEditExercise">
                        Cancel
                      </button>
                    </template>
                    <template v-else>
                      <button class="button is-info is-light" @click="startEditExercise(exercise)">
                        <span class="icon"><i class="fas fa-edit"></i></span>
                      </button>
                    </template>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <p v-else-if="!isLoadingExercises" class="has-text-grey">No exercises found in the database.</p>
        </div>

        <div class="box">
          <div class="table-container admin-table-container">
            <table class="table is-fullwidth is-striped is-hoverable">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Activities</th>
                  <th>Calories</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in mockUsers" :key="user.id">
                  <td>{{ user.id }}</td>
                  <td><strong>{{ user.name }}</strong></td>
                  <td>
                    <span class="tag user-tag" :class="user.role === 'admin' ? 'is-danger' : 'is-info'">
                      {{ user.role }}
                    </span>
                  </td>

                  <td>{{ user.activities.length }}</td>
                  <td>{{ user.totalCalories }}</td>
                  <td>
                    <div class="buttons are-small">
                      <button class="button is-warning is-light" @click="editUser(user.name)">
                        <span class="icon"><i class="fas fa-edit"></i></span>
                      </button>
                      <button class="button is-danger is-light" @click="deleteUser(user.id)">
                        <span class="icon"><i class="fas fa-trash"></i></span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
