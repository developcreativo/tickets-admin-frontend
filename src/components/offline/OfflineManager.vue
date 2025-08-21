<template>
  <div class="offline-manager">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-medium text-gray-900">Gestión Offline</h2>
          <p class="text-sm text-gray-500">Gestiona el modo offline y la sincronización de datos</p>
        </div>
        <div class="flex items-center space-x-3">
          <div class="flex items-center space-x-2">
            <div
              :class="[
                'w-3 h-3 rounded-full',
                isOnline ? 'bg-green-500' : 'bg-red-500'
              ]"
            ></div>
            <span class="text-sm text-gray-600">
              {{ isOnline ? 'En línea' : 'Sin conexión' }}
            </span>
          </div>
          <button
            @click="syncAllData"
            :disabled="!isOnline || isSyncing"
            class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="isSyncing" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {{ isSyncing ? 'Sincronizando...' : 'Sincronizar Todo' }}
          </button>
        </div>
      </div>
    </div>

    <div class="flex">
      <!-- Sidebar de estado -->
      <div class="w-80 bg-gray-50 border-r border-gray-200 p-6">
        <!-- Estado de conexión -->
        <div class="mb-6">
          <h3 class="text-sm font-medium text-gray-900 mb-4">Estado de Conexión</h3>
          <div class="space-y-3">
            <div class="bg-white rounded-lg p-4 border border-gray-200">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700">Conexión a Internet</span>
                <span
                  :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ isOnline ? 'Conectado' : 'Desconectado' }}
                </span>
              </div>
              <p class="text-xs text-gray-500 mt-1">
                Última verificación: {{ lastConnectionCheck }}
              </p>
            </div>

            <div class="bg-white rounded-lg p-4 border border-gray-200">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700">Backend</span>
                <span
                  :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    backendStatus === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ backendStatus === 'online' ? 'Disponible' : 'No disponible' }}
                </span>
              </div>
              <p class="text-xs text-gray-500 mt-1">
                {{ backendStatus === 'online' ? 'Servidor respondiendo' : 'Error de conexión' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Configuración offline -->
        <div class="mb-6">
          <h3 class="text-sm font-medium text-gray-900 mb-4">Configuración Offline</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-700">Modo Offline</span>
              <button
                @click="toggleOfflineMode"
                :class="[
                  'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                  offlineMode ? 'bg-blue-600' : 'bg-gray-200'
                ]"
              >
                <span
                  :class="[
                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                    offlineMode ? 'translate-x-5' : 'translate-x-0'
                  ]"
                ></span>
              </button>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-700">Sincronización Automática</span>
              <button
                @click="toggleAutoSync"
                :class="[
                  'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                  autoSync ? 'bg-blue-600' : 'bg-gray-200'
                ]"
              >
                <span
                  :class="[
                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                    autoSync ? 'translate-x-5' : 'translate-x-0'
                  ]"
                ></span>
              </button>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-700">Almacenamiento Local</span>
              <span class="text-sm text-gray-900">{{ storageUsage }}</span>
            </div>
          </div>
        </div>

        <!-- Información del sistema -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 class="text-sm font-medium text-blue-800 mb-2">Información del Sistema</h4>
          <ul class="text-xs text-blue-700 space-y-1">
            <li>• Los datos se almacenan localmente</li>
            <li>• La sincronización es automática</li>
            <li>• Funciona sin conexión a internet</li>
            <li>• Los cambios se sincronizan al reconectar</li>
          </ul>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="flex-1 p-6">
        <!-- Resumen de estado -->
        <div class="mb-8">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Resumen del Estado</h3>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-500">Datos Locales</p>
                  <p class="text-2xl font-semibold text-gray-900">{{ localDataCount }}</p>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-500">Sincronizados</p>
                  <p class="text-2xl font-semibold text-gray-900">{{ syncedDataCount }}</p>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-500">Pendientes</p>
                  <p class="text-2xl font-semibold text-gray-900">{{ pendingDataCount }}</p>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-500">Errores</p>
                  <p class="text-2xl font-semibold text-gray-900">{{ errorCount }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Cola de sincronización -->
        <div class="mb-8">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Cola de Sincronización</h3>
          <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div class="grid grid-cols-5 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div>Tipo</div>
                <div>Acción</div>
                <div>Datos</div>
                <div>Estado</div>
                <div>Acciones</div>
              </div>
            </div>
            <div class="divide-y divide-gray-200">
              <div
                v-for="item in syncQueue"
                :key="item.id"
                class="px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div class="grid grid-cols-5 gap-4 items-center">
                  <div>
                    <div class="flex items-center space-x-2">
                      <div class="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center">
                        <component :is="getSyncItemIcon(item.type)" class="w-4 h-4 text-gray-600" />
                      </div>
                      <span class="text-sm font-medium text-gray-900">{{ getSyncItemTypeName(item.type) }}</span>
                    </div>
                  </div>
                  <div>
                    <span class="text-sm text-gray-700">{{ item.action }}</span>
                  </div>
                  <div>
                    <span class="text-sm text-gray-700">{{ item.dataSummary }}</span>
                  </div>
                  <div>
                    <span
                      :class="[
                        'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                        getStatusColor(item.status)
                      ]"
                    >
                      {{ getStatusName(item.status) }}
                    </span>
                  </div>
                  <div>
                    <div class="flex space-x-2">
                      <button
                        v-if="item.status === 'pending'"
                        @click="retrySync(item.id)"
                        class="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Reintentar
                      </button>
                      <button
                        v-if="item.status === 'error'"
                        @click="viewError(item.id)"
                        class="text-red-600 hover:text-red-800 text-sm"
                      >
                        Ver Error
                      </button>
                      <button
                        @click="removeFromQueue(item.id)"
                        class="text-gray-600 hover:text-gray-800 text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Historial de sincronización -->
        <div class="mb-8">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Historial de Sincronización</h3>
          <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div class="grid grid-cols-4 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div>Fecha</div>
                <div>Tipo</div>
                <div>Resultado</div>
                <div>Duración</div>
              </div>
            </div>
            <div class="divide-y divide-gray-200">
              <div
                v-for="sync in syncHistory"
                :key="sync.id"
                class="px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div class="grid grid-cols-4 gap-4 items-center">
                  <div>
                    <span class="text-sm text-gray-900">{{ formatDate(sync.timestamp) }}</span>
                  </div>
                  <div>
                    <span class="text-sm text-gray-700">{{ sync.type }}</span>
                  </div>
                  <div>
                    <span
                      :class="[
                        'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                        sync.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      ]"
                    >
                      {{ sync.success ? 'Éxito' : 'Error' }}
                    </span>
                  </div>
                  <div>
                    <span class="text-sm text-gray-700">{{ sync.duration }}ms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Configuración avanzada -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">Configuración Avanzada</h3>
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Intervalo de Sincronización (minutos)
                </label>
                <input
                  v-model="syncInterval"
                  type="number"
                  min="1"
                  max="60"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  @change="updateSyncInterval"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Tiempo de espera (segundos)
                </label>
                <input
                  v-model="syncTimeout"
                  type="number"
                  min="5"
                  max="60"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  @change="updateSyncTimeout"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Tamaño máximo de cola
                </label>
                <input
                  v-model="maxQueueSize"
                  type="number"
                  min="10"
                  max="1000"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  @change="updateMaxQueueSize"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Intentos de reintento
                </label>
                <input
                  v-model="maxRetries"
                  type="number"
                  min="1"
                  max="10"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  @change="updateMaxRetries"
                />
              </div>
            </div>
            <div class="mt-6">
              <button
                @click="clearSyncHistory"
                class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Limpiar Historial
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Estados
const isOnline = ref(navigator.onLine)
const backendStatus = ref('unknown')
const isSyncing = ref(false)
const offlineMode = ref(false)
const autoSync = ref(true)
const syncInterval = ref(5)
const syncTimeout = ref(30)
const maxQueueSize = ref(100)
const maxRetries = ref(3)

