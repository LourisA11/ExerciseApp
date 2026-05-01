<script setup lang="ts">
import { onMounted } from 'vue'
import { authState } from '../store/userData'
import { useUserActivityStore } from '../store/UserActivity'
import UserExInputForm from '@/components/UserExInputForm.vue'
import QuickLogItem from '@/components/QuickLogItem.vue'
import { exerciseState } from '../store/exerciseBank'

const activityStore = useUserActivityStore()

const handleAddShortcut = () => {
  activityStore.shortcuts.push({
    id: Date.now(), 
    label: 'New Favorite',
    exercise_id: '',
    weight_lb: 0,
    reps: 0,
  })
}

onMounted(async () => {
    await exerciseState.load() 
    await activityStore.loadActivities()
})
</script>

<template>
  <div class="section">
    <div v-if="authState.currentUser">
      <div class="level">
        <h1 class="title">My Activities</h1>
        <button class="button is-primary" @click="handleAddShortcut">+ Add Quick Link</button>
      </div>

      <div class="columns is-multiline">
        <div v-for="s in activityStore.shortcuts" :key="s.id" class="column is-4">
          <QuickLogItem :config="s" />
        </div>
      </div>

      <UserExInputForm />

      <table class="table is-fullwidth mt-5">
        <tbody>
          <tr v-for="a in activityStore.activities" :key="a.id">
            <td>{{ a.exercise_id }}</td>
            <td>{{ a.weight_lb }} lbs</td>
            <td>{{ new Date(a.created_at).toLocaleDateString() }}</td>
            <td><button @click="activityStore.removeActivity(a.id)">Delete</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>