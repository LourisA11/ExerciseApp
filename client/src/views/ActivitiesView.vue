<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { authState } from '../store/userData'
import { useUserActivityStore } from '../store/UserActivity'
import UserExInputForm from '@/components/UserExInputForm.vue'

const activityStore = useUserActivityStore() 

const myActivities = computed(() => {
  const currentId = authState.currentUser?.id;
  if (!currentId) return [];

  return activityStore.activities.filter(a => {
    // Supabase usually returns 'userId' or 'user_id' based on your table schema
    const activityId = a.userId; 
    return String(activityId) === String(currentId);
  });
})

onMounted(async () => {
  if (activityStore.loadExerciseBank) {
    await activityStore.loadExerciseBank()
  }
  await activityStore.loadActivities()
})


</script>

<template>
  <div class="section">
    <div v-if="authState.currentUser">
      <h1 class="title">Activities</h1>

      <UserExInputForm @added="activityStore.loadActivities" />

      <p v-if="activityStore.error" class="has-text-danger mt-3">
        {{ activityStore.error }}
      </p>

      <div v-if="activityStore.loading" class="has-text-centered mt-5">
        <button class="button is-loading is-text">Loading...</button>
      </div>

      <table v-else-if="myActivities.length" class="table is-fullwidth mt-4">
        <thead>
          <tr>
            <th>Exercise</th>
            <th>Created</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="a in activityStore.activities" :key="a.id">
            <td>{{ a.action }}</td>
            <td>{{ new Date(a.createdAt).toLocaleDateString() }}</td>
            <td>
              <button 
                class="button is-small is-danger is-light" 
                @click="activityStore.removeActivity(a.id)"
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