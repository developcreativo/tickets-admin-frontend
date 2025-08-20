import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useUsersStore = defineStore('users', () => {
    // Estados
    const users = ref([])
    const isLoading = ref(false)
    const error = ref(null)

    // Getters
    const activeUsers = computed(() => users.value.filter(user => user.is_active))
    const adminUsers = computed(() => users.value.filter(user => user.role === 'ADMIN'))
    const sellerUsers = computed(() => users.value.filter(user => user.role === 'SELLER'))
    const supervisorUsers = computed(() => users.value.filter(user => user.role === 'SUPERVISOR'))

    // Acciones
    const fetchUsers = async () => {
        try {
            isLoading.value = true
            error.value = null
            const response = await axios.get('/api/auth/users/')
            users.value = response.data
            console.log('Users fetched:', users.value)
        } catch (err) {
            console.error('Error fetching users:', err)
            error.value = 'Error al cargar los usuarios'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    // CRUD Operations para Usuarios
    const createUser = async (userData) => {
        try {
            isLoading.value = true
            error.value = null
            const response = await axios.post('/api/auth/users/', userData)
            users.value.push(response.data)
            return response.data
        } catch (err) {
            console.error('Error creating user:', err)
            if (err.response?.data?.username) {
                error.value = 'El nombre de usuario ya existe'
            } else if (err.response?.data?.email) {
                error.value = 'El email ya está registrado'
            } else {
                error.value = 'Error al crear el usuario'
            }
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const updateUser = async (id, userData) => {
        try {
            isLoading.value = true
            error.value = null
            const response = await axios.put(`/api/auth/users/${id}/`, userData)
            const index = users.value.findIndex(user => user.id === id)
            if (index !== -1) {
                users.value[index] = response.data
            }
            return response.data
        } catch (err) {
            console.error('Error updating user:', err)
            if (err.response?.data?.username) {
                error.value = 'El nombre de usuario ya existe'
            } else if (err.response?.data?.email) {
                error.value = 'El email ya está registrado'
            } else {
                error.value = 'Error al actualizar el usuario'
            }
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const deleteUser = async (id) => {
        try {
            isLoading.value = true
            error.value = null
            await axios.delete(`/api/auth/users/${id}/`)
            users.value = users.value.filter(user => user.id !== id)
        } catch (err) {
            console.error('Error deleting user:', err)
            error.value = 'Error al eliminar el usuario'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const toggleUserStatus = async (id) => {
        try {
            const user = users.value.find(u => u.id === id)
            if (!user) return

            const updatedData = { ...user, is_active: !user.is_active }
            await updateUser(id, updatedData)
        } catch (err) {
            console.error('Error toggling user status:', err)
            throw err
        }
    }

    // Funciones de utilidad
    const getUserById = (id) => {
        return users.value.find(user => user.id === id)
    }

    const getUsersByRole = (role) => {
        return users.value.filter(user => user.role === role)
    }

    const getUsersByZone = (zoneId) => {
        return users.value.filter(user => user.zone === zoneId)
    }

    // Limpiar errores
    const clearError = () => {
        error.value = null
    }

    return {
        // Estados
        users,
        isLoading,
        error,

        // Getters
        activeUsers,
        adminUsers,
        sellerUsers,
        supervisorUsers,

        // Acciones
        fetchUsers,
        createUser,
        updateUser,
        deleteUser,
        toggleUserStatus,
        getUserById,
        getUsersByRole,
        getUsersByZone,
        clearError
    }
})
