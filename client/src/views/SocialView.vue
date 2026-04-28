<script setup lang="ts">
import { authState } from '../store/userData'
</script>

<template>
  <div class="section">
    <div class="container">
      <div v-if="authState.currentUser">
        <h1 class="title is-2 has-text-centered mb-6">Social Feed</h1>
        <p class="subtitle is-2 has-text-centered mb-6">See how your friends are doing!</p>

        <div class="columns is-centered">
          <div class="column is-8">
            <div class="box">
              <div class="media-content">
                <div class="content">
                  <p>
                    <strong>{{ authState.currentUser.name }}</strong> 
                    <span class="tag is-info is-light ml-2">You</span>
                    <br>
                    <span class="has-text-grey">Role: {{ authState.currentUser.role }}</span>
                  </p>
                </div>
                
                <nav class="level is-mobile">
                  <div class="level-item has-text-centered">
                    <div>
                      <p class="heading">Activities</p>
                      <p class="title is-5">{{ authState.currentUser.activities?.length || 0 }}</p>
                    </div>
                  </div>
                  <div class="level-item has-text-centered">
                    <div>
                      <p class="heading">Calories</p>
                      <p class="title is-5">{{ authState.currentUser.totalCalories || 0 }}</p>
                    </div>
                  </div>
                  <div class="level-item has-text-centered">
                    <div>
                      <p class="heading">Workouts</p>
                      <p class="title is-5">{{ authState.currentUser.stats?.workoutsThisMonth || 0 }}</p>
                    </div>
                  </div>
                  <div class="level-item has-text-centered">
                    <div>
                      <p class="heading">Distance</p>
                      <p class="title is-5">{{ authState.currentUser.stats?.totalDistance || 0 }} mi</p>
                    </div>
                  </div>
                </nav>

               <div v-if="authState.currentUser.activities?.length" class="mt-3">
                <p class="is-size-7 has-text-weight-bold">Your Recent Activity:</p>
                <span class="tag is-success is-light">
                   {{ authState.currentUser.activities[0]?.type }} — 
                {{ authState.currentUser.activities[0]?.duration }} mins
              </span>
            </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="has-text-centered py-6">
        <p class="title">Please log in to view the social feed.</p>
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
</style>