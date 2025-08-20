import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const token = ref(localStorage.getItem('token') || null)
    const isLoading = ref(false)

    // Configurar axios con token
    if (token.value) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
    }

    const isAuthenticated = computed(() => !!token.value && !!user.value)

    const login = async (credentials) => {
        try {
            isLoading.value = true
            const response = await axios.post('/api/auth/token/', credentials)

            const { access, refresh } = response.data
            token.value = access
            localStorage.setItem('token', access)
            localStorage.setItem('refreshToken', refresh)

            axios.defaults.headers.common['Authorization'] = `Bearer ${access}`

            // Obtener información del usuario
            await fetchUser()

            return { success: true }
        } catch (error) {
            console.error('Error de login:', error)
            return {
                success: false,
                error: error.response?.data?.detail || 'Error de autenticación'
            }
        } finally {
            isLoading.value = false
        }
    }

    const fetchUser = async () => {
        try {
            const response = await axios.get('/api/auth/me/')
            user.value = response.data
        } catch (error) {
            console.error('Error obteniendo usuario:', error)
            logout()
        }
    }

    const logout = () => {
        user.value = null
        token.value = null
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        delete axios.defaults.headers.common['Authorization']
    }

    const refreshToken = async () => {
        try {
            const refresh = localStorage.getItem('refreshToken')
            if (!refresh) {
                logout()
                return false
            }

            const response = await axios.post('/api/auth/token/refresh/', {
                refresh
            })

            const { access } = response.data
            token.value = access
            localStorage.setItem('token', access)
            axios.defaults.headers.common['Authorization'] = `Bearer ${access}`

            return true
        } catch (error) {
            console.error('Error refrescando token:', error)
            logout()
            return false
        }
    }

    // Verificar token al inicializar
    if (token.value) {
        fetchUser()
    }

    return {
        user,
        token,
        isLoading,
        isAuthenticated,
        login,
        logout,
        fetchUser,
        refreshToken
    }
})
