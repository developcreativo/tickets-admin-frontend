import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../utils/api'

// Base URL provista por Vite en utils/api

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const token = ref(localStorage.getItem('token') || null)
    const isLoading = ref(false)
    const error = ref(null)

    // Token se adjunta vía interceptor en utils/api

    const isAuthenticated = computed(() => {
        // No considerar autenticado hasta que se complete la inicialización
        if (!isInitialized.value) {
            console.log('Auth not yet initialized')
            return false
        }

        const authenticated = !!token.value && !!user.value
        console.log('Checking authentication:', { token: !!token.value, user: !!user.value, authenticated, initialized: isInitialized.value })
        return authenticated
    })

    const login = async (credentials) => {
        try {
            isLoading.value = true
            error.value = null
            console.log('Starting login process...')

            // Hacer petición real al backend
            const response = await api.post('/auth/token/', {
                username: credentials.username,
                password: credentials.password
            })

            const { access, refresh } = response.data
            console.log('Token received from backend')

            // Guardar tokens
            token.value = access
            localStorage.setItem('token', access)
            localStorage.setItem('refreshToken', refresh)

            // Configurar axios con el nuevo token
            // Se adjunta por interceptor en peticiones futuras

            // Obtener información del usuario
            await fetchUser()

            console.log('Login successful:', { token: !!token.value, user: !!user.value, userData: user.value })

            return { success: true }
        } catch (error) {
            console.error('Error de login:', error)
            let errorMessage = 'Error de autenticación'

            if (error.response?.status === 401) {
                errorMessage = 'Credenciales inválidas'
            } else if (error.response?.data?.detail) {
                errorMessage = error.response.data.detail
            } else if (error.code === 'NETWORK_ERROR') {
                errorMessage = 'No se puede conectar al servidor. Verifica que el backend esté ejecutándose.'
            }

            // Guardar el error en el store
            error.value = errorMessage

            return {
                success: false,
                error: errorMessage
            }
        } finally {
            isLoading.value = false
        }
    }

    const fetchUser = async () => {
        try {
            console.log('Fetching user data...')
            const response = await api.get('/auth/me/')
            user.value = response.data
            localStorage.setItem('user', JSON.stringify(response.data))
            console.log('User data fetched successfully:', response.data)
            return response.data
        } catch (error) {
            console.error('Error obteniendo usuario:', error)
            if (error.response?.status === 401) {
                // Token inválido, hacer logout
                logout()
                throw new Error('Token inválido o expirado')
            }
            throw error
        }
    }

    const logout = () => {
        console.log('Logging out...')
        user.value = null
        token.value = null
        error.value = null
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        // El interceptor omitirá Authorization si no hay token
    }

    const refreshToken = async () => {
        try {
            const refresh = localStorage.getItem('refreshToken')
            if (!refresh) {
                logout()
                return false
            }

            const response = await api.post('/auth/token/refresh/', {
                refresh
            })

            const { access } = response.data
            token.value = access
            localStorage.setItem('token', access)
            // Se adjunta por interceptor

            return true
        } catch (error) {
            console.error('Error refrescando token:', error)
            logout()
            return false
        }
    }

    // Estado de inicialización
    const isInitialized = ref(false)

    // Verificar token al inicializar
    const initializeAuth = async () => {
        try {
            if (token.value) {
                console.log('Initializing auth with existing token')
                await fetchUser()
            } else {
                console.log('No existing token found')
            }
        } catch (error) {
            console.error('Error during auth initialization:', error)
            // Si hay error durante la inicialización, limpiar estado
            logout()
        } finally {
            isInitialized.value = true
        }
    }

    // Inicializar inmediatamente
    initializeAuth()

    // Limpiar error
    const clearError = () => {
        error.value = null
    }

    return {
        user,
        token,
        isLoading,
        error,
        isAuthenticated,
        isInitialized,
        login,
        logout,
        fetchUser,
        refreshToken,
        clearError
    }
})
