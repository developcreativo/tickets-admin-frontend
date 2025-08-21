<template>
  <div class="theme-customizer">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-medium text-gray-900">Personalización de Temas</h2>
          <p class="text-sm text-gray-500">Personaliza la apariencia de la aplicación</p>
        </div>
        <div class="flex items-center space-x-3">
          <button
            @click="themeStore.resetToDefault"
            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg class="-ml-0.5 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Restaurar
          </button>
          <button
            @click="themeStore.exportTheme"
            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg class="-ml-0.5 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar
          </button>
          <label
            for="theme-import"
            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
          >
            <svg class="-ml-0.5 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            Importar
          </label>
          <input
            id="theme-import"
            type="file"
            accept=".json"
            @change="handleThemeImport"
            class="hidden"
          />
        </div>
      </div>
    </div>

    <div class="flex">
      <!-- Sidebar de opciones -->
      <div class="w-80 bg-gray-50 border-r border-gray-200 p-6 space-y-8">
        <!-- Temas predefinidos -->
        <div>
          <h3 class="text-sm font-medium text-gray-900 mb-4">Temas Predefinidos</h3>
          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="(theme, key) in themeStore.themes"
              :key="key"
              @click="themeStore.setTheme(key)"
              :class="[
                'relative p-3 rounded-lg border-2 transition-all duration-200',
                themeStore.currentTheme === key
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              ]"
            >
              <div class="flex items-center space-x-2">
                <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: theme.colors.primary }"></div>
                <span class="text-xs font-medium text-gray-900">{{ theme.name }}</span>
              </div>
              <div class="mt-2 flex space-x-1">
                <div class="w-3 h-3 rounded" :style="{ backgroundColor: theme.colors.background }"></div>
                <div class="w-3 h-3 rounded" :style="{ backgroundColor: theme.colors.surface }"></div>
                <div class="w-3 h-3 rounded" :style="{ backgroundColor: theme.colors.accent }"></div>
              </div>
            </button>
          </div>
        </div>

        <!-- Colores primarios -->
        <div>
          <h3 class="text-sm font-medium text-gray-900 mb-4">Color Primario</h3>
          <div class="grid grid-cols-4 gap-2">
            <button
              v-for="(color, key) in themeStore.primaryColors"
              :key="key"
              @click="themeStore.setPrimaryColor(key)"
              :class="[
                'w-8 h-8 rounded-full border-2 transition-all duration-200',
                themeStore.primaryColor === key
                  ? 'border-gray-900 scale-110'
                  : 'border-gray-300 hover:border-gray-400'
              ]"
              :style="{ backgroundColor: color.value }"
              :title="color.name"
            ></button>
          </div>
        </div>

        <!-- Colores de acento -->
        <div>
          <h3 class="text-sm font-medium text-gray-900 mb-4">Color de Acento</h3>
          <div class="grid grid-cols-4 gap-2">
            <button
              v-for="(color, key) in themeStore.accentColors"
              :key="key"
              @click="themeStore.setAccentColor(key)"
              :class="[
                'w-8 h-8 rounded-full border-2 transition-all duration-200',
                themeStore.accentColor === key
                  ? 'border-gray-900 scale-110'
                  : 'border-gray-300 hover:border-gray-400'
              ]"
              :style="{ backgroundColor: color.value }"
              :title="color.name"
            ></button>
          </div>
        </div>

        <!-- Estilos de sidebar -->
        <div>
          <h3 class="text-sm font-medium text-gray-900 mb-4">Estilo de Sidebar</h3>
          <div class="space-y-2">
            <button
              v-for="(style, key) in themeStore.sidebarStyles"
              :key="key"
              @click="themeStore.setSidebarStyle(key)"
              :class="[
                'w-full text-left px-3 py-2 rounded-md text-sm transition-colors',
                themeStore.sidebarStyle === key
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              ]"
            >
              {{ style.name }}
            </button>
          </div>
        </div>

        <!-- Tamaños de fuente -->
        <div>
          <h3 class="text-sm font-medium text-gray-900 mb-4">Tamaño de Fuente</h3>
          <div class="space-y-2">
            <button
              v-for="(size, key) in themeStore.fontSizes"
              :key="key"
              @click="themeStore.setFontSize(key)"
              :class="[
                'w-full text-left px-3 py-2 rounded-md text-sm transition-colors',
                themeStore.fontSize === key
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              ]"
            >
              {{ size.name }}
            </button>
          </div>
        </div>

        <!-- Opciones adicionales -->
        <div class="space-y-4">
          <h3 class="text-sm font-medium text-gray-900">Opciones Adicionales</h3>
          
          <!-- Modo oscuro -->
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-700">Modo Oscuro</span>
            <button
              @click="themeStore.toggleDarkMode"
              :class="[
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                themeStore.darkMode ? 'bg-blue-600' : 'bg-gray-200'
              ]"
            >
              <span
                :class="[
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                  themeStore.darkMode ? 'translate-x-5' : 'translate-x-0'
                ]"
              ></span>
            </button>
          </div>

          <!-- Modo compacto -->
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-700">Modo Compacto</span>
            <button
              @click="themeStore.toggleCompactMode"
              :class="[
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                themeStore.compactMode ? 'bg-blue-600' : 'bg-gray-200'
              ]"
            >
              <span
                :class="[
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                  themeStore.compactMode ? 'translate-x-5' : 'translate-x-0'
                ]"
              ></span>
            </button>
          </div>

          <!-- Animaciones -->
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-700">Animaciones</span>
            <button
              @click="themeStore.toggleAnimations"
              :class="[
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                themeStore.animations ? 'bg-blue-600' : 'bg-gray-200'
              ]"
            >
              <span
                :class="[
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                  themeStore.animations ? 'translate-x-5' : 'translate-x-0'
                ]"
              ></span>
            </button>
          </div>

          <!-- Alto contraste -->
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-700">Alto Contraste</span>
            <button
              @click="themeStore.toggleHighContrast"
              :class="[
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                themeStore.highContrast ? 'bg-blue-600' : 'bg-gray-200'
              ]"
            >
              <span
                :class="[
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                  themeStore.highContrast ? 'translate-x-5' : 'translate-x-0'
                ]"
              ></span>
            </button>
          </div>
        </div>
      </div>

      <!-- Vista previa -->
      <div class="flex-1 p-6">
        <div class="mb-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Vista Previa</h3>
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <!-- Header de ejemplo -->
            <div class="flex items-center justify-between mb-6">
              <h4 class="text-xl font-semibold text-gray-900">Ejemplo de Interfaz</h4>
              <div class="flex items-center space-x-3">
                <button class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Botón Primario
                </button>
                <button class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                  Botón Secundario
                </button>
              </div>
            </div>

            <!-- Cards de ejemplo -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">Estadísticas</p>
                    <p class="text-2xl font-bold text-blue-600">1,234</p>
                  </div>
                </div>
              </div>

              <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">Ventas</p>
                    <p class="text-2xl font-bold text-green-600">$5,678</p>
                  </div>
                </div>
              </div>

              <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">Usuarios</p>
                    <p class="text-2xl font-bold text-purple-600">890</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tabla de ejemplo -->
            <div class="mt-6">
              <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rol
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Juan Pérez
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Activo
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Administrador
                      </td>
                    </tr>
                    <tr>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        María García
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pendiente
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Usuario
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Colores personalizados -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">Colores Personalizados</h3>
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Color Personalizado 1</label>
                <div class="flex space-x-2">
                  <input
                    v-model="customColor1"
                    type="color"
                    class="w-12 h-10 rounded border border-gray-300"
                    @change="updateCustomColor('custom1', customColor1)"
                  />
                  <input
                    v-model="customColor1"
                    type="text"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="#000000"
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Color Personalizado 2</label>
                <div class="flex space-x-2">
                  <input
                    v-model="customColor2"
                    type="color"
                    class="w-12 h-10 rounded border border-gray-300"
                    @change="updateCustomColor('custom2', customColor2)"
                  />
                  <input
                    v-model="customColor2"
                    type="text"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="#000000"
                  />
                </div>
              </div>
            </div>
            <div class="mt-4">
              <button
                @click="themeStore.resetCustomColors"
                class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg class="-ml-0.5 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Limpiar Colores Personalizados
              </button>
            </div>
          </div>
        </div>

        <!-- Temas guardados -->
        <div v-if="themeStore.savedThemes.length > 0" class="mt-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Temas Guardados</h3>
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="space-y-3">
              <div
                v-for="theme in themeStore.savedThemes"
                :key="theme.id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <h4 class="text-sm font-medium text-gray-900">{{ theme.name }}</h4>
                  <p class="text-xs text-gray-500">{{ formatDate(theme.created_at) }}</p>
                </div>
                <div class="flex space-x-2">
                  <button
                    @click="themeStore.loadCustomTheme(theme.id)"
                    class="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Cargar
                  </button>
                  <button
                    @click="themeStore.deleteCustomTheme(theme.id)"
                    class="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useThemeStore } from '../../stores/theme'

