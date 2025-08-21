import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useNotificationsStore } from './notifications'

export const useAuditStore = defineStore('audit', () => {
    // Stores
    const notificationsStore = useNotificationsStore()

    // Estados
    const auditLogs = ref([])
    const systemLogs = ref([])
    const errorLogs = ref([])
    const userActions = ref([])
    const isLogging = ref(false)

    // Tipos de eventos de auditoría
    const auditEventTypes = {
        // Autenticación
        USER_LOGIN: 'user_login',
        USER_LOGOUT: 'user_logout',
        LOGIN_FAILED: 'login_failed',
        PASSWORD_CHANGED: 'password_changed',
        ACCOUNT_LOCKED: 'account_locked',
        ACCOUNT_UNLOCKED: 'account_unlocked',

        // CRUD Operations
        CREATE: 'create',
        READ: 'read',
        UPDATE: 'update',
        DELETE: 'delete',
        BULK_UPDATE: 'bulk_update',
        BULK_DELETE: 'bulk_delete',

        // Sistema
        SYSTEM_STARTUP: 'system_startup',
        SYSTEM_SHUTDOWN: 'system_shutdown',
        CONFIGURATION_CHANGED: 'configuration_changed',
        BACKUP_CREATED: 'backup_created',
        BACKUP_RESTORED: 'backup_restored',
        CACHE_CLEARED: 'cache_cleared',

        // Seguridad
        PERMISSION_DENIED: 'permission_denied',
        SUSPICIOUS_ACTIVITY: 'suspicious_activity',
        RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded',
        INVALID_TOKEN: 'invalid_token',
        SESSION_EXPIRED: 'session_expired',

        // Exportación
        EXPORT_CREATED: 'export_created',
        EXPORT_DOWNLOADED: 'export_downloaded',
        EXPORT_FAILED: 'export_failed',

        // Reportes
        REPORT_GENERATED: 'report_generated',
        REPORT_VIEWED: 'report_viewed',
        REPORT_EXPORTED: 'report_exported'
    }

    // Niveles de log
    const logLevels = {
        DEBUG: 'debug',
        INFO: 'info',
        WARNING: 'warning',
        ERROR: 'error',
        CRITICAL: 'critical'
    }

    // Categorías de eventos
    const eventCategories = {
        AUTHENTICATION: 'authentication',
        AUTHORIZATION: 'authorization',
        DATA_ACCESS: 'data_access',
        SYSTEM: 'system',
        SECURITY: 'security',
        EXPORT: 'export',
        REPORT: 'report',
        USER_MANAGEMENT: 'user_management'
    }

    // Getters
    const criticalLogs = computed(() =>
        errorLogs.value.filter(log => log.level === logLevels.CRITICAL)
    )

    const recentLogs = computed(() =>
        [...auditLogs.value, ...systemLogs.value, ...errorLogs.value]
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 50)
    )

    const logsByCategory = computed(() => {
        const categorized = {}
        recentLogs.value.forEach(log => {
            if (!categorized[log.category]) {
                categorized[log.category] = []
            }
            categorized[log.category].push(log)
        })
        return categorized
    })

    const logsByUser = computed(() => {
        const userLogs = {}
        userActions.value.forEach(action => {
            if (!userLogs[action.user_id]) {
                userLogs[action.user_id] = []
            }
            userLogs[action.user_id].push(action)
        })
        return userLogs
    })

    // Acciones principales
    const logAuditEvent = (event) => {
        const auditEvent = {
            id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            type: event.type || auditEventTypes.READ,
            category: event.category || eventCategories.DATA_ACCESS,
            user_id: event.user_id || 'system',
            username: event.username || 'System',
            ip_address: event.ip_address || '127.0.0.1',
            user_agent: event.user_agent || 'System',
            resource: event.resource || 'unknown',
            action: event.action || 'unknown',
            details: event.details || {},
            severity: event.severity || 'info',
            session_id: event.session_id || null,
            request_id: event.request_id || null
        }

        auditLogs.value.unshift(auditEvent)

        // Limitar logs a 1000 entradas
        if (auditLogs.value.length > 1000) {
            auditLogs.value = auditLogs.value.slice(0, 1000)
        }

        // Guardar en localStorage
        saveAuditLogs()

        return auditEvent
    }

    const logSystemEvent = (event) => {
        const systemEvent = {
            id: `system_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            level: event.level || logLevels.INFO,
            category: event.category || eventCategories.SYSTEM,
            component: event.component || 'system',
            message: event.message || 'System event',
            details: event.details || {},
            stack_trace: event.stack_trace || null,
            performance_metrics: event.performance_metrics || null
        }

        systemLogs.value.unshift(systemEvent)

        // Limitar logs a 1000 entradas
        if (systemLogs.value.length > 1000) {
            systemLogs.value = systemLogs.value.slice(0, 1000)
        }

        // Guardar en localStorage
        saveSystemLogs()

        return systemEvent
    }

    const logError = (error) => {
        const errorEvent = {
            id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            level: error.level || logLevels.ERROR,
            category: error.category || eventCategories.SYSTEM,
            component: error.component || 'unknown',
            message: error.message || 'Unknown error',
            error_type: error.error_type || 'Error',
            stack_trace: error.stack_trace || null,
            user_id: error.user_id || null,
            username: error.username || null,
            ip_address: error.ip_address || null,
            request_url: error.request_url || null,
            request_method: error.request_method || null,
            request_headers: error.request_headers || null,
            request_body: error.request_body || null,
            response_status: error.response_status || null,
            response_body: error.response_body || null
        }

        errorLogs.value.unshift(errorEvent)

        // Limitar logs a 1000 entradas
        if (errorLogs.value.length > 1000) {
            errorLogs.value = errorLogs.value.slice(0, 1000)
        }

        // Guardar en localStorage
        saveErrorLogs()

        // Notificar si es crítico
        if (errorEvent.level === logLevels.CRITICAL) {
            notificationsStore.showError(`Error crítico: ${errorEvent.message}`)
        }

        return errorEvent
    }

    const logUserAction = (action) => {
        const userAction = {
            id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            user_id: action.user_id,
            username: action.username,
            ip_address: action.ip_address || '127.0.0.1',
            user_agent: action.user_agent || 'Unknown',
            action: action.action,
            resource: action.resource,
            resource_id: action.resource_id,
            details: action.details || {},
            session_id: action.session_id || null,
            request_id: action.request_id || null,
            performance_ms: action.performance_ms || null
        }

        userActions.value.unshift(userAction)

        // Limitar acciones a 1000 entradas
        if (userActions.value.length > 1000) {
            userActions.value = userActions.value.slice(0, 1000)
        }

        // Guardar en localStorage
        saveUserActions()

        return userAction
    }

    // Logs específicos del sistema
    const logAuthentication = (event) => {
        return logAuditEvent({
            type: event.success ? auditEventTypes.USER_LOGIN : auditEventTypes.LOGIN_FAILED,
            category: eventCategories.AUTHENTICATION,
            user_id: event.user_id,
            username: event.username,
            ip_address: event.ip_address,
            user_agent: event.user_agent,
            resource: 'authentication',
            action: event.success ? 'login_success' : 'login_failed',
            details: {
                success: event.success,
                failure_reason: event.failure_reason,
                login_method: event.login_method || 'password'
            },
            severity: event.success ? 'info' : 'warning'
        })
    }

    const logDataAccess = (event) => {
        return logAuditEvent({
            type: auditEventTypes[event.operation.toUpperCase()] || auditEventTypes.READ,
            category: eventCategories.DATA_ACCESS,
            user_id: event.user_id,
            username: event.username,
            ip_address: event.ip_address,
            user_agent: event.user_agent,
            resource: event.resource,
            action: event.operation,
            details: {
                resource_id: event.resource_id,
                resource_type: event.resource_type,
                operation: event.operation,
                fields_modified: event.fields_modified,
                old_values: event.old_values,
                new_values: event.new_values
            },
            severity: 'info'
        })
    }

    const logSecurityEvent = (event) => {
        return logAuditEvent({
            type: auditEventTypes[event.event_type.toUpperCase()] || auditEventTypes.SUSPICIOUS_ACTIVITY,
            category: eventCategories.SECURITY,
            user_id: event.user_id,
            username: event.username,
            ip_address: event.ip_address,
            user_agent: event.user_agent,
            resource: event.resource || 'security',
            action: event.action || 'security_event',
            details: {
                event_type: event.event_type,
                threat_level: event.threat_level,
                description: event.description,
                mitigation: event.mitigation
            },
            severity: event.severity || 'warning'
        })
    }

    const logExportEvent = (event) => {
        return logAuditEvent({
            type: event.success ? auditEventTypes.EXPORT_CREATED : auditEventTypes.EXPORT_FAILED,
            category: eventCategories.EXPORT,
            user_id: event.user_id,
            username: event.username,
            ip_address: event.ip_address,
            user_agent: event.user_agent,
            resource: 'export',
            action: event.success ? 'export_created' : 'export_failed',
            details: {
                export_type: event.export_type,
                format: event.format,
                filename: event.filename,
                file_size: event.file_size,
                filters: event.filters,
                success: event.success,
                error_message: event.error_message
            },
            severity: event.success ? 'info' : 'error'
        })
    }

    // Búsqueda y filtrado
    const searchLogs = (query, filters = {}) => {
        let results = [...auditLogs.value, ...systemLogs.value, ...errorLogs.value]

        // Filtro por texto
        if (query) {
            const searchTerm = query.toLowerCase()
            results = results.filter(log =>
                log.message?.toLowerCase().includes(searchTerm) ||
                log.action?.toLowerCase().includes(searchTerm) ||
                log.resource?.toLowerCase().includes(searchTerm) ||
                log.username?.toLowerCase().includes(searchTerm) ||
                JSON.stringify(log.details).toLowerCase().includes(searchTerm)
            )
        }

        // Filtros adicionales
        if (filters.level) {
            results = results.filter(log => log.level === filters.level)
        }

        if (filters.category) {
            results = results.filter(log => log.category === filters.category)
        }

        if (filters.user_id) {
            results = results.filter(log => log.user_id === filters.user_id)
        }

        if (filters.date_from) {
            results = results.filter(log => new Date(log.timestamp) >= new Date(filters.date_from))
        }

        if (filters.date_to) {
            results = results.filter(log => new Date(log.timestamp) <= new Date(filters.date_to))
        }

        if (filters.severity) {
            results = results.filter(log => log.severity === filters.severity)
        }

        // Ordenar por timestamp
        return results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    }

    const getLogsByUser = (userId, limit = 100) => {
        return userActions.value
            .filter(action => action.user_id === userId)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, limit)
    }

    const getLogsByResource = (resource, limit = 100) => {
        return auditLogs.value
            .filter(log => log.resource === resource)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, limit)
    }

    const getLogsByTimeRange = (startDate, endDate, limit = 100) => {
        const start = new Date(startDate)
        const end = new Date(endDate)

        return [...auditLogs.value, ...systemLogs.value, ...errorLogs.value]
            .filter(log => {
                const logDate = new Date(log.timestamp)
                return logDate >= start && logDate <= end
            })
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, limit)
    }

    // Estadísticas de auditoría
    const getAuditStats = (timeRange = '24h') => {
        const now = new Date()
        let startDate

        switch (timeRange) {
            case '1h':
                startDate = new Date(now.getTime() - 60 * 60 * 1000)
                break
            case '24h':
                startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
                break
            case '7d':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                break
            case '30d':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
                break
            default:
                startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        }

        const logs = getLogsByTimeRange(startDate, now)

        const stats = {
            total_events: logs.length,
            events_by_type: {},
            events_by_category: {},
            events_by_user: {},
            events_by_severity: {},
            top_resources: {},
            top_actions: {},
            errors_count: 0,
            warnings_count: 0,
            critical_count: 0
        }

        logs.forEach(log => {
            // Contar por tipo
            stats.events_by_type[log.type] = (stats.events_by_type[log.type] || 0) + 1

            // Contar por categoría
            stats.events_by_category[log.category] = (stats.events_by_category[log.category] || 0) + 1

            // Contar por usuario
            if (log.user_id && log.user_id !== 'system') {
                stats.events_by_user[log.username] = (stats.events_by_user[log.username] || 0) + 1
            }

            // Contar por severidad
            if (log.severity) {
                stats.events_by_severity[log.severity] = (stats.events_by_severity[log.severity] || 0) + 1
            }

            // Contar recursos más accedidos
            if (log.resource) {
                stats.top_resources[log.resource] = (stats.top_resources[log.resource] || 0) + 1
            }

            // Contar acciones más realizadas
            if (log.action) {
                stats.top_actions[log.action] = (stats.top_actions[log.action] || 0) + 1
            }

            // Contar errores
            if (log.level === logLevels.ERROR) stats.errors_count++
            if (log.level === logLevels.WARNING) stats.warnings_count++
            if (log.level === logLevels.CRITICAL) stats.critical_count++
        })

        return stats
    }

    // Limpieza de logs
    const clearOldLogs = (daysToKeep = 30) => {
        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

        const cutoffTimestamp = cutoffDate.toISOString()

        auditLogs.value = auditLogs.value.filter(log => log.timestamp > cutoffTimestamp)
        systemLogs.value = systemLogs.value.filter(log => log.timestamp > cutoffTimestamp)
        errorLogs.value = errorLogs.value.filter(log => log.timestamp > cutoffTimestamp)
        userActions.value = userActions.value.filter(action => action.timestamp > cutoffTimestamp)

        saveAllLogs()

        notificationsStore.showSuccess(`Logs antiguos (más de ${daysToKeep} días) eliminados`)
    }

    const clearAllLogs = () => {
        auditLogs.value = []
        systemLogs.value = []
        errorLogs.value = []
        userActions.value = []

        saveAllLogs()

        notificationsStore.showSuccess('Todos los logs han sido eliminados')
    }

    // Exportación de logs
    const exportLogs = (format = 'json', filters = {}) => {
        const logs = searchLogs('', filters)

        let content, filename, mimeType

        switch (format) {
            case 'json':
                content = JSON.stringify(logs, null, 2)
                filename = `audit_logs_${new Date().toISOString().split('T')[0]}.json`
                mimeType = 'application/json'
                break
            case 'csv':
                content = convertLogsToCSV(logs)
                filename = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`
                mimeType = 'text/csv'
                break
            case 'xml':
                content = convertLogsToXML(logs)
                filename = `audit_logs_${new Date().toISOString().split('T')[0]}.xml`
                mimeType = 'application/xml'
                break
            default:
                throw new Error(`Formato no soportado: ${format}`)
        }

        const blob = new Blob([content], { type: mimeType })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        notificationsStore.showSuccess(`Logs exportados en formato ${format.toUpperCase()}`)
    }

    const convertLogsToCSV = (logs) => {
        if (logs.length === 0) return ''

        const headers = ['timestamp', 'type', 'category', 'user_id', 'username', 'action', 'resource', 'severity', 'details']
        let csvContent = headers.join(',') + '\n'

        logs.forEach(log => {
            const values = headers.map(header => {
                let value = log[header]
                if (header === 'details') {
                    value = JSON.stringify(value)
                }
                return typeof value === 'string' && value.includes(',') ? `"${value}"` : value
            })
            csvContent += values.join(',') + '\n'
        })

        return csvContent
    }

    const convertLogsToXML = (logs) => {
        let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n<audit_logs>\n'

        logs.forEach(log => {
            xmlContent += '  <log>\n'
            Object.entries(log).forEach(([key, value]) => {
                if (key === 'details') {
                    xmlContent += `    <${key}><![CDATA[${JSON.stringify(value)}]]></${key}>\n`
                } else {
                    xmlContent += `    <${key}>${value}</${key}>\n`
                }
            })
            xmlContent += '  </log>\n'
        })

        xmlContent += '</audit_logs>'
        return xmlContent
    }

    // Persistencia
    const saveAuditLogs = () => {
        localStorage.setItem('audit_logs', JSON.stringify(auditLogs.value))
    }

    const saveSystemLogs = () => {
        localStorage.setItem('system_logs', JSON.stringify(systemLogs.value))
    }

    const saveErrorLogs = () => {
        localStorage.setItem('error_logs', JSON.stringify(errorLogs.value))
    }

    const saveUserActions = () => {
        localStorage.setItem('user_actions', JSON.stringify(userActions.value))
    }

    const saveAllLogs = () => {
        saveAuditLogs()
        saveSystemLogs()
        saveErrorLogs()
        saveUserActions()
    }

    const loadAllLogs = () => {
        const savedAudit = localStorage.getItem('audit_logs')
        const savedSystem = localStorage.getItem('system_logs')
        const savedError = localStorage.getItem('error_logs')
        const savedUserActions = localStorage.getItem('user_actions')

        if (savedAudit) auditLogs.value = JSON.parse(savedAudit)
        if (savedSystem) systemLogs.value = JSON.parse(savedSystem)
        if (savedError) errorLogs.value = JSON.parse(savedError)
        if (savedUserActions) userActions.value = JSON.parse(savedUserActions)
    }

    // Inicialización
    const initialize = () => {
        loadAllLogs()

        // Log de inicio del sistema
        logSystemEvent({
            level: logLevels.INFO,
            category: eventCategories.SYSTEM,
            component: 'audit_system',
            message: 'Sistema de auditoría inicializado',
            details: {
                version: '1.0.0',
                timestamp: new Date().toISOString()
            }
        })
    }

    return {
        // States
        auditLogs,
        systemLogs,
        errorLogs,
        userActions,
        isLogging,

        // Getters
        criticalLogs,
        recentLogs,
        logsByCategory,
        logsByUser,

        // Constantes
        auditEventTypes,
        logLevels,
        eventCategories,

        // Acciones principales
        logAuditEvent,
        logSystemEvent,
        logError,
        logUserAction,
        logAuthentication,
        logDataAccess,
        logSecurityEvent,
        logExportEvent,

        // Búsqueda y filtrado
        searchLogs,
        getLogsByUser,
        getLogsByResource,
        getLogsByTimeRange,

        // Estadísticas
        getAuditStats,

        // Limpieza
        clearOldLogs,
        clearAllLogs,

        // Exportación
        exportLogs,

        // Utilidades
        initialize,
        saveAllLogs
    }
})
