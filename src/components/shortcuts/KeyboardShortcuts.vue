<template>
  <div class="keyboard-shortcuts min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">Atajos de Teclado</h2>
          <p class="text-sm text-gray-500 dark:text-gray-300">Personaliza los atajos de teclado para una navegación más rápida</p>
        </div>
        <div class="flex items-center space-x-3">
          <button
          @click="resetToDefault"
            class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-700 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg class="-ml-0.5 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Restaurar
          </button>
          <button
            @click="exportShortcuts"
            class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-700 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg class="-ml-0.5 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar
          </button>
          <label
            for="shortcuts-import"
            class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-700 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
            >
            <svg class="-ml-0.5 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            Importar
          </label>
          <input
            id="shortcuts-import"
            type="file"
            accept=".json"
            @change="handleShortcutsImport"
            class="hidden"
          />
        </div>
      </div>
    </div>

    <div class="flex">
      <!-- Sidebar de categorías -->
      <div class="w-80 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-6">
        <div class="mb-6">
          <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">Categorías</h3>
          <div class="space-y-2">
            <button
              v-for="category in shortcutCategories"
              :key="category"
              @click="selectedCategory = category"
              :class="[
                'w-full text-left px-3 py-2 rounded-md text-sm transition-colors',
                selectedCategory === category
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              ]"
            >
              {{ getCategoryName(category) }}
              <span class="ml-2 text-xs text-gray-500 dark:text-gray-400">
                ({{ getShortcutsByCategory(category).length }})
              </span>
            </button>
          </div>
        </div>

        <!-- Información de uso -->
        <div class="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 class="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Cómo usar</h4>
          <ul class="text-xs text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Haz clic en un atajo para editarlo</li>
            <li>• Presiona las teclas deseadas</li>
            <li>• Presiona Escape para cancelar</li>
            <li>• Los atajos se guardan automáticamente</li>
          </ul>
        </div>
      </div>

      <!-- Lista de atajos -->
      <div class="flex-1 p-6">
        <div class="mb-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            {{ getCategoryName(selectedCategory) }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {{ getCategoryDescription(selectedCategory) }}
          </p>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <div class="grid grid-cols-3 gap-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <div>Acción</div>
              <div>Atajo</div>
              <div>Estado</div>  
            </div>
          </div>

          <div class="divide-y divide-gray-200 dark:divide-gray-700">
            <div
              v-for="shortcut in getShortcutsByCategory(selectedCategory)"
              :key="shortcut.id"
              class="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div class="grid grid-cols-3 gap-4 items-center">
                <!-- Acción -->
                <div>
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <component :is="getShortcutIcon(shortcut.action)" class="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ shortcut.name }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ shortcut.description }}</p>
                    </div>
                  </div>
                </div>

                <!-- Atajo -->
                <div>
                  <button
                    @click="editShortcut(shortcut)"
                    :class="[
                      'px-3 py-2 border rounded-md text-sm font-mono transition-colors',
                      editingShortcut?.id === shortcut.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                        : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    ]"
                  >
                    <span v-if="editingShortcut?.id === shortcut.id">
                      Presiona teclas...
                    </span>
                    <span v-else>
                      {{ formatShortcut(shortcut.keys) }}
                    </span>
                  </button>
                </div>

                <!-- Estado -->
                <div>
                  <div class="flex items-center space-x-3">
                    <span
                      :class="[
                        'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                        shortcut.enabled
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                          : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                      ]"
                    >
                      {{ shortcut.enabled ? 'Activo' : 'Inactivo' }}
                    </span>
                    <button
                      @click="toggleShortcut(shortcut.id)"
                      :class="[
                        'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                        shortcut.enabled ? 'bg-green-600' : 'bg-gray-200'
                      ]"
                    >
                      <span
                        :class="[
                          'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                          shortcut.enabled ? 'translate-x-4' : 'translate-x-0'
                        ]"
                      ></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Estadísticas de uso -->
        <div class="mt-8">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Estadísticas de Uso</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-blue-600 dark:text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total de Usos</p>
                  <p class="text-2xl font-semibold text-gray-900 dark:text-gray-100">{{ totalUsage }}</p>
                </div>
              </div>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-green-600 dark:text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Atajos Activos</p>
                  <p class="text-2xl font-semibold text-gray-900 dark:text-gray-100">{{ activeShortcuts }}</p>
                </div>
              </div>
            </div>

              <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-purple-600 dark:text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Tiempo Ahorrado</p>
                  <p class="text-2xl font-semibold text-gray-900 dark:text-gray-100">{{ timeSaved }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Atajos más usados -->
        <div class="mt-8">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Atajos Más Usados</h3>
          <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <div class="grid grid-cols-3 gap-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div>Atajo</div>
                <div>Acción</div>
                <div>Usos</div>
              </div>
            </div>
            <div class="divide-y divide-gray-200 dark:divide-gray-700">
              <div
                v-for="shortcut in topUsedShortcuts"
                :key="shortcut.id"
                class="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div class="grid grid-cols-3 gap-4 items-center">
                  <div>
                    <span class="inline-flex px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-mono rounded">
                      {{ formatShortcut(shortcut.keys) }}
                    </span>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ shortcut.name }}</p>
                  </div>
                  <div>
                    <span class="text-sm text-gray-600 dark:text-gray-400">{{ shortcut.usageCount }} usos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de edición -->
    <div
      v-if="editingShortcut"
      class="fixed inset-0 bg-gray-600 dark:bg-gray-800 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="cancelEdit"
    >
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800" @click.stop>
        <div class="mt-3 text-center">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Editar Atajo: {{ editingShortcut.name }}
          </h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Presiona la combinación de teclas para este atajo:
            </p>
            <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <span class="text-lg font-mono text-gray-900 dark:text-gray-100">
                {{ formatShortcut(editingShortcut.keys) }}
              </span>
            </div>
            <p class="text-xs text-gray-400 dark:text-gray-400">
              Presiona Escape para cancelar o Enter para confirmar
            </p>
          </div>
          <div class="flex justify-center space-x-3">
            <button
              @click="cancelEdit"
              class="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              @click="confirmEdit"
              class="px-4 py-2 bg-blue-600 dark:bg-blue-800 text-white dark:text-gray-100 rounded-md hover:bg-blue-700 dark:hover:bg-blue-900 transition-colors"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useShortcutsStore } from '../../stores/shortcuts'

