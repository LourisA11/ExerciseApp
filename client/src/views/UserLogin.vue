<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router' // To redirect after login
import useSessionStore from '../store/session'
import { api } from '../services/myFetch'
import { type User } from '../store/userData'

const sessionStore = useSessionStore()
const router = useRouter()
const isDropdownOpen = ref(false)
const users = ref<User[]>([]) 
const isLoading = ref(false)

const fetchUsers = async () => {
  isLoading.value = true
  try {
    // Note the change here: your API returns an object containing the array
    const response = await api<{ data: User[] }>('/users') 
    
    // We need to access response.data to get the actual array of users
    users.value = response.data || []
    
    console.log("Users loaded successfully:", users.value)
  } catch (err: unknown) {
    console.error('Fetch Error:', err)
  } finally {
    isLoading.value = false
  }
}


const selectAccount = (user: User) => {
  sessionStore.setUser(user)
  isDropdownOpen.value = false 
  // Redirect to home after logging in
  router.push('/')
}

onMounted(fetchUsers)
</script>

<template>
  <div class="login-page">
    <div class="box login-card">
      <h1 class="title has-text-centered">Welcome Back</h1>
      <p class="subtitle has-text-centered">Please select an account to continue</p>

      <div class="login-wrapper">
        <button @click="isDropdownOpen = !isDropdownOpen" class="button is-large is-fullwidth is-primary" :disabled="isLoading">
          <span>{{ isLoading ? 'Connecting...' : 'Select Account' }}</span>
          <span class="icon"><i class="fas fa-chevron-down"></i></span>
        </button>

        <ul v-if="isDropdownOpen" class="custom-dropdown">
          <li v-for="user in users" :key="user.id" @click="selectAccount(user)" class="custom-item">
            <div class="user-avatar">{{ user.firstName[0] }}</div>
            <div class="user-info">
              <span class="is-weight-bold">{{ user.firstName }} {{ user.lastName }}</span>
              <small>{{ user.role }}</small>
            </div>
          </li>
          <li v-if="users.length === 0 && !isLoading" class="p-4 has-text-centered">
            <p>No users found in database.</p>
            <button class="button is-small is-light mt-2" @click="fetchUsers">Retry</button>
          </li>
        </ul>
        <li v-for="user in users" :key="user.id" @click="selectAccount(user)" class="custom-item">
  <div class="user-avatar">{{ user.firstName?.[0] || '?' }}</div>
  <div class="user-info">
    <span class="is-weight-bold">{{ user.firstName }} {{ user.lastName }}</span>
    <small>{{ user.role }}</small>
  </div>
</li>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}
.login-card {
  width: 100%;
  max-width: 400px;
}
.login-wrapper { position: relative; }
.custom-dropdown {
  position: absolute;
  top: 105%;
  left: 0;
  width: 100%;
  background: white;
  border: 1px solid #dbdbdb;
  border-radius: 6px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  z-index: 50;
}
.custom-item {
  display: flex;
  padding: 12px;
  cursor: pointer;
  align-items: center;
}
.custom-item:hover { background: #f5f5f5; }
.user-avatar {
  background: #485fc7;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
}
.user-info { display: flex; flex-direction: column; }
</style>