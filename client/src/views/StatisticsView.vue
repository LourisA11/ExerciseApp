<script setup lang="ts">
import { authState } from '../store/userData'
import { computed, onMounted } from 'vue'
import { useUserActivityStore } from '../store/UserActivity'
import { exerciseState, loadExercises } from '../store/exerciseBank'


const activityStore = useUserActivityStore()

const myExercises = computed(() => {
  const currentId = authState.currentUser?.id
  return activityStore.activities
    .filter(a => String(a.user_id) === String(currentId))
    .map(activity => {
      const exercise = exerciseState.list.find(e => e.id === activity.exercise_id)
      return {
        ...activity,
        exerciseName: exercise ? exercise.name : 'Unknown Exercise',
        exerciseType: exercise ? exercise.type : ''
      }
    })
})


const confirmDelete = async (id: number) => {
    try {
      await activityStore.removeActivity(id)
    } catch (err) {
      alert("Could not delete activity. Please try again.")
    }
  }


onMounted(() => {
   loadExercises()
  activityStore.loadActivities()
})

</script>

<template>
  <div class="container p-4">
    <h1 class="title">My Progress</h1>
    <div v-for="ex in myExercises" :key="ex.id" class="box border-left-blue">
      <div class="is-flex is-justify-content-space-between">
        <button 
        class="delete is-medium is-pulled-right" 
        @click="confirmDelete(ex.id)"
        title="Delete this log"
      ></button>
        <h3 class="has-text-weight-bold">{{ ex.exerciseName }}</h3>
        <span class="tag is-light">{{ ex.exerciseType }}</span>
      </div>
      <p class="is-size-6 mt-2">
        {{ ex.weight_lb }} lbs × {{ ex.reps }} reps
        <span v-if="ex.durations_min"> | {{ ex.durations_min }} mins</span>
        <span v-if="ex.distance"> | {{ ex.distance }} mi</span>
      </p>
    </div>
  </div>
</template>

