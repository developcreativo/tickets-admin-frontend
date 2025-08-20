<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <div class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out"
         :class="{ '-translate-x-full': !sidebarOpen, 'translate-x-0': sidebarOpen }">
      <div class="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <h1 class="text-xl font-bold text-gray-900">Admin Dashboard</h1>
        <button @click="sidebarOpen = false" class="lg:hidden">
          <XMarkIcon class="w-6 h-6 text-gray-500" />
        </button>
      </div>
      
      <nav class="px-4 py-6 space-y-2">
        <router-link 
          v-for="item in navigation" 
          :key="item.name"
          :to="item.href"
          class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
          :class="[
            $route.path === item.href
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-700 hover:bg-gray-100'
          ]"
        >
          <component :is="item.icon" class="w-5 h-5 mr-3" />
          {{ item.name }}
        </router-link>
      </nav>
    </div>

    <!-- Main content -->
    <div class="lg:pl-64">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="flex items-center justify-between h-16 px-6">
          <div class="flex items-center">
            <button @click="sidebarOpen = true" class="lg:hidden mr-4">
              <Bars3Icon class="w-6 h-6 text-gray-500" />
            </button>
            <h2 class="text-lg font-medium text-gray-900">{{ currentPageTitle }}</h2>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Notifications -->
            <button class="p-2 text-gray-400 hover:text-gray-500">
              <BellIcon class="w-6 h-6" />
            </button>
            
            <!-- User menu -->
            <div class="relative">
              <button @click="userMenuOpen = !userMenuOpen" class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <span class="text-sm font-medium text-white">
                    {{ userInitials }}
                  </span>
                </div>
                <span class="text-sm font-medium text-gray-700">{{ authStore.user?.username }}</span>
                <ChevronDownIcon class="w-4 h-4 text-gray-400" />
              </button>
              
              <div v-if="userMenuOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                <button @click="goToSettings" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Configuración
                </button>
                <button @click="logout" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import {
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  ChevronDownIcon,
  HomeIcon,
  FolderIcon,
  UsersIcon,
  ChartBarIcon,
  Cog6ToothIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const sidebarOpen = ref(false)
const userMenuOpen = ref(false)

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Catálogos', href: '/catalog', icon: FolderIcon },
  { name: 'Usuarios', href: '/users', icon: UsersIcon },
  { name: 'Reportes', href: '/reports', icon: ChartBarIcon },
  { name: 'Configuración', href: '/settings', icon: Cog6ToothIcon },
]

const currentPageTitle = computed(() => {
  const currentNav = navigation.find(item => item.href === route.path)
  return currentNav?.name || 'Dashboard'
})

const userInitials = computed(() => {
  if (!authStore.user?.username) return 'U'
  return authStore.user.username.charAt(0).toUpperCase()
})

const goToSettings = () => {
  router.push('/settings')
  userMenuOpen.value = false
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}

// Cerrar sidebar en pantallas grandes
const handleResize = () => {
  if (window.innerWidth >= 1024) {
    sidebarOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
