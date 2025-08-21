<template>
  <div class="settings-view min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Configuración</h1>
        <p class="text-gray-600 dark:text-gray-300">Personaliza la aplicación según tus preferencias</p>
      </div>

      <!-- Navegación por pestañas -->
      <div class="mb-8">
        <nav class="flex space-x-8 border-b border-gray-200 dark:border-gray-700">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-200 hover:border-gray-300'
            ]"
          >
            <div class="flex items-center space-x-2">
              <component :is="tab.icon" class="w-5 h-5" />
              <span>{{ tab.name }}</span>
            </div>
          </button>
        </nav>
      </div>

      <!-- Contenido de las pestañas -->
      <div class="tab-content">
        <!-- Pestaña de Temas -->
        <div v-if="activeTab === 'themes'" class="space-y-6">
          <ThemeCustomizer />
        </div>

        <!-- Pestaña de Atajos de Teclado -->
        <div v-if="activeTab === 'shortcuts'" class="space-y-6">
          <KeyboardShortcuts />
        </div>

        <!-- Pestaña de Modo Offline -->
        <div v-if="activeTab === 'offline'" class="space-y-6">
          <OfflineManager />
        </div>

        <!-- Pestaña de Notificaciones -->
        <div v-if="activeTab === 'notifications'" class="space-y-6">
          <div class="bg-white dark:bg-gray-800 dark:border-gray-700 rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Configuración de Notificaciones</h3>
            
            <!-- Preferencias de notificaciones -->
            <div class="space-y-6">
              <div>
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Tipos de Notificaciones</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    v-for="(enabled, category) in notificationPreferences"
                    :key="category"
                    class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <span class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ getCategoryName(category) }}</span>
                      <p class="text-xs text-gray-500 dark:text-gray-300">{{ getCategoryDescription(category) }}</p>
                    </div>
                    <button
                      @click="updateNotificationPreference(category, !enabled)"
                      :class="[
                        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                        enabled ? 'bg-blue-600' : 'bg-gray-200'
                      ]"
                    >
                      <span
                        :class="[
                          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-gray-900 shadow ring-0 transition duration-200 ease-in-out',
                          enabled ? 'translate-x-5' : 'translate-x-0'
                        ]"
                      ></span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Configuración de sonidos -->
              <div>
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Sonidos y Alertas</h4>
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-700 dark:text-gray-300">Sonidos de notificación</span>
                    <button
                      @click="notificationsStore.toggleSound"
                      :class="[
                        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                        notificationsStore.soundEnabled ? 'bg-blue-600' : 'bg-gray-200'
                      ]"
                    >
                      <span
                        :class="[
                          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-gray-900 shadow ring-0 transition duration-200 ease-in-out',
                          notificationsStore.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                        ]"
                      ></span>
                    </button>
                  </div>

                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-700 dark:text-gray-300">Notificaciones del navegador</span>
                    <button
                      @click="notificationsStore.toggleDesktopNotifications"
                      :class="[
                        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                        notificationsStore.desktopNotifications ? 'bg-blue-600' : 'bg-gray-200'
                      ]"
                    >
                      <span
                        :class="[
                          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-gray-900 shadow ring-0 transition duration-200 ease-in-out',
                          notificationsStore.desktopNotifications ? 'translate-x-5' : 'translate-x-0'
                        ]"
                      ></span>
                    </button>
                  </div>

                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-700 dark:text-gray-300">Notificaciones push</span>
                    <button
                      @click="notificationsStore.togglePushNotifications"
                      :class="[
                        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                        notificationsStore.pushNotifications ? 'bg-blue-600' : 'bg-gray-200'
                      ]"
                    >
                      <span
                        :class="[
                          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-gray-900 shadow ring-0 transition duration-200 ease-in-out',
                          notificationsStore.pushNotifications ? 'translate-x-5' : 'translate-x-0'
                        ]"
                      ></span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Estadísticas de notificaciones -->
              <div>
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Estadísticas</h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p class="text-xs text-gray-500 dark:text-gray-300">Total</p>
                    <p class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ notificationStats.total }}</p>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p class="text-xs text-gray-500 dark:text-gray-300">No leídas</p>
                    <p class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ notificationStats.unread }}</p>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p class="text-xs text-gray-500 dark:text-gray-300">Críticas</p>
                    <p class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ notificationStats.critical }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pestaña de Usuario -->
        <div v-if="activeTab === 'user'" class="space-y-6">
          <div class="bg-white dark:bg-gray-800 dark:border-gray-700 rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Perfil de Usuario</h3>
            
            <form @submit.prevent="updateUserProfile" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre de usuario
                  </label>
                  <input
                    v-model="userForm.username"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    v-model="userForm.email"
                    type="email"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre completo
                  </label>
                  <input
                    v-model="userForm.fullName"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rol
                  </label>
                  <select
                    v-model="userForm.role"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="admin">Administrador</option>
                    <option value="user">Usuario</option>
                    <option value="viewer">Visualizador</option>
                  </select>
                </div>
              </div>

              <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Cambiar Contraseña</h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Contraseña actual
                    </label>
                    <input
                      v-model="userForm.currentPassword"
                      type="password"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nueva contraseña
                    </label>
                    <input
                      v-model="userForm.newPassword"
                      type="password"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirmar contraseña
                    </label>
                    <input
                      v-model="userForm.confirmPassword"
                      type="password"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div class="flex justify-end space-x-3">
                <button
                  type="button"
                  @click="resetUserForm"
                  class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Restaurar
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Pestaña de Sistema -->
        <div v-if="activeTab === 'system'" class="space-y-6">
          <div class="bg-white dark:bg-gray-800 dark:border-gray-700 rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Configuración del Sistema</h3>
            
            <div class="space-y-6">
              <!-- Configuración de caché -->
              <div>
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Gestión de Caché</h4>
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-700 dark:text-gray-300">Caché de reportes</span>
                    <span class="text-sm text-gray-900 dark:text-gray-100">{{ cacheInfo.reports || '0' }} MB</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-700 dark:text-gray-300">Caché de usuarios</span>
                    <span class="text-sm text-gray-900 dark:text-gray-100">{{ cacheInfo.users || '0' }} MB</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-700 dark:text-gray-300">Caché de catálogo</span>
                    <span class="text-sm text-gray-900 dark:text-gray-100">{{ cacheInfo.catalog || '0' }} MB</span>
                  </div>
                  <button
                    @click="clearAllCache"
                    class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-700 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Limpiar Todo el Caché
                  </button>
                </div>
              </div>

              <!-- Configuración de logs -->
              <div>
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Configuración de Logs</h4>
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-700 dark:text-gray-300">Nivel de log</span>
                    <select
                      v-model="systemConfig.logLevel"
                      class="px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="debug">Debug</option>
                      <option value="info">Info</option>
                      <option value="warning">Warning</option>
                      <option value="error">Error</option>
                    </select>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-700 dark:text-gray-300">Retención de logs (días)</span>
                    <input
                      v-model="systemConfig.logRetention"
                      type="number"
                      min="1"
                      max="365"
                      class="w-20 px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <!-- Configuración de seguridad -->
              <div>
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Seguridad</h4>
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-700 dark:text-gray-300">Tiempo de sesión (minutos)</span>
                    <input
                      v-model="systemConfig.sessionTimeout"
                      type="number"
                      min="15"
                      max="480"
                      class="w-20 px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-700 dark:text-gray-300">Requerir 2FA</span>
                    <button
                      @click="systemConfig.require2FA = !systemConfig.require2FA"
                      :class="[
                        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                        systemConfig.require2FA ? 'bg-blue-600' : 'bg-gray-200'
                      ]"
                    >
                      <span
                        :class="[
                          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                          systemConfig.require2FA ? 'translate-x-5' : 'translate-x-0'
                        ]"
                      ></span>
                    </button>
                  </div>
                </div>
              </div>

              <div class="flex justify-end">
                <button
                  @click="saveSystemConfig"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Guardar Configuración
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useNotificationsStore } from '../stores/notifications'
import { useReportsStore } from '../stores/reports'
import ThemeCustomizer from '../components/theme/ThemeCustomizer.vue'
import KeyboardShortcuts from '../components/shortcuts/KeyboardShortcuts.vue'
import OfflineManager from '../components/offline/OfflineManager.vue'
import {
  PaintBrushIcon,
  CommandLineIcon,
  WifiIcon,
  BellIcon,
  UserIcon,
  Cog6ToothIcon
} from '@heroicons/vue/24/outline'