const shortcutsStore = useShortcutsStore()

// Estados
const selectedCategory = ref('navigation')
const editingShortcut = ref(null)
const newKeys = ref([])

// Categorías disponibles
const shortcutCategories = [
  'navigation',
  'actions',
  'system',
  'reports',
  'tickets',
  'users'
]

// Funciones
const getCategoryName = (category) => {
  const names = {
    navigation: 'Navegación',
    actions: 'Acciones',
    system: 'Sistema',
    reports: 'Reportes',
    tickets: 'Tickets',
    users: 'Usuarios'
  }
  return names[category] || category
}

const getCategoryDescription = (category) => {
  const descriptions = {
    navigation: 'Atajos para navegar entre diferentes secciones de la aplicación',
    actions: 'Atajos para realizar acciones comunes como crear, editar o eliminar',
    system: 'Atajos del sistema como guardar, imprimir o cerrar',
    reports: 'Atajos específicos para la generación y exportación de reportes',
    tickets: 'Atajos para la gestión de tickets de venta',
    users: 'Atajos para la administración de usuarios'
  }
  return descriptions[category] || ''
}

const getShortcutsByCategory = (category) => {
  return shortcutsStore.shortcuts.filter(s => s.category === category)
}

const getShortcutIcon = (action) => {
  const icons = {
    navigate: 'ArrowRightIcon',
    create: 'PlusIcon',
    edit: 'PencilIcon',
    delete: 'TrashIcon',
    save: 'CheckIcon',
    search: 'MagnifyingGlassIcon',
    refresh: 'ArrowPathIcon',
    export: 'ArrowDownTrayIcon',
    print: 'PrinterIcon',
    close: 'XMarkIcon'
  }
  return icons[action] || 'QuestionMarkCircleIcon'
}

