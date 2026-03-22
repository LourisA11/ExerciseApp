<script setup lang="ts">
import { mockUsers, authState } from '../store/userData'



</script>

<template>
  <div class="section">
    <div class="container">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <h1 class="title">Admin Dashboard</h1>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
          </div>
        </div>
      </div>

      <div v-if="authState.currentUser?.role !== 'admin'" class="notification is-danger">
        Access Denied. You must be an administrator to view this page.
      </div>

      <div v-else class="box">
        <div class="table-container admin-table-container">
          <table class="table is-fullwidth is-striped is-hoverable">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Role</th>
                <th>Activities</th>
                <th>Calories</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in mockUsers" :key="user.id">
                <td>{{ user.id }}</td>
                <td><strong>{{ user.name }}</strong></td>
                <td>
                  <span class="tag user-tag" :class="user.role === 'admin' ? 'is-danger' : 'is-info'">
                    {{ user.role }}
                  </span>
                </td>

                <td>{{ user.activities.length }}</td>
                <td>{{ user.totalCalories }}</td>
                <td>
                  <div class="buttons are-small">
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
