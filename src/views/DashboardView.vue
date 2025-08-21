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
          <button 
            @click="toggleAutoRefresh"
            :class="autoRefresh ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'"
            class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg class="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF' }}
        </button>
      </div>
    </div>

      <!-- Tarjetas de estadísticas principales -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total de Tickets -->
        <div class="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total Tickets</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.totalTickets.toLocaleString() }}</p>
              <div class="flex items-center mt-1">
                <span :class="stats.ticketsGrowth >= 0 ? 'text-green-600' : 'text-red-600'" class="text-sm font-medium">
                  {{ stats.ticketsGrowth >= 0 ? '+' : '' }}{{ stats.ticketsGrowth }}%
                </span>
                <span class="text-gray-400 text-sm ml-1">vs mes anterior</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Total de Piezas -->
        <div class="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
        <div class="flex items-center">
          <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total Piezas</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.totalPieces.toLocaleString() }}</p>
              <div class="flex items-center mt-1">
                <span :class="stats.piecesGrowth >= 0 ? 'text-green-600' : 'text-red-600'" class="text-sm font-medium">
                  {{ stats.piecesGrowth >= 0 ? '+' : '' }}{{ stats.piecesGrowth }}%
                </span>
                <span class="text-gray-400 text-sm ml-1">vs mes anterior</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Usuarios Activos -->
        <div class="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
          </div>
          <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Usuarios Activos</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.activeUsers }}</p>
              <div class="flex items-center mt-1">
                <span :class="stats.usersGrowth >= 0 ? 'text-green-600' : 'text-red-600'" class="text-sm font-medium">
                  {{ stats.usersGrowth >= 0 ? '+' : '' }}{{ stats.usersGrowth }}%
                </span>
                <span class="text-gray-400 text-sm ml-1">vs mes anterior</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Zonas Activas -->
        <div class="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Zonas Activas</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.activeZones }}/{{ stats.totalZones }}</p>
              <div class="flex items-center mt-1">
                <span class="text-sm text-gray-500">
                  {{ Math.round((stats.activeZones / stats.totalZones) * 100) }}% activas
          </span>
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

      <!-- Nuevos gráficos de auditoría y exportación -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Gráfico de actividad del sistema -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Actividad del Sistema</h3>
            <div class="flex space-x-2">
              <button 
                @click="auditPeriod = '1h'"
                :class="auditPeriod === '1h' ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:text-gray-700'"
                class="px-3 py-1 text-sm font-medium rounded-md transition-colors"
              >
                1h
              </button>
              <button 
                @click="auditPeriod = '24h'"
                :class="auditPeriod === '24h' ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:text-gray-700'"
                class="px-3 py-1 text-sm font-medium rounded-md transition-colors"
              >
                24h
              </button>
            </div>
          </div>
          <div class="h-64">
            <canvas ref="auditChart" class="w-full h-full"></canvas>
          </div>
        </div>

        <!-- Gráfico de exportaciones -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Exportaciones por Formato</h3>
            <div class="flex space-x-2">
              <button 
                @click="exportPeriod = '7d'"
                :class="exportPeriod === '7d' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'"
                class="px-3 py-1 text-sm font-medium rounded-md transition-colors"
              >
                7d
              </button>
              <button 
                @click="exportPeriod = '30d'"
                :class="exportPeriod === '30d' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'"
                class="px-3 py-1 text-sm font-medium rounded-md transition-colors"
              >
                30d
              </button>
            </div>
          </div>
          <div class="h-64">
            <canvas ref="exportChart" class="w-full h-full"></canvas>
          </div>
        </div>
      </div>

      <!-- Actividad reciente y métricas adicionales -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Actividad reciente -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Actividad Reciente</h3>
          <div class="space-y-3">
            <div v-for="activity in recentActivity" :key="activity.id" class="flex items-start space-x-3">
          <div class="flex-shrink-0">
                <div class="w-2 h-2 rounded-full mt-2" :class="getActivityColor(activity.type)"></div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
                <p class="text-sm text-gray-500">{{ activity.description }}</p>
                <p class="text-xs text-gray-400">{{ formatTimeAgo(activity.timestamp) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Top zonas -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Top Zonas</h3>
          <div class="space-y-3">
            <div v-for="zone in topZones" :key="zone.id" class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-900">{{ zone.name }}</span>
              <div class="flex items-center space-x-2">
                <div class="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    class="bg-blue-600 h-2 rounded-full" 
                    :style="{ width: `${(zone.tickets / maxZoneTickets) * 100}%` }"
                  ></div>
                </div>
                <span class="text-sm text-gray-500 w-8 text-right">{{ zone.tickets }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Métricas de rendimiento -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Rendimiento</h3>
          <div class="space-y-4">
            <div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Tickets/hora</span>
                <span class="font-medium text-gray-900">{{ performance.ticketsPerHour }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  class="bg-green-600 h-2 rounded-full" 
                  :style="{ width: `${Math.min((performance.ticketsPerHour / 50) * 100, 100)}%` }"
                ></div>
              </div>
            </div>
            <div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Piezas/ticket</span>
                <span class="font-medium text-gray-900">{{ performance.avgPiecesPerTicket }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  class="bg-blue-600 h-2 rounded-full" 
                  :style="{ width: `${Math.min((performance.avgPiecesPerTicket / 10) * 100, 100)}%` }"
                ></div>
              </div>
            </div>
            <div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Tiempo respuesta</span>
                <span class="font-medium text-gray-900">{{ performance.responseTime }}ms</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  class="bg-yellow-600 h-2 rounded-full" 
                  :style="{ width: `${Math.min((performance.responseTime / 200) * 100, 100)}%` }"
                ></div>
              </div>
            </div>
            <div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Uptime</span>
                <span class="font-medium text-gray-900">{{ performance.uptime }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  class="bg-green-600 h-2 rounded-full" 
                  :style="{ width: performance.uptime }"
                ></div>
        </div>
      </div>
    </div>
        </div>
      </div>

      <!-- Alertas y notificaciones críticas -->
      <div v-if="criticalAlerts.length > 0" class="mt-8">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Alertas Críticas</h3>
        <div class="bg-red-50 border border-red-200 rounded-lg p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
        </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Alertas del Sistema</h3>
              <div class="mt-2 text-sm text-red-700">
                <ul class="list-disc pl-5 space-y-1">
                  <li v-for="alert in criticalAlerts" :key="alert.id">{{ alert.message }}</li>
                </ul>
    </div>
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
import { useExportStore } from '../stores/export'
import { useAuditStore } from '../stores/audit'
import Chart from 'chart.js/auto'

// Stores
const reportsStore = useReportsStore()
const catalogStore = useCatalogStore()
const usersStore = useUsersStore()
const ticketsStore = useTicketsStore()
const exportStore = useExportStore()
const auditStore = useAuditStore()

// Estados
const isLoading = ref(false)
const lastUpdate = ref('Nunca')
const autoRefresh = ref(false)
const chartPeriod = ref('month')
const trendPeriod = ref('7d')
const auditPeriod = ref('24h')
const exportPeriod = ref('7d')

// Referencias de canvas
const zoneChart = ref(null)
const trendChart = ref(null)
const auditChart = ref(null)
const exportChart = ref(null)

// Instancias de Chart.js
let zoneChartInstance = null
let trendChartInstance = null
let auditChartInstance = null
let exportChartInstance = null

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

const criticalAlerts = ref([])

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
      loadPerformanceMetrics(),
      loadAuditStats(),
      loadExportStats()
    ])
    lastUpdate.value = new Date().toLocaleTimeString('es-ES')
    updateCharts()
  } catch (error) {
    console.error('Error refreshing dashboard:', error)
  } finally {
    isLoading.value = false
  }
}

const toggleAutoRefresh = () => {
  autoRefresh.value = !autoRefresh.value
  if (autoRefresh.value) {
    startAutoRefresh()
  } else {
    stopAutoRefresh()
  }
}

let autoRefreshInterval = null

const startAutoRefresh = () => {
  autoRefreshInterval = setInterval(() => {
    refreshDashboard()
  }, 30000) // Actualizar cada 30 segundos
}

const stopAutoRefresh = () => {
  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval)
    autoRefreshInterval = null
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
    // Simular actividad reciente basada en tickets y auditoría
    const tickets = ticketsStore.tickets.slice(0, 3)
    const auditLogs = auditStore.recentLogs.slice(0, 2)
    
    recentActivity.value = [
      ...tickets.map(ticket => ({
        id: ticket.id,
        type: 'ticket_created',
        title: `Ticket #${ticket.id} creado`,
        description: `Zona: ${getZoneName(ticket.zone)} - ${getDrawTypeName(ticket.draw_type)}`,
        timestamp: ticket.created_at
      })),
      ...auditLogs.map(log => ({
        id: log.id,
        type: log.type,
        title: log.action || log.message,
        description: log.resource || log.component,
        timestamp: log.timestamp
      }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5)
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

const loadAuditStats = async () => {
  try {
    const auditStats = auditStore.getAuditStats(auditPeriod.value)
    
    // Generar alertas críticas
    criticalAlerts.value = []
    
    if (auditStats.critical_count > 0) {
      criticalAlerts.value.push({
        id: 'critical_logs',
        message: `${auditStats.critical_count} eventos críticos detectados`
      })
    }
    
    if (auditStats.errors_count > 10) {
      criticalAlerts.value.push({
        id: 'high_errors',
        message: `${auditStats.errors_count} errores en las últimas ${auditPeriod.value}`
      })
    }
  } catch (error) {
    console.error('Error loading audit stats:', error)
  }
}

const loadExportStats = async () => {
  try {
    // Simular estadísticas de exportación
    console.log('Export stats loaded')
  } catch (error) {
    console.error('Error loading export stats:', error)
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
    error: 'bg-red-500',
    create: 'bg-green-500',
    update: 'bg-blue-500',
    delete: 'bg-red-500'
  }
  return colors[type] || 'bg-gray-500'
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

  // Gráfico de auditoría
  if (auditChart.value) {
    auditChartInstance = new Chart(auditChart.value, {
      type: 'bar',
      data: {
        labels: ['Info', 'Warning', 'Error', 'Critical'],
        datasets: [{
          label: 'Eventos',
          data: [45, 12, 8, 2],
          backgroundColor: ['#10B981', '#F59E0B', '#EF4444', '#DC2626']
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

  // Gráfico de exportaciones
  if (exportChart.value) {
    exportChartInstance = new Chart(exportChart.value, {
      type: 'pie',
      data: {
        labels: ['PDF', 'Excel', 'CSV', 'JSON'],
        datasets: [{
          data: [25, 40, 20, 15],
          backgroundColor: ['#EF4444', '#10B981', '#3B82F6', '#8B5CF6']
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
}

const updateCharts = () => {
  // Actualizar datos de los gráficos según los filtros
  if (zoneChartInstance) {
    // Actualizar datos del gráfico de zonas
  }
  
  if (trendChartInstance) {
    // Actualizar datos del gráfico de tendencia
  }
  
  if (auditChartInstance) {
    // Actualizar datos del gráfico de auditoría
  }
  
  if (exportChartInstance) {
    // Actualizar datos del gráfico de exportaciones
  }
}

// Watchers
watch(chartPeriod, () => {
  refreshDashboard()
})

watch(trendPeriod, () => {
  refreshDashboard()
})

watch(auditPeriod, () => {
  refreshDashboard()
})

watch(exportPeriod, () => {
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
  if (auditChartInstance) {
    auditChartInstance.destroy()
  }
  if (exportChartInstance) {
    exportChartInstance.destroy()
  }
  
  stopAutoRefresh()
})
</script>

<style scoped>
.dashboard-view {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>
