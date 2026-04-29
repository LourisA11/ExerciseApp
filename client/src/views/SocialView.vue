<script setup lang="ts">
import { authState } from '../store/userData'
</script>

<template>
  <div class="section">
    <div class="container">
      <div v-if="authState.currentUser">
        <h1 class="title is-2 has-text-centered mb-6">Social Feed</h1>
        <p class="subtitle is-4 has-text-centered mb-6">See how your friends are doing!</p>

        <div class="columns is-centered">
          <div class="column is-8">
            <div class="box border-top-primary">
              <div class="media">
                <div class="media-left">
                  <figure class="image is-48x48">
                    <div class="avatar-circle">
                      {{ authState.currentUser.firstName?.charAt(0) }}
                    </div>
                  </figure>
                </div>
                <div class="media-content">
                  <div class="content">
                    <p>
                      <strong>{{ authState.currentUser.firstName }} {{ authState.currentUser.lastName }}</strong> 
                      <span class="tag is-info is-light ml-2">You</span>
                      <br>
                      <span class="has-text-grey is-size-7">Role: {{ authState.currentUser.role }}</span>
                    </p>
                  </div>
                </div>
              </div>

              <hr class="my-4">
              
              <nav class="level is-mobile">
                <div class="level-item has-text-centered">
                  <div>
                    <p class="heading">Weight</p>
                    <p class="title is-5">{{ authState.currentUser.weight }} <small class="is-size-7">lbs</small></p>
                  </div>
                </div>
                <div class="level-item has-text-centered">
                  <div>
                    <p class="heading">Height</p>
                    <p class="title is-5">{{ authState.currentUser.height }} <small class="is-size-7">in</small></p>
                  </div>
                </div>
                <div class="level-item has-text-centered">
                  <div>
                    <p class="heading">Age</p>
                    <p class="title is-5">{{ authState.currentUser.age }}</p>
                  </div>
                </div>
              </nav>

              <div class="message is-light mt-4">
                <div class="message-body is-size-7 has-text-centered">
                  <span class="icon mr-2"><i class="fas fa-sync-alt"></i></span>
                  Workout history for <strong>{{ authState.currentUser.firstName }}</strong> will appear here once synced from the database.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="has-text-centered py-6">
        <div class="box has-background-light">
          <p class="title">Please log in to view the social feed.</p>
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