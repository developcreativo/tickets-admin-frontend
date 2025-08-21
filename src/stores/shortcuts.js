import { defineStore } from 'pinia'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './auth'
import { useNotificationsStore } from './notifications'

export const useShortcutsStore = defineStore('shortcuts', () => {
    // Estados
    const isEnabled = ref(true)
    const showHelp = ref(false)
    const pressedKeys = ref(new Set())
    const shortcuts = ref(new Map())

    // Router y stores
    const router = useRouter()
    const authStore = useAuthStore()
    const notificationsStore = useNotificationsStore()

    // Atajos predefinidos
    const defaultShortcuts = {
        // Navegación
        'g h': { action: 'goHome', description: 'Ir al Dashboard', category: 'Navegación' },
        'g c': { action: 'goCatalog', description: 'Ir a Catálogos', category: 'Navegación' },
        'g u': { action: 'goUsers', description: 'Ir a Usuarios', category: 'Navegación' },
        'g t': { action: 'goTickets', description: 'Ir a Tickets', category: 'Navegación' },
        'g r': { action: 'goReports', description: 'Ir a Reportes', category: 'Navegación' },
        'g s': { action: 'goSettings', description: 'Ir a Configuración', category: 'Navegación' },

        // Acciones generales
        '?': { action: 'showHelp', description: 'Mostrar ayuda de atajos', category: 'General' },
        'escape': { action: 'closeModals', description: 'Cerrar modales/dropdowns', category: 'General' },
        'ctrl+s': { action: 'save', description: 'Guardar cambios', category: 'General' },
        'ctrl+z': { action: 'undo', description: 'Deshacer', category: 'General' },
        'ctrl+y': { action: 'redo', description: 'Rehacer', category: 'General' },
        'ctrl+f': { action: 'search', description: 'Buscar', category: 'General' },
        'ctrl+n': { action: 'newItem', description: 'Nuevo elemento', category: 'General' },
        'ctrl+e': { action: 'edit', description: 'Editar', category: 'General' },
        'ctrl+d': { action: 'delete', description: 'Eliminar', category: 'General' },

        // Navegación por páginas
        'n': { action: 'nextPage', description: 'Página siguiente', category: 'Paginación' },
        'p': { action: 'previousPage', description: 'Página anterior', category: 'Paginación' },
        'home': { action: 'firstPage', description: 'Primera página', category: 'Paginación' },
        'end': { action: 'lastPage', description: 'Última página', category: 'Paginación' },

        // Filtros
        'ctrl+shift+f': { action: 'toggleFilters', description: 'Mostrar/ocultar filtros', category: 'Filtros' },
        'ctrl+shift+c': { action: 'clearFilters', description: 'Limpiar filtros', category: 'Filtros' },

        // Notificaciones
        'n': { action: 'toggleNotifications', description: 'Mostrar/ocultar notificaciones', category: 'Notificaciones' },
        'ctrl+shift+n': { action: 'markAllRead', description: 'Marcar todas como leídas', category: 'Notificaciones' },

        // Tema
        'ctrl+shift+t': { action: 'toggleTheme', description: 'Cambiar tema', category: 'Tema' },
        'ctrl+shift+c': { action: 'toggleCompact', description: 'Modo compacto', category: 'Tema' },

        // Accesibilidad
        'ctrl+shift+a': { action: 'toggleAccessibility', description: 'Opciones de accesibilidad', category: 'Accesibilidad' },
        'ctrl+shift+h': { action: 'toggleHighContrast', description: 'Alto contraste', category: 'Accesibilidad' },
        'ctrl+shift+s': { action: 'toggleAnimations', description: 'Mostrar/ocultar animaciones', category: 'Accesibilidad' },

        // Sistema
        'ctrl+shift+r': { action: 'refresh', description: 'Recargar página', category: 'Sistema' },
        'ctrl+shift+l': { action: 'logout', description: 'Cerrar sesión', category: 'Sistema' },
        'ctrl+shift+p': { action: 'print', description: 'Imprimir', category: 'Sistema' }
    }

    // Acciones de atajos
    const actions = {
        // Navegación
        goHome: () => router.push('/'),
        goCatalog: () => router.push('/catalog'),
        goUsers: () => router.push('/users'),
        goTickets: () => router.push('/tickets'),
        goReports: () => router.push('/reports'),
        goSettings: () => router.push('/settings'),

        // Acciones generales
        showHelp: () => {
            showHelp.value = !showHelp.value
            if (showHelp.value) {
                notificationsStore.showSuccess('Presiona Escape para cerrar la ayuda')
            }
        },
        closeModals: () => {
            // Cerrar modales abiertos
            document.dispatchEvent(new CustomEvent('closeModals'))
            showHelp.value = false
        },
        save: () => {
            // Buscar botón de guardar activo
            const saveButton = document.querySelector('button[type="submit"]:not([disabled])')
            if (saveButton) {
                saveButton.click()
                notificationsStore.showSuccess('Guardando...')
            }
        },
        undo: () => {
            notificationsStore.showWarning('Función de deshacer no implementada')
        },
        redo: () => {
            notificationsStore.showWarning('Función de rehacer no implementada')
        },
        search: () => {
            // Buscar campo de búsqueda activo
            const searchInput = document.querySelector('input[type="search"], input[placeholder*="buscar"], input[placeholder*="search"]')
            if (searchInput) {
                searchInput.focus()
                searchInput.select()
            }
        },
        newItem: () => {
            // Buscar botón de nuevo elemento
            const newButton = document.querySelector('button:contains("Nuevo"), button:contains("Crear"), button:contains("Add")')
            if (newButton) {
                newButton.click()
            }
        },
        edit: () => {
            // Buscar botón de editar activo
            const editButton = document.querySelector('button:contains("Editar"), button:contains("Edit")')
            if (editButton) {
                editButton.click()
            }
        },
        delete: () => {
            // Buscar botón de eliminar activo
            const deleteButton = document.querySelector('button:contains("Eliminar"), button:contains("Delete")')
            if (deleteButton) {
                deleteButton.click()
            }
        },

        // Paginación
        nextPage: () => {
            const nextButton = document.querySelector('button:contains("Siguiente"), button:contains("Next")')
            if (nextButton && !nextButton.disabled) {
                nextButton.click()
            }
        },
        previousPage: () => {
            const prevButton = document.querySelector('button:contains("Anterior"), button:contains("Previous")')
            if (prevButton && !prevButton.disabled) {
                prevButton.click()
            }
        },
        firstPage: () => {
            const firstButton = document.querySelector('button:contains("Primera"), button:contains("First")')
            if (firstButton && !firstButton.disabled) {
                firstButton.click()
            }
        },
        lastPage: () => {
            const lastButton = document.querySelector('button:contains("Última"), button:contains("Last")')
            if (lastButton && !lastButton.disabled) {
                lastButton.click()
            }
        },

        // Filtros
        toggleFilters: () => {
            const filtersSection = document.querySelector('[data-filters-section]')
            if (filtersSection) {
                const isHidden = filtersSection.classList.contains('hidden')
                filtersSection.classList.toggle('hidden', !isHidden)
                notificationsStore.showInfo(`Filtros ${isHidden ? 'mostrados' : 'ocultos'}`)
            }
        },
        clearFilters: () => {
            const clearButton = document.querySelector('button:contains("Limpiar"), button:contains("Clear")')
            if (clearButton) {
                clearButton.click()
            }
        },

        // Notificaciones
        toggleNotifications: () => {
            const notificationButton = document.querySelector('.notification-center button')
            if (notificationButton) {
                notificationButton.click()
            }
        },
        markAllRead: () => {
            notificationsStore.markAllAsRead()
            notificationsStore.showSuccess('Todas las notificaciones marcadas como leídas')
        },

        // Tema
        toggleTheme: () => {
            // Simular cambio de tema
            const currentTheme = document.documentElement.classList.contains('theme-dark') ? 'light' : 'dark'
            document.documentElement.classList.toggle('theme-dark', currentTheme === 'dark')
            notificationsStore.showInfo(`Tema cambiado a ${currentTheme === 'dark' ? 'oscuro' : 'claro'}`)
        },
        toggleCompact: () => {
            document.documentElement.classList.toggle('compact-mode')
            const isCompact = document.documentElement.classList.contains('compact-mode')
            notificationsStore.showInfo(`Modo compacto ${isCompact ? 'activado' : 'desactivado'}`)
        },

        // Accesibilidad
        toggleAccessibility: () => {
            notificationsStore.showInfo('Panel de accesibilidad abierto')
        },
        toggleHighContrast: () => {
            document.documentElement.classList.toggle('high-contrast')
            const isHighContrast = document.documentElement.classList.contains('high-contrast')
            notificationsStore.showInfo(`Alto contraste ${isHighContrast ? 'activado' : 'desactivado'}`)
        },
        toggleAnimations: () => {
            document.documentElement.classList.toggle('no-animations')
            const noAnimations = document.documentElement.classList.contains('no-animations')
            notificationsStore.showInfo(`Animaciones ${noAnimations ? 'desactivadas' : 'activadas'}`)
        },

        // Sistema
        refresh: () => {
            window.location.reload()
        },
        logout: () => {
            if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
                authStore.logout()
                router.push('/login')
            }
        },
        print: () => {
            window.print()
        }
    }

    // Registrar atajo
    const registerShortcut = (key, action, description, category) => {
        shortcuts.value.set(key, { action, description, category })
    }

    // Desregistrar atajo
    const unregisterShortcut = (key) => {
        shortcuts.value.delete(key)
    }

    // Verificar si una combinación de teclas coincide
    const checkShortcut = (keys) => {
        const keyString = Array.from(keys).sort().join('+')
        const shortcut = shortcuts.value.get(keyString)

        if (shortcut && actions[shortcut.action]) {
            try {
                actions[shortcut.action]()
                notificationsStore.showSuccess(`Atajo ejecutado: ${shortcut.description}`)
            } catch (error) {
                console.error('Error ejecutando atajo:', error)
                notificationsStore.showError('Error ejecutando atajo')
            }
        }
    }

    // Manejar eventos de teclado
    const handleKeyDown = (event) => {
        if (!isEnabled.value) return

        // Ignorar eventos en campos de entrada
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.isContentEditable) {
            return
        }

        const key = event.key.toLowerCase()
        const modifiers = []

        if (event.ctrlKey) modifiers.push('ctrl')
        if (event.shiftKey) modifiers.push('shift')
        if (event.altKey) modifiers.push('alt')
        if (event.metaKey) modifiers.push('meta')

        // Agregar tecla principal
        if (key !== 'control' && key !== 'shift' && key !== 'alt' && key !== 'meta') {
            modifiers.push(key)
        }

        pressedKeys.value = new Set(modifiers)
        checkShortcut(pressedKeys.value)
    }

    const handleKeyUp = (event) => {
        const key = event.key.toLowerCase()

        if (key === 'control' || key === 'shift' || key === 'alt' || key === 'meta') {
            pressedKeys.value.clear()
        }
    }

    // Inicializar atajos
    const initializeShortcuts = () => {
        // Registrar atajos por defecto
        Object.entries(defaultShortcuts).forEach(([key, config]) => {
            registerShortcut(key, config.action, config.description, config.category)
        })

        // Agregar event listeners
        document.addEventListener('keydown', handleKeyDown)
        document.addEventListener('keyup', handleKeyUp)
    }

    // Limpiar event listeners
    const cleanupShortcuts = () => {
        document.removeEventListener('keydown', handleKeyDown)
        document.removeEventListener('keyup', handleKeyUp)
    }

    // Obtener atajos por categoría
    const shortcutsByCategory = computed(() => {
        const categorized = {}

        shortcuts.value.forEach((shortcut, key) => {
            if (!categorized[shortcut.category]) {
                categorized[shortcut.category] = []
            }
            categorized[shortcut.category].push({
                key,
                ...shortcut
            })
        })

        return categorized
    })

    // Habilitar/deshabilitar atajos
    const toggleShortcuts = () => {
        isEnabled.value = !isEnabled.value
        localStorage.setItem('shortcuts_enabled', isEnabled.value)

        if (isEnabled.value) {
            notificationsStore.showSuccess('Atajos de teclado habilitados')
        } else {
            notificationsStore.showWarning('Atajos de teclado deshabilitados')
        }
    }

    // Personalizar atajo
    const customizeShortcut = (oldKey, newKey, action, description, category) => {
        if (shortcuts.value.has(oldKey)) {
            shortcuts.value.delete(oldKey)
        }

        registerShortcut(newKey, action, description, category)
        notificationsStore.showSuccess('Atajo personalizado guardado')
    }

    // Exportar configuración de atajos
    const exportShortcuts = () => {
        const config = {
            shortcuts: Array.from(shortcuts.value.entries()),
            enabled: isEnabled.value,
            timestamp: new Date().toISOString()
        }

        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `shortcuts_config_${new Date().toISOString().split('T')[0]}.json`
        a.click()
        URL.revokeObjectURL(url)
    }

    // Importar configuración de atajos
    const importShortcuts = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = (e) => {
                try {
                    const config = JSON.parse(e.target.result)

                    if (config.shortcuts) {
                        shortcuts.value.clear()
                        config.shortcuts.forEach(([key, shortcut]) => {
                            registerShortcut(key, shortcut.action, shortcut.description, shortcut.category)
                        })
                    }

                    if (typeof config.enabled === 'boolean') {
                        isEnabled.value = config.enabled
                    }

                    notificationsStore.showSuccess('Configuración de atajos importada')
                    resolve()
                } catch (error) {
                    reject(error)
                }
            }
            reader.onerror = reject
            reader.readAsText(file)
        })
    }

    // Lifecycle
    onMounted(() => {
        // Cargar configuración guardada
        const savedEnabled = localStorage.getItem('shortcuts_enabled')
        if (savedEnabled !== null) {
            isEnabled.value = savedEnabled === 'true'
        }

        initializeShortcuts()
    })

    onUnmounted(() => {
        cleanupShortcuts()
    })

    return {
        // States
        isEnabled,
        showHelp,
        pressedKeys,
        shortcuts,

        // Getters
        shortcutsByCategory,

        // Acciones principales
        registerShortcut,
        unregisterShortcut,
        toggleShortcuts,
        customizeShortcut,

        // Utilidades
        initializeShortcuts,
        cleanupShortcuts,
        exportShortcuts,
        importShortcuts,

        // Acciones disponibles
        actions
    }
})
