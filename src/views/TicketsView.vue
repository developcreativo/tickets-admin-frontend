<template>
  <div class="tickets-view">
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Gestión de Tickets</h1>
        <div class="flex space-x-3">
          <button 
            @click="showCreateModal = true"
            class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Crear Ticket
          </button>
          <button 
            @click="refreshData"
            class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Actualizar
          </button>
        </div>
      </div>

      <!-- Filtros -->
      <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Zona</label>
            <select 
              v-model="filters.zone"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las zonas</option>
              <option v-for="zone in catalogStore.zones" :key="zone.id" :value="zone.id">
                {{ zone.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Sorteo</label>
            <select 
              v-model="filters.drawType"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los tipos</option>
              <option v-for="drawType in catalogStore.drawTypes" :key="drawType.id" :value="drawType.id">
                {{ drawType.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
            <select 
              v-model="filters.user"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los usuarios</option>
              <option v-for="user in usersStore.users" :key="user.id" :value="user.id">
                {{ user.username }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio</label>
            <input 
              v-model="filters.startDate"
              type="date" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Fecha Fin</label>
            <input 
              v-model="filters.endDate"
              type="date" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
        </div>
        <div class="mt-4 flex justify-between items-center">
          <button 
            @click="applyFilters"
            class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Aplicar Filtros
          </button>
          <button 
            @click="clearFilters"
            class="text-gray-600 hover:text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      <!-- Indicador de carga -->
      <div v-if="ticketsStore.isLoading" class="bg-white rounded-lg shadow-sm p-8 text-center mb-6">
        <div class="inline-flex items-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-gray-600">Cargando tickets...</span>
        </div>
      </div>

      <!-- Mensaje de error -->
      <div v-else-if="ticketsStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error al cargar tickets</h3>
            <div class="mt-2 text-sm text-red-700">
              {{ ticketsStore.error }}
            </div>
            <div v-if="ticketsStore.error.includes('No se puede conectar al servidor')" class="mt-3">
              <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <h4 class="text-sm font-medium text-yellow-800 mb-2">Solución:</h4>
                <ol class="text-sm text-yellow-700 list-decimal list-inside space-y-1">
                  <li>Verifica que el backend esté ejecutándose</li>
                  <li>Ejecuta: <code class="bg-yellow-100 px-1 rounded">docker-compose build web</code></li>
                  <li>Luego: <code class="bg-yellow-100 px-1 rounded">docker-compose up -d web</code></li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla de tickets -->
      <div v-if="filteredTickets.length > 0" class="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Tickets de Venta</h3>
          <p class="text-sm text-gray-500 mt-1">
            Total: {{ filteredTickets.length }} tickets
          </p>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zona
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo de Sorteo
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Números
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Piezas
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="ticket in paginatedTickets" :key="ticket.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ ticketsStore.formatTicketNumber(ticket) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ getZoneName(ticket.zone) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ getDrawTypeName(ticket.draw_type) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ getUserName(ticket.user) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ getTicketSummary(ticket).totalNumbers }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ getTicketSummary(ticket).totalPieces }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDate(ticket.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button 
                      @click="viewTicket(ticket)"
                      class="text-blue-600 hover:text-blue-900"
                    >
                      Ver
                    </button>
                    <button 
                      @click="editTicket(ticket)"
                      class="text-green-600 hover:text-green-900"
                    >
                      Editar
                    </button>
                    <button 
                      @click="deleteTicket(ticket.id)"
                      class="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Mensaje sin tickets -->
      <div v-else-if="!ticketsStore.isLoading" class="bg-white rounded-lg shadow-sm p-8 text-center mb-6">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No hay tickets</h3>
        <p class="mt-1 text-sm text-gray-500">
          {{ hasFilters ? 'No se encontraron tickets con los filtros aplicados.' : 'Comienza creando tu primer ticket.' }}
        </p>
        <div class="mt-6">
          <button 
            @click="showCreateModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Crear Ticket
          </button>
        </div>
      </div>

      <!-- Paginación -->
      <div v-if="totalPages > 1" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg">
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
            <p class="text-sm text-gray-700">
              Mostrando <span class="font-medium">{{ startIndex + 1 }}</span> a 
              <span class="font-medium">{{ endIndex }}</span> de 
              <span class="font-medium">{{ filteredTickets.length }}</span> tickets
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
                :disabled="currentPage === totalPages"
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

      <!-- Modal de creación/edición -->
      <div v-if="showCreateModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
          <div class="mt-3">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium text-gray-900">
                {{ editingTicket ? 'Editar Ticket' : 'Crear Nuevo Ticket' }}
              </h3>
              <button 
                @click="closeModal"
                class="text-gray-400 hover:text-gray-600"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <form @submit.prevent="saveTicket" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Zona *</label>
                  <select 
                    v-model="ticketForm.zone"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar zona</option>
                    <option v-for="zone in catalogStore.zones" :key="zone.id" :value="zone.id">
                      {{ zone.name }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Sorteo *</label>
                  <select 
                    v-model="ticketForm.drawType"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar tipo</option>
                    <option v-for="drawType in catalogStore.drawTypes" :key="drawType.id" :value="drawType.id">
                      {{ drawType.name }}
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Números y Piezas *</label>
                <div class="space-y-2">
                  <div v-for="(item, index) in ticketForm.items" :key="index" class="flex space-x-2">
                    <input 
                      v-model="item.number"
                      type="text"
                      placeholder="Número (00-99)"
                      maxlength="2"
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                    <input 
                      v-model="item.pieces"
                      type="number"
                      placeholder="Piezas"
                      min="1"
                      class="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                    <button 
                      type="button"
                      @click="removeItem(index)"
                      class="px-3 py-2 text-red-600 hover:text-red-800"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <button 
                  type="button"
                  @click="addItem"
                  class="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  + Agregar número
                </button>
              </div>

              <div class="flex justify-end space-x-3 pt-4">
                <button 
                  type="button"
                  @click="closeModal"
                  class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  :disabled="ticketsStore.isLoading"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {{ ticketsStore.isLoading ? 'Guardando...' : (editingTicket ? 'Actualizar' : 'Crear') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useTicketsStore } from '../stores/tickets'
import { useCatalogStore } from '../stores/catalog'
import { useUsersStore } from '../stores/users'

const ticketsStore = useTicketsStore()
const catalogStore = useCatalogStore()
const usersStore = useUsersStore()

// Estados locales
const showCreateModal = ref(false)
const editingTicket = ref(null)
const currentPage = ref(1)
const ticketsPerPage = ref(10)

// Filtros
const filters = ref({
  zone: '',
  drawType: '',
  user: '',
  startDate: '',
  endDate: ''
})

// Formulario de ticket
const ticketForm = ref({
  zone: '',
  drawType: '',
  items: [{ number: '', pieces: 1 }]
})

// Computed properties
const filteredTickets = computed(() => {
  let filtered = ticketsStore.tickets

  if (filters.value.zone) {
    filtered = filtered.filter(ticket => ticket.zone === filters.value.zone)
  }
  if (filters.value.drawType) {
    filtered = filtered.filter(ticket => ticket.draw_type === filters.value.drawType)
  }
  if (filters.value.user) {
    filtered = filtered.filter(ticket => ticket.user === filters.value.user)
  }
  if (filters.value.startDate) {
    filtered = filtered.filter(ticket => ticket.created_at >= filters.value.startDate)
  }
  if (filters.value.endDate) {
    filtered = filtered.filter(ticket => ticket.created_at <= filters.value.endDate)
  }

  return filtered
})

const hasFilters = computed(() => {
  return filters.value.zone || filters.value.drawType || filters.value.user || 
         filters.value.startDate || filters.value.endDate
})

const totalTickets = computed(() => filteredTickets.value.length)
const totalPages = computed(() => Math.ceil(totalTickets.value / ticketsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * ticketsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + ticketsPerPage.value, totalTickets.value))

const paginatedTickets = computed(() => {
  const start = startIndex.value
  const end = endIndex.value
  return filteredTickets.value.slice(start, end)
})

// Funciones
const refreshData = async () => {
  try {
    await ticketsStore.fetchTickets()
  } catch (error) {
    console.error('Error refreshing tickets:', error)
  }
}

const applyFilters = async () => {
  currentPage.value = 1
  await refreshData()
}

const clearFilters = () => {
  filters.value = {
    zone: '',
    drawType: '',
    user: '',
    startDate: '',
    endDate: ''
  }
  currentPage.value = 1
  refreshData()
}

const addItem = () => {
  ticketForm.value.items.push({ number: '', pieces: 1 })
}

const removeItem = (index) => {
  if (ticketForm.value.items.length > 1) {
    ticketForm.value.items.splice(index, 1)
  }
}

const saveTicket = async () => {
  try {
    // Validar formulario
    const errors = ticketsStore.validateTicketItems(ticketForm.value.items, ticketForm.value.zone, ticketForm.value.drawType)
    if (errors.length > 0) {
      alert('Errores de validación:\n' + errors.join('\n'))
      return
    }

    // Preparar datos
    const ticketData = {
      zone: ticketForm.value.zone,
      draw_type: ticketForm.value.drawType,
      items: ticketForm.value.items.map(item => ({
        number: item.number,
        pieces: parseInt(item.pieces)
      }))
    }

    if (editingTicket.value) {
      await ticketsStore.updateTicket(editingTicket.value.id, ticketData)
    } else {
      await ticketsStore.createTicket(ticketData)
    }

    closeModal()
    await refreshData()
  } catch (error) {
    console.error('Error saving ticket:', error)
  }
}

const editTicket = (ticket) => {
  editingTicket.value = ticket
  ticketForm.value = {
    zone: ticket.zone,
    drawType: ticket.draw_type,
    items: ticket.items ? ticket.items.map(item => ({
      number: item.number,
      pieces: item.pieces
    })) : [{ number: '', pieces: 1 }]
  }
  showCreateModal.value = true
}

const viewTicket = (ticket) => {
  // Implementar vista detallada del ticket
  console.log('Viewing ticket:', ticket)
}

const deleteTicket = async (id) => {
  if (confirm('¿Estás seguro de que quieres eliminar este ticket?')) {
    try {
      await ticketsStore.deleteTicket(id)
      await refreshData()
    } catch (error) {
      console.error('Error deleting ticket:', error)
    }
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingTicket.value = null
  ticketForm.value = {
    zone: '',
    drawType: '',
    items: [{ number: '', pieces: 1 }]
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// Funciones de utilidad
const getZoneName = (zoneId) => {
  if (!zoneId) return 'N/A'
  const zone = catalogStore.zones.find(z => z.id === zoneId)
  return zone ? zone.name : 'N/A'
}

const getDrawTypeName = (drawTypeId) => {
  if (!drawTypeId) return 'N/A'
  const drawType = catalogStore.drawTypes.find(d => d.id === drawTypeId)
  return drawType ? drawType.name : 'N/A'
}

const getUserName = (userId) => {
  if (!userId) return 'N/A'
  const user = usersStore.users.find(u => u.id === userId)
  return user ? user.username : 'N/A'
}

const getTicketSummary = (ticket) => {
  return ticketsStore.getTicketSummary(ticket)
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

// Watchers
watch(filters, () => {
  currentPage.value = 1
})

// Cargar datos iniciales
onMounted(async () => {
  try {
    await Promise.all([
      catalogStore.fetchZones(),
      catalogStore.fetchDrawTypes(),
      usersStore.fetchUsers(),
      ticketsStore.fetchTickets()
    ])
  } catch (error) {
    console.error('Error loading initial data:', error)
  }
})
</script>

<style scoped>
.tickets-view {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>
