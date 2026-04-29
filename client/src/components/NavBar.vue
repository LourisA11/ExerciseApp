<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { authState } from '../store/userData';
import useSessionStore from '../store/session';
import { api } from '../services/myFetch';
import type { User } from '../store/userData';
import '../assets/style.css'

const sessionStore = useSessionStore();
const isActive = ref(false); // Mobile burger menu
const isLoginDropdownActive = ref(false); // Login dropdown
const dbUsers = ref<User[]>([]);

const toggleMenu = () => {
    isActive.value = !isActive.value;
};

const toggleLogin = () => {
    isLoginDropdownActive.value = !isLoginDropdownActive.value;
};

const selectAccount = (user: User) => {
    sessionStore.setUser(user);
    isLoginDropdownActive.value = false;
    isActive.value = false;
};

const fetchUsers = async () => {
    try {
        const data = await api<User[]>('/users');
        dbUsers.value = data || [];
    } catch (err) {
        console.error('Navbar Login Error:', err);
    }
};

onMounted(fetchUsers);
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

                <a role="button" class="navbar-burger" @click="toggleMenu" :class="{ 'is-active': isActive }">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div class="navbar-menu" :class="{ 'is-active': isActive }">
                <div class="navbar-start">
                    <RouterLink to="/" class="navbar-item">Home</RouterLink>
                    <RouterLink to="/Activities" class="navbar-item">Activities</RouterLink>
                    <RouterLink to="/Statistics" class="navbar-item">Stats</RouterLink>
                    <RouterLink to="/Social" class="navbar-item">Social</RouterLink>
                    <RouterLink v-if="authState.currentUser?.role === 'admin'" to="/Admin" class="navbar-item">Admin</RouterLink>
                </div>

                <div class="navbar-end">
                    <div class="navbar-item has-dropdown is-right" :class="{ 'is-active': isLoginDropdownActive }">
                        
                        <div v-if="!authState.currentUser" class="buttons">
                            <a class="button is-light" @click="toggleLogin">
                                Log in
                            </a>
                        </div>

                        <div v-else class="navbar-item">
                            <span class="has-text-white mr-2">Hi, {{ authState.currentUser.firstName }}</span>
                            <button class="button is-small is-danger is-light" @click="sessionStore.clearUser()">
                                Log out
                            </button>
                        </div>

                        <div class="navbar-dropdown" v-if="!authState.currentUser">
                            <a v-for="user in dbUsers" 
                               :key="user.id" 
                               class="navbar-item" 
                               @click="selectAccount(user)">
                                {{ user.firstName }} {{ user.lastName }} ({{ user.role }})
                            </a>
                            <hr class="navbar-divider">
                            <div v-if="dbUsers.length === 0" class="navbar-item has-text-grey">
                                No users in DB
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>