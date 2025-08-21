import axios from 'axios'

// Usar directamente la URL correcta del backend
const baseURL = 'http://localhost:8000/api'

const api = axios.create({
    baseURL,
    withCredentials: false,
    timeout: 10000, // 10 segundos de timeout
})

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`
    }

    // Log de peticiones en desarrollo
    if (import.meta.env.DEV) {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    }

    return config
}, error => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
})

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
    response => {
        // Log de respuestas exitosas en desarrollo
        if (import.meta.env.DEV) {
            console.log(`✅ API Response: ${response.status} ${response.config.url}`)
        }
        return response
    },
    async error => {
        const originalRequest = error.config

        // Log de errores en desarrollo
        if (import.meta.env.DEV) {
            console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`, error.response?.data)
        }

        // Si es un error 401 y no hemos intentado refrescar el token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                // Intentar refrescar el token
                const refreshToken = localStorage.getItem('refreshToken')
                if (refreshToken) {
                    const response = await axios.post(`${baseURL}/auth/token/refresh/`, {
                        refresh: refreshToken
                    })

                    const { access } = response.data
                    localStorage.setItem('token', access)

                    // Actualizar el header de la petición original
                    originalRequest.headers.Authorization = `Bearer ${access}`

                    // Reintentar la petición original
                    return api(originalRequest)
                }
            } catch (refreshError) {
                console.error('Error refreshing token:', refreshError)
                // Si falla el refresh, limpiar tokens y redirigir a login
                localStorage.removeItem('token')
                localStorage.removeItem('refreshToken')
                localStorage.removeItem('user')

                // Emitir evento para que el store de auth se entere
                window.dispatchEvent(new CustomEvent('auth:token-expired'))
            }
        }

        // Para otros errores, agregar información útil
        if (error.response?.status === 403) {
            error.message = 'No tienes permisos para realizar esta acción'
        } else if (error.response?.status === 404) {
            error.message = 'El recurso solicitado no fue encontrado'
        } else if (error.response?.status === 500) {
            error.message = 'Error interno del servidor'
        } else if (error.code === 'NETWORK_ERROR') {
            error.message = 'Error de conexión. Verifica tu conexión a internet.'
        } else if (error.code === 'ECONNABORTED') {
            error.message = 'La petición tardó demasiado en responder'
        }

        return Promise.reject(error)
    }
)

export default api


