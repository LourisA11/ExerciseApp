<script setup lang="ts">
import { ref } from 'vue'
import { mockUsers, authState } from '../store/userData'

const isDropdownOpen = ref(false)

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const selectAccount = (user: (typeof mockUsers)[number]) => {
  authState.currentUser = user
  isDropdownOpen.value = false 
  
  console.log(`Logged in as ${user.name}! Now you can navigate to other pages.`)
}
</script>

<template>
  <div class="page-container">
    <div class="login-wrapper">
      <button @click="toggleDropdown" class="trigger-btn">
        <span>Login / Select Account</span>
        <span class="chevron" :class="{ 'rotate': isDropdownOpen }">▼</span>
      </button>

      <ul v-if="isDropdownOpen" class="dropdown-menu">
        <li 
          v-for="user in mockUsers" 
          :key="user.id" 
          @click="selectAccount(user)"
          class="dropdown-item"
        >
          <div class="avatar">{{ user.name.charAt(0) }}</div>
          <div class="user-details">
            <span class="username">{{ user.name }}</span>
            <span class="user-role">{{ user.role }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>

.page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f6f9;
}


.login-wrapper {
  position: relative;
  width: 100%;
  max-width: 350px;
}

.trigger-btn {
  width: 100%;
  padding: 1rem;
  background-color: #4f46e5; /* Indigo */
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.chevron {
  font-size: 0.8rem;
  transition: transform 0.2s ease;
}

.rotate {
  transform: rotate(180deg);
}


.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px); 
  left: 0;
  width: 100%;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 50; 
  list-style: none;
  padding: 0;
  margin: 0;
  overflow: hidden;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f1f5f9;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background-color: #f8fafc;
}

.avatar {
  background-color: #6366f1;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  margin-right: 0.75rem;
  font-size: 0.85rem;
}

.user-details {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.username {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.95rem;
}

.user-role {
  font-size: 0.75rem;
  color: #64748b;
  text-transform: capitalize;
}
</style>