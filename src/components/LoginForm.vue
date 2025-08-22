<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <div class="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
          <TicketIcon class="h-8 w-8 text-white" />
        </div>
        <h2 class="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Inicia sesión para acceder al panel de administración
        </p>
      </div>
      
      <!-- Login Form -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
        <form class="space-y-6" @submit.prevent="handleLogin" novalidate>
          <!-- Username Input -->
          <BaseInput
            v-model="credentials.username"
            label="Usuario"
            type="text"
            placeholder="Ingresa tu usuario"
            :left-icon="UserIcon"
            :disabled="authStore.isLoading"
            :error-message="errors.username"
            :required="false"
            @blur="validateUsername"
            @input="clearError('username')"
          />
          
          <!-- Password Input -->
          <BaseInput
            v-model="credentials.password"
            label="Contraseña"
            type="password"
            placeholder="Ingresa tu contraseña"
            :left-icon="LockClosedIcon"
            :disabled="authStore.isLoading"
            :error-message="errors.password"
            :show-password-toggle="true"
            :required="false"
            @blur="validatePassword"
            @input="clearError('password')"
          />

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="rememberMe"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Recordarme
              </label>
            </div>
            <div class="text-sm">
              <a href="#" class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <div class="flex">
              <ExclamationTriangleIcon class="w-5 h-5 text-red-400 flex-shrink-0" />
              <div class="ml-3">
                <p class="text-sm text-red-800 dark:text-red-200">{{ error }}</p>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              :disabled="authStore.isLoading || !isFormValid"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <span v-if="authStore.isLoading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Iniciando sesión...
              </span>
              <span v-else class="flex items-center">
                <LockOpenIcon class="w-5 h-5 mr-2" />
                Iniciar sesión
              </span>
            </button>
          </div>
        </form>

        <!-- Demo Credentials -->
        <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <div class="flex items-center">
            <InformationCircleIcon class="w-5 h-5 text-blue-400 flex-shrink-0" />
            <div class="ml-3">
              <p class="text-sm font-medium text-blue-800 dark:text-blue-200">
                Credenciales de prueba
              </p>
              <p class="text-xs text-blue-600 dark:text-blue-300 mt-1">
                Usuario: <span class="font-mono">admin</span> | Contraseña: <span class="font-mono">admin1234</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Quick Login Buttons -->
        <div class="mt-4 space-y-2">
          <button
            type="button"
            @click="fillDemoCredentials"
            class="w-full text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            :disabled="authStore.isLoading"
          >
            Usar credenciales de demo
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import BaseInput from './ui/BaseInput.vue'
import { 
  TicketIcon, 
  ExclamationTriangleIcon,
  UserIcon,
  LockClosedIcon,
  LockOpenIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const router = useRouter()

const credentials = ref({
  username: '',
  password: ''
})

const errors = ref({
  username: '',
  password: ''
})

const error = ref('')
const rememberMe = ref(false)

// Computed properties for validation
const isFormValid = computed(() => {
  return credentials.value.username && credentials.value.password && 
         !errors.value.username && !errors.value.password
})

// Validation functions
const validateUsername = () => {
  if (!credentials.value.username) {
    errors.value.username = 'El usuario es requerido'
  } else if (credentials.value.username.length < 3) {
    errors.value.username = 'El usuario debe tener al menos 3 caracteres'
  } else {
    errors.value.username = ''
  }
}

const validatePassword = () => {
  if (!credentials.value.password) {
    errors.value.password = 'La contraseña es requerida'
  } else if (credentials.value.password.length < 6) {
    errors.value.password = 'La contraseña debe tener al menos 6 caracteres'
  } else {
    errors.value.password = ''
  }
}

const clearError = (field) => {
  errors.value[field] = ''
  error.value = ''
}

const fillDemoCredentials = () => {
  credentials.value = {
    username: 'admin',
    password: 'admin1234'
  }
  errors.value = { username: '', password: '' }
  error.value = ''
  
  // Validar automáticamente después de llenar las credenciales
  setTimeout(() => {
    validateUsername()
    validatePassword()
  }, 100)
}

const handleLogin = async () => {
  // Clear previous errors
  error.value = ''
  errors.value = { username: '', password: '' }
  
  // Validate form
  validateUsername()
  validatePassword()
  
  // Check if form is valid after validation
  if (!credentials.value.username || !credentials.value.password) {
    return
  }
  
  if (errors.value.username || errors.value.password) {
    return
  }
  
  console.log('Attempting login with:', credentials.value)
  const result = await authStore.login(credentials.value)
  
  console.log('Login result:', result)
  
  if (!result.success) {
    error.value = result.error || 'Error al iniciar sesión'
  } else {
    console.log('Login successful, redirecting...')
    // Store remember me preference
    if (rememberMe.value) {
      localStorage.setItem('rememberMe', 'true')
    }
    
    // Redirigir al dashboard después del login exitoso
    try {
      // Pequeño delay para asegurar que el store se actualice
      await new Promise(resolve => setTimeout(resolve, 100))
      await router.push('/')
      console.log('Redirected to dashboard successfully')
    } catch (routerError) {
      console.error('Router error:', routerError)
      // Fallback: usar window.location si el router falla
      setTimeout(() => {
        window.location.href = '/'
      }, 200)
    }
  }
}
</script>