// Datos de ejemplo
const syncQueue = ref([
  {
    id: 1,
    type: 'ticket',
    action: 'create',
    dataSummary: 'Ticket #12345',
    status: 'pending',
    timestamp: new Date().toISOString()
  },
  {
    id: 2,
    type: 'user',
    action: 'update',
    dataSummary: 'Usuario admin',
    status: 'synced',
    timestamp: new Date().toISOString()
  },
  {
    id: 3,
    type: 'report',
    action: 'export',
    dataSummary: 'Reporte ventas',
    status: 'error',
    timestamp: new Date().toISOString()
  }
])

const syncHistory = ref([
  {
    id: 1,
    type: 'Manual',
    success: true,
    timestamp: new Date().toISOString(),
    duration: 1250
  },
  {
    id: 2,
    type: 'Automática',
    success: false,
    timestamp: new Date(Date.now() - 60000).toISOString(),
    duration: 5000
  }
])

// Computed
const lastConnectionCheck = computed(() => {
  return new Date().toLocaleTimeString('es-ES')
})

const storageUsage = computed(() => {
  const used = localStorage.length
  const total = 10 * 1024 * 1024 // 10MB
  const percentage = Math.round((used / total) * 100)
  return `${percentage}% (${Math.round(used / 1024)}KB)`
})

const localDataCount = computed(() => {
  return syncQueue.value.filter(item => item.status === 'pending').length
})

const syncedDataCount = computed(() => {
  return syncQueue.value.filter(item => item.status === 'synced').length
})

const pendingDataCount = computed(() => {
  return syncQueue.value.filter(item => item.status === 'pending').length
})

const errorCount = computed(() => {
  return syncQueue.value.filter(item => item.status === 'error').length
})

// Funciones
const toggleOfflineMode = () => {
  offlineMode.value = !offlineMode.value
  localStorage.setItem('offline_mode', offlineMode.value)
}