// Stores
const notificationsStore = useNotificationsStore()
const reportsStore = useReportsStore()

// Estados
const activeTab = ref('themes')

// Pestañas disponibles
const tabs = [
  { id: 'themes', name: 'Temas', icon: PaintBrushIcon },
  { id: 'shortcuts', name: 'Atajos de Teclado', icon: CommandLineIcon },
  { id: 'offline', name: 'Modo Offline', icon: WifiIcon },
  { id: 'notifications', name: 'Notificaciones', icon: BellIcon },
  { id: 'user', name: 'Usuario', icon: UserIcon },
  { id: 'system', name: 'Sistema', icon: Cog6ToothIcon }
]

// Formulario de usuario
const userForm = ref({
  username: 'admin',
  email: 'admin@example.com',
  fullName: 'Administrador del Sistema',
  role: 'admin',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Configuración del sistema
const systemConfig = ref({
  logLevel: 'info',
  logRetention: 30,
  sessionTimeout: 120,
  require2FA: false
})

// Preferencias de notificaciones
const notificationPreferences = computed(() => notificationsStore.notificationPreferences)

// Estadísticas de notificaciones
const notificationStats = computed(() => {
  const stats = notificationsStore.getNotificationStats('24h')
  return {
    total: stats.total,
    unread: stats.unread,
    critical: stats.byPriority?.critical || 0
  }
})

// Información de caché
const cacheInfo = ref({
  reports: '2.5',
  users: '1.2',
  catalog: '0.8'
})

// Funciones
const getCategoryName = (category) => {
  const names = {
    tickets: 'Tickets',
    users: 'Usuarios',
    system: 'Sistema',
    security: 'Seguridad',
    reports: 'Reportes'
  }
  return names[category] || category
}

const getCategoryDescription = (category) => {
  const descriptions = {
    tickets: 'Notificaciones sobre tickets de venta',
    users: 'Notificaciones sobre usuarios del sistema',
    system: 'Notificaciones del sistema y mantenimiento',
    security: 'Alertas de seguridad y acceso',
    reports: 'Notificaciones sobre reportes y exportaciones'
  }
  return descriptions[category] || ''
}

const updateNotificationPreference = (category, enabled) => {
  notificationsStore.updateNotificationPreferences(category, enabled)
}

const updateUserProfile = () => {
  // Validar contraseñas si se están cambiando
  if (userForm.value.newPassword) {
    if (userForm.value.newPassword !== userForm.value.confirmPassword) {
      alert('Las contraseñas no coinciden')
      return
    }
    if (userForm.value.newPassword.length < 8) {
      alert('La nueva contraseña debe tener al menos 8 caracteres')
      return
    }
  }

  // Aquí se enviarían los datos al backend
  console.log('Actualizando perfil de usuario:', userForm.value)
  alert('Perfil actualizado correctamente')
  
  // Limpiar campos de contraseña
  userForm.value.currentPassword = ''
  userForm.value.newPassword = ''
  userForm.value.confirmPassword = ''
}

const resetUserForm = () => {
  userForm.value = {
    username: 'admin',
    email: 'admin@example.com',
    fullName: 'Administrador del Sistema',
    role: 'admin',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
}

const clearAllCache = async () => {
  if (confirm('¿Estás seguro de que quieres limpiar todo el caché? Esto puede afectar el rendimiento temporalmente.')) {
    try {
      await reportsStore.clearCache()
      // Limpiar otros caches aquí
      alert('Caché limpiado correctamente')
    } catch (error) {
      console.error('Error clearing cache:', error)
      alert('Error al limpiar el caché')
    }
  }
}

const saveSystemConfig = () => {
  // Aquí se guardarían las configuraciones del sistema
  console.log('Guardando configuración del sistema:', systemConfig.value)
  alert('Configuración guardada correctamente')
}

// Lifecycle
onMounted(() => {
  // Cargar configuraciones guardadas
  const savedLogLevel = localStorage.getItem('system_log_level')
  const savedLogRetention = localStorage.getItem('system_log_retention')
  const savedSessionTimeout = localStorage.getItem('system_session_timeout')
  const savedRequire2FA = localStorage.getItem('system_require_2fa')

  if (savedLogLevel) systemConfig.value.logLevel = savedLogLevel
  if (savedLogRetention) systemConfig.value.logRetention = parseInt(savedLogRetention)
  if (savedSessionTimeout) systemConfig.value.sessionTimeout = parseInt(savedSessionTimeout)
  if (savedRequire2FA !== null) systemConfig.value.require2FA = savedRequire2FA === 'true'
})
</script>

<style scoped>
.settings-view {
  min-height: 100vh;
  background-color: var(--color-background);
}

.tab-content {
  min-height: 600px;
}

/* Transiciones suaves */
* {
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}
</style>
