<script setup lang="ts">
import { authState } from '../store/userData'
// Note: You will eventually want to import a store here to fetch 
// actual calculated totals (calories/distance) from the DB.
</script>

<template>
  <div class="section">
    <div class="container">
      
      <div v-if="authState.currentUser">
        <h1 class="title is-2 has-text-centered mb-6">Fitness Profile</h1>
        
        <p class="subtitle is-4 has-text-centered mb-6">
          Welcome back, 
          <span class="has-text-primary has-text-weight-bold">
            {{ authState.currentUser.firstName }} {{ authState.currentUser.lastName }}
          </span>!
        </p>
        
        <div class="columns is-multiline">
          <div class="column is-4">
            <div class="box hover-lift has-text-centered">
              <p class="heading">Current Weight</p>
              <p class="title is-4">{{ authState.currentUser.weight }} <small>lbs</small></p>
            </div>
          </div>

          <div class="column is-4">
            <div class="box hover-lift has-text-centered">
              <p class="heading">Height</p>
              <p class="title is-4">{{ authState.currentUser.height }} <small>inches</small></p>
            </div>
          </div>

          <div class="column is-4">
            <div class="box hover-lift has-text-centered">
              <p class="heading">Age</p>
              <p class="title is-4">{{ authState.currentUser.age }} <small>years</small></p>
            </div>
          </div>

          <div class="column is-12">
            <div class="box has-background-link-light has-text-centered py-6">
              <p class="heading is-size-5">Activity Summary</p>
              <p class="is-italic has-text-grey-light">
                Activity calculations (Calories/Distance) will sync from your workout logs.
              </p>
            </div>
          </div>
        </div>

        <div class="has-text-centered mt-5">
           <p class="is-size-7 has-text-grey">Member since: {{ new Date(authState.currentUser.created_at).toLocaleDateString() }}</p>
        </div>
      </div>

      <div v-else class="has-text-centered py-6">
        <div class="box has-background-warning-light">
          <p class="title">Please log in to view your statistics.</p>
          <p>We couldn't find an active session. Please select an account from the login page.</p>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.heading {
  margin-bottom: 0.5rem !important;
  color: #7a7a7a;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0,0,0,0.1);
}
</style>