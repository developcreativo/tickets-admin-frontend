<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-600">Resumen general del sistema de tickets</p>
      </div>
      <div class="flex space-x-3">
        <button class="btn-secondary">
          <ArrowDownTrayIcon class="w-4 h-4 mr-2" />
          Exportar
        </button>
        <button class="btn-primary">
          <PlusIcon class="w-4 h-4 mr-2" />
          Nuevo Ticket
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
              <TicketIcon class="w-5 h-5 text-primary-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Tickets Hoy</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.ticketsToday }}</p>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-sm text-success-600 flex items-center">
            <ArrowUpIcon class="w-4 h-4 mr-1" />
            +12% vs ayer
          </span>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon class="w-5 h-5 text-success-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Ingresos Hoy</p>
            <p class="text-2xl font-bold text-gray-900">${{ stats.revenueToday }}</p>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-sm text-success-600 flex items-center">
            <ArrowUpIcon class="w-4 h-4 mr-1" />
            +8% vs ayer
          </span>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
              <UsersIcon class="w-5 h-5 text-warning-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Vendedores Activos</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.activeSellers }}</p>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-sm text-gray-600">
            De {{ stats.totalSellers }} total
          </span>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-danger-100 rounded-lg flex items-center justify-center">
              <ExclamationTriangleIcon class="w-5 h-5 text-danger-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Alertas</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.alerts }}</p>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-sm text-danger-600">
            Requieren atención
          </span>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Tickets por Zona -->
      <div class="card">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Tickets por Zona</h3>
        <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div class="text-center">
            <div class="text-4xl font-bold text-primary-600 mb-2">156</div>
            <div class="text-sm text-gray-600">Total de tickets</div>
            <div class="mt-4 space-y-2 text-sm">
              <div class="flex justify-between">
                <span>Zona Norte:</span>
                <span class="font-medium">45 tickets</span>
              </div>
              <div class="flex justify-between">
                <span>Zona Sur:</span>
                <span class="font-medium">32 tickets</span>
              </div>
              <div class="flex justify-between">
                <span>Zona Este:</span>
                <span class="font-medium">28 tickets</span>
              </div>
              <div class="flex justify-between">
                <span>Zona Oeste:</span>
                <span class="font-medium">51 tickets</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tickets por Hora -->
      <div class="card">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Tickets por Hora</h3>
        <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div class="text-center">
            <div class="text-4xl font-bold text-success-600 mb-2">25</div>
            <div class="text-sm text-gray-600">Promedio por hora</div>
            <div class="mt-4 space-y-2 text-sm">
              <div class="flex justify-between">
                <span>8:00 - 10:00:</span>
                <span class="font-medium">12 tickets</span>
              </div>
              <div class="flex justify-between">
                <span>10:00 - 12:00:</span>
                <span class="font-medium">19 tickets</span>
              </div>
              <div class="flex justify-between">
                <span>12:00 - 14:00:</span>
                <span class="font-medium">25 tickets</span>
              </div>
              <div class="flex justify-between">
                <span>14:00 - 16:00:</span>
                <span class="font-medium">32 tickets</span>
              </div>
              <div class="flex justify-between">
                <span>16:00 - 18:00:</span>
                <span class="font-medium">28 tickets</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="card">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Actividad Reciente</h3>
      <div class="space-y-4">
        <div v-for="activity in recentActivity" :key="activity.id" class="flex items-center space-x-4">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 rounded-full flex items-center justify-center"
                 :class="getActivityColor(activity.type)">
              <component :is="getActivityIcon(activity.type)" class="w-4 h-4 text-white" />
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900">{{ activity.message }}</p>
            <p class="text-sm text-gray-500">{{ activity.time }}</p>
          </div>
          <div class="flex-shrink-0">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getActivityBadgeColor(activity.type)">
              {{ activity.type }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  TicketIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ExclamationTriangleIcon,
  ArrowUpIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline'

// Stats mock data
const stats = ref({
  ticketsToday: 156,
  revenueToday: '2,450',
  activeSellers: 8,
  totalSellers: 12,
  alerts: 3
})

// Recent activity mock data
const recentActivity = ref([
  {
    id: 1,
    type: 'ticket',
    message: 'Nuevo ticket creado en Zona Norte',
    time: 'Hace 2 minutos'
  },
  {
    id: 2,
    type: 'user',
    message: 'Usuario "vendedor1" inició sesión',
    time: 'Hace 5 minutos'
  },
  {
    id: 3,
    type: 'alert',
    message: 'Límite alcanzado en número 12, Zona Sur',
    time: 'Hace 10 minutos'
  },
  {
    id: 4,
    type: 'report',
    message: 'Reporte diario generado automáticamente',
    time: 'Hace 1 hora'
  }
])

const getActivityColor = (type) => {
  const colors = {
    ticket: 'bg-primary-500',
    user: 'bg-success-500',
    alert: 'bg-danger-500',
    report: 'bg-warning-500'
  }
  return colors[type] || 'bg-gray-500'
}

const getActivityIcon = (type) => {
  const icons = {
    ticket: TicketIcon,
    user: UsersIcon,
    alert: ExclamationTriangleIcon,
    report: ChartBarIcon
  }
  return icons[type] || TicketIcon
}

const getActivityBadgeColor = (type) => {
  const colors = {
    ticket: 'bg-primary-100 text-primary-800',
    user: 'bg-success-100 text-success-800',
    alert: 'bg-danger-100 text-danger-800',
    report: 'bg-warning-100 text-warning-800'
  }
  return colors[type] || 'bg-gray-100 text-gray-800'
}
</script>