const themeStore = useThemeStore()

// Colores personalizados
const customColor1 = ref('#3B82F6')
const customColor2 = ref('#10B981')

// Funciones
const handleThemeImport = async (event) => {
  const file = event.target.files[0]
  if (file) {
    try {
      await themeStore.importTheme(file)
      // Limpiar input
      event.target.value = ''
    } catch (error) {
      console.error('Error importing theme:', error)
      alert('Error al importar el tema')
    }
  }
}

const updateCustomColor = (name, value) => {
  themeStore.setCustomColor(name, value)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Lifecycle
onMounted(() => {
  themeStore.loadSavedThemes()
})
</script>

<style scoped>
.theme-customizer {
  min-height: 100vh;
  background-color: #f9fafb;
}

/* Transiciones suaves para los cambios de tema */
* {
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

/* Modo compacto */
.compact-mode .theme-customizer {
  --spacing-unit: 0.75rem;
}

.compact-mode .p-6 {
  padding: var(--spacing-unit);
}

.compact-mode .p-4 {
  padding: calc(var(--spacing-unit) * 0.75);
}

.compact-mode .p-3 {
  padding: calc(var(--spacing-unit) * 0.5);
}

/* Alto contraste */
.high-contrast .theme-customizer {
  --color-text: #000000;
  --color-background: #ffffff;
  --color-border: #000000;
}

.high-contrast .bg-gray-50 {
  background-color: #ffffff;
}

.high-contrast .border-gray-200 {
  border-color: #000000;
}

/* Sin animaciones */
.no-animations * {
  transition: none !important;
  animation: none !important;
}
</style>
