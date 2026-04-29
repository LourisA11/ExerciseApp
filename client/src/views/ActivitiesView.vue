<script setup lang="ts">
import { onMounted } from 'vue'
import { authState } from '../store/userData'
import { activityStore } from '../store/UserActivity'
import AddNewExercise from '../components/AddNewExercise.vue'

onMounted(async () => {
  // Only fetch the bank if it's empty to save bandwidth
  if (activityStore.exerciseBank.value.length === 0) {
    await activityStore.loadExerciseBank()
  }
  await activityStore.loadActivities()
})
</script>

<template>
  <div class="section">
    <div v-if="authState.currentUser">
      <h1 class="title">Activities</h1>

      <AddNewExercise @added="activityStore.loadActivities" />

      <p v-if="activityStore.errorMessage.value" class="has-text-danger mt-3">
        {{ activityStore.errorMessage.value }}
      </p>

      <div v-if="activityStore.isLoading.value" class="has-text-centered mt-5">
        <button class="button is-loading is-text">Loading...</button>
      </div>

      <table v-else-if="activityStore.activities.value.length" class="table is-fullwidth mt-4">
        <thead>
          <tr>
            <th>Exercise</th>
            <th>Created</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="a in activityStore.activities.value" :key="a.id">
            <td>{{ activityStore.getExerciseLabel(a.exercise_id) }}</td>
            <td>{{ new Date(a.created_at).toLocaleDateString() }}</td>
            <td>
              <button 
                class="button is-small is-danger is-light" 
                @click="activityStore.deleteActivity(a.id)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else class="notification is-light mt-4">
        No activities logged yet. Start by adding one above!
      </div>
    </div>

    <div v-else class="has-text-centered py-6">
      <p class="title">Please log in to view your activities.</p>
    </div>
  </div>
</template>