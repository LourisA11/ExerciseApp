<script setup lang="ts">
import { authState } from '../store/userData'

const addActivity = () => {
  alert("Add activity form would open here.")
}

const editActivity = (type: string) => {
  alert(`Editing activity: ${type}`)
}

const deleteActivity = (id: number) => {
  alert(`Deleting activity ID: ${id}`)
}
</script>

<template>
  <div class="section">
    <div v-if="authState.currentUser" class="container">
      <div class="level">
        <div class="level-left">
          <h1 class="title">Activities Overview</h1>
        </div>
        <div class="level-right">
          <button class="button is-primary" @click="addActivity">
            <span class="icon"><i class="fas fa-plus"></i></span>
            <span>Add Activity</span>
          </button>
        </div>
      </div>

      <div class="box">
        <h2 class="subtitle">Recent logs for <strong>{{ authState.currentUser.name }}</strong></h2>
        
        <table class="table is-fullwidth is-striped is-hoverable" v-if="authState.currentUser.activities.length">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Duration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="act in authState.currentUser.activities" :key="act.id">
              <td>{{ act.date }}</td>
              <td><span class="tag is-info is-light">{{ act.type }}</span></td>
              <td>{{ act.duration }} min</td>
              <td>
                <div class="buttons are-small">
                  <button class="button is-info is-light" @click="editActivity(act.type)">
                    <span class="icon"><i class="fas fa-edit"></i></span>
                  </button>
                  <button class="button is-danger is-light" @click="deleteActivity(act.id)">
                    <span class="icon"><i class="fas fa-trash"></i></span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else class="has-text-grey has-text-centered py-4">No activities recorded yet.</p>
      </div>
    </div>
    <div v-else class="container">
      <div class="notification is-warning">
        Please log in to see your activity logs.
      </div>
    </div>
  </div>
</template>

