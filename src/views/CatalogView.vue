<template>
  <div class="catalog-view min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">Catálogo</h1>
        <button 
          @click="showAddModal = true"
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Agregar {{ getTabTitle() }}
        </button>
      </div>

      <!-- Pestañas -->
      <div class="bg-white dark:bg-gray-800 dark:border-gray-700 rounded-lg shadow-sm mb-6">
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="-mb-px flex space-x-8 px-6">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="changeTab(tab.id)"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-200 hover:border-gray-300'
              ]"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>
      </div>

      <!-- Filtros -->
      <div class="bg-white dark:bg-gray-800 dark:border-gray-700 rounded-lg shadow-sm p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Buscar</label>
            <input 
              v-model="searchQuery"
              type="text" 
              :placeholder="`Buscar en ${getTabTitle().toLowerCase()}...`"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
        </div>
      </div>

      <!-- Indicador de carga -->
      <div v-if="catalogStore.isLoading" class="bg-white rounded-lg shadow-sm p-8 text-center">
        <div class="inline-flex items-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-gray-600">Cargando datos del catálogo...</span>
        </div>
      </div>

      <!-- Mensaje de error -->
      <div v-else-if="catalogStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error al cargar datos</h3>
            <div class="mt-2 text-sm text-red-700">
              {{ catalogStore.error }}
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

      <!-- Tabla del catálogo -->
      <div v-else class="bg-white dark:bg-gray-800 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ getTabTitle() }}
                </th>
                <th v-if="activeTab === 'drawTypes'" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th v-if="activeTab === 'schedules'" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo de Sorteo
                </th>
                <th v-if="activeTab === 'schedules'" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zona
                </th>
                <th v-if="activeTab === 'schedules'" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hora de Cierre
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-if="paginatedItems.length === 0" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td :colspan="getColumnCount()" class="px-6 py-8 text-center">
                  <div class="text-gray-500">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No se encontraron {{ getTabTitle().toLowerCase() }}</h3>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-300">
                      {{ searchQuery ? 'Intenta con otros términos de búsqueda.' : 'No hay datos disponibles.' }}
                    </p>
                  </div>
                </td>
              </tr>
              <tr v-for="item in paginatedItems" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span class="text-primary-600 font-medium">{{ item.name?.charAt(0) || 'N' }}</span>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ item.name }}</div>
                      <div v-if="item.description" class="text-sm text-gray-500 dark:text-gray-300">{{ item.description }}</div>
                    </div>
                  </div>
                </td>
                <td v-if="activeTab === 'drawTypes'" class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  <code class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">{{ item.code }}</code>
                </td>
                <td v-if="activeTab === 'schedules'" class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {{ getDrawTypeName(item.draw_type) }}
                </td>
                <td v-if="activeTab === 'schedules'" class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {{ getZoneName(item.zone) }}
                </td>
                <td v-if="activeTab === 'schedules'" class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {{ formatTime(item.cutoff_time) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full" 
                        :class="getStatusClass(item.is_active)">
                    {{ getStatusText(item.is_active) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    @click="editItem(item)"
                    class="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Editar
                  </button>
                  <button 
                    @click="deleteItem(item.id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
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
              <span class="font-medium">{{ totalItems }}</span> resultados
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

    <!-- Modal para agregar/editar item -->
    <div v-if="showAddModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ editingItem ? 'Editar' : 'Agregar' }} {{ getTabTitle() }}
          </h3>
          
          <!-- Formulario para Zonas -->
          <form v-if="activeTab === 'zones'" @submit.prevent="saveItem">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Nombre</label>
                <input 
                  v-model="zoneForm.name"
                  type="text" 
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea 
                  v-model="zoneForm.description"
                  rows="3"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              <div>
                <label class="flex items-center">
                  <input 
                    v-model="zoneForm.is_active"
                    type="checkbox" 
                    class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  >
                  <span class="ml-2 text-sm text-gray-700">Activo</span>
                </label>
              </div>
            </div>
            <div class="flex justify-end space-x-3 mt-6">
              <button 
                type="button"
                @click="showAddModal = false"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                class="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
              >
                {{ editingItem ? 'Actualizar' : 'Guardar' }}
              </button>
            </div>
          </form>

          <!-- Formulario para Tipos de Sorteo -->
          <form v-if="activeTab === 'drawTypes'" @submit.prevent="saveItem">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Código</label>
                <input 
                  v-model="drawTypeForm.code"
                  type="text" 
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Nombre</label>
                <input 
                  v-model="drawTypeForm.name"
                  type="text" 
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>
              <div>
                <label class="flex items-center">
                  <input 
                    v-model="drawTypeForm.is_active"
                    type="checkbox" 
                    class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  >
                  <span class="ml-2 text-sm text-gray-700">Activo</span>
                </label>
              </div>
            </div>
            <div class="flex justify-end space-x-3 mt-6">
              <button 
                type="button"
                @click="showAddModal = false"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                class="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
              >
                {{ editingItem ? 'Actualizar' : 'Guardar' }}
              </button>
            </div>
          </form>

          <!-- Formulario para Horarios de Sorteo -->
          <form v-if="activeTab === 'schedules'" @submit.prevent="saveItem">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Tipo de Sorteo</label>
                <select 
                  v-model="scheduleForm.draw_type"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar tipo de sorteo</option>
                  <option v-for="type in catalogStore.drawTypes" :key="type.id" :value="type.id">
                    {{ type.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Zona</label>
                <select 
                  v-model="scheduleForm.zone"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar zona</option>
                  <option v-for="zone in catalogStore.zones" :key="zone.id" :value="zone.id">
                    {{ zone.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Hora de Cierre</label>
                <input 
                  v-model="scheduleForm.cutoff_time"
                  type="time" 
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>
              <div>
                <label class="flex items-center">
                  <input 
                    v-model="scheduleForm.is_active"
                    type="checkbox" 
                    class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  >
                  <span class="ml-2 text-sm text-gray-700">Activo</span>
                </label>
              </div>
            </div>
            <div class="flex justify-end space-x-3 mt-6">
              <button 
                type="button"
                @click="showAddModal = false"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                class="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
              >
                {{ editingItem ? 'Actualizar' : 'Guardar' }}
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
import { useCatalogStore } from '../stores/catalog'

const catalogStore = useCatalogStore()

// Estados locales
const activeTab = ref('zones')
const searchQuery = ref('')
const showAddModal = ref(false)
const editingItem = ref(null)
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Definir pestañas
const tabs = [
  { id: 'zones', name: 'Zonas' },
  { id: 'drawTypes', name: 'Tipos de Sorteo' },
  { id: 'schedules', name: 'Horarios de Sorteo' }
]

// Formularios
const zoneForm = ref({
  name: '',
  description: '',
  is_active: true
})

const drawTypeForm = ref({
  code: '',
  name: '',
  is_active: true
})

const scheduleForm = ref({
  draw_type: '',
  zone: '',
  cutoff_time: '',
  is_active: true
})

// Computed properties
const currentItems = computed(() => {
  switch (activeTab.value) {
    case 'zones':
      return catalogStore.zones
    case 'drawTypes':
      return catalogStore.drawTypes
    case 'schedules':
      return catalogStore.drawSchedules
    default:
      return []
  }
})

const filteredItems = computed(() => {
  let filtered = currentItems.value

  if (searchQuery.value) {
    filtered = filtered.filter(item => 
      item.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.code?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  return filtered
})

const paginatedItems = computed(() => {
  const start = startIndex.value
  const end = endIndex.value
  return filteredItems.value.slice(start, end)
})

const totalItems = computed(() => filteredItems.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, totalItems.value))

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
const getStatusClass = (isActive) => {
  return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
}

const getStatusText = (isActive) => {
  return isActive ? 'Activo' : 'Inactivo'
}

const editItem = (item) => {
  editingItem.value = item
  switch (activeTab.value) {
    case 'zones':
      zoneForm.value = { ...item }
      break
    case 'drawTypes':
      drawTypeForm.value = { ...item }
      break
    case 'schedules':
      scheduleForm.value = { ...item }
      break
  }
  showAddModal.value = true
}

const saveItem = async () => {
  try {
    switch (activeTab.value) {
      case 'zones':
        if (editingItem.value) {
          await catalogStore.updateZone(editingItem.value.id, zoneForm.value)
        } else {
          await catalogStore.createZone(zoneForm.value)
        }
        break
      case 'drawTypes':
        if (editingItem.value) {
          await catalogStore.updateDrawType(editingItem.value.id, drawTypeForm.value)
        } else {
          await catalogStore.createDrawType(drawTypeForm.value)
        }
        break
      case 'schedules':
        if (editingItem.value) {
          await catalogStore.updateDrawSchedule(editingItem.value.id, scheduleForm.value)
        } else {
          await catalogStore.createDrawSchedule(scheduleForm.value)
        }
        break
    }
    
    resetForm()
    showAddModal.value = false
  } catch (error) {
    console.error('Error saving item:', error)
  }
}

const deleteItem = async (id) => {
  if (confirm('¿Estás seguro de que quieres eliminar este elemento?')) {
    try {
      switch (activeTab.value) {
        case 'zones':
          await catalogStore.deleteZone(id)
          break
        case 'drawTypes':
          await catalogStore.deleteDrawType(id)
          break
        case 'schedules':
          await catalogStore.deleteDrawSchedule(id)
          break
      }
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }
}

const resetForm = () => {
  zoneForm.value = { name: '', description: '', is_active: true }
  drawTypeForm.value = { code: '', name: '', is_active: true }
  scheduleForm.value = { draw_type: '', zone: '', cutoff_time: '', is_active: true }
  editingItem.value = null
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

const changeTab = (tab) => {
  activeTab.value = tab
  currentPage.value = 1
  searchQuery.value = ''
  // Resetear formularios al cambiar de pestaña
  resetForm()
}

// Funciones de utilidad para mostrar datos
const getTabTitle = () => {
  const tab = tabs.find(t => t.id === activeTab.value)
  return tab ? tab.name : 'Elemento'
}

const getDrawTypeName = (drawTypeId) => {
  const drawType = catalogStore.drawTypes.find(type => type.id === drawTypeId)
  return drawType ? drawType.name : 'N/A'
}

const getZoneName = (zoneId) => {
  const zone = catalogStore.zones.find(z => z.id === zoneId)
  return zone ? zone.name : 'N/A'
}

const formatTime = (time) => {
  if (!time) return 'N/A'
  return time
}

const getColumnCount = () => {
  switch (activeTab.value) {
    case 'zones':
      return 3 // Nombre, Estado, Acciones
    case 'drawTypes':
      return 4 // Nombre, Código, Estado, Acciones
    case 'schedules':
      return 6 // Nombre, Tipo de Sorteo, Zona, Hora de Cierre, Estado, Acciones
    default:
      return 3
  }
}

// Función para reintentar carga
const retryLoad = async () => {
  try {
    catalogStore.clearError()
    await catalogStore.loadAllData()
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
    await catalogStore.loadAllData()
  } catch (error) {
    console.error('Error loading catalog data:', error)
  }
})
</script>

<style scoped>
.catalog-view {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>
