import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../utils/api'

export const useTicketsStore = defineStore('tickets', () => {
    // Estados
    const tickets = ref([])
    const isLoading = ref(false)
    const error = ref(null)
    const currentTicket = ref(null)

    // Getters
    const activeTickets = computed(() => tickets.value.filter(ticket => ticket.is_active !== false))
    const ticketsByZone = computed(() => (zoneId) => tickets.value.filter(ticket => ticket.zone === zoneId))
    const ticketsByDrawType = computed(() => (drawTypeId) => tickets.value.filter(ticket => ticket.draw_type === drawTypeId))
    const ticketsByUser = computed(() => (userId) => tickets.value.filter(ticket => ticket.user === userId))

    // Acciones
    const fetchTickets = async (params = {}) => {
        try {
            isLoading.value = true
            error.value = null

            // Construir query params
            const queryParams = new URLSearchParams()
            if (params.zone) queryParams.append('zone', params.zone)
            if (params.draw_type) queryParams.append('draw_type', params.draw_type)
            if (params.user) queryParams.append('user', params.user)
            if (params.start_date) queryParams.append('start_date', params.start_date)
            if (params.end_date) queryParams.append('end_date', params.end_date)

            const response = await api.get(`/sales/tickets/?${queryParams}`)
            tickets.value = response.data
            console.log('Tickets fetched:', tickets.value)
        } catch (err) {
            console.error('Error fetching tickets:', err)
            if (err.code === 'NETWORK_ERROR' || err.message?.includes('Network Error')) {
                error.value = 'No se puede conectar al servidor. Verifica que el backend esté ejecutándose.'
            } else if (err.response?.status === 500) {
                error.value = 'Error interno del servidor. Verifica los logs del backend.'
            } else if (err.response?.data?.detail) {
                error.value = err.response.data.detail
            } else {
                error.value = 'Error al cargar los tickets'
            }
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const createTicket = async (ticketData) => {
        try {
            isLoading.value = true
            error.value = null

            const response = await api.post('/sales/tickets/', ticketData)
            tickets.value.push(response.data)
            console.log('Ticket created:', response.data)
            return response.data
        } catch (err) {
            console.error('Error creating ticket:', err)
            if (err.code === 'NETWORK_ERROR' || err.message?.includes('Network Error')) {
                error.value = 'No se puede conectar al servidor. Verifica que el backend esté ejecutándose.'
            } else if (err.response?.data?.non_field_errors) {
                error.value = err.response.data.non_field_errors.join(', ')
            } else if (err.response?.data?.items) {
                error.value = 'Error en los items del ticket: ' + Object.values(err.response.data.items).join(', ')
            } else if (err.response?.data?.detail) {
                error.value = err.response.data.detail
            } else {
                error.value = 'Error al crear el ticket'
            }
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const updateTicket = async (id, ticketData) => {
        try {
            isLoading.value = true
            error.value = null

            const response = await api.put(`/sales/tickets/${id}/`, ticketData)
            const index = tickets.value.findIndex(ticket => ticket.id === id)
            if (index !== -1) {
                tickets.value[index] = response.data
            }
            console.log('Ticket updated:', response.data)
            return response.data
        } catch (err) {
            console.error('Error updating ticket:', err)
            if (err.code === 'NETWORK_ERROR' || err.message?.includes('Network Error')) {
                error.value = 'No se puede conectar al servidor. Verifica que el backend esté ejecutándose.'
            } else if (err.response?.data?.non_field_errors) {
                error.value = err.response.data.non_field_errors.join(', ')
            } else if (err.response?.data?.detail) {
                error.value = err.response.data.detail
            } else {
                error.value = 'Error al actualizar el ticket'
            }
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const deleteTicket = async (id) => {
        try {
            isLoading.value = true
            error.value = null

            await api.delete(`/sales/tickets/${id}/`)
            tickets.value = tickets.value.filter(ticket => ticket.id !== id)
            console.log('Ticket deleted:', id)
        } catch (err) {
            console.error('Error deleting ticket:', err)
            if (err.code === 'NETWORK_ERROR' || err.message?.includes('Network Error')) {
                error.value = 'No se puede conectar al servidor. Verifica que el backend esté ejecutándose.'
            } else if (err.response?.data?.detail) {
                error.value = err.response.data.detail
            } else {
                error.value = 'Error al eliminar el ticket'
            }
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const getTicketById = async (id) => {
        try {
            isLoading.value = true
            error.value = null

            const response = await api.get(`/sales/tickets/${id}/`)
            currentTicket.value = response.data
            console.log('Ticket details:', response.data)
            return response.data
        } catch (err) {
            console.error('Error fetching ticket details:', err)
            if (err.code === 'NETWORK_ERROR' || err.message?.includes('Network Error')) {
                error.value = 'No se puede conectar al servidor. Verifica que el backend esté ejecutándose.'
            } else if (err.response?.data?.detail) {
                error.value = err.response.data.detail
            } else {
                error.value = 'Error al cargar los detalles del ticket'
            }
            throw err
        } finally {
            isLoading.value = false
        }
    }

    // Funciones de utilidad
    const getTicketSummary = (ticket) => {
        if (!ticket || !ticket.items) return { totalNumbers: 0, totalPieces: 0 }

        const totalNumbers = ticket.items.length
        const totalPieces = ticket.items.reduce((sum, item) => sum + (item.pieces || 0), 0)

        return { totalNumbers, totalPieces }
    }

    const validateTicketItems = (items, zoneId, drawTypeId) => {
        // Esta función se puede expandir para validar límites de números
        // por ahora solo valida estructura básica
        const errors = []

        if (!items || items.length === 0) {
            errors.push('El ticket debe tener al menos un número')
        }

        items.forEach((item, index) => {
            if (!item.number || item.number.trim() === '') {
                errors.push(`Número ${index + 1}: El número es requerido`)
            }
            if (!item.pieces || item.pieces <= 0) {
                errors.push(`Número ${index + 1}: Las piezas deben ser mayor a 0`)
            }
            // Validar formato de número (00-99)
            if (item.number && !/^\d{1,2}$/.test(item.number)) {
                errors.push(`Número ${index + 1}: Debe ser un número de 1-2 dígitos`)
            }
        })

        return errors
    }

    const formatTicketNumber = (ticket) => {
        return `#${String(ticket.id).padStart(6, '0')}`
    }

    const getTicketStatus = (ticket) => {
        // Por ahora todos los tickets están activos
        // Se puede expandir para manejar estados como "cancelado", "procesado", etc.
        return 'Activo'
    }

    // Limpiar errores
    const clearError = () => {
        error.value = null
    }

    // Resetear estado
    const resetState = () => {
        tickets.value = []
        currentTicket.value = null
        error.value = null
    }

    return {
        // States
        tickets,
        isLoading,
        error,
        currentTicket,

        // Getters
        activeTickets,
        ticketsByZone,
        ticketsByDrawType,
        ticketsByUser,

        // Acciones
        fetchTickets,
        createTicket,
        updateTicket,
        deleteTicket,
        getTicketById,

        // Utilidades
        getTicketSummary,
        validateTicketItems,
        formatTicketNumber,
        getTicketStatus,
        clearError,
        resetState
    }
})
