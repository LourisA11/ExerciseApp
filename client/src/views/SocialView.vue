<script setup lang="ts">
import { authState } from '../store/userData'
import { useUserActivityStore } from '../store/UserActivity'
import { loadExercises, exerciseState } from '../store/exerciseBank' 
import {usersState, loadUsers} from '../store/users'
import { computed, onMounted, ref } from 'vue'
import { useInfiniteScroll } from '@vueuse/core'


const activityStore = useUserActivityStore()
const feedContainer = ref<HTMLElement | null>(null)

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
  activityStore.loadActivities(true)
})
useInfiniteScroll(
  feedContainer,
  async () => {
    await activityStore.loadActivities()
  },
  {
    distance: 200
  }
)
</script>

<template>
  <div ref="feedContainer" class="container p-4 social-scroll pb-6">

    <h1 class="title">Community Feed</h1>

    <!-- FEED -->
    <div v-for="post in socialFeed" :key="post.id" class="box mb-4">
      <div v-if="activityStore.loading">
        <div v-for="n in 3" :key="n" class="box mb-4">
          <div class="skeleton-line large mb-3"></div>
          <div class="skeleton-line mb-2"></div>
          <div class="skeleton-line short"></div>
        </div>
      </div>

      <div class="media">
        <div class="media-content">
          <p>
            <strong>{{ post.userName }}</strong>
            completed <strong>{{ post.exerciseName }}</strong>
          </p>

          <p class="is-size-7 has-text-grey">
            {{ new Date(post.created_at).toLocaleString() }}
          </p>

          <div class="mt-2 tags">
            <span v-if="post.weight_lb" class="tag is-info is-light">
              {{ post.weight_lb }} lbs
            </span>
            <span v-if="post.reps" class="tag is-success is-light">
              {{ post.reps }} reps
            </span>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="!activityStore.loading && socialFeed.length >= activityStore.count"
      class="has-text-centered p-4 has-text-grey"
    >
      No more activities to load
    </div>
  </div>

  <!-- FIXED COUNTER -->
  <div class="fixed-counter">
    Showing {{ socialFeed.length }} of {{ activityStore.count }} activities
  </div>
</template>