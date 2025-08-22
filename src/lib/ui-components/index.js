// Componentes de Formularios
export { default as BaseInput } from '../../components/ui/BaseInput.vue'
export { default as BaseSelect } from './forms/BaseSelect.vue'
export { default as BaseButton } from './forms/BaseButton.vue'
export { default as BaseTextarea } from './forms/BaseTextarea.vue'
export { default as BaseCheckbox } from './forms/BaseCheckbox.vue'
export { default as BaseRadio } from './forms/BaseRadio.vue'

// Componentes de Visualización de Datos
export { default as DataTable } from './data-display/DataTable.vue'

// Componentes de Overlay
export { default as BaseModal } from './overlay/BaseModal.vue'

// Componentes de Feedback
export { default as BaseAlert } from './feedback/BaseAlert.vue'

// Componentes de Navegación
export { default as BaseTabs } from './navigation/BaseTabs.vue'

// Componentes de Layout
export { default as BaseCard } from './layout/BaseCard.vue'

// Re-exportar componentes existentes
export { default as ActionButtons } from '../../components/ui/ActionButtons.vue'

// Exportar tipos de componentes para TypeScript (opcional)
export const ComponentTypes = {
    // Formularios
    BaseInput: 'BaseInput',
    BaseSelect: 'BaseSelect',
    BaseButton: 'BaseButton',
    BaseTextarea: 'BaseTextarea',
    BaseCheckbox: 'BaseCheckbox',
    BaseRadio: 'BaseRadio',

    // Visualización
    DataTable: 'DataTable',

    // Overlay
    BaseModal: 'BaseModal',

    // Feedback
    BaseAlert: 'BaseAlert',

    // Navegación
    BaseTabs: 'BaseTabs',

    // Layout
    BaseCard: 'BaseCard',

    // Existente
    ActionButtons: 'ActionButtons'
}

// Exportar configuración de temas
export const ThemeConfig = {
    colors: {
        primary: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a'
        },
        success: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d'
        },
        danger: {
            50: '#fef2f2',
            100: '#fee2e2',
            200: '#fecaca',
            300: '#fca5a5',
            400: '#f87171',
            500: '#ef4444',
            600: '#dc2626',
            700: '#b91c1c',
            800: '#991b1b',
            900: '#7f1d1d'
        },
        warning: {
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309',
            800: '#92400e',
            900: '#78350f'
        },
        info: {
            50: '#ecfeff',
            100: '#cffafe',
            200: '#a5f3fc',
            300: '#67e8f9',
            400: '#22d3ee',
            500: '#06b6d4',
            600: '#0891b2',
            700: '#0e7490',
            800: '#155e75',
            900: '#164e63'
        }
    },

    sizes: {
        xs: '0.75rem',    // 12px
        sm: '0.875rem',   // 14px
        md: '1rem',       // 16px
        lg: '1.125rem',   // 18px
        xl: '1.25rem',    // 20px
        '2xl': '1.5rem',  // 24px
        '3xl': '1.875rem' // 30px
    },

    spacing: {
        xs: '0.25rem',    // 4px
        sm: '0.5rem',     // 8px
        md: '1rem',       // 16px
        lg: '1.5rem',     // 24px
        xl: '2rem',       // 32px
        '2xl': '3rem',    // 48px
        '3xl': '4rem'     // 64px
    },

    borderRadius: {
        none: '0',
        sm: '0.125rem',   // 2px
        md: '0.25rem',    // 4px
        lg: '0.5rem',     // 8px
        xl: '0.75rem',    // 12px
        '2xl': '1rem',    // 16px
        full: '9999px'
    },

    shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    },

    transitions: {
        fast: '150ms ease-in-out',
        normal: '200ms ease-in-out',
        slow: '300ms ease-in-out'
    }
}

