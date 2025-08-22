import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../utils/api'

export const useReportsStore = defineStore('reports', () => {
    // Estados
    const reports = ref([])
    const totals = ref({})
    const pagination = ref({})
    const dailyData = ref([])
    const cacheInfo = ref({})
    const isLoading = ref(false)
    const error = ref(null)

    // Getters
    const hasData = computed(() => reports.value.length > 0)
    const totalTickets = computed(() => totals.value.total_tickets || 0)
    const totalPieces = computed(() => totals.value.total_pieces || 0)
    const isCached = computed(() => !!cacheInfo.value.cached_at)

    // Acciones
    const fetchSummaryReport = async (params = {}) => {
        try {
            isLoading.value = true
            error.value = null

            // Construir query params
            const queryParams = new URLSearchParams()

            if (params.startDate) queryParams.append('start', params.startDate)
            if (params.endDate) queryParams.append('end', params.endDate)
            if (params.zone) queryParams.append('zone', params.zone)
            if (params.drawType) queryParams.append('draw_type', params.drawType)
            if (params.user) queryParams.append('user', params.user)
            if (params.groupBy) queryParams.append('group_by', params.groupBy)
            if (params.page) queryParams.append('page', params.page)
            if (params.pageSize) queryParams.append('page_size', params.pageSize)
            if (params.includeDaily) queryParams.append('daily', '1')
            if (params.forceRefresh) queryParams.append('refresh', '1')

            const response = await api.get(`/sales/tickets/reports/summary/?${queryParams}`)

            // Actualizar estado
            reports.value = response.data.summary || []
            totals.value = response.data.totals || {}
            pagination.value = response.data.pagination || {}
            dailyData.value = response.data.daily || []
            cacheInfo.value = response.data.cache_info || {}

            console.log('Report fetched:', response.data)

            return response.data
        } catch (err) {
            console.error('Error fetching report:', err)
            error.value = 'Error al cargar el reporte'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const exportReport = async (params = {}, format = 'csv') => {
        try {
            isLoading.value = true
            error.value = null

            // Obtener datos del reporte usando el endpoint que sabemos que funciona
            const reportData = await fetchSummaryReport(params)

            // Generar archivo en el frontend
            if (format === 'csv') {
                const csvContent = generateCSV(reportData)
                downloadFile(csvContent, `reporte_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv')
            } else if (format === 'xlsx') {
                // Para XLSX necesitaríamos una librería como SheetJS
                // Por ahora, usar CSV como fallback
                const csvContent = generateCSV(reportData)
                downloadFile(csvContent, `reporte_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv')
            }

            return true
        } catch (err) {
            console.error('Error exporting report:', err)
            console.error('Error details:', {
                status: err.response?.status,
                statusText: err.response?.statusText,
                data: err.response?.data,
                url: err.config?.url,
                method: err.config?.method
            })
            error.value = `Error al exportar el reporte: ${err.response?.status} - ${err.response?.statusText}`
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const generateCSV = (data) => {
        const lines = []

        // Encabezados
        lines.push('Grupo,Total Tickets,Total Pedazos')

        // Datos
        if (data.summary) {
            data.summary.forEach(row => {
                lines.push(`"${row.group}",${row.total_tickets},${row.total_pieces}`)
            })
        }

        // Línea en blanco
        lines.push('')

        // Totales
        if (data.totals) {
            lines.push(`"Totales",${data.totals.total_tickets},${data.totals.total_pieces}`)
        }

        // Datos diarios si existen
        if (data.daily && data.daily.length > 0) {
            lines.push('')
            lines.push('Fecha,Total Tickets,Total Pedazos')
            data.daily.forEach(row => {
                lines.push(`"${row.date}",${row.total_tickets},${row.total_pieces}`)
            })
        }

        return lines.join('\n')
    }

    const downloadFile = (content, filename, contentType) => {
        const blob = new Blob([content], { type: contentType })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
    }

    const getCacheStats = async () => {
        try {
            const response = await api.get('/sales/tickets/cache/stats/')
            return response.data
        } catch (err) {
            console.error('Error getting cache stats:', err)
            throw err
        }
    }

    const clearCache = async () => {
        try {
            const response = await api.post('/sales/tickets/cache/clear/')
            return response.data
        } catch (err) {
            console.error('Error clearing cache:', err)
            throw err
        }
    }

    const refreshReport = async (params = {}) => {
        // Forzar refrescar cache
        return await fetchSummaryReport({ ...params, forceRefresh: true })
    }

    // Funciones de utilidad
    const formatNumber = (num) => {
        return new Intl.NumberFormat('es-ES').format(num)
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'NIO'
        }).format(amount)
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const getCacheAge = () => {
        if (!cacheInfo.value.cached_at) return null

        const cachedAt = new Date(cacheInfo.value.cached_at)
        const now = new Date()
        const diffMs = now - cachedAt
        const diffMins = Math.floor(diffMs / (1000 * 60))

        if (diffMins < 1) return 'Justo ahora'
        if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`

        const diffHours = Math.floor(diffMins / 60)
        if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`

        const diffDays = Math.floor(diffHours / 24)
        return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`
    }

    // Limpiar errores
    const clearError = () => {
        error.value = null
    }

    // Resetear estado
    const resetState = () => {
        reports.value = []
        totals.value = {}
        pagination.value = {}
        dailyData.value = []
        cacheInfo.value = {}
        error.value = null
    }

    return {
        // Estados
        reports,
        totals,
        pagination,
        dailyData,
        cacheInfo,
        isLoading,
        error,

        // Getters
        hasData,
        totalTickets,
        totalPieces,
        isCached,

        // Acciones
        fetchSummaryReport,
        exportReport,
        getCacheStats,
        clearCache,
        refreshReport,

        // Utilidades
        formatNumber,
        formatCurrency,
        formatDate,
        getCacheAge,
        clearError,
        resetState
    }
})
