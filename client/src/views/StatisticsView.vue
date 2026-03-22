<script setup lang="ts">
import { authState } from '../store/userdata'
</script>

<template>
  <div class="section">
    <div class="container">
      <div v-if="authState.currentUser">
        <h1 class="title is-2 has-text-centered mb-6">Fitness Statistics</h1>
        <p class="subtitle is-4 has-text-centered mb-6">Welcome back, <span class="has-text-primary has-text-weight-bold">{{ authState.currentUser.name }}</span>!</p>
        
        <!-- Stats Grid -->
        <div class="columns is-multiline">
          <!-- Calories Card -->
          <div class="column is-12">
            <div class="box has-background-primary-light has-text-centered py-6">
              <p class="heading is-size-5">Total Calories Burned</p>
              <p class="title is-1 has-text-primary">{{ authState.currentUser.totalCalories.toLocaleString() }} <span class="is-size-4">kcal</span></p>
            </div>
          </div>

          <!-- Mini Stats -->
          <div class="column is-3">
            <div class="box hover-lift has-text-centered h-100">
              <span class="icon is-large has-text-info">
                <i class="fas fa-road fa-2x"></i>
              </span>
              <p class="heading">Total Distance</p>
              <p class="title is-4">{{ authState.currentUser.stats.totalDistance }} <small>miles</small></p>
            </div>
          </div>

          <div class="column is-3">
            <div class="box hover-lift has-text-centered h-100">
              <span class="icon is-large has-text-success">
                <i class="fas fa-calendar-check fa-2x"></i>
              </span>
              <p class="heading">Workouts</p>
              <p class="title is-4">{{ authState.currentUser.stats.workoutsThisMonth }} <small>this month</small></p>
            </div>
          </div>

          <div class="column is-3">
            <div class="box hover-lift has-text-centered h-100">
              <span class="icon is-large has-text-warning">
                <i class="fas fa-weight fa-2x"></i>
              </span>
              <p class="heading">Current Weight</p>
              <p class="title is-4">{{ authState.currentUser.stats.weight }} <small>lbs</small></p>
            </div>
          </div>

          <div class="column is-3">
            <div class="box hover-lift has-text-centered h-100">
              <span class="icon is-large has-text-danger">
                <i class="fas fa-arrows-alt-v fa-2x"></i>
              </span>
              <p class="heading">Height</p>
              <p class="title is-4">{{ authState.currentUser.stats.height }} <small>inches</small></p>
            </div>
          </div>
        </div>
      </div>


      <div v-else class="hero is-medium is-light is-rounded">
        <div class="hero-body has-text-centered">
          <p class="title">Statistics Dashboard</p>
          <p class="subtitle">Please log in to see your personalized fitness data.</p>
          <span class="icon is-large">
            <i class="fas fa-lock fa-3x"></i>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.h-100 {
  height: 100%;
}

.heading {
  margin-bottom: 0.5rem !important;
  color: #7a7a7a;
  letter-spacing: 1px;
}
</style>
