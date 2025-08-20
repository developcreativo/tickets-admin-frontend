<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <AdminLayout v-if="isAuthenticated" />
    <LoginView v-else />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from './stores/auth'
import AdminLayout from './components/layout/AdminLayout.vue'
import LoginView from './views/LoginView.vue'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
</script>
