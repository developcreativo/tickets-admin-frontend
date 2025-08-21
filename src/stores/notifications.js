import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNotificationsStore = defineStore('notifications', () => {
  // Estados
  const notifications = ref([])
  const unreadCount = ref(0)
  const isConnected = ref(false)
  const toastNotifications = ref([])
  const soundEnabled = ref(true)
  const desktopNotifications = ref(true)

  // Getters
  const hasUnread = computed(() => unreadCount.value > 0)
  const recentNotifications = computed(() => 
    notifications.value
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10)
  )
  const criticalNotifications = computed(() => 
    notifications.value.filter(n => n.priority === 'critical')
  )

  // Tipos de notificaciones
  const notificationTypes = {
    TICKET_CREATED: 'ticket_created',
    TICKET_UPDATED: 'ticket_updated',
    TICKET_DELETED: 'ticket_deleted',
    USER_LOGIN: 'user_login',
    USER_LOGOUT: 'user_logout',
    ZONE_LIMIT_REACHED: 'zone_limit_reached',
    SYSTEM_ALERT: 'system_alert',
    REPORT_GENERATED: 'report_generated',
    CACHE_CLEARED: 'cache_cleared',
    ERROR_OCCURRED: 'error_occurred'
  }

  // Prioridades
  const priorities = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical'
  }

  // Acciones
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      read: false,
      priority: priorities.MEDIUM,
      ...notification
    }

    notifications.value.unshift(newNotification)
    
    if (!newNotification.read) {
      unreadCount.value++
    }

    // Mostrar toast si está habilitado
    if (desktopNotifications.value) {
      showToast(newNotification)
    }

    // Reproducir sonido si está habilitado
    if (soundEnabled.value) {
      playNotificationSound(newNotification.priority)
    }

    // Limitar el número de notificaciones
    if (notifications.value.length > 100) {
      notifications.value = notifications.value.slice(0, 100)
    }

    return newNotification
  }

  const markAsRead = (notificationId) => {
    const notification = notifications.value.find(n => n.id === notificationId)
    if (notification && !notification.read) {
      notification.read = true
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    }
  }

  const markAllAsRead = () => {
    notifications.value.forEach(n => n.read = true)
    unreadCount.value = 0
  }

  const removeNotification = (notificationId) => {
    const index = notifications.value.findIndex(n => n.id === notificationId)
    if (index !== -1) {
      const notification = notifications.value[index]
      if (!notification.read) {
        unreadCount.value = Math.max(0, unreadCount.value - 1)
      }
      notifications.value.splice(index, 1)
    }
  }

  const clearAll = () => {
    notifications.value = []
    unreadCount.value = 0
  }

  // Toast notifications
  const showToast = (notification) => {
    const toast = {
      id: Date.now() + Math.random(),
      ...notification,
      visible: true,
      autoHide: true
    }

    toastNotifications.value.push(toast)

    // Auto-hide después de 5 segundos
    if (toast.autoHide) {
      setTimeout(() => {
        hideToast(toast.id)
      }, 5000)
    }
  }

  const hideToast = (toastId) => {
    const index = toastNotifications.value.findIndex(t => t.id === toastId)
    if (index !== -1) {
      toastNotifications.value.splice(index, 1)
    }
  }

  const hideAllToasts = () => {
    toastNotifications.value = []
  }

  // Notificaciones del sistema
  const showSystemAlert = (message, type = 'info', priority = priorities.MEDIUM) => {
    addNotification({
      type: notificationTypes.SYSTEM_ALERT,
      title: 'Alerta del Sistema',
      message,
      priority,
      category: type
    })
  }

  const showError = (message, details = null) => {
    addNotification({
      type: notificationTypes.ERROR_OCCURRED,
      title: 'Error',
      message,
      details,
      priority: priorities.HIGH,
      category: 'error'
    })
  }

  const showSuccess = (message) => {
    addNotification({
      type: 'success',
      title: 'Éxito',
      message,
      priority: priorities.LOW,
      category: 'success'
    })
  }

  const showWarning = (message) => {
    addNotification({
      type: 'warning',
      title: 'Advertencia',
      message,
      priority: priorities.MEDIUM,
      category: 'warning'
    })
  }

  // Notificaciones específicas del sistema
  const notifyTicketCreated = (ticketId, zoneName, drawTypeName) => {
    addNotification({
      type: notificationTypes.TICKET_CREATED,
      title: 'Nuevo Ticket Creado',
      message: `Ticket #${ticketId} creado en ${zoneName} - ${drawTypeName}`,
      priority: priorities.MEDIUM,
      category: 'ticket',
      data: { ticketId, zoneName, drawTypeName }
    })
  }

  const notifyTicketUpdated = (ticketId, zoneName, drawTypeName) => {
    addNotification({
      type: notificationTypes.TICKET_UPDATED,
      title: 'Ticket Actualizado',
      message: `Ticket #${ticketId} actualizado en ${zoneName} - ${drawTypeName}`,
      priority: priorities.LOW,
      category: 'ticket',
      data: { ticketId, zoneName, drawTypeName }
    })
  }

  const notifyTicketDeleted = (ticketId) => {
    addNotification({
      type: notificationTypes.TICKET_DELETED,
      title: 'Ticket Eliminado',
      message: `Ticket #${ticketId} ha sido eliminado`,
      priority: priorities.MEDIUM,
      category: 'ticket',
      data: { ticketId }
    })
  }

  const notifyZoneLimitReached = (zoneName, number, limit) => {
    addNotification({
      type: notificationTypes.ZONE_LIMIT_REACHED,
      title: 'Límite de Zona Alcanzado',
      message: `Zona ${zoneName}: Número ${number} ha alcanzado el límite de ${limit} piezas`,
      priority: priorities.HIGH,
      category: 'zone',
      data: { zoneName, number, limit }
    })
  }

  const notifyUserActivity = (username, action) => {
    addNotification({
      type: action === 'login' ? notificationTypes.USER_LOGIN : notificationTypes.USER_LOGOUT,
      title: `Usuario ${action === 'login' ? 'Conectado' : 'Desconectado'}`,
      message: `Usuario ${username} ha ${action === 'login' ? 'iniciado sesión' : 'cerrado sesión'}`,
      priority: priorities.LOW,
      category: 'user',
      data: { username, action }
    })
  }

  const notifyReportGenerated = (reportType, format) => {
    addNotification({
      type: notificationTypes.REPORT_GENERATED,
      title: 'Reporte Generado',
      message: `Reporte de ${reportType} generado en formato ${format}`,
      priority: priorities.LOW,
      category: 'report',
      data: { reportType, format }
    })
  }

  const notifyCacheCleared = (cacheType) => {
    addNotification({
      type: notificationTypes.CACHE_CLEARED,
      title: 'Cache Limpiado',
      message: `Cache de ${cacheType} ha sido limpiado`,
      priority: priorities.LOW,
      category: 'system',
      data: { cacheType }
    })
  }

  // Sonidos de notificación
  const playNotificationSound = (priority) => {
    // Por ahora solo simulamos el sonido
    // En una implementación real, se reproducirían archivos de audio
    console.log(`Playing ${priority} priority notification sound`)
  }

  // Configuración
  const toggleSound = () => {
    soundEnabled.value = !soundEnabled.value
    localStorage.setItem('notifications_sound_enabled', soundEnabled.value)
  }

  const toggleDesktopNotifications = () => {
    desktopNotifications.value = !desktopNotifications.value
    localStorage.setItem('notifications_desktop_enabled', desktopNotifications.value)
  }

  // Inicialización
  const initialize = () => {
    // Cargar configuraciones guardadas
    const savedSound = localStorage.getItem('notifications_sound_enabled')
    if (savedSound !== null) {
      soundEnabled.value = savedSound === 'true'
    }

    const savedDesktop = localStorage.getItem('notifications_desktop_enabled')
    if (savedDesktop !== null) {
      desktopNotifications.value = savedDesktop === 'true'
    }

    // Solicitar permisos de notificación del navegador
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }

  // Limpiar notificaciones antiguas (más de 30 días)
  const cleanupOldNotifications = () => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    notifications.value = notifications.value.filter(n => 
      new Date(n.timestamp) > thirtyDaysAgo
    )
  }

  // Exportar notificaciones
  const exportNotifications = (format = 'json') => {
    const data = notifications.value.map(n => ({
      id: n.id,
      type: n.type,
      title: n.title,
      message: n.message,
      priority: n.priority,
      category: n.category,
      timestamp: n.timestamp,
      read: n.read
    }))

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `notifications_${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    } else if (format === 'csv') {
      const csvContent = [
        ['ID', 'Tipo', 'Título', 'Mensaje', 'Prioridad', 'Categoría', 'Timestamp', 'Leído'],
        ...data.map(n => [
          n.id,
          n.type,
          n.title,
          n.message,
          n.priority,
          n.category,
          n.timestamp,
          n.read
        ])
      ].map(row => row.map(field => `"${field}"`).join(',')).join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `notifications_${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  return {
    // States
    notifications,
    unreadCount,
    isConnected,
    toastNotifications,
    soundEnabled,
    desktopNotifications,

    // Getters
    hasUnread,
    recentNotifications,
    criticalNotifications,

    // Constantes
    notificationTypes,
    priorities,

    // Acciones principales
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,

    // Toast notifications
    showToast,
    hideToast,
    hideAllToasts,

    // Notificaciones del sistema
    showSystemAlert,
    showError,
    showSuccess,
    showWarning,

    // Notificaciones específicas
    notifyTicketCreated,
    notifyTicketUpdated,
    notifyTicketDeleted,
    notifyZoneLimitReached,
    notifyUserActivity,
    notifyReportGenerated,
    notifyCacheCleared,

    // Configuración
    toggleSound,
    toggleDesktopNotifications,

    // Utilidades
    initialize,
    cleanupOldNotifications,
    exportNotifications
  }
})
