<script setup lang="ts">
import { mockUsers, authState } from '../store/userData'
</script>

<template>
  <div class="section">
    <div class="container">
      <h1 class="title">Social Feed</h1>
      <p class="subtitle">See how your friends are doing!</p>

      <div class="columns is-multiline">
        <div v-for="user in mockUsers" :key="user.id" class="column is-12">
          <div class="box hover-lift" :class="{ 'has-background-link-light': user.id === authState.currentUser?.id }">
            <div class="media">
              <div class="media-left">
                <figure class="image is-48x48">
                  <div class="is-rounded has-background-primary has-text-white has-text-centered avatar-round" style="width: 48px; height: 48px;">
                    {{ user.name.charAt(0) }}
                  </div>
                </figure>
              </div>
              <div class="media-content">
                <div class="content">
                  <p>
                    <strong>{{ user.name }}</strong> 
                    <small v-if="user.id === authState.currentUser?.id" class="tag is-info is-light ml-2">You</small>
                    <br>
                    <span class="has-text-grey">Role: {{ user.role }}</span>
                  </p>
                </div>
                
                <nav class="level is-mobile">
                  <div class="level-item has-text-centered">
                    <div>
                      <p class="heading">Activities</p>
                      <p class="title is-5">{{ user.activities.length }}</p>
                    </div>
                  </div>
                  <div class="level-item has-text-centered">
                    <div>
                      <p class="heading">Calories</p>
                      <p class="title is-5">{{ user.totalCalories }}</p>
                    </div>
                  </div>
                  <div class="level-item has-text-centered">
                    <div>
                      <p class="heading">Workouts</p>
                      <p class="title is-5">{{ user.stats.workoutsThisMonth }}</p>
                    </div>
                  </div>
                  <div class="level-item has-text-centered">
                    <div>
                      <p class="heading">Distance</p>
                      <p class="title is-5">{{ user.stats.totalDistance }} mi</p>
                    </div>
                  </div>
                </nav>

                <div v-if="user.activities && user.activities[0]" class="mt-3">
                  <p class="is-size-7 has-text-weight-bold">Recent Activity:</p>
                  <span class="tag is-success is-light">
                    {{ user.activities[0].type }} - {{ user.activities[0].duration }} mins
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
