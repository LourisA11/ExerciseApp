<script setup lang="ts">
import { authState } from '../store/userdata'
</script>

<template>
  <div class="hero is-fullheight-with-navbar is-brand-pink">
    <div class="hero-body">
      <div class="container has-text-centered">
        <h1 class="title is-1 has-text-white">
          Home Page
        </h1>
        <h2 class="subtitle is-3 has-text-white">
          Start your fitness journey
        </h2>
        <div v-if="!authState.currentUser" class="mt-6">
          <p class="is-size-5">Please use the login menu in the navbar to begin.</p>
        </div>
        <div v-else class="mt-6">
          <p class="is-size-4">Welcome, {{ authState.currentUser.name }}!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero.is-brand-pink {
    background: linear-gradient(135deg, #ff5fa2 0%, #ff8fb1 100%) !important;
}

.title {
    text-transform: uppercase;
    letter-spacing: 2px;
}
</style>