const formatShortcut = (keys) => {
  if (!keys || keys.length === 0) return 'Sin asignar'
  return keys.map(key => {
    if (key === 'Ctrl') return 'Ctrl'
    if (key === 'Shift') return 'Shift'
    if (key === 'Alt') return 'Alt'
    if (key === 'Meta') return '⌘'
    return key.toUpperCase()
  }).join(' + ')
}

const editShortcut = (shortcut) => {
  editingShortcut.value = { ...shortcut }
  newKeys.value = [...shortcut.keys]
  startListening()
}

const cancelEdit = () => {
  editingShortcut.value = null
  newKeys.value = []
  stopListening()
}

const confirmEdit = () => {
  if (editingShortcut.value && newKeys.value.length > 0) {
    shortcutsStore.updateShortcut(editingShortcut.value.id, newKeys.value)
  }
  cancelEdit()
}

const toggleShortcut = (shortcutId) => {
  shortcutsStore.toggleShortcut(shortcutId)
}

const resetToDefault = () => {
  if (confirm('¿Estás seguro de que quieres restaurar todos los atajos a sus valores por defecto?')) {
    shortcutsStore.resetToDefault()
  }
}

const exportShortcuts = () => {
  shortcutsStore.exportShortcuts()
}

const handleShortcutsImport = async (event) => {
  const file = event.target.files[0]
  if (file) {
    try {
      await shortcutsStore.importShortcuts(file)
      event.target.value = ''
    } catch (error) {
      console.error('Error importing shortcuts:', error)
      alert('Error al importar los atajos')
    }
  }
}

// Escucha de teclas
let isListening = false

const startListening = () => {
  isListening = true
  document.addEventListener('keydown', handleKeyDown)
  document.addEventListener('keyup', handleKeyUp)
}

const stopListening = () => {
  isListening = false
  document.removeEventListener('keydown', handleKeyDown)
  document.removeEventListener('keyup', handleKeyUp)
}

const handleKeyDown = (event) => {
  if (!isListening || !editingShortcut.value) return

  event.preventDefault()
  event.stopPropagation()

  const key = event.key
  const modifiers = []

  if (event.ctrlKey) modifiers.push('Ctrl')
  if (event.shiftKey) modifiers.push('Shift')
  if (event.altKey) modifiers.push('Alt')
  if (event.metaKey) modifiers.push('Meta')

  // Evitar teclas especiales
  if (['Control', 'Shift', 'Alt', 'Meta'].includes(key)) return

  // Escape para cancelar
  if (key === 'Escape') {
    cancelEdit()
    return
  }

  // Enter para confirmar
  if (key === 'Enter') {
    confirmEdit()
    return
  }

  // Construir combinación de teclas
  const combination = [...modifiers, key]
  newKeys.value = combination
}

const handleKeyUp = (event) => {
  // No hacer nada en keyup
}

// Computed
const totalUsage = computed(() => {
  return shortcutsStore.shortcuts.reduce((total, s) => total + (s.usageCount || 0), 0)
})

const activeShortcuts = computed(() => {
  return shortcutsStore.shortcuts.filter(s => s.enabled).length
})

const timeSaved = computed(() => {
  const totalSeconds = totalUsage.value * 2 // Asumiendo 2 segundos por atajo
  const minutes = Math.floor(totalSeconds / 60)
  const hours = Math.floor(minutes / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`
  } else if (minutes > 0) {
    return `${minutes}m ${totalSeconds % 60}s`
  } else {
    return `${totalSeconds}s`
  }
})

const topUsedShortcuts = computed(() => {
  return [...shortcutsStore.shortcuts]
    .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
    .slice(0, 5)
})

// Lifecycle
onMounted(() => {
  shortcutsStore.loadShortcuts()
})

onUnmounted(() => {
  stopListening()
})
</script>

<style scoped>
.keyboard-shortcuts {
  min-height: 100vh;
  background-color: #f9fafb;
}

/* Transiciones suaves */
* {
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

/* Estilos para el modal */
.modal-overlay {
  backdrop-filter: blur(4px);
}

/* Estilos para los atajos de teclado */
.shortcut-key {
  @apply inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-xs font-mono rounded border border-gray-200;
}

.shortcut-key:not(:last-child)::after {
  content: '+';
  @apply mx-1 text-gray-400;
}
</style>
