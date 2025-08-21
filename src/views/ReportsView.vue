<template>
  <div class="reports-view min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">Reportes y Estadísticas</h1>
        <div class="flex space-x-3">
          <button 
            @click="exportReport('csv')"
            class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Exportar CSV
          </button>
          <button 
            @click="exportReport('xlsx')"
            class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Exportar Excel
          </button>
          <button 
            @click="refreshData"
            class="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Actualizar Datos
          </button>
        </div>
      </div>

      <!-- Filtros de fecha -->
      <div class="bg-white dark:bg-gray-800 dark:border-gray-700 rounded-lg shadow-sm p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fecha Inicio</label>
            <input 
              v-model="dateRange.start"
              type="date" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fecha Fin</label>
            <input 
              v-model="dateRange.end"
              type="date" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Agrupar por</label>
            <select 
              v-model="groupBy"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="zone">Zona</option>
              <option value="draw_type">Tipo de Sorteo</option>
              <option value="user">Usuario</option>
            </select>
          </div>
          <div class="flex items-end">
            <button 
              @click="generateReport"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Generar Reporte
            </button>
          </div>
        </div>
      </div>

      <!-- Filtros adicionales -->
      <div class="bg-white dark:bg-gray-800 dark:border-gray-700 rounded-lg shadow-sm p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Zona</label>
            <select 
              v-model="selectedZone"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las zonas</option>
              <option v-for="zone in catalogStore.zones" :key="zone.id" :value="zone.id">
                {{ zone.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo de Sorteo</label>
            <select 
              v-model="selectedDrawType"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los tipos</option>
              <option v-for="drawType in catalogStore.drawTypes" :key="drawType.id" :value="drawType.id">
                {{ drawType.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Usuario</label>
            <select 
              v-model="selectedUser"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los usuarios</option>
              <option v-for="user in usersStore.users" :key="user.id" :value="user.id">
                {{ user.username }}
              </option>
            </select>
          </div>
        </div>
        <div class="mt-4 flex items-center space-x-4">
          <label class="flex items-center">
            <input 
              v-model="includeDaily"
              type="checkbox" 
              class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Incluir datos diarios</span>
          </label>
        </div>
      </div>

      <!-- Indicador de carga -->
      <div v-if="reportsStore.isLoading" class="bg-white rounded-lg shadow-sm p-8 text-center mb-6">
        <div class="inline-flex items-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-gray-600">Generando reporte...</span>
        </div>
      </div>

      <!-- Mensaje de error -->
      <div v-else-if="reportsStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error al generar reporte</h3>
            <div class="mt-2 text-sm text-red-700">
              {{ reportsStore.error }}
            </div>
          </div>
        </div>
      </div>

      <!-- Tarjetas de resumen -->
      <div v-if="reportsStore.hasData" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 dark:border-gray-700 rounded-lg shadow-sm p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-300">Total Tickets</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-gray-100">{{ reportsStore.formatNumber(reportsStore.totalTickets) }}</p>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-sm text-blue-600 font-medium">Reporte actualizado</span>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 dark:border-gray-700 rounded-lg shadow-sm p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-300">Total Pedazos</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-gray-100">{{ reportsStore.formatNumber(reportsStore.totalPieces) }}</p>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-sm text-green-600 font-medium">Datos en tiempo real</span>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 dark:border-gray-700 rounded-lg shadow-sm p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-300">Estado Cache</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-gray-100">{{ reportsStore.isCached ? 'Activo' : 'Inactivo' }}</p>
            </div>
          </div>
          <div class="mt-4">
            <span v-if="reportsStore.isCached" class="text-sm text-green-600 font-medium">
              {{ reportsStore.getCacheAge() }}
            </span>
            <span v-else class="text-sm text-gray-600 dark:text-gray-400 font-medium">Sin cache</span>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 dark:border-gray-700 rounded-lg shadow-sm p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-300">Páginas</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-gray-100">{{ reportsStore.pagination.total_pages || 1 }}</p>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-sm text-blue-600 font-medium">Paginación</span>
          </div>
        </div>
      </div>

      <!-- Tabla de reportes -->
      <div v-if="reportsStore.hasData" class="bg-white dark:bg-gray-800 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden mb-6">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Reporte Detallado</h3>
          <p class="text-sm text-gray-500 dark:text-gray-300 mt-1">
            Agrupado por: <span class="font-medium">{{ groupBy === 'zone' ? 'Zona' : groupBy === 'draw_type' ? 'Tipo de Sorteo' : 'Usuario' }}</span>
          </p>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ groupBy === 'zone' ? 'Zona' : groupBy === 'draw_type' ? 'Tipo de Sorteo' : 'Usuario' }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Tickets
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Pedazos
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="report in reportsStore.reports" :key="report.group" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ report.group || 'Sin nombre' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {{ reportsStore.formatNumber(report.total_tickets) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {{ reportsStore.formatNumber(report.total_pieces) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Paginación -->
      <div v-if="reportsStore.pagination.total_pages > 1" class="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6 rounded-lg">
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
            :disabled="currentPage === reportsStore.pagination.total_pages"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700 dark:text-gray-300">
              Mostrando <span class="font-medium">{{ reportsStore.pagination.page || 1 }}</span> de 
              <span class="font-medium">{{ reportsStore.pagination.total_pages || 1 }}</span> páginas
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button 
                @click="previousPage"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <span class="sr-only">Anterior</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
              <button 
                @click="nextPage"
                :disabled="currentPage === reportsStore.pagination.total_pages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
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

      <!-- Botón de limpiar cache -->
      <div class="mt-6 text-center">
        <button 
          @click="clearCache"
          class="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Limpiar Cache
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useReportsStore } from '../stores/reports'
import { useCatalogStore } from '../stores/catalog'
import { useUsersStore } from '../stores/users'

const reportsStore = useReportsStore()
const catalogStore = useCatalogStore()
const usersStore = useUsersStore()

// Estados locales
const dateRange = ref({
  start: '',
  end: ''
})
const selectedZone = ref('')
const selectedDrawType = ref('')
const selectedUser = ref('')
const groupBy = ref('zone')
const includeDaily = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)

// Computed properties
const reportParams = computed(() => ({
  startDate: dateRange.value.start,
  endDate: dateRange.value.end,
  zone: selectedZone.value,
  drawType: selectedDrawType.value,
  user: selectedUser.value,
  groupBy: groupBy.value,
  page: currentPage.value,
  pageSize: pageSize.value,
  includeDaily: includeDaily.value
}))

const hasFilters = computed(() => {
  return dateRange.value.start || dateRange.value.end || 
         selectedZone.value || selectedDrawType.value || selectedUser.value
})

// Funciones
const generateReport = async () => {
  try {
    await reportsStore.fetchSummaryReport(reportParams.value)
  } catch (error) {
    console.error('Error generating report:', error)
  }
}

const refreshData = async () => {
  try {
    await reportsStore.refreshReport(reportParams.value)
  } catch (error) {
    console.error('Error refreshing data:', error)
  }
}

const exportReport = async (format = 'csv') => {
  try {
    await reportsStore.exportReport(reportParams.value, format)
  } catch (error) {
    console.error('Error exporting report:', error)
  }
}

const clearCache = async () => {
  try {
    await reportsStore.clearCache()
    // Recargar reporte después de limpiar cache
    await generateReport()
  } catch (error) {
    console.error('Error clearing cache:', error)
  }
}

const nextPage = () => {
  if (currentPage.value < reportsStore.pagination.total_pages) {
    currentPage.value++
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const goToPage = (page) => {
  currentPage.value = page
}

// Watchers
watch([dateRange, selectedZone, selectedDrawType, selectedUser, groupBy], () => {
  currentPage.value = 1
  if (hasFilters.value) {
    generateReport()
  }
})

// Cargar datos iniciales
onMounted(async () => {
  try {
    // Establecer fechas por defecto (último mes)
    const today = new Date()
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
    
    dateRange.value = {
      start: lastMonth.toISOString().split('T')[0],
      end: today.toISOString().split('T')[0]
    }
    
    await Promise.all([
      catalogStore.fetchZones(),
      catalogStore.fetchDrawTypes(),
      usersStore.fetchUsers()
    ])
  } catch (error) {
    console.error('Error loading initial data:', error)
  }
})
</script>

<style scoped>
.reports-view {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>