const toggleAutoSync = () => {
  autoSync.value = !autoSync.value
  localStorage.setItem('auto_sync', autoSync.value)
}

const syncAllData = async () => {
  if (!isOnline.value) return
  
  isSyncing.value = true
  try {
    // Simular sincronización
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Actualizar estado de elementos en cola
    syncQueue.value.forEach(item => {
      if (item.status === 'pending') {
        item.status = 'synced'
      }
    })
    
    // Agregar al historial
    syncHistory.value.unshift({
      id: Date.now(),
      type: 'Manual',
      success: true,
      timestamp: new Date().toISOString(),
      duration: 2000
    })
    
  } catch (error) {
    console.error('Error syncing data:', error)
  } finally {
    isSyncing.value = false
  }
}

const retrySync = (itemId) => {
  const item = syncQueue.value.find(i => i.id === itemId)
  if (item) {
    item.status = 'pending'
  }
}

const viewError = (itemId) => {
  const item = syncQueue.value.find(i => i.id === itemId)
  if (item) {
    alert(`Error en sincronización: ${item.dataSummary}`)
  }
}

const removeFromQueue = (itemId) => {
  syncQueue.value = syncQueue.value.filter(i => i.id !== itemId)
}

const clearSyncHistory = () => {
  if (confirm('¿Estás seguro de que quieres limpiar el historial de sincronización?')) {
    syncHistory.value = []
  }
}

const updateSyncInterval = () => {
  localStorage.setItem('sync_interval', syncInterval.value)
}

const updateSyncTimeout = () => {
  localStorage.setItem('sync_timeout', syncTimeout.value)
}

const updateMaxQueueSize = () => {
  localStorage.setItem('max_queue_size', maxQueueSize.value)
}

const updateMaxRetries = () => {
  localStorage.setItem('max_retries', maxRetries.value)
}

const getSyncItemIcon = (type) => {
  const icons = {
    ticket: 'TicketIcon',
    user: 'UserIcon',
    report: 'ChartIcon',
    catalog: 'FolderIcon'
  }
  return icons[type] || 'QuestionMarkCircleIcon'
}

const getSyncItemTypeName = (type) => {
  const names = {
    ticket: 'Ticket',
    user: 'Usuario',
    report: 'Reporte',
    catalog: 'Catálogo'
  }
  return names[type] || type
}

const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    synced: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getStatusName = (status) => {
  const names = {
    pending: 'Pendiente',
    synced: 'Sincronizado',
    error: 'Error'
  }
  return names[status] || status
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const checkBackendStatus = async () => {
  try {
    const response = await fetch('/api/health/', { 
      method: 'GET',
      timeout: 5000
    })
    backendStatus.value = response.ok ? 'online' : 'offline'
  } catch (error) {
    backendStatus.value = 'offline'
  }
}

const handleOnline = () => {
  isOnline.value = true
  if (autoSync.value) {
    syncAllData()
  }
}

const handleOffline = () => {
  isOnline.value = false
}

// Lifecycle
onMounted(() => {
  // Cargar configuraciones guardadas
  const savedOfflineMode = localStorage.getItem('offline_mode')
  const savedAutoSync = localStorage.getItem('auto_sync')
  const savedSyncInterval = localStorage.getItem('sync_interval')
  const savedSyncTimeout = localStorage.getItem('sync_timeout')
  const savedMaxQueueSize = localStorage.getItem('max_queue_size')
  const savedMaxRetries = localStorage.getItem('max_retries')

  if (savedOfflineMode !== null) offlineMode.value = savedOfflineMode === 'true'
  if (savedAutoSync !== null) autoSync.value = savedAutoSync === 'true'
  if (savedSyncInterval) syncInterval.value = parseInt(savedSyncInterval)
  if (savedSyncTimeout) syncTimeout.value = parseInt(savedSyncTimeout)
  if (savedMaxQueueSize) maxQueueSize.value = parseInt(savedMaxQueueSize)
  if (savedMaxRetries) maxRetries.value = parseInt(savedMaxRetries)

  // Verificar estado del backend
  checkBackendStatus()

  // Configurar listeners de conexión
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)

  // Configurar verificación periódica del backend
  const backendCheckInterval = setInterval(checkBackendStatus, 30000) // Cada 30 segundos

  // Limpiar intervalo al desmontar
  onUnmounted(() => {
    clearInterval(backendCheckInterval)
  })
})

onUnmounted(() => {
  window.removeEventListener('online', handleOnline)
  window.removeEventListener('offline', handleOffline)
})
</script>

<style scoped>
.offline-manager {
  min-height: 100vh;
  background-color: #f9fafb;
}

/* Transiciones suaves */
* {
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

/* Indicador de estado de conexión */
.connection-indicator {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

/* Estado offline */
.offline-mode .offline-manager {
  opacity: 0.8;
}

.offline-mode .bg-blue-600 {
  background-color: #6b7280;
}
</style>
