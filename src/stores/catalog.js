import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../utils/api'

export const useCatalogStore = defineStore('catalog', () => {
    // Estados
    const zones = ref([])
    const drawTypes = ref([])
    const drawSchedules = ref([])
    const numberLimits = ref([])
    const isLoading = ref(false)
    const error = ref(null)

    // Getters
    const activeZones = computed(() => zones.value.filter(zone => zone.is_active))
    const activeDrawTypes = computed(() => drawTypes.value.filter(type => type.is_active))
    const activeSchedules = computed(() => drawSchedules.value.filter(schedule => schedule.is_active))

    // Acciones
    const fetchZones = async () => {
        try {
            isLoading.value = true
            error.value = null
            const response = await api.get('/catalog/zones/')
            zones.value = response.data
            console.log('Zones fetched:', zones.value)
        } catch (err) {
            console.error('Error fetching zones:', err)
            error.value = 'Error al cargar las zonas'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const fetchDrawTypes = async () => {
        try {
            isLoading.value = true
            error.value = null
            const response = await api.get('/catalog/draw-types/')
            drawTypes.value = response.data
            console.log('Draw types fetched:', drawTypes.value)
        } catch (err) {
            console.error('Error fetching draw types:', err)
            error.value = 'Error al cargar los tipos de sorteo'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const fetchDrawSchedules = async () => {
        try {
            isLoading.value = true
            error.value = null
            const response = await api.get('/catalog/draw-schedules/')
            drawSchedules.value = response.data
            console.log('Draw schedules fetched:', drawTypes.value)
        } catch (err) {
            console.error('Error fetching draw schedules:', err)
            error.value = 'Error al cargar los horarios de sorteo'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const fetchNumberLimits = async () => {
        try {
            isLoading.value = true
            error.value = null
            const response = await api.get('/catalog/number-limits/')
            numberLimits.value = response.data
            console.log('Number limits fetched:', drawTypes.value)
        } catch (err) {
            console.error('Error fetching number limits:', err)
            error.value = 'Error al cargar los límites de números'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    // CRUD Operations para Zonas
    const createZone = async (zoneData) => {
        try {
            isLoading.value = true
            error.value = null
            const response = await api.post('/catalog/zones/', zoneData)
            zones.value.push(response.data)
            return response.data
        } catch (err) {
            console.error('Error creating zone:', err)
            error.value = 'Error al crear la zona'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const updateZone = async (id, zoneData) => {
        try {
            isLoading.value = true
            error.value = null
            const response = await api.put(`/catalog/zones/${id}/`, zoneData)
            const index = zones.value.findIndex(zone => zone.id === id)
            if (index !== -1) {
                zones.value[index] = response.data
            }
            return response.data
        } catch (err) {
            console.error('Error updating zone:', err)
            error.value = 'Error al actualizar la zona'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const deleteZone = async (id) => {
        try {
            isLoading.value = true
            error.value = null
            await api.delete(`/catalog/zones/${id}/`)
            zones.value = zones.value.filter(zone => zone.id !== id)
        } catch (err) {
            console.error('Error deleting zone:', err)
            error.value = 'Error al eliminar la zona'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    // CRUD Operations para Tipos de Sorteo
    const createDrawType = async (drawTypeData) => {
        try {
            isLoading.value = true
            error.value = null
            const response = await api.post('/catalog/draw-types/', drawTypeData)
            drawTypes.value.push(response.data)
            return response.data
        } catch (err) {
            console.error('Error creating draw type:', err)
            error.value = 'Error al crear el tipo de sorteo'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const updateDrawType = async (id, drawTypeData) => {
        try {
            isLoading.value = true
            error.value = null
            const response = await api.put(`/catalog/draw-types/${id}/`, drawTypeData)
            const index = drawTypes.value.findIndex(type => type.id === id)
            if (index !== -1) {
                drawTypes.value[index] = response.data
            }
            return response.data
        } catch (err) {
            console.error('Error updating draw type:', err)
            error.value = 'Error al actualizar el tipo de sorteo'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const deleteDrawType = async (id) => {
        try {
            isLoading.value = true
            error.value = null
            await api.delete(`/catalog/draw-types/${id}/`)
            drawTypes.value = drawTypes.value.filter(type => type.id !== id)
        } catch (err) {
            console.error('Error deleting draw type:', err)
            error.value = 'Error al eliminar el tipo de sorteo'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    // CRUD Operations para Horarios de Sorteo
    const createDrawSchedule = async (scheduleData) => {
        try {
            isLoading.value = true
            error.value = null
            const response = await api.post('/catalog/draw-schedules/', scheduleData)
            drawSchedules.value.push(response.data)
            return response.data
        } catch (err) {
            console.error('Error creating draw schedule:', err)
            error.value = 'Error al crear el horario de sorteo'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const updateDrawSchedule = async (id, scheduleData) => {
        try {
            isLoading.value = true
            error.value = null
            const response = await api.put(`/catalog/draw-schedules/${id}/`, scheduleData)
            const index = drawSchedules.value.findIndex(schedule => schedule.id === id)
            if (index !== -1) {
                drawSchedules.value[index] = response.data
            }
            return response.data
        } catch (err) {
            console.error('Error updating draw schedule:', err)
            error.value = 'Error al actualizar el horario de sorteo'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const deleteDrawSchedule = async (id) => {
        try {
            isLoading.value = true
            error.value = null
            await api.delete(`/catalog/draw-schedules/${id}/`)
            drawSchedules.value = drawSchedules.value.filter(schedule => schedule.id !== id)
        } catch (err) {
            console.error('Error deleting draw schedule:', err)
            error.value = 'Error al eliminar el horario de sorteo'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    // Cargar todos los datos
    const loadAllData = async () => {
        try {
            isLoading.value = true
            error.value = null
            await Promise.all([
                fetchZones(),
                fetchDrawTypes(),
                fetchDrawSchedules(),
                fetchNumberLimits()
            ])
        } catch (err) {
            console.error('Error loading catalog data:', err)
            error.value = 'Error al cargar los datos del catálogo'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    // Limpiar errores
    const clearError = () => {
        error.value = null
    }

    return {
        // Estados
        zones,
        drawTypes,
        drawSchedules,
        numberLimits,
        isLoading,
        error,

        // Getters
        activeZones,
        activeDrawTypes,
        activeSchedules,

        // Acciones
        fetchZones,
        fetchDrawTypes,
        fetchDrawSchedules,
        fetchNumberLimits,
        createZone,
        updateZone,
        deleteZone,
        createDrawType,
        updateDrawType,
        deleteDrawType,
        createDrawSchedule,
        updateDrawSchedule,
        deleteDrawSchedule,
        loadAllData,
        clearError
    }
})
