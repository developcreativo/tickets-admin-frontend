import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
    // Estados
    const currentTheme = ref('light')
    const primaryColor = ref('blue')
    const accentColor = ref('indigo')
    const sidebarStyle = ref('default')
    const fontSize = ref('medium')
    const compactMode = ref(false)
    const animations = ref(true)
    const highContrast = ref(false)

    // Temas predefinidos
    const themes = {
        light: {
            name: 'Claro',
            colors: {
                primary: '#3B82F6',
                secondary: '#6B7280',
                background: '#FFFFFF',
                surface: '#F9FAFB',
                text: '#111827',
                textSecondary: '#6B7280',
                border: '#E5E7EB',
                accent: '#6366F1'
            }
        },
        dark: {
            name: 'Oscuro',
            colors: {
                primary: '#60A5FA',
                secondary: '#9CA3AF',
                background: '#111827',
                surface: '#1F2937',
                text: '#F9FAFB',
                textSecondary: '#D1D5DB',
                border: '#374151',
                accent: '#818CF8'
            }
        },
        blue: {
            name: 'Azul Profesional',
            colors: {
                primary: '#1E40AF',
                secondary: '#475569',
                background: '#F8FAFC',
                surface: '#FFFFFF',
                text: '#0F172A',
                textSecondary: '#475569',
                border: '#CBD5E1',
                accent: '#3B82F6'
            }
        },
        green: {
            name: 'Verde Naturaleza',
            colors: {
                primary: '#059669',
                secondary: '#6B7280',
                background: '#F0FDF4',
                surface: '#FFFFFF',
                text: '#064E3B',
                textSecondary: '#374151',
                border: '#D1FAE5',
                accent: '#10B981'
            }
        },
        purple: {
            name: 'Púrpura Creativo',
            colors: {
                primary: '#7C3AED',
                secondary: '#6B7280',
                background: '#FAF5FF',
                surface: '#FFFFFF',
                text: '#581C87',
                textSecondary: '#374151',
                border: '#E9D5FF',
                accent: '#8B5CF6'
            }
        }
    }

    // Colores primarios disponibles
    const primaryColors = {
        blue: { name: 'Azul', value: '#3B82F6' },
        green: { name: 'Verde', value: '#10B981' },
        purple: { name: 'Púrpura', value: '#8B5CF6' },
        red: { name: 'Rojo', value: '#EF4444' },
        orange: { name: 'Naranja', value: '#F59E0B' },
        teal: { name: 'Teal', value: '#14B8A6' },
        indigo: { name: 'Índigo', value: '#6366F1' },
        pink: { name: 'Rosa', value: '#EC4899' }
    }

    // Colores de acento disponibles
    const accentColors = {
        indigo: { name: 'Índigo', value: '#6366F1' },
        blue: { name: 'Azul', value: '#3B82F6' },
        green: { name: 'Verde', value: '#10B981' },
        purple: { name: 'Púrpura', value: '#8B5CF6' },
        red: { name: 'Rojo', value: '#EF4444' },
        orange: { name: 'Naranja', value: '#F59E0B' },
        teal: { name: 'Teal', value: '#14B8A6' },
        pink: { name: 'Rosa', value: '#EC4899' }
    }

    // Estilos de sidebar disponibles
    const sidebarStyles = {
        default: { name: 'Predeterminado', class: 'bg-gray-800' },
        modern: { name: 'Moderno', class: 'bg-gradient-to-b from-blue-600 to-blue-800' },
        elegant: { name: 'Elegante', class: 'bg-gradient-to-b from-gray-900 to-gray-700' },
        colorful: { name: 'Colorido', class: 'bg-gradient-to-b from-purple-600 to-pink-600' },
        minimal: { name: 'Minimalista', class: 'bg-white border-r border-gray-200' }
    }

    // Tamaños de fuente disponibles
    const fontSizes = {
        small: { name: 'Pequeño', class: 'text-sm', scale: 0.875 },
        medium: { name: 'Mediano', class: 'text-base', scale: 1 },
        large: { name: 'Grande', class: 'text-lg', scale: 1.125 },
        xlarge: { name: 'Extra Grande', class: 'text-xl', scale: 1.25 }
    }

    // Getters
    const currentThemeData = computed(() => themes[currentTheme.value])
    const currentPrimaryColor = computed(() => primaryColors[primaryColor.value])
    const currentAccentColor = computed(() => accentColors[accentColor.value])
    const currentSidebarStyle = computed(() => sidebarStyles[sidebarStyle.value])
    const currentFontSize = computed(() => fontSizes[fontSize.value])

    // CSS Variables para el tema
    const cssVariables = computed(() => {
        const theme = currentThemeData.value
        const primary = currentPrimaryColor.value
        const accent = currentAccentColor.value

        return {
            '--color-primary': primary.value,
            '--color-primary-light': lightenColor(primary.value, 20),
            '--color-primary-dark': darkenColor(primary.value, 20),
            '--color-accent': accent.value,
            '--color-accent-light': lightenColor(accent.value, 20),
            '--color-accent-dark': darkenColor(accent.value, 20),
            '--color-background': theme.colors.background,
            '--color-surface': theme.colors.surface,
            '--color-text': theme.colors.text,
            '--color-text-secondary': theme.colors.textSecondary,
            '--color-border': theme.colors.border,
            '--font-size-base': currentFontSize.value.scale,
            '--sidebar-style': currentSidebarStyle.value.class
        }
    })

    // Acciones
    const setTheme = (themeName) => {
        if (themes[themeName]) {
            currentTheme.value = themeName
            localStorage.setItem('theme', themeName)
            applyTheme()
        }
    }

    const setPrimaryColor = (colorName) => {
        if (primaryColors[colorName]) {
            primaryColor.value = colorName
            localStorage.setItem('primaryColor', colorName)
            applyTheme()
        }
    }

    const setAccentColor = (colorName) => {
        if (accentColors[colorName]) {
            accentColor.value = colorName
            localStorage.setItem('accentColor', colorName)
            applyTheme()
        }
    }

    const setSidebarStyle = (styleName) => {
        if (sidebarStyles[styleName]) {
            sidebarStyle.value = styleName
            localStorage.setItem('sidebarStyle', styleName)
            applyTheme()
        }
    }

    const setFontSize = (sizeName) => {
        if (fontSizes[sizeName]) {
            fontSize.value = sizeName
            localStorage.setItem('fontSize', sizeName)
            applyTheme()
        }
    }

    const toggleCompactMode = () => {
        compactMode.value = !compactMode.value
        localStorage.setItem('compactMode', compactMode.value)
        applyTheme()
    }

    const toggleAnimations = () => {
        animations.value = !animations.value
        localStorage.setItem('animations', animations.value)
        applyTheme()
    }

    const toggleHighContrast = () => {
        highContrast.value = !highContrast.value
        localStorage.setItem('highContrast', highContrast.value)
        applyTheme()
    }

    // Aplicar tema al DOM
    const applyTheme = () => {
        const root = document.documentElement

        // Aplicar variables CSS
        Object.entries(cssVariables.value).forEach(([property, value]) => {
            root.style.setProperty(property, value)
        })

        // Aplicar clases de tema
        root.className = root.className.replace(/theme-\w+/g, '')
        root.classList.add(`theme-${currentTheme.value}`)

        // Aplicar modo compacto
        if (compactMode.value) {
            root.classList.add('compact-mode')
        } else {
            root.classList.remove('compact-mode')
        }

        // Aplicar animaciones
        if (!animations.value) {
            root.classList.add('no-animations')
        } else {
            root.classList.remove('no-animations')
        }

        // Aplicar alto contraste
        if (highContrast.value) {
            root.classList.add('high-contrast')
        } else {
            root.classList.remove('high-contrast')
        }

        // Aplicar tamaño de fuente
        root.style.fontSize = `${currentFontSize.value.scale}rem`
    }

    // Funciones de utilidad para colores
    const lightenColor = (color, percent) => {
        const num = parseInt(color.replace('#', ''), 16)
        const amt = Math.round(2.55 * percent)
        const R = (num >> 16) + amt
        const G = (num >> 8 & 0x00FF) + amt
        const B = (num & 0x0000FF) + amt
        return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)
    }

    const darkenColor = (color, percent) => {
        const num = parseInt(color.replace('#', ''), 16)
        const amt = Math.round(2.55 * percent)
        const R = (num >> 16) - amt
        const G = (num >> 8 & 0x00FF) - amt
        const B = (num & 0x0000FF) - amt
        return '#' + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
            (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
            (B > 255 ? 255 : B < 0 ? 0 : B)).toString(16).slice(1)
    }

    // Inicializar tema
    const initializeTheme = () => {
        // Cargar configuraciones guardadas
        const savedTheme = localStorage.getItem('theme')
        const savedPrimaryColor = localStorage.getItem('primaryColor')
        const savedAccentColor = localStorage.getItem('accentColor')
        const savedSidebarStyle = localStorage.getItem('sidebarStyle')
        const savedFontSize = localStorage.getItem('fontSize')
        const savedCompactMode = localStorage.getItem('compactMode')
        const savedAnimations = localStorage.getItem('animations')
        const savedHighContrast = localStorage.getItem('highContrast')

        if (savedTheme) currentTheme.value = savedTheme
        if (savedPrimaryColor) primaryColor.value = savedPrimaryColor
        if (savedAccentColor) accentColor.value = savedAccentColor
        if (savedSidebarStyle) sidebarStyle.value = savedSidebarStyle
        if (savedFontSize) fontSize.value = savedFontSize
        if (savedCompactMode !== null) compactMode.value = savedCompactMode === 'true'
        if (savedAnimations !== null) animations.value = savedAnimations === 'true'
        if (savedHighContrast !== null) highContrast.value = savedHighContrast === 'true'

        // Aplicar tema inicial
        applyTheme()
    }

    // Resetear a tema por defecto
    const resetToDefault = () => {
        currentTheme.value = 'light'
        primaryColor.value = 'blue'
        accentColor.value = 'indigo'
        sidebarStyle.value = 'default'
        fontSize.value = 'medium'
        compactMode.value = false
        animations.value = true
        highContrast.value = false

        // Limpiar localStorage
        localStorage.removeItem('theme')
        localStorage.removeItem('primaryColor')
        localStorage.removeItem('accentColor')
        localStorage.removeItem('sidebarStyle')
        localStorage.removeItem('fontSize')
        localStorage.removeItem('compactMode')
        localStorage.removeItem('animations')
        localStorage.removeItem('highContrast')

        applyTheme()
    }

    // Exportar configuración del tema
    const exportTheme = () => {
        const themeConfig = {
            theme: currentTheme.value,
            primaryColor: primaryColor.value,
            accentColor: accentColor.value,
            sidebarStyle: sidebarStyle.value,
            fontSize: fontSize.value,
            compactMode: compactMode.value,
            animations: animations.value,
            highContrast: highContrast.value,
            timestamp: new Date().toISOString()
        }

        const blob = new Blob([JSON.stringify(themeConfig, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `theme_config_${new Date().toISOString().split('T')[0]}.json`
        a.click()
        URL.revokeObjectURL(url)
    }

    // Importar configuración del tema
    const importTheme = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = (e) => {
                try {
                    const config = JSON.parse(e.target.result)

                    // Validar configuración
                    if (config.theme && themes[config.theme]) currentTheme.value = config.theme
                    if (config.primaryColor && primaryColors[config.primaryColor]) primaryColor.value = config.primaryColor
                    if (config.accentColor && accentColors[config.accentColor]) accentColor.value = config.accentColor
                    if (config.sidebarStyle && sidebarStyles[config.sidebarStyle]) sidebarStyle.value = config.sidebarStyle
                    if (config.fontSize && fontSizes[config.fontSize]) fontSize.value = config.fontSize
                    if (typeof config.compactMode === 'boolean') compactMode.value = config.compactMode
                    if (typeof config.animations === 'boolean') animations.value = config.animations
                    if (typeof config.highContrast === 'boolean') highContrast.value = config.highContrast

                    // Guardar en localStorage
                    localStorage.setItem('theme', currentTheme.value)
                    localStorage.setItem('primaryColor', primaryColor.value)
                    localStorage.setItem('accentColor', accentColor.value)
                    localStorage.setItem('sidebarStyle', sidebarStyle.value)
                    localStorage.setItem('fontSize', fontSize.value)
                    localStorage.setItem('compactMode', compactMode.value)
                    localStorage.setItem('animations', animations.value)
                    localStorage.setItem('highContrast', highContrast.value)

                    applyTheme()
                    resolve()
                } catch (error) {
                    reject(error)
                }
            }
            reader.onerror = reject
            reader.readAsText(file)
        })
    }

    // Watcher para aplicar cambios automáticamente
    watch([currentTheme, primaryColor, accentColor, sidebarStyle, fontSize, compactMode, animations, highContrast], () => {
        applyTheme()
    }, { deep: true })

    return {
        // States
        currentTheme,
        primaryColor,
        accentColor,
        sidebarStyle,
        fontSize,
        compactMode,
        animations,
        highContrast,

        // Getters
        currentThemeData,
        currentPrimaryColor,
        currentAccentColor,
        currentSidebarStyle,
        currentFontSize,
        cssVariables,

        // Constantes
        themes,
        primaryColors,
        accentColors,
        sidebarStyles,
        fontSizes,

        // Acciones principales
        setTheme,
        setPrimaryColor,
        setAccentColor,
        setSidebarStyle,
        setFontSize,
        toggleCompactMode,
        toggleAnimations,
        toggleHighContrast,

        // Utilidades
        initializeTheme,
        resetToDefault,
        exportTheme,
        importTheme
    }
})
