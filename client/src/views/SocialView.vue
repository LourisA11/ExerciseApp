<script setup lang="ts">
import { authState } from '../store/userData'
import { computed, onMounted } from 'vue'
import { useUserActivityStore } from '../store/UserActivity'
import { loadExercises, exerciseState } from '../store/exerciseBank' 
import {usersState, loadUsers} from '../store/users'


const activityStore = useUserActivityStore()

const socialFeed = computed(() => {
  return activityStore.activities.map(activity => {
    const user = usersState.list.find(u => u.id === activity.user_id) //[cite: 11]
    const exercise = exerciseState.list.find(e => e.id === activity.exercise_id) //[cite: 15]
    
    return {
      ...activity,
      userName: user ? `${user.firstName} ${user.lastName}` : 'Someone',
      exerciseName: exercise ? exercise.name : 'an exercise'
    }
  })
})

onMounted(() => {
  loadExercises()
  loadUsers()
  activityStore.loadActivities()
})
</script>

<template>
  <div class="container p-4">
    <h1 class="title">Community Feed</h1>
    <div v-for="post in socialFeed" :key="post.id" class="box mb-4">
      <div class="media">
        <div class="media-content">
          <p><strong>{{ post.userName }}</strong> completed <strong>{{ post.exerciseName }}</strong></p>
          <p class="is-size-7 has-text-grey">{{ new Date(post.created_at).toLocaleString() }}</p>
          <div class="mt-2 tags">
             <span v-if="post.weight_lb" class="tag is-info is-light">{{ post.weight_lb }} lbs</span>
             <span v-if="post.reps" class="tag is-success is-light">{{ post.reps }} reps</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.heading {
  color: #7a7a7a;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 1px;
}

.border-top-primary {
  border-top: 4px solid #4f46e5;
}

.avatar-circle {
  background-color: #4f46e5;
  color: white;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
}
</style>