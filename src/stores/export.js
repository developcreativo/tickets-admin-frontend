import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useNotificationsStore } from './notifications'

export const useExportStore = defineStore('export', () => {
    // Stores
    const notificationsStore = useNotificationsStore()

    // Estados
    const isExporting = ref(false)
    const exportProgress = ref(0)
    const exportHistory = ref([])
    const exportTemplates = ref([])
    const scheduledExports = ref([])

    // Formatos de exportación disponibles
    const exportFormats = {
        pdf: {
            name: 'PDF',
            extension: '.pdf',
            mimeType: 'application/pdf',
            icon: '📄',
            description: 'Documento PDF con formato profesional'
        },
        excel: {
            name: 'Excel',
            extension: '.xlsx',
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            icon: '📊',
            description: 'Hoja de cálculo Excel con fórmulas y gráficos'
        },
        csv: {
            name: 'CSV',
            extension: '.csv',
            mimeType: 'text/csv',
            icon: '📋',
            description: 'Archivo de texto separado por comas'
        },
        json: {
            name: 'JSON',
            extension: '.json',
            mimeType: 'application/json',
            icon: '🔧',
            description: 'Datos estructurados en formato JSON'
        },
        xml: {
            name: 'XML',
            extension: '.xml',
            mimeType: 'application/xml',
            icon: '📝',
            description: 'Documento XML estructurado'
        }
    }

    // Tipos de exportación
    const exportTypes = {
        TICKETS: 'tickets',
        USERS: 'users',
        CATALOG: 'catalog',
        REPORTS: 'reports',
        NOTIFICATIONS: 'notifications',
        AUDIT_LOGS: 'audit_logs',
        SYSTEM_STATS: 'system_stats',
        CUSTOM_QUERY: 'custom_query'
    }

    // Plantillas predefinidas
    const defaultTemplates = [
        {
            id: 'tickets_daily',
            name: 'Reporte Diario de Tickets',
            type: exportTypes.TICKETS,
            description: 'Resumen diario de tickets creados y procesados',
            format: 'pdf',
            fields: ['id', 'zone', 'draw_type', 'user', 'items', 'created_at'],
            filters: { date_range: 'today' },
            schedule: 'daily',
            enabled: true
        },
        {
            id: 'users_summary',
            name: 'Resumen de Usuarios',
            type: exportTypes.USERS,
            description: 'Lista completa de usuarios con estadísticas',
            format: 'excel',
            fields: ['id', 'username', 'email', 'role', 'is_active', 'last_login'],
            filters: { status: 'all' },
            schedule: 'weekly',
            enabled: true
        },
        {
            id: 'catalog_complete',
            name: 'Catálogo Completo',
            type: exportTypes.CATALOG,
            description: 'Todos los elementos del catálogo del sistema',
            format: 'excel',
            fields: ['zones', 'draw_types', 'draw_schedules', 'number_limits'],
            filters: {},
            schedule: 'monthly',
            enabled: true
        },
        {
            id: 'reports_analytics',
            name: 'Reportes Analíticos',
            type: exportTypes.REPORTS,
            description: 'Análisis detallado de reportes y métricas',
            format: 'pdf',
            fields: ['summary', 'charts', 'trends', 'recommendations'],
            filters: { period: 'month' },
            schedule: 'monthly',
            enabled: true
        }
    ]

    // Getters
    const availableFormats = computed(() => Object.keys(exportFormats))
    const availableTypes = computed(() => Object.values(exportTypes))
    const activeTemplates = computed(() => exportTemplates.value.filter(t => t.enabled))
    const scheduledExportsActive = computed(() => scheduledExports.value.filter(e => e.enabled))

    // Acciones principales
    const exportData = async (config) => {
        try {
            isExporting.value = true
            exportProgress.value = 0

            // Validar configuración
            if (!validateExportConfig(config)) {
                throw new Error('Configuración de exportación inválida')
            }

            // Simular progreso de exportación
            const progressInterval = setInterval(() => {
                if (exportProgress.value < 90) {
                    exportProgress.value += Math.random() * 20
                }
            }, 200)

            // Generar datos según el tipo
            const data = await generateExportData(config)

            // Aplicar filtros
            const filteredData = applyFilters(data, config.filters)

            // Aplicar campos seleccionados
            const selectedData = selectFields(filteredData, config.fields)

            // Generar archivo según formato
            const file = await generateFile(selectedData, config.format, config)

            // Descargar archivo
            downloadFile(file, config.filename || generateFilename(config))

            // Actualizar historial
            updateExportHistory(config, file.size)

            // Notificar éxito
            notificationsStore.showSuccess(`Exportación completada: ${config.filename || generateFilename(config)}`)

            clearInterval(progressInterval)
            exportProgress.value = 100

            return file
        } catch (error) {
            console.error('Error en exportación:', error)
            notificationsStore.showError(`Error en exportación: ${error.message}`)
            throw error
        } finally {
            isExporting.value = false
            setTimeout(() => {
                exportProgress.value = 0
            }, 1000)
        }
    }

    // Exportación rápida por tipo
    const exportTickets = async (format = 'excel', filters = {}) => {
        return await exportData({
            type: exportTypes.TICKETS,
            format,
            filters,
            fields: ['id', 'zone', 'draw_type', 'user', 'items', 'created_at'],
            filename: `tickets_${new Date().toISOString().split('T')[0]}.${exportFormats[format].extension}`
        })
    }

    const exportUsers = async (format = 'excel', filters = {}) => {
        return await exportData({
            type: exportTypes.USERS,
            format,
            filters,
            fields: ['id', 'username', 'email', 'role', 'is_active', 'last_login'],
            filename: `users_${new Date().toISOString().split('T')[0]}.${exportFormats[format].extension}`
        })
    }

    const exportCatalog = async (format = 'excel', filters = {}) => {
        return await exportData({
            type: exportTypes.CATALOG,
            format,
            filters,
            fields: ['zones', 'draw_types', 'draw_schedules', 'number_limits'],
            filename: `catalog_${new Date().toISOString().split('T')[0]}.${exportFormats[format].extension}`
        })
    }

    const exportReports = async (format = 'pdf', filters = {}) => {
        return await exportData({
            type: exportTypes.REPORTS,
            format,
            filters,
            fields: ['summary', 'charts', 'trends', 'recommendations'],
            filename: `reports_${new Date().toISOString().split('T')[0]}.${exportFormats[format].extension}`
        })
    }

    // Plantillas de exportación
    const createTemplate = (template) => {
        const newTemplate = {
            id: `template_${Date.now()}`,
            created_at: new Date().toISOString(),
            enabled: true,
            ...template
        }

        exportTemplates.value.push(newTemplate)
        saveTemplates()

        notificationsStore.showSuccess('Plantilla de exportación creada')
        return newTemplate
    }

    const updateTemplate = (templateId, updates) => {
        const index = exportTemplates.value.findIndex(t => t.id === templateId)
        if (index !== -1) {
            exportTemplates.value[index] = { ...exportTemplates.value[index], ...updates }
            saveTemplates()
            notificationsStore.showSuccess('Plantilla actualizada')
        }
    }

    const deleteTemplate = (templateId) => {
        exportTemplates.value = exportTemplates.value.filter(t => t.id !== templateId)
        saveTemplates()
        notificationsStore.showSuccess('Plantilla eliminada')
    }

    const duplicateTemplate = (templateId) => {
        const template = exportTemplates.value.find(t => t.id === templateId)
        if (template) {
            const duplicated = {
                ...template,
                id: `template_${Date.now()}`,
                name: `${template.name} (Copia)`,
                created_at: new Date().toISOString()
            }
            exportTemplates.value.push(duplicated)
            saveTemplates()
            notificationsStore.showSuccess('Plantilla duplicada')
            return duplicated
        }
    }

    // Exportaciones programadas
    const scheduleExport = (templateId, schedule) => {
        const template = exportTemplates.value.find(t => t.id === templateId)
        if (template) {
            const scheduledExport = {
                id: `scheduled_${Date.now()}`,
                template_id: templateId,
                template: template,
                schedule,
                next_run: calculateNextRun(schedule),
                enabled: true,
                created_at: new Date().toISOString()
            }

            scheduledExports.value.push(scheduledExport)
            saveScheduledExports()

            notificationsStore.showSuccess('Exportación programada creada')
            return scheduledExport
        }
    }

    const updateScheduledExport = (exportId, updates) => {
        const index = scheduledExports.value.findIndex(e => e.id === exportId)
        if (index !== -1) {
            scheduledExports.value[index] = { ...scheduledExports.value[index], ...updates }
            if (updates.schedule) {
                scheduledExports.value[index].next_run = calculateNextRun(updates.schedule)
            }
            saveScheduledExports()
            notificationsStore.showSuccess('Exportación programada actualizada')
        }
    }

    const deleteScheduledExport = (exportId) => {
        scheduledExports.value = scheduledExports.value.filter(e => e.id !== exportId)
        saveScheduledExports()
        notificationsStore.showSuccess('Exportación programada eliminada')
    }

    // Funciones de utilidad
    const validateExportConfig = (config) => {
        if (!config.type || !exportTypes[config.type.toUpperCase()]) {
            return false
        }
        if (!config.format || !exportFormats[config.format]) {
            return false
        }
        return true
    }

    const generateExportData = async (config) => {
        // Simular generación de datos según el tipo
        switch (config.type) {
            case exportTypes.TICKETS:
                return await generateTicketsData()
            case exportTypes.USERS:
                return await generateUsersData()
            case exportTypes.CATALOG:
                return await generateCatalogData()
            case exportTypes.REPORTS:
                return await generateReportsData()
            default:
                return []
        }
    }

    const generateTicketsData = async () => {
        // Simular datos de tickets
        return Array.from({ length: 100 }, (_, i) => ({
            id: i + 1,
            zone: `Zona ${(i % 5) + 1}`,
            draw_type: `Sorteo ${(i % 3) + 1}`,
            user: `Usuario ${(i % 10) + 1}`,
            items: Math.floor(Math.random() * 10) + 1,
            created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
        }))
    }

    const generateUsersData = async () => {
        // Simular datos de usuarios
        return Array.from({ length: 50 }, (_, i) => ({
            id: i + 1,
            username: `usuario${i + 1}`,
            email: `usuario${i + 1}@example.com`,
            role: i === 0 ? 'admin' : i < 5 ? 'manager' : 'user',
            is_active: Math.random() > 0.1,
            last_login: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
        }))
    }

    const generateCatalogData = async () => {
        // Simular datos de catálogo
        return {
            zones: Array.from({ length: 5 }, (_, i) => ({ id: i + 1, name: `Zona ${i + 1}` })),
            draw_types: Array.from({ length: 3 }, (_, i) => ({ id: i + 1, name: `Sorteo ${i + 1}` })),
            draw_schedules: Array.from({ length: 7 }, (_, i) => ({ id: i + 1, name: `Horario ${i + 1}` })),
            number_limits: Array.from({ length: 10 }, (_, i) => ({ id: i + 1, limit: Math.floor(Math.random() * 100) + 50 }))
        }
    }

    const generateReportsData = async () => {
        // Simular datos de reportes
        return {
            summary: {
                total_tickets: 1250,
                total_users: 45,
                total_revenue: 125000
            },
            charts: {
                tickets_by_zone: [300, 250, 200, 300, 200],
                tickets_by_day: [65, 59, 80, 81, 56, 55, 40]
            },
            trends: {
                growth_rate: 12.5,
                peak_hours: ['10:00', '14:00', '16:00']
            },
            recommendations: [
                'Aumentar personal en horas pico',
                'Optimizar distribución de zonas',
                'Implementar sistema de reservas'
            ]
        }
    }

    const applyFilters = (data, filters) => {
        if (!filters || Object.keys(filters).length === 0) {
            return data
        }

        return data.filter(item => {
            for (const [key, value] of Object.entries(filters)) {
                if (value && item[key] !== value) {
                    return false
                }
            }
            return true
        })
    }

    const selectFields = (data, fields) => {
        if (!fields || fields.length === 0) {
            return data
        }

        if (Array.isArray(data)) {
            return data.map(item => {
                const selected = {}
                fields.forEach(field => {
                    if (item.hasOwnProperty(field)) {
                        selected[field] = item[field]
                    }
                })
                return selected
            })
        } else {
            const selected = {}
            fields.forEach(field => {
                if (data.hasOwnProperty(field)) {
                    selected[field] = data[field]
                }
            })
            return selected
        }
    }

    const generateFile = async (data, format, config) => {
        const formatConfig = exportFormats[format]

        switch (format) {
            case 'pdf':
                return await generatePDF(data, config)
            case 'excel':
                return await generateExcel(data, config)
            case 'csv':
                return generateCSV(data, config)
            case 'json':
                return generateJSON(data, config)
            case 'xml':
                return generateXML(data, config)
            default:
                throw new Error(`Formato no soportado: ${format}`)
        }
    }

    const generatePDF = async (data, config) => {
        // Simular generación de PDF
        const content = JSON.stringify(data, null, 2)
        const blob = new Blob([content], { type: 'application/pdf' })
        return {
            blob,
            size: blob.size,
            type: 'pdf'
        }
    }

    const generateExcel = async (data, config) => {
        // Simular generación de Excel
        const content = JSON.stringify(data, null, 2)
        const blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        return {
            blob,
            size: blob.size,
            type: 'excel'
        }
    }

    const generateCSV = (data, config) => {
        let csvContent = ''

        if (Array.isArray(data) && data.length > 0) {
            const headers = Object.keys(data[0])
            csvContent += headers.join(',') + '\n'

            data.forEach(row => {
                const values = headers.map(header => {
                    const value = row[header]
                    return typeof value === 'string' && value.includes(',') ? `"${value}"` : value
                })
                csvContent += values.join(',') + '\n'
            })
        }

        const blob = new Blob([csvContent], { type: 'text/csv' })
        return {
            blob,
            size: blob.size,
            type: 'csv'
        }
    }

    const generateJSON = (data, config) => {
        const content = JSON.stringify(data, null, 2)
        const blob = new Blob([content], { type: 'application/json' })
        return {
            blob,
            size: blob.size,
            type: 'json'
        }
    }

    const generateXML = (data, config) => {
        let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n<data>\n'

        if (Array.isArray(data)) {
            data.forEach(item => {
                xmlContent += '  <item>\n'
                Object.entries(item).forEach(([key, value]) => {
                    xmlContent += `    <${key}>${value}</${key}>\n`
                })
                xmlContent += '  </item>\n'
            })
        } else {
            Object.entries(data).forEach(([key, value]) => {
                xmlContent += `  <${key}>${value}</${key}>\n`
            })
        }

        xmlContent += '</data>'
        const blob = new Blob([xmlContent], { type: 'application/xml' })
        return {
            blob,
            size: blob.size,
            type: 'xml'
        }
    }

    const downloadFile = (file, filename) => {
        const url = URL.createObjectURL(file.blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const generateFilename = (config) => {
        const timestamp = new Date().toISOString().split('T')[0]
        const format = exportFormats[config.format]
        return `${config.type}_${timestamp}${format.extension}`
    }

    const updateExportHistory = (config, fileSize) => {
        const historyEntry = {
            id: `export_${Date.now()}`,
            type: config.type,
            format: config.format,
            filename: config.filename || generateFilename(config),
            file_size: fileSize,
            created_at: new Date().toISOString(),
            template_id: config.template_id || null
        }

        exportHistory.value.unshift(historyEntry)

        // Limitar historial a 100 entradas
        if (exportHistory.value.length > 100) {
            exportHistory.value = exportHistory.value.slice(0, 100)
        }

        saveExportHistory()
    }

    const calculateNextRun = (schedule) => {
        const now = new Date()

        switch (schedule) {
            case 'daily':
                return new Date(now.getTime() + 24 * 60 * 60 * 1000)
            case 'weekly':
                return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
            case 'monthly':
                return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
            default:
                return now
        }
    }

    // Persistencia
    const saveTemplates = () => {
        localStorage.setItem('export_templates', JSON.stringify(exportTemplates.value))
    }

    const loadTemplates = () => {
        const saved = localStorage.getItem('export_templates')
        if (saved) {
            exportTemplates.value = JSON.parse(saved)
        } else {
            exportTemplates.value = [...defaultTemplates]
        }
    }

    const saveScheduledExports = () => {
        localStorage.setItem('scheduled_exports', JSON.stringify(scheduledExports.value))
    }

    const loadScheduledExports = () => {
        const saved = localStorage.getItem('scheduled_exports')
        if (saved) {
            scheduledExports.value = JSON.parse(saved)
        }
    }

    const saveExportHistory = () => {
        localStorage.setItem('export_history', JSON.stringify(exportHistory.value))
    }

    const loadExportHistory = () => {
        const saved = localStorage.getItem('export_history')
        if (saved) {
            exportHistory.value = JSON.parse(saved)
        }
    }

    // Inicialización
    const initialize = () => {
        loadTemplates()
        loadScheduledExports()
        loadExportHistory()
    }

    // Limpiar historial
    const clearHistory = () => {
        exportHistory.value = []
        saveExportHistory()
        notificationsStore.showSuccess('Historial de exportaciones limpiado')
    }

    // Exportar configuración
    const exportConfiguration = () => {
        const config = {
            templates: exportTemplates.value,
            scheduled_exports: scheduledExports.value,
            timestamp: new Date().toISOString()
        }

        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `export_config_${new Date().toISOString().split('T')[0]}.json`
        a.click()
        URL.revokeObjectURL(url)

        notificationsStore.showSuccess('Configuración de exportación exportada')
    }

    // Importar configuración
    const importConfiguration = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = (e) => {
                try {
                    const config = JSON.parse(e.target.result)

                    if (config.templates) {
                        exportTemplates.value = config.templates
                        saveTemplates()
                    }

                    if (config.scheduled_exports) {
                        scheduledExports.value = config.scheduled_exports
                        saveScheduledExports()
                    }

                    notificationsStore.showSuccess('Configuración de exportación importada')
                    resolve()
                } catch (error) {
                    reject(error)
                }
            }
            reader.onerror = reject
            reader.readAsText(file)
        })
    }

    return {
        // States
        isExporting,
        exportProgress,
        exportHistory,
        exportTemplates,
        scheduledExports,

        // Getters
        availableFormats,
        availableTypes,
        activeTemplates,
        scheduledExportsActive,

        // Constantes
        exportFormats,
        exportTypes,

        // Acciones principales
        exportData,
        exportTickets,
        exportUsers,
        exportCatalog,
        exportReports,

        // Plantillas
        createTemplate,
        updateTemplate,
        deleteTemplate,
        duplicateTemplate,

        // Exportaciones programadas
        scheduleExport,
        updateScheduledExport,
        deleteScheduledExport,

        // Utilidades
        initialize,
        clearHistory,
        exportConfiguration,
        importConfiguration
    }
})
