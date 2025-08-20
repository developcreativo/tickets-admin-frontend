<template>
  <div class="reports-view">
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Reportes y Estadísticas</h1>
        <div class="flex space-x-3">
          <button 
            @click="exportReport"
            class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Exportar Reporte
          </button>
          <button 
            @click="refreshData"
            class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Actualizar Datos
          </button>
        </div>
      </div>

      <!-- Filtros de fecha -->
      <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio</label>
            <input 
              v-model="dateRange.start"
              type="date" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Fecha Fin</label>
            <input 
              v-model="dateRange.end"
              type="date" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Reporte</label>
            <select 
              v-model="selectedReportType"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="sales">Ventas</option>
              <option value="events">Eventos</option>
              <option value="users">Usuarios</option>
              <option value="revenue">Ingresos</option>
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

      <!-- Tarjetas de resumen -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Ventas Totales</p>
              <p class="text-2xl font-semibold text-gray-900">{{ formatCurrency(summary.totalSales) }}</p>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-sm text-green-600 font-medium">+12.5%</span>
            <span class="text-sm text-gray-500 ml-1">vs mes anterior</span>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Tickets Vendidos</p>
              <p class="text-2xl font-semibold text-gray-900">{{ summary.ticketsSold }}</p>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-sm text-green-600 font-medium">+8.2%</span>
            <span class="text-sm text-gray-500 ml-1">vs mes anterior</span>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
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
              <p class="text-2xl font-semibold text-gray-900">{{ summary.activeUsers }}</p>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-sm text-green-600 font-medium">+15.3%</span>
            <span class="text-sm text-gray-500 ml-1">vs mes anterior</span>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Eventos Activos</p>
              <p class="text-2xl font-semibold text-gray-900">{{ summary.activeEvents }}</p>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-sm text-green-600 font-medium">+5.7%</span>
            <span class="text-sm text-gray-500 ml-1">vs mes anterior</span>
          </div>
        </div>
      </div>

      <!-- Gráficos y tablas -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Gráfico de ventas -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Ventas por Mes</h3>
          <div class="h-64 flex items-end justify-between space-x-2">
            <div 
              v-for="(month, index) in salesChart" 
              :key="index"
              class="flex-1 bg-blue-100 rounded-t"
              :style="{ height: `${(month.value / maxSalesValue) * 100}%` }"
            >
              <div class="bg-blue-600 rounded-t h-full"></div>
            </div>
          </div>
          <div class="flex justify-between mt-4 text-sm text-gray-500">
            <span v-for="(month, index) in salesChart" :key="index">{{ month.label }}</span>
          </div>
        </div>

        <!-- Gráfico de eventos populares -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Eventos Más Populares</h3>
          <div class="space-y-4">
            <div v-for="event in popularEvents" :key="event.id" class="flex items-center">
              <div class="flex-1">
                <div class="flex justify-between text-sm">
                  <span class="font-medium text-gray-900">{{ event.name }}</span>
                  <span class="text-gray-500">{{ event.tickets }} tickets</span>
                </div>
                <div class="mt-1 bg-gray-200 rounded-full h-2">
                  <div 
                    class="bg-blue-600 h-2 rounded-full" 
                    :style="{ width: `${(event.tickets / maxTickets) * 100}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla de reportes detallados -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Reporte Detallado</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Evento
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tickets Vendidos
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ingresos
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="report in detailedReports" :key="report.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ report.eventName }}</div>
                  <div class="text-sm text-gray-500">{{ report.category }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDate(report.date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ report.ticketsSold }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatCurrency(report.revenue) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full" 
                        :class="getStatusClass(report.status)">
                    {{ report.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'ReportsView',
  setup() {
    const dateRange = ref({
      start: '',
      end: ''
    })
    const selectedReportType = ref('sales')
    const summary = ref({
      totalSales: 0,
      ticketsSold: 0,
      activeUsers: 0,
      activeEvents: 0
    })

    // Datos de ejemplo para gráficos
    const salesChart = ref([
      { label: 'Ene', value: 15000 },
      { label: 'Feb', value: 18000 },
      { label: 'Mar', value: 22000 },
      { label: 'Abr', value: 19000 },
      { label: 'May', value: 25000 },
      { label: 'Jun', value: 28000 }
    ])

    const popularEvents = ref([
      { id: 1, name: 'Concierto de Rock', tickets: 150 },
      { id: 2, name: 'Partido de Fútbol', tickets: 120 },
      { id: 3, name: 'Obra de Teatro', tickets: 80 },
      { id: 4, name: 'Festival de Música', tickets: 200 },
      { id: 5, name: 'Exposición de Arte', tickets: 60 }
    ])

    const detailedReports = ref([
      {
        id: 1,
        eventName: 'Concierto de Rock',
        category: 'Conciertos',
        date: '2024-01-15',
        ticketsSold: 150,
        revenue: 7500,
        status: 'completado'
      },
      {
        id: 2,
        eventName: 'Partido de Fútbol',
        category: 'Deportes',
        date: '2024-01-20',
        ticketsSold: 120,
        revenue: 3600,
        status: 'completado'
      },
      {
        id: 3,
        eventName: 'Obra de Teatro',
        category: 'Teatro',
        date: '2024-01-25',
        ticketsSold: 80,
        revenue: 2000,
        status: 'programado'
      },
      {
        id: 4,
        eventName: 'Festival de Música',
        category: 'Eventos',
        date: '2024-02-01',
        ticketsSold: 200,
        revenue: 10000,
        status: 'programado'
      }
    ])

    const maxSalesValue = computed(() => {
      return Math.max(...salesChart.value.map(item => item.value))
    })

    const maxTickets = computed(() => {
      return Math.max(...popularEvents.value.map(event => event.tickets))
    })

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD'
      }).format(amount)
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const getStatusClass = (status) => {
      const classes = {
        completado: 'bg-green-100 text-green-800',
        programado: 'bg-blue-100 text-blue-800',
        cancelado: 'bg-red-100 text-red-800'
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    }

    const loadSummaryData = () => {
      // Simular carga de datos desde API
      summary.value = {
        totalSales: 125000,
        ticketsSold: 1250,
        activeUsers: 450,
        activeEvents: 12
      }
    }

    const generateReport = () => {
      // Simular generación de reporte
      console.log('Generando reporte...', {
        dateRange: dateRange.value,
        reportType: selectedReportType.value
      })
    }

    const exportReport = () => {
      // Simular exportación
      console.log('Exportando reporte...')
    }

    const refreshData = () => {
      loadSummaryData()
    }

    onMounted(() => {
      // Establecer fechas por defecto (último mes)
      const today = new Date()
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
      
      dateRange.value = {
        start: lastMonth.toISOString().split('T')[0],
        end: today.toISOString().split('T')[0]
      }
      
      loadSummaryData()
    })

    return {
      dateRange,
      selectedReportType,
      summary,
      salesChart,
      popularEvents,
      detailedReports,
      maxSalesValue,
      maxTickets,
      formatCurrency,
      formatDate,
      getStatusClass,
      generateReport,
      exportReport,
      refreshData
    }
  }
}
</script>

<style scoped>
.reports-view {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>
