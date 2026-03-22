<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { mockUsers, authState } from '../store/userdata';
import '../assets/style.css'

const isActive = ref(false);
const isLoginDropdownActive = ref(false);

const toggleMenu = () => {
    isActive.value = !isActive.value;
};

const selectAccount = (user: typeof mockUsers[number]) => {
  authState.currentUser = user;
  isLoginDropdownActive.value = false;
  isActive.value = false; // Close the mobile menu after selecting an account
};
</script>

<template>
    <nav class="navbar custom-navbar" role="navigation" aria-label="main navigation">
        <div class="container">
            <div class="navbar-brand">
                <RouterLink class="navbar-item" to="/">
                    <span class="icon is-large has-text-white">
                        <i class="fas fa-heart fa-2x"></i>
                    </span>
                </RouterLink>

                <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false"
                   @click="toggleMenu" :class="{ 'is-active': isActive }"
                   data-target="navbarBasicExample">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div id="navbarBasicExample" class="navbar-menu" :class="{ 'is-active': isActive }">
                <div class="navbar-start">
                    <RouterLink to="/" active-class="is-active" class="navbar-item" @click="isActive = false">
                        Home
                    </RouterLink>

                    <RouterLink to="/Activities" active-class="is-active" class="navbar-item" @click="isActive = false">
                        Activities
                    </RouterLink>

                    <RouterLink to="/Statistics" active-class="is-active" class="navbar-item" @click="isActive = false">
                        Stats
                    </RouterLink>

                    <RouterLink to="/Social" active-class="is-active" class="navbar-item" @click="isActive = false">
                        Social
                    </RouterLink>

                    <RouterLink v-if="authState.currentUser?.role === 'admin'" to="/Admin" active-class="is-active" class="navbar-item" @click="isActive = false">
                        Admin
                    </RouterLink>
                </div>

                <div class="navbar-end">
                    <div class="navbar-item has-dropdown is-right" :class="{ 'is-active': isLoginDropdownActive }">
                        <div class="buttons" v-if="!authState.currentUser">
                            <RouterLink to="/sign-up" active-class="is-active" class="button is-primary">
                                <strong>Sign up</strong>
                            </RouterLink>
                            <a class="button is-light" @click="isLoginDropdownActive = !isLoginDropdownActive">
                                Log in
                            </a>
                        </div>
                        <div v-else class="navbar-item">
                            <span>Welcome, {{ authState.currentUser.name }}</span>
                            <button class="button is-small is-danger is-light ml-2" @click="authState.currentUser = null">
                                Log out
                            </button>
                        </div>

                        <div class="navbar-dropdown" v-if="!authState.currentUser">
                            <a v-for="user in mockUsers" 
                               :key="user.id" 
                               class="navbar-item" 
                               @click="selectAccount(user)">
                                {{ user.name }} ({{ user.role }})
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<style scoped>
</style>