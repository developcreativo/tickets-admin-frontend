<template>
  <div class="settings-view">
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Configuraciones</h1>
        <button 
          @click="saveAllSettings"
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Guardar Cambios
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Navegación lateral -->
        <div class="lg:col-span-1">
          <nav class="space-y-1">
            <button 
              v-for="section in sections" 
              :key="section.id"
              @click="activeSection = section.id"
              :class="[
                'w-full text-left px-3 py-2 text-sm font-medium rounded-md',
                activeSection === section.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              ]"
            >
              {{ section.name }}
            </button>
          </nav>
        </div>

        <!-- Contenido de configuraciones -->
        <div class="lg:col-span-2">
          <!-- Configuración General -->
          <div v-if="activeSection === 'general'" class="space-y-6">
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Configuración General</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nombre de la Empresa</label>
                  <input 
                    v-model="settings.general.companyName"
                    type="text" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Email de Contacto</label>
                  <input 
                    v-model="settings.general.contactEmail"
                    type="email" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Zona Horaria</label>
                  <select 
                    v-model="settings.general.timezone"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="America/Mexico_City">México (GMT-6)</option>
                    <option value="America/New_York">Nueva York (GMT-5)</option>
                    <option value="America/Los_Angeles">Los Ángeles (GMT-8)</option>
                    <option value="Europe/Madrid">Madrid (GMT+1)</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Moneda</label>
                  <select 
                    v-model="settings.general.currency"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="USD">Dólar Estadounidense (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="MXN">Peso Mexicano (MXN)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Configuración de Notificaciones -->
          <div v-if="activeSection === 'notifications'" class="space-y-6">
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Configuración de Notificaciones</h3>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">Notificaciones por Email</h4>
                    <p class="text-sm text-gray-500">Recibir notificaciones por correo electrónico</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input 
                      v-model="settings.notifications.emailEnabled"
                      type="checkbox" 
                      class="sr-only peer"
                    >
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">Notificaciones Push</h4>
                    <p class="text-sm text-gray-500">Recibir notificaciones en el navegador</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input 
                      v-model="settings.notifications.pushEnabled"
                      type="checkbox" 
                      class="sr-only peer"
                    >
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">Alertas de Stock Bajo</h4>
                    <p class="text-sm text-gray-500">Notificar cuando el stock esté bajo</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input 
                      v-model="settings.notifications.lowStockAlerts"
                      type="checkbox" 
                      class="sr-only peer"
                    >
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Configuración de Seguridad -->
          <div v-if="activeSection === 'security'" class="space-y-6">
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Configuración de Seguridad</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Tiempo de Sesión (minutos)</label>
                  <input 
                    v-model="settings.security.sessionTimeout"
                    type="number" 
                    min="5"
                    max="480"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">Autenticación de Dos Factores</h4>
                    <p class="text-sm text-gray-500">Requerir 2FA para todos los usuarios</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input 
                      v-model="settings.security.twoFactorRequired"
                      type="checkbox" 
                      class="sr-only peer"
                    >
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">Registro de Actividad</h4>
                    <p class="text-sm text-gray-500">Mantener registro de todas las actividades</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input 
                      v-model="settings.security.activityLogging"
                      type="checkbox" 
                      class="sr-only peer"
                    >
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Configuración de Integración -->
          <div v-if="activeSection === 'integration'" class="space-y-6">
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Configuración de Integración</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">URL de la API</label>
                  <input 
                    v-model="settings.integration.apiUrl"
                    type="url" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Clave de API</label>
                  <input 
                    v-model="settings.integration.apiKey"
                    type="password" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">Sincronización Automática</h4>
                    <p class="text-sm text-gray-500">Sincronizar datos automáticamente</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input 
                      v-model="settings.integration.autoSync"
                      type="checkbox" 
                      class="sr-only peer"
                    >
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Configuración de Apariencia -->
          <div v-if="activeSection === 'appearance'" class="space-y-6">
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Configuración de Apariencia</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Tema</label>
                  <select 
                    v-model="settings.appearance.theme"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="light">Claro</option>
                    <option value="dark">Oscuro</option>
                    <option value="auto">Automático</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Color Principal</label>
                  <div class="flex space-x-2">
                    <button 
                      v-for="color in themeColors" 
                      :key="color.name"
                      @click="settings.appearance.primaryColor = color.value"
                      :class="[
                        'w-8 h-8 rounded-full border-2',
                        settings.appearance.primaryColor === color.value ? 'border-gray-900' : 'border-gray-300'
                      ]"
                      :style="{ backgroundColor: color.value }"
                    ></button>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">Mostrar Animaciones</h4>
                    <p class="text-sm text-gray-500">Habilitar animaciones en la interfaz</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input 
                      v-model="settings.appearance.animations"
                      type="checkbox" 
                      class="sr-only peer"
                    >
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'

export default {
  name: 'SettingsView',
  setup() {
    const activeSection = ref('general')

    const sections = [
      { id: 'general', name: 'General' },
      { id: 'notifications', name: 'Notificaciones' },
      { id: 'security', name: 'Seguridad' },
      { id: 'integration', name: 'Integración' },
      { id: 'appearance', name: 'Apariencia' }
    ]

    const settings = reactive({
      general: {
        companyName: 'TicketMaster Admin',
        contactEmail: 'admin@ticketmaster.com',
        timezone: 'America/Mexico_City',
        currency: 'USD'
      },
      notifications: {
        emailEnabled: true,
        pushEnabled: false,
        lowStockAlerts: true
      },
      security: {
        sessionTimeout: 30,
        twoFactorRequired: false,
        activityLogging: true
      },
      integration: {
        apiUrl: 'https://api.ticketmaster.com',
        apiKey: '',
        autoSync: true
      },
      appearance: {
        theme: 'light',
        primaryColor: '#3B82F6',
        animations: true
      }
    })

    const themeColors = [
      { name: 'Azul', value: '#3B82F6' },
      { name: 'Verde', value: '#10B981' },
      { name: 'Púrpura', value: '#8B5CF6' },
      { name: 'Rojo', value: '#EF4444' },
      { name: 'Naranja', value: '#F59E0B' },
      { name: 'Rosa', value: '#EC4899' }
    ]

    const saveAllSettings = () => {
      // Simular guardado de configuraciones
      console.log('Guardando configuraciones...', settings)
      // Aquí se enviarían las configuraciones al backend
    }

    return {
      activeSection,
      sections,
      settings,
      themeColors,
      saveAllSettings
    }
  }
}
</script>

<style scoped>
.settings-view {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>
