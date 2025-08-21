<template>
  <div class="users-view min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">Gestión de Usuarios</h1>
        <button 
          @click="showAddModal = true"
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Agregar Usuario
        </button>
      </div>

      <!-- Filtros -->
      <div class="bg-white dark:bg-gray-800 dark:border-gray-700 rounded-lg shadow-sm p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Buscar</label>
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Buscar usuarios..."
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rol</label>
            <select 
              v-model="selectedRole"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los roles</option>
              <option value="ADMIN">Administrador</option>
              <option value="SELLER">Vendedor</option>
              <option value="SUPERVISOR">Supervisor</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Estado</label>
            <select 
              v-model="selectedStatus"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Indicador de carga -->
      <div v-if="usersStore.isLoading" class="bg-white rounded-lg shadow-sm p-8 text-center">
        <div class="inline-flex items-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-gray-600">Cargando usuarios...</span>
        </div>
      </div>

      <!-- Mensaje de error -->
      <div v-else-if="usersStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error al cargar usuarios</h3>
            <div class="mt-2 text-sm text-red-700">
              {{ usersStore.error }}
            </div>
            <div class="mt-4">
              <button 
                @click="retryLoad"
                class="bg-red-100 text-red-800 px-3 py-1 rounded-md text-sm font-medium hover:bg-red-200"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla de usuarios -->
      <div v-else class="bg-white dark:bg-gray-800 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Usuario
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zona
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de Registro
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-if="paginatedUsers.length === 0" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td colspan="7" class="px-6 py-8 text-center">
                  <div class="text-gray-500">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No se encontraron usuarios</h3>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-300">
                      {{ searchQuery ? 'Intenta con otros términos de búsqueda.' : 'No hay usuarios registrados.' }}
                    </p>
                  </div>
                </td>
              </tr>
              <tr v-for="user in paginatedUsers" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span class="text-primary-600 font-medium">{{ getUserFullName(user).charAt(0) }}</span>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ getUserFullName(user) }}</div>
                      <div class="text-sm text-gray-500 dark:text-gray-300">{{ user.username }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {{ user.email }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full" 
                        :class="getRoleClass(user.role)">
                    {{ getRoleText(user.role) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {{ getZoneName(user.zone) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full" 
                        :class="getStatusClass(user.is_active)">
                    {{ getStatusText(user.is_active) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {{ formatDate(user.date_joined) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <ActionButtons 
                    :show-edit="true"
                    :show-toggle="true"
                    :show-delete="true"
                    :is-active="user.is_active"
                    edit-title="Editar usuario"
                    toggle-title="Cambiar estado del usuario"
                    delete-title="Eliminar usuario"
                    @edit="editUser(user)" 
                    @toggle="toggleUserStatus(user)" 
                    @delete="deleteUser(user.id)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Paginación -->
      <div class="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6 mt-4 rounded-lg">
        <div class="flex-1 flex justify-between sm:hidden">
          <button 
            @click="previousPage"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Anterior
          </button>
          <button 
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700 dark:text-gray-300">
              Mostrando <span class="font-medium">{{ startIndex + 1 }}</span> a 
              <span class="font-medium">{{ endIndex }}</span> de 
              <span class="font-medium">{{ totalUsers }}</span> usuarios
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button 
                @click="previousPage"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <span class="sr-only">Anterior</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
              <button 
                v-for="page in visiblePages" 
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                  page === currentPage 
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' 
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                ]"
              >
                {{ page }}
              </button>
              <button 
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <span class="sr-only">Siguiente</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para agregar/editar usuario -->
    <div v-if="showAddModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            {{ editingUser ? 'Editar Usuario' : 'Agregar Nuevo Usuario' }}
          </h3>
          <form @submit.prevent="saveUser">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
                <input 
                  v-model="form.first_name"
                  type="text" 
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Apellido</label>
                <input 
                  v-model="form.last_name"
                  type="text" 
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre de Usuario</label>
                <input 
                  v-model="form.username"
                  type="text" 
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input 
                  v-model="form.email"
                  type="email" 
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
              </div>
              <div v-if="!editingUser">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña</label>
                <input 
                  v-model="form.password"
                  type="password" 
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Rol</label>
                <select 
                  v-model="form.role"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="" class="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">Seleccionar rol</option>
                  <option value="ADMIN" class="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">Administrador</option>
                  <option value="SELLER" class="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">Vendedor</option>
                  <option value="SUPERVISOR" class="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">Supervisor</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Zona</label>
                <select 
                  v-model="form.zone"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="" class="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">Sin zona asignada</option>
                  <option v-for="zone in catalogStore.zones" :key="zone.id" :value="zone.id" class="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                    {{ zone.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="flex items-center">
                  <input 
                    v-model="form.is_active"
                    type="checkbox" 
                    class="rounded border-gray-300 dark:border-gray-600 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 bg-white dark:bg-gray-700"
                  >
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Usuario activo</span>
                </label>
              </div>
            </div>
            <div class="flex justify-end space-x-3 mt-6">
              <button 
                type="button"
                @click="showAddModal = false"
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                class="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
              >
                {{ editingUser ? 'Actualizar' : 'Guardar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useUsersStore } from '../stores/users'
import { useCatalogStore } from '../stores/catalog'
import ActionButtons from '../components/ui/ActionButtons.vue'

const usersStore = useUsersStore()
const catalogStore = useCatalogStore()

// Estados locales
const searchQuery = ref('')
const selectedRole = ref('')
const selectedStatus = ref('')
const showAddModal = ref(false)
const editingUser = ref(null)
const currentPage = ref(1)
const usersPerPage = ref(10)

// Formulario
const form = ref({
  username: '',
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  role: 'SELLER',
  zone: '',
  is_active: true
})

// Computed properties
const filteredUsers = computed(() => {
  let filtered = usersStore.users

  if (searchQuery.value) {
    filtered = filtered.filter(user => 
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (selectedRole.value) {
    filtered = filtered.filter(user => user.role === selectedRole.value)
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(user => user.is_active === (selectedStatus.value === 'active'))
  }

  return filtered
})

const paginatedUsers = computed(() => {
  const start = startIndex.value
  const end = endIndex.value
  return filteredUsers.value.slice(start, end)
})

const totalUsers = computed(() => filteredUsers.value.length)
const totalPages = computed(() => Math.ceil(totalUsers.value / usersPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * usersPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + usersPerPage.value, totalUsers.value))

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Funciones de utilidad
const getRoleClass = (role) => {
  const classes = {
    ADMIN: 'bg-red-100 text-red-800',
    SELLER: 'bg-green-100 text-green-800',
    SUPERVISOR: 'bg-blue-100 text-blue-800'
  }
  return classes[role] || 'bg-gray-100 text-gray-800'
}

const getRoleText = (role) => {
  const texts = {
    ADMIN: 'Administrador',
    SELLER: 'Vendedor',
    SUPERVISOR: 'Supervisor'
  }
  return texts[role] || role
}

const getStatusClass = (isActive) => {
  return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
}

const getStatusText = (isActive) => {
  return isActive ? 'Activo' : 'Inactivo'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getZoneName = (zoneId) => {
  if (!zoneId) return 'N/A'
  const zone = catalogStore.zones.find(z => z.id === zoneId)
  return zone ? zone.name : 'N/A'
}

const getUserFullName = (user) => {
  const firstName = user.first_name || ''
  const lastName = user.last_name || ''
  return `${firstName} ${lastName}`.trim() || user.username
}

// Funciones CRUD
const editUser = (user) => {
  editingUser.value = user
  form.value = { 
    username: user.username,
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    email: user.email,
    password: '',
    role: user.role,
    zone: user.zone || '',
    is_active: user.is_active
  }
  showAddModal.value = true
}

const saveUser = async () => {
  try {
    if (editingUser.value) {
      await usersStore.updateUser(editingUser.value.id, form.value)
    } else {
      await usersStore.createUser(form.value)
    }
    
    resetForm()
    showAddModal.value = false
  } catch (error) {
    console.error('Error saving user:', error)
  }
}

const toggleUserStatus = async (user) => {
  try {
    await usersStore.toggleUserStatus(user.id)
  } catch (error) {
    console.error('Error toggling user status:', error)
  }
}

const deleteUser = async (id) => {
  if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
    try {
      await usersStore.deleteUser(id)
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }
}

const resetForm = () => {
  form.value = {
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'SELLER',
    zone: '',
    is_active: true
  }
  editingUser.value = null
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToPage = (page) => {
  currentPage.value = page
}

// Función para reintentar carga
const retryLoad = async () => {
  try {
    usersStore.clearError()
    await Promise.all([
      usersStore.fetchUsers(),
      catalogStore.fetchZones()
    ])
  } catch (error) {
    console.error('Error retrying load:', error)
  }
}

// Watcher para resetear paginación cuando cambia la búsqueda
watch(searchQuery, () => {
  currentPage.value = 1
})

// Cargar datos al montar el componente
onMounted(async () => {
  try {
    await Promise.all([
      usersStore.fetchUsers(),
      catalogStore.fetchZones()
    ])
  } catch (error) {
    console.error('Error loading data:', error)
  }
})
</script>

<style scoped>
.users-view {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>
