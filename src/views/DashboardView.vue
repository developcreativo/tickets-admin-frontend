<template>
  <div class="dashboard-view">
    <div class="container mx-auto px-4 py-8">
      <!-- Header del Dashboard -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p class="text-gray-600">Vista general del sistema de emisión de tickets</p>
        <div class="flex items-center space-x-4 mt-4">
          <button 
            @click="refreshDashboard"
            :disabled="isLoading"
            class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {{ isLoading ? 'Actualizando...' : 'Actualizar' }}
          </button>
          <span class="text-sm text-gray-500">
            Última actualización: {{ lastUpdate }}
          </span>
        </div>
      </div>

      <!-- Tarjetas de estadísticas principales -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
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
              <p class="text-sm font-medium text-gray-500">Total Tickets</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.totalTickets }}</p>
              <div class="flex items-center mt-1">
                <span :class="stats.ticketsGrowth >= 0 ? 'text-green-600' : 'text-red-600'" class="text-sm font-medium">
                  {{ stats.ticketsGrowth >= 0 ? '+' : '' }}{{ stats.ticketsGrowth }}%
                </span>
                <span class="text-sm text-gray-500 ml-1">vs mes anterior</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total Piezas</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.totalPieces }}</p>
              <div class="flex items-center mt-1">
                <span :class="stats.piecesGrowth >= 0 ? 'text-green-600' : 'text-red-600'" class="text-sm font-medium">
                  {{ stats.piecesGrowth >= 0 ? '+' : '' }}{{ stats.piecesGrowth }}%
                </span>
                <span class="text-sm text-gray-500 ml-1">vs mes anterior</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Usuarios Activos</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.activeUsers }}</p>
              <div class="flex items-center mt-1">
                <span :class="stats.usersGrowth >= 0 ? 'text-green-600' : 'text-red-600'" class="text-sm font-medium">
                  {{ stats.usersGrowth >= 0 ? '+' : '' }}{{ stats.usersGrowth }}%
                </span>
                <span class="text-sm text-gray-500 ml-1">vs mes anterior</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Zonas Activas</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.activeZones }}</p>
              <div class="flex items-center mt-1">
                <span class="text-sm text-gray-500">Total: {{ stats.totalZones }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Gráficos y visualizaciones -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Gráfico de tickets por zona -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Tickets por Zona</h3>
            <div class="flex space-x-2">
              <button 
                @click="chartPeriod = 'week'"
                :class="chartPeriod === 'week' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'"
                class="px-3 py-1 text-sm font-medium rounded-md transition-colors"
              >
                Semana
              </button>
              <button 
                @click="chartPeriod = 'month'"
                :class="chartPeriod === 'month' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'"
                class="px-3 py-1 text-sm font-medium rounded-md transition-colors"
              >
                Mes
              </button>
            </div>
          </div>
          <div class="h-64">
            <canvas ref="zoneChart" class="w-full h-full"></canvas>
          </div>
        </div>

        <!-- Gráfico de tendencia de ventas -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Tendencia de Ventas</h3>
            <div class="flex space-x-2">
              <button 
                @click="trendPeriod = '7d'"
                :class="trendPeriod === '7d' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'"
                class="px-3 py-1 text-sm font-medium rounded-md transition-colors"
              >
                7 días
              </button>
              <button 
                @click="trendPeriod = '30d'"
                :class="trendPeriod === '30d' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'"
                class="px-3 py-1 text-sm font-medium rounded-md transition-colors"
              >
                30 días
              </button>
            </div>
          </div>
          <div class="h-64">
            <canvas ref="trendChart" class="w-full h-full"></canvas>
          </div>
        </div>
      </div>

      <!-- Actividad reciente y métricas adicionales -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Actividad reciente -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Actividad Reciente</h3>
          <div class="space-y-4">
            <div v-for="activity in recentActivity" :key="activity.id" class="flex items-start space-x-3">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 rounded-full flex items-center justify-center"
                     :class="getActivityColor(activity.type)">
                  <component :is="getActivityIcon(activity.type)" class="w-4 h-4 text-white" />
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
                <p class="text-sm text-gray-500">{{ activity.description }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ formatTimeAgo(activity.timestamp) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Top zonas -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Top Zonas</h3>
          <div class="space-y-3">
            <div v-for="(zone, index) in topZones" :key="zone.id" class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <span class="text-sm font-medium text-gray-500 w-6">{{ index + 1 }}</span>
                <span class="text-sm font-medium text-gray-900">{{ zone.name }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-900">{{ zone.tickets }}</span>
                <div class="w-20 bg-gray-200 rounded-full h-2">
                  <div class="bg-blue-600 h-2 rounded-full" 
                       :style="{ width: `${(zone.tickets / maxZoneTickets) * 100}%` }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Métricas de rendimiento -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Rendimiento</h3>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Tickets por hora</span>
              <span class="text-sm font-medium text-gray-900">{{ performance.ticketsPerHour }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Promedio piezas/ticket</span>
              <span class="text-sm font-medium text-gray-900">{{ performance.avgPiecesPerTicket }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Tiempo respuesta</span>
              <span class="text-sm font-medium text-gray-900">{{ performance.responseTime }}ms</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Uptime</span>
              <span class="text-sm font-medium text-green-600">{{ performance.uptime }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useReportsStore } from '../stores/reports'
import { useCatalogStore } from '../stores/catalog'
import { useUsersStore } from '../stores/users'
import { useTicketsStore } from '../stores/tickets'
import Chart from 'chart.js/auto'

// Stores
const reportsStore = useReportsStore()
const catalogStore = useCatalogStore()
const usersStore = useUsersStore()
const ticketsStore = useTicketsStore()

// Estados
const isLoading = ref(false)
const lastUpdate = ref('Nunca')
const chartPeriod = ref('month')
const trendPeriod = ref('7d')

// Referencias de canvas
const zoneChart = ref(null)
const trendChart = ref(null)

// Instancias de Chart.js
let zoneChartInstance = null
let trendChartInstance = null

// Datos del dashboard
const stats = ref({
  totalTickets: 0,
  totalPieces: 0,
  activeUsers: 0,
  activeZones: 0,
  totalZones: 0,
  ticketsGrowth: 0,
  piecesGrowth: 0,
  usersGrowth: 0
})

const recentActivity = ref([])
const topZones = ref([])
const performance = ref({
  ticketsPerHour: 0,
  avgPiecesPerTicket: 0,
  responseTime: 0,
  uptime: 99.9
})

// Computed
const maxZoneTickets = computed(() => {
  if (topZones.value.length === 0) return 1
  return Math.max(...topZones.value.map(zone => zone.tickets))
})

// Funciones
const refreshDashboard = async () => {
  try {
    isLoading.value = true
    await Promise.all([
      loadDashboardStats(),
      loadRecentActivity(),
      loadTopZones(),
      loadPerformanceMetrics()
    ])
    lastUpdate.value = new Date().toLocaleTimeString('es-ES')
  } catch (error) {
    console.error('Error refreshing dashboard:', error)
  } finally {
    isLoading.value = false
  }
}

const loadDashboardStats = async () => {
  try {
    // Cargar datos de reportes
    await reportsStore.fetchSummaryReport({
      startDate: getDateRange(chartPeriod.value).start,
      endDate: getDateRange(chartPeriod.value).end
    })

    // Actualizar estadísticas
    stats.value = {
      totalTickets: reportsStore.totalTickets,
      totalPieces: reportsStore.totalPieces,
      activeUsers: usersStore.users.filter(u => u.is_active).length,
      activeZones: catalogStore.zones.filter(z => z.is_active).length,
      totalZones: catalogStore.zones.length,
      ticketsGrowth: calculateGrowth(reportsStore.totalTickets, 1250), // Mock data
      piecesGrowth: calculateGrowth(reportsStore.totalPieces, 12500), // Mock data
      usersGrowth: calculateGrowth(usersStore.users.filter(u => u.is_active).length, 450) // Mock data
    }
  } catch (error) {
    console.error('Error loading dashboard stats:', error)
  }
}

const loadRecentActivity = async () => {
  try {
    // Simular actividad reciente basada en tickets
    const tickets = ticketsStore.tickets.slice(0, 5)
    recentActivity.value = tickets.map(ticket => ({
      id: ticket.id,
      type: 'ticket_created',
      title: `Ticket #${ticket.id} creado`,
      description: `Zona: ${getZoneName(ticket.zone)} - ${getDrawTypeName(ticket.draw_type)}`,
      timestamp: ticket.created_at
    }))
  } catch (error) {
    console.error('Error loading recent activity:', error)
  }
}

const loadTopZones = async () => {
  try {
    // Simular top zonas basado en tickets
    const zoneStats = {}
    ticketsStore.tickets.forEach(ticket => {
      const zoneName = getZoneName(ticket.zone)
      if (!zoneStats[zoneName]) {
        zoneStats[zoneName] = { id: ticket.zone, name: zoneName, tickets: 0 }
      }
      zoneStats[zoneName].tickets++
    })

    topZones.value = Object.values(zoneStats)
      .sort((a, b) => b.tickets - a.tickets)
      .slice(0, 5)
  } catch (error) {
    console.error('Error loading top zones:', error)
  }
}

const loadPerformanceMetrics = async () => {
  try {
    // Simular métricas de rendimiento
    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
    const recentTickets = ticketsStore.tickets.filter(t => new Date(t.created_at) > oneHourAgo)

    performance.value = {
      ticketsPerHour: recentTickets.length,
      avgPiecesPerTicket: ticketsStore.tickets.length > 0 
        ? Math.round(reportsStore.totalPieces / ticketsStore.tickets.length) 
        : 0,
      responseTime: Math.floor(Math.random() * 100) + 50, // Mock data
      uptime: 99.9
    }
  } catch (error) {
    console.error('Error loading performance metrics:', error)
  }
}

const getDateRange = (period) => {
  const now = new Date()
  const start = new Date()
  
  if (period === 'week') {
    start.setDate(now.getDate() - 7)
  } else if (period === 'month') {
    start.setMonth(now.getMonth() - 1)
  }
  
  return {
    start: start.toISOString().split('T')[0],
    end: now.toISOString().split('T')[0]
  }
}

const calculateGrowth = (current, previous) => {
  if (previous === 0) return 0
  return Math.round(((current - previous) / previous) * 100)
}

const getZoneName = (zoneId) => {
  const zone = catalogStore.zones.find(z => z.id === zoneId)
  return zone ? zone.name : 'N/A'
}

const getDrawTypeName = (drawTypeId) => {
  const drawType = catalogStore.drawTypes.find(d => d.id === drawTypeId)
  return drawType ? drawType.name : 'N/A'
}

const getActivityColor = (type) => {
  const colors = {
    ticket_created: 'bg-green-500',
    user_login: 'bg-blue-500',
    zone_updated: 'bg-purple-500',
    error: 'bg-red-500'
  }
  return colors[type] || 'bg-gray-500'
}

const getActivityIcon = (type) => {
  const icons = {
    ticket_created: 'TicketIcon',
    user_login: 'UserIcon',
    zone_updated: 'ZoneIcon',
    error: 'ErrorIcon'
  }
  return icons[type] || 'InfoIcon'
}

const formatTimeAgo = (timestamp) => {
  const now = new Date()
  const time = new Date(timestamp)
  const diffMs = now - time
  const diffMins = Math.floor(diffMs / (1000 * 60))
  
  if (diffMins < 1) return 'Justo ahora'
  if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`
  
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`
  
  const diffDays = Math.floor(diffHours / 24)
  return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`
}

// Inicializar gráficos
const initCharts = () => {
  // Gráfico de zonas
  if (zoneChart.value) {
    zoneChartInstance = new Chart(zoneChart.value, {
      type: 'doughnut',
      data: {
        labels: ['Zona A', 'Zona B', 'Zona C'],
        datasets: [{
          data: [300, 250, 200],
          backgroundColor: ['#3B82F6', '#10B981', '#F59E0B']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    })
  }

  // Gráfico de tendencia
  if (trendChart.value) {
    trendChartInstance = new Chart(trendChart.value, {
      type: 'line',
      data: {
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        datasets: [{
          label: 'Tickets',
          data: [65, 59, 80, 81, 56, 55, 40],
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    })
  }
}

// Watchers
watch(chartPeriod, () => {
  refreshDashboard()
})

watch(trendPeriod, () => {
  refreshDashboard()
})

// Lifecycle
onMounted(async () => {
  try {
    await Promise.all([
      catalogStore.fetchZones(),
      catalogStore.fetchDrawTypes(),
      usersStore.fetchUsers(),
      ticketsStore.fetchTickets()
    ])
    
    await refreshDashboard()
    initCharts()
  } catch (error) {
    console.error('Error initializing dashboard:', error)
  }
})

onUnmounted(() => {
  if (zoneChartInstance) {
    zoneChartInstance.destroy()
  }
  if (trendChartInstance) {
    trendChartInstance.destroy()
  }
})
</script>

<style scoped>
.dashboard-view {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>