// Exportar utilidades comunes
export const Utils = {
    // Generar ID único
    generateId: (prefix = 'id') => `${prefix}_${Math.random().toString(36).substr(2, 9)}`,

    // Formatear fecha
    formatDate: (date, options = {}) => {
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            ...options
        }
        return new Intl.DateTimeFormat('es-ES', defaultOptions).format(new Date(date))
    },

    // Formatear moneda
    formatCurrency: (amount, currency = 'USD', locale = 'es-ES') => {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency
        }).format(amount)
    },

    // Formatear número
    formatNumber: (number, locale = 'es-ES', options = {}) => {
        return new Intl.NumberFormat(locale, options).format(number)
    },

    // Validar email
    isValidEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    },

    // Validar teléfono
    isValidPhone: (phone) => {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
        return phoneRegex.test(phone.replace(/\s/g, ''))
    },

    // Debounce function
    debounce: (func, wait) => {
        let timeout
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout)
                func(...args)
            }
            clearTimeout(timeout)
            timeout = setTimeout(later, wait)
        }
    },

    // Throttle function
    throttle: (func, limit) => {
        let inThrottle
        return function () {
            const args = arguments
            const context = this
            if (!inThrottle) {
                func.apply(context, args)
                inThrottle = true
                setTimeout(() => inThrottle = false, limit)
            }
        }
    }
}

// Exportar hooks personalizados (opcional)
import { computed, ref, readonly } from 'vue'
export const useFormValidation = () => {
    const errors = ref({})
    const isValid = computed(() => Object.keys(errors.value).length === 0)

    const setError = (field, message) => {
        errors.value[field] = message
    }

    const clearError = (field) => {
        if (field) {
            delete errors.value[field]
        } else {
            errors.value = {}
        }
    }

    const validateField = (field, value, rules) => {
        clearError(field)

        for (const rule of rules) {
            if (rule.required && !value) {
                setError(field, rule.message || 'Este campo es requerido')
                return false
            }

            if (rule.minLength && value.length < rule.minLength) {
                setError(field, rule.message || `Mínimo ${rule.minLength} caracteres`)
                return false
            }

            if (rule.maxLength && value.length > rule.maxLength) {
                setError(field, rule.message || `Máximo ${rule.maxLength} caracteres`)
                return false
            }

            if (rule.pattern && !rule.pattern.test(value)) {
                setError(field, rule.message || 'Formato inválido')
                return false
            }

            if (rule.validator && !rule.validator(value)) {
                setError(field, rule.message || 'Valor inválido')
                return false
            }
        }

        return true
    }

    return {
        errors: readonly(errors),
        isValid,
        setError,
        clearError,
        validateField
    }
}

// Exportar configuración de componentes por defecto
export const DefaultProps = {
    BaseInput: {
        size: 'md',
        variant: 'default',
        clearable: false,
        showCharacterCount: false
    },

    BaseSelect: {
        size: 'md',
        variant: 'default',
        searchable: false,
        multiple: false
    },

    BaseButton: {
        size: 'md',
        variant: 'primary',
        loading: false,
        disabled: false
    },

    BaseTextarea: {
        size: 'md',
        variant: 'default',
        rows: 3,
        autoResize: false
    },

    BaseCheckbox: {
        size: 'md',
        variant: 'default',
        validateOnChange: true
    },

    BaseRadio: {
        size: 'md',
        variant: 'default',
        validateOnChange: true
    },

    BaseAlert: {
        type: 'info',
        size: 'md',
        variant: 'default',
        dismissible: false,
        showIcon: true
    },

    BaseTabs: {
        size: 'md',
        variant: 'default',
        vertical: false,
        lazy: false
    },

    BaseCard: {
        size: 'md',
        variant: 'default',
        elevation: 'md',
        hoverable: false,
        showHeader: true,
        showFooter: false
    },

    DataTable: {
        pageSize: 10,
        showPagination: true,
        showFilters: true,
        searchable: true,
        selectable: false
    },

    BaseModal: {
        size: 'md',
        showHeader: true,
        showFooter: true,
        closeOnOverlay: true,
        closeOnEscape: true
    }
}

// Exportar todo como un objeto
export default {
    // Componentes de Formularios
    BaseInput, BaseSelect, BaseButton, BaseTextarea, BaseCheckbox, BaseRadio,

    // Componentes de Visualización
    DataTable,

    // Componentes de Overlay
    BaseModal,

    // Componentes de Feedback
    BaseAlert,

    // Componentes de Navegación
    BaseTabs,

    // Componentes de Layout
    BaseCard,

    // Componentes Existentes
    ActionButtons,

    // Configuración
    ComponentTypes, ThemeConfig, DefaultProps,

    // Utilidades
    Utils, useFormValidation
}
