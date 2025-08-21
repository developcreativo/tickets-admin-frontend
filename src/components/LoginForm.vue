<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
          <svg class="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Iniciar Sesión
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Accede a tu cuenta de administración
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="username" class="sr-only">Usuario</label>
            <input
              id="username"
              v-model="form.username"
              name="username"
              type="text"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 focus:z-10 sm:text-sm bg-white dark:bg-gray-800"
              placeholder="Usuario"
              :disabled="isLoading"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Contraseña</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 focus:z-10 sm:text-sm bg-white dark:bg-gray-800"
              placeholder="Contraseña"
              :disabled="isLoading"
            />
          </div>
        </div>

        <!-- Credenciales de prueba -->
        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-blue-800 dark:text-blue-200">
                Credenciales de Prueba
              </h3>
              <div class="mt-2 text-sm text-blue-700 dark:text-blue-300">
                <p><strong>Usuario:</strong> testuser</p>
                <p><strong>Contraseña:</strong> testpass123</p>
              </div>
              <div class="mt-2">
                <button
                  type="button"
                  @click="fillTestCredentials"
                  class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 underline"
                >
                  Usar credenciales de prueba
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Mensaje de error -->
        <div v-if="authStore.error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
                Error de Autenticación
              </h3>
              <div class="mt-2 text-sm text-red-700 dark:text-red-300">
                {{ authStore.error }}
              </div>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading || !form.username || !form.password"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <span v-if="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </span>
            <span v-else class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="h-5 w-5 text-blue-500 group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
            {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>
        </div>

        <!-- Información adicional -->
        <div class="text-center">
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Backend corriendo en: {{ apiBaseUrl }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Estado: {{ backendStatus }}
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const form = ref({
  username: '',
  password: ''
})

const isLoading = computed(() => authStore.isLoading)
const apiBaseUrl = computed(() => import.meta.env.VITE_API_BASE_URL || '/api')
const backendStatus = ref('Verificando...')

const handleSubmit = async () => {
  if (!form.value.username || !form.value.password) {
    return
  }

  const result = await authStore.login(form.value)
  
  if (result.success) {
    // El store maneja la redirección automáticamente
    console.log('Login exitoso')
  } else {
    console.error('Error en login:', result.error)
  }
}

const fillTestCredentials = () => {
  form.value.username = 'testuser'
  form.value.password = 'testpass123'
}

const checkBackendStatus = async () => {
  try {
    const response = await fetch(`${apiBaseUrl.value}/health/`)
    if (response.ok) {
      backendStatus.value = '✅ Conectado'
    } else {
      backendStatus.value = '⚠️ Error en respuesta'
    }
  } catch (error) {
    backendStatus.value = '❌ No conectado'
    console.error('Error checking backend status:', error)
  }
}

onMounted(() => {
  checkBackendStatus()
})
</script>
