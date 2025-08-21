<template>
  <div class="notification-center">
    <!-- Botón de notificaciones en el header -->
    <div class="relative">
      <button
        @click="toggleDropdown"
        class="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
      >
        <span class="sr-only">Ver notificaciones</span>
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M9 11h.01M9 8h.01M9 5h.01M9 2h.01M9 19h.01M9 16h.01M9 13h.01M9 10h.01M9 7h.01M9 4h.01M9 1h.01" />
        </svg>
        
        <!-- Badge de notificaciones no leídas -->
        <span
          v-if="notificationsStore.hasUnread"
          class="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
        >
          {{ notificationsStore.unreadCount > 99 ? '99+' : notificationsStore.unreadCount }}
        </span>
      </button>

      <!-- Dropdown de notificaciones -->
      <div
        v-if="isDropdownOpen"
        class="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50"
      >
        <div class="py-2">
          <!-- Header del dropdown -->
          <div class="px-4 py-2 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-medium text-gray-900">Notificaciones</h3>
              <div class="flex space-x-2">
                <button
                  @click="notificationsStore.markAllAsRead"
                  class="text-xs text-blue-600 hover:text-blue-800"
                >
                  Marcar todas como leídas
                </button>
                <button
                  @click="notificationsStore.clearAll"
                  class="text-xs text-red-600 hover:text-red-800"
                >
                  Limpiar todas
                </button>
              </div>
            </div>
          </div>

          <!-- Lista de notificaciones -->
          <div class="max-h-96 overflow-y-auto">
            <div v-if="notificationsStore.notifications.length === 0" class="px-4 py-8 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p class="mt-2 text-sm text-gray-500">No hay notificaciones</p>
            </div>

            <div
              v-for="notification in notificationsStore.recentNotifications"
              :key="notification.id"
              class="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              :class="{ 'bg-blue-50': !notification.read }"
            >
              <div class="flex items-start space-x-3">
                <!-- Icono de prioridad -->
                <div class="flex-shrink-0">
                  <div
                    class="w-2 h-2 rounded-full"
                    :class="getPriorityColor(notification.priority)"
                  ></div>
                </div>

                <!-- Contenido de la notificación -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <p class="text-sm font-medium text-gray-900">
                      {{ notification.title }}
                    </p>
                    <div class="flex items-center space-x-2">
                      <span class="text-xs text-gray-500">
                        {{ formatTimeAgo(notification.timestamp) }}
                      </span>
                      <button
                        @click="notificationsStore.removeNotification(notification.id)"
                        class="text-gray-400 hover:text-gray-600"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <p class="text-sm text-gray-600 mt-1">
                    {{ notification.message }}
                  </p>

                  <!-- Badge de categoría -->
                  <div class="mt-2 flex items-center space-x-2">
                    <span
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                      :class="getCategoryColor(notification.category)"
                    >
                      {{ notification.category }}
                    </span>
                    
                    <span
                      v-if="!notification.read"
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      Nuevo
                    </span>
                  </div>
                </div>

                <!-- Botón de marcar como leído -->
                <div v-if="!notification.read" class="flex-shrink-0">
                  <button
                    @click="notificationsStore.markAsRead(notification.id)"
                    class="text-blue-600 hover:text-blue-800 text-xs"
                  >
                    Marcar leída
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer del dropdown -->
          <div class="px-4 py-2 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <button
                @click="showAllNotifications"
                class="text-sm text-blue-600 hover:text-blue-800"
              >
                Ver todas las notificaciones
              </button>
              <button
                @click="notificationsStore.exportNotifications('json')"
                class="text-sm text-gray-600 hover:text-gray-800"
              >
                Exportar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast notifications -->
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <div
        v-for="toast in notificationsStore.toastNotifications"
        :key="toast.id"
        class="bg-white rounded-lg shadow-lg border-l-4 p-4 max-w-sm"
        :class="getToastBorderColor(toast.priority)"
      >
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0">
            <div
              class="w-6 h-6 rounded-full flex items-center justify-center"
              :class="getToastIconColor(toast.priority)"
            >
              <component :is="getToastIcon(toast.type)" class="w-4 h-4 text-white" />
            </div>
          </div>
          
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900">
              {{ toast.title }}
            </p>
            <p class="text-sm text-gray-600 mt-1">
              {{ toast.message }}
            </p>
          </div>

          <button
            @click="notificationsStore.hideToast(toast.id)"
            class="flex-shrink-0 text-gray-400 hover:text-gray-600"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useNotificationsStore } from '../../stores/notifications'

const notificationsStore = useNotificationsStore()

// Estados
const isDropdownOpen = ref(false)

// Funciones
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const showAllNotifications = () => {
  // Aquí se podría abrir una vista completa de notificaciones
  console.log('Mostrar todas las notificaciones')
  isDropdownOpen.value = false
}

const getPriorityColor = (priority) => {
  const colors = {
    low: 'bg-green-400',
    medium: 'bg-yellow-400',
    high: 'bg-orange-400',
    critical: 'bg-red-400'
  }
  return colors[priority] || 'bg-gray-400'
}

const getCategoryColor = (category) => {
  const colors = {
    ticket: 'bg-blue-100 text-blue-800',
    user: 'bg-green-100 text-green-800',
    zone: 'bg-purple-100 text-purple-800',
    system: 'bg-gray-100 text-gray-800',
    report: 'bg-indigo-100 text-indigo-800',
    error: 'bg-red-100 text-red-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800'
  }
  return colors[category] || 'bg-gray-100 text-gray-800'
}

const getToastBorderColor = (priority) => {
  const colors = {
    low: 'border-green-500',
    medium: 'border-yellow-500',
    high: 'border-orange-500',
    critical: 'border-red-500'
  }
  return colors[priority] || 'border-gray-500'
}

const getToastIconColor = (priority) => {
  const colors = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-orange-500',
    critical: 'bg-red-500'
  }
  return colors[priority] || 'bg-gray-500'
}

const getToastIcon = (type) => {
  const icons = {
    ticket_created: 'TicketIcon',
    ticket_updated: 'TicketIcon',
    ticket_deleted: 'TicketIcon',
    user_login: 'UserIcon',
    user_logout: 'UserIcon',
    zone_limit_reached: 'ExclamationIcon',
    system_alert: 'InformationIcon',
    report_generated: 'ChartIcon',
    cache_cleared: 'CogIcon',
    error_occurred: 'ExclamationIcon',
    success: 'CheckIcon',
    warning: 'ExclamationIcon'
  }
  return icons[type] || 'InformationIcon'
}

const formatTimeAgo = (timestamp) => {
  const now = new Date()
  const time = new Date(timestamp)
  const diffMs = now - time
  const diffMins = Math.floor(diffMs / (1000 * 60))
  
  if (diffMins < 1) return 'Justo ahora'
  if (diffMins < 60) return `Hace ${diffMins} min`
  
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `Hace ${diffHours} h`
  
  const diffDays = Math.floor(diffHours / 24)
  return `Hace ${diffDays} d`
}

// Cerrar dropdown al hacer clic fuera
const handleClickOutside = (event) => {
  if (!event.target.closest('.notification-center')) {
    isDropdownOpen.value = false
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  notificationsStore.initialize()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.notification-center {
  position: relative;
}

/* Scrollbar personalizado para el dropdown */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
