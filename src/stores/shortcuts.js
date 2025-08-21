import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useShortcutsStore = defineStore('shortcuts', () => {
    // Estados
    const shortcuts = ref([])
    const isEnabled = ref(true)
    const globalListener = ref(null)

    // Atajos por defecto
    const defaultShortcuts = [
        // Navegación
        {
            id: 'nav_dashboard',
            name: 'Ir al Dashboard',
            description: 'Navegar a la página principal del dashboard',
            action: 'navigate',
            category: 'navigation',
            keys: ['Ctrl', '1'],
            enabled: true,
            usageCount: 0,
            route: '/dashboard'
        },
        {
            id: 'nav_catalog',
            name: 'Ir al Catálogo',
            description: 'Navegar a la gestión del catálogo',
            action: 'navigate',
            category: 'navigation',
            keys: ['Ctrl', '2'],
            enabled: true,
            usageCount: 0,
            route: '/catalog'
        },
        {
            id: 'nav_users',
            name: 'Ir a Usuarios',
            description: 'Navegar a la gestión de usuarios',
            action: 'navigate',
            category: 'navigation',
            keys: ['Ctrl', '3'],
            enabled: true,
            usageCount: 0,
            route: '/users'
        },
        {
            id: 'nav_tickets',
            name: 'Ir a Tickets',
            description: 'Navegar a la gestión de tickets',
            action: 'navigate',
            category: 'navigation',
            keys: ['Ctrl', '4'],
            enabled: true,
            usageCount: 0,
            route: '/tickets'
        },
        {
            id: 'nav_reports',
            name: 'Ir a Reportes',
            description: 'Navegar a la generación de reportes',
            action: 'navigate',
            category: 'navigation',
            keys: ['Ctrl', '5'],
            enabled: true,
            usageCount: 0,
            route: '/reports'
        },
        {
            id: 'nav_settings',
            name: 'Ir a Configuración',
            description: 'Navegar a la configuración del sistema',
            action: 'navigate',
            category: 'navigation',
            keys: ['Ctrl', '6'],
            enabled: true,
            usageCount: 0,
            route: '/settings'
        },

        // Acciones
        {
            id: 'action_create',
            name: 'Crear Nuevo',
            description: 'Crear un nuevo elemento en la vista actual',
            action: 'create',
            category: 'actions',
            keys: ['Ctrl', 'N'],
            enabled: true,
            usageCount: 0
        },
        {
            id: 'action_edit',
            name: 'Editar',
            description: 'Editar el elemento seleccionado',
            action: 'edit',
            category: 'actions',
            keys: ['Ctrl', 'E'],
            enabled: true,
            usageCount: 0
        },
        {
            id: 'action_delete',
            name: 'Eliminar',
            description: 'Eliminar el elemento seleccionado',
            action: 'delete',
            category: 'actions',
            keys: ['Ctrl', 'Delete'],
            enabled: true,
            usageCount: 0
        },
        {
            id: 'action_save',
            name: 'Guardar',
            description: 'Guardar cambios en el formulario actual',
            action: 'save',
            category: 'actions',
            keys: ['Ctrl', 'S'],
            enabled: true,
            usageCount: 0
        },
        {
            id: 'action_search',
            name: 'Buscar',
            description: 'Activar la búsqueda en la vista actual',
            action: 'search',
            category: 'actions',
            keys: ['Ctrl', 'F'],
            enabled: true,
            usageCount: 0
        },
        {
            id: 'action_refresh',
            name: 'Actualizar',
            description: 'Actualizar los datos de la vista actual',
            action: 'refresh',
            category: 'actions',
            keys: ['F5'],
            enabled: true,
            usageCount: 0
        },

        // Sistema
        {
            id: 'system_help',
            name: 'Ayuda',
            description: 'Mostrar la ayuda del sistema',
            action: 'help',
            category: 'system',
            keys: ['F1'],
            enabled: true,
            usageCount: 0
        },
        {
            id: 'system_print',
            name: 'Imprimir',
            description: 'Imprimir la vista actual',
            action: 'print',
            category: 'system',
            keys: ['Ctrl', 'P'],
            enabled: true,
            usageCount: 0
        },
        {
            id: 'system_export',
            name: 'Exportar',
            description: 'Exportar datos de la vista actual',
            action: 'export',
            category: 'system',
            keys: ['Ctrl', 'Shift', 'E'],
            enabled: true,
            usageCount: 0
        },
        {
            id: 'system_fullscreen',
            name: 'Pantalla Completa',
            description: 'Alternar modo pantalla completa',
            action: 'fullscreen',
            category: 'system',
            keys: ['F11'],
            enabled: true,
            usageCount: 0
        },
        {
            id: 'system_close',
            name: 'Cerrar',
            description: 'Cerrar la ventana o modal actual',
            action: 'close',
            category: 'system',
            keys: ['Escape'],
            enabled: true,
            usageCount: 0
        },

        // Reportes
        {
            id: 'report_generate',
            name: 'Generar Reporte',
            description: 'Generar un nuevo reporte',
            action: 'generate_report',
            category: 'reports',
            keys: ['Ctrl', 'R'],
            enabled: true,
            usageCount: 0
        },
        {
            id: 'report_export_pdf',
            name: 'Exportar PDF',
            description: 'Exportar reporte en formato PDF',
            action: 'export_pdf',
            category: 'reports',
            keys: ['Ctrl', 'Shift', 'P'],
            enabled: true,
            usageCount: 0
        },
        {
            id: 'report_export_excel',
            name: 'Exportar Excel',
            description: 'Exportar reporte en formato Excel',
            action: 'export_excel',
            category: 'reports',
            keys: ['Ctrl', 'Shift', 'X'],
            enabled: true,
            usageCount: 0
        },
        {
            id: 'report_schedule',
            name: 'Programar Reporte',
            description: 'Programar la generación automática de un reporte',
            action: 'schedule_report',
            category: 'reports',
            keys: ['Ctrl', 'Shift', 'S'],
            enabled: true,
            usageCount: 0
        },

        // Tickets
        {
            id: 'ticket_new',
            name: 'Nuevo Ticket',
            description: 'Crear un nuevo ticket de venta',
            action: 'new_ticket',
            category: 'tickets',
            keys: ['Ctrl', 'T'],
            enabled: true,
            usageCount: 0
        },
        {
            id: 'ticket_duplicate',
            name: 'Duplicar Ticket',
            description: 'Duplicar el ticket seleccionado',
            action: 'duplicate_ticket',
            category: 'tickets',
            keys: ['Ctrl', 'D'],
            enabled: true,
            usageCount: 0
        },
        {
            id: 'ticket_print',
            name: 'Imprimir Ticket',
            description: 'Imprimir el ticket seleccionado',
            action: 'print_ticket',
            category: 'tickets',
            keys: ['Ctrl', 'Shift', 'P'],
            enabled: true,
            usageCount: 0
        },
        {
            id: 'ticket_cancel',
            name: 'Cancelar Ticket',
            description: 'Cancelar el ticket seleccionado',
            action: 'cancel_ticket',
            category: 'tickets',
            keys: ['Ctrl', 'Shift', 'C'],
            enabled: true,
            usageCount: 0
        },

        // Usuarios
        {
            id: 'user_new',
            name: 'Nuevo Usuario',
            description: 'Crear un nuevo usuario',
            action: 'new_user',
            category: 'users',
            keys: ['Ctrl', 'Shift', 'U'],
            enabled: true,
            usageCount: 0
        },
        {
            id: 'user_activate',
            name: 'Activar Usuario',
            description: 'Activar el usuario seleccionado',
            action: 'activate_user',
            category: 'users',
            keys: ['Ctrl', 'Shift', 'A'],
            enabled: true,
            usageCount: 0
        },
        {
            id: 'user_deactivate',
            name: 'Desactivar Usuario',
            description: 'Desactivar el usuario seleccionado',
            action: 'deactivate_user',
            category: 'users',
            keys: ['Ctrl', 'Shift', 'D'],
            enabled: true,
            usageCount: 0
        },
        {
            id: 'user_reset_password',
            name: 'Resetear Contraseña',
            description: 'Resetear la contraseña del usuario seleccionado',
            action: 'reset_password',
            category: 'users',
            keys: ['Ctrl', 'Shift', 'R'],
            enabled: true,
            usageCount: 0
        }
    ]

    // Getters
    const enabledShortcuts = computed(() =>
        shortcuts.value.filter(s => s.enabled)
    )

    const shortcutsByCategory = computed(() => {
        const categorized = {}
        shortcuts.value.forEach(shortcut => {
            if (!categorized[shortcut.category]) {
                categorized[shortcut.category] = []
            }
            categorized[shortcut.category].push(shortcut)
        })
        return categorized
    })

    const shortcutsByAction = computed(() => {
        const byAction = {}
        shortcuts.value.forEach(shortcut => {
            if (!byAction[shortcut.action]) {
                byAction[shortcut.action] = []
            }
            byAction[shortcut.action].push(shortcut)
        })
        return byAction
    })

    const totalShortcuts = computed(() => shortcuts.value.length)
    const activeShortcuts = computed(() => shortcuts.value.filter(s => s.enabled).length)

    // Acciones
    const initializeShortcuts = () => {
        const saved = localStorage.getItem('keyboard_shortcuts')
        if (saved) {
            try {
                shortcuts.value = JSON.parse(saved)
            } catch (error) {
                console.error('Error loading shortcuts:', error)
                shortcuts.value = [...defaultShortcuts]
            }
        } else {
            shortcuts.value = [...defaultShortcuts]
        }
    }

    const saveShortcuts = () => {
        localStorage.setItem('keyboard_shortcuts', JSON.stringify(shortcuts.value))
    }

    const updateShortcut = (shortcutId, newKeys) => {
        const shortcut = shortcuts.value.find(s => s.id === shortcutId)
        if (shortcut) {
            shortcut.keys = newKeys
            saveShortcuts()
        }
    }

    const toggleShortcut = (shortcutId) => {
        const shortcut = shortcuts.value.find(s => s.id === shortcutId)
        if (shortcut) {
            shortcut.enabled = !shortcut.enabled
            saveShortcuts()
        }
    }

    const resetToDefault = () => {
        shortcuts.value = [...defaultShortcuts]
        saveShortcuts()
    }

    const addShortcut = (shortcut) => {
        const newShortcut = {
            id: `custom_${Date.now()}`,
            enabled: true,
            usageCount: 0,
            ...shortcut
        }
        shortcuts.value.push(newShortcut)
        saveShortcuts()
        return newShortcut
    }

    const removeShortcut = (shortcutId) => {
        shortcuts.value = shortcuts.value.filter(s => s.id !== shortcutId)
        saveShortcuts()
    }

    const duplicateShortcut = (shortcutId) => {
        const shortcut = shortcuts.value.find(s => s.id === shortcutId)
        if (shortcut) {
            const duplicated = {
                ...shortcut,
                id: `copy_${Date.now()}`,
                name: `${shortcut.name} (Copia)`,
                keys: [...shortcut.keys]
            }
            shortcuts.value.push(duplicated)
            saveShortcuts()
            return duplicated
        }
    }

    const incrementUsage = (shortcutId) => {
        const shortcut = shortcuts.value.find(s => s.id === shortcutId)
        if (shortcut) {
            shortcut.usageCount = (shortcut.usageCount || 0) + 1
            saveShortcuts()
        }
    }

    const getShortcutByKeys = (keys) => {
        if (!keys || keys.length === 0) return null

        const normalizedKeys = keys.sort()
        return shortcuts.value.find(shortcut => {
            if (!shortcut.enabled || !shortcut.keys) return false
            const shortcutKeys = [...shortcut.keys].sort()
            return JSON.stringify(normalizedKeys) === JSON.stringify(shortcutKeys)
        })
    }

    const executeShortcut = (shortcutId) => {
        const shortcut = shortcuts.value.find(s => s.id === shortcutId)
        if (shortcut && shortcut.enabled) {
            incrementUsage(shortcutId)

            // Emitir evento para que la aplicación maneje la acción
            window.dispatchEvent(new CustomEvent('shortcutExecuted', {
                detail: {
                    shortcut,
                    timestamp: new Date().toISOString()
                }
            }))

            return shortcut
        }
        return null
    }

    const enableGlobalListener = () => {
        if (globalListener.value) return

        globalListener.value = (event) => {
            if (!isEnabled.value) return

            // Ignorar si está en un input o textarea
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) {
                return
            }

            const keys = []
            if (event.ctrlKey) keys.push('Ctrl')
            if (event.shiftKey) keys.push('Shift')
            if (event.altKey) keys.push('Alt')
            if (event.metaKey) keys.push('Meta')

            // Agregar la tecla principal
            if (event.key && !['Control', 'Shift', 'Alt', 'Meta'].includes(event.key)) {
                keys.push(event.key)
            }

            if (keys.length > 0) {
                const shortcut = getShortcutByKeys(keys)
                if (shortcut) {
                    event.preventDefault()
                    event.stopPropagation()
                    executeShortcut(shortcut.id)
                }
            }
        }

        document.addEventListener('keydown', globalListener.value)
    }

    const disableGlobalListener = () => {
        if (globalListener.value) {
            document.removeEventListener('keydown', globalListener.value)
            globalListener.value = null
        }
    }

    const toggleGlobalListener = () => {
        isEnabled.value = !isEnabled.value
        localStorage.setItem('shortcuts_enabled', isEnabled.value)

        if (isEnabled.value) {
            enableGlobalListener()
        } else {
            disableGlobalListener()
        }
    }

    // Exportar/Importar
    const exportShortcuts = () => {
        const data = shortcuts.value.map(s => ({
            id: s.id,
            name: s.name,
            description: s.description,
            action: s.action,
            category: s.category,
            keys: s.keys,
            enabled: s.enabled,
            route: s.route
        }))

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `keyboard_shortcuts_${new Date().toISOString().split('T')[0]}.json`
        a.click()
        URL.revokeObjectURL(url)
    }

    const importShortcuts = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result)

                    // Validar estructura
                    if (!Array.isArray(data)) {
                        throw new Error('Formato inválido: debe ser un array')
                    }

                    // Validar cada shortcut
                    data.forEach(shortcut => {
                        if (!shortcut.id || !shortcut.name || !shortcut.action || !shortcut.category) {
                            throw new Error('Estructura de shortcut inválida')
                        }
                    })

                    // Reemplazar shortcuts existentes
                    shortcuts.value = data.map(s => ({
                        ...s,
                        usageCount: s.usageCount || 0,
                        enabled: s.enabled !== undefined ? s.enabled : true
                    }))

                    saveShortcuts()
                    resolve()
                } catch (error) {
                    reject(error)
                }
            }
            reader.onerror = reject
            reader.readAsText(file)
        })
    }

    // Inicialización
    const initialize = () => {
        const savedEnabled = localStorage.getItem('shortcuts_enabled')
        if (savedEnabled !== null) {
            isEnabled.value = savedEnabled === 'true'
        }

        initializeShortcuts()

        if (isEnabled.value) {
            enableGlobalListener()
        }
    }

    const cleanup = () => {
        disableGlobalListener()
    }

    return {
        // States
        shortcuts,
        isEnabled,

        // Getters
        enabledShortcuts,
        shortcutsByCategory,
        shortcutsByAction,
        totalShortcuts,
        activeShortcuts,

        // Acciones principales
        initializeShortcuts,
        saveShortcuts,
        updateShortcut,
        toggleShortcut,
        resetToDefault,
        addShortcut,
        removeShortcut,
        duplicateShortcut,
        incrementUsage,
        getShortcutByKeys,
        executeShortcut,

        // Listener global
        enableGlobalListener,
        disableGlobalListener,
        toggleGlobalListener,

        // Exportar/Importar
        exportShortcuts,
        importShortcuts,

        // Utilidades
        initialize,
        cleanup
    }
})
