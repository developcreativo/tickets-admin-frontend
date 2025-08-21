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
  const pushNotifications = ref(false)
  const notificationPreferences = ref({
    tickets: true,
    users: true,
    system: true,
    security: true,
    reports: true
  })

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
  const notificationsByCategory = computed(() => {
    const categorized = {}
    notifications.value.forEach(notification => {
      if (!categorized[notification.category]) {
        categorized[notification.category] = []
      }
      categorized[notification.category].push(notification)
    })
    return categorized
  })

  // Tipos de notificaciones
  const notificationTypes = {
    TICKET_CREATED: 'ticket_created',
    TICKET_UPDATED: 'ticket_updated',
    TICKET_DELETED: 'ticket_deleted',
    TICKET_COMPLETED: 'ticket_completed',
    TICKET_CANCELLED: 'ticket_cancelled',
    USER_LOGIN: 'user_login',
    USER_LOGOUT: 'user_logout',
    USER_CREATED: 'user_created',
    USER_UPDATED: 'user_updated',
    USER_DELETED: 'user_deleted',
    ZONE_LIMIT_REACHED: 'zone_limit_reached',
    ZONE_UPDATED: 'zone_updated',
    SYSTEM_ALERT: 'system_alert',
    SYSTEM_MAINTENANCE: 'system_maintenance',
    REPORT_GENERATED: 'report_generated',
    REPORT_EXPORTED: 'report_exported',
    CACHE_CLEARED: 'cache_cleared',
    BACKUP_CREATED: 'backup_created',
    ERROR_OCCURRED: 'error_occurred',
    SECURITY_ALERT: 'security_alert',
    PERMISSION_DENIED: 'permission_denied',
    SUSPICIOUS_ACTIVITY: 'suspicious_activity'
  }

  // Priorities
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
      dismissed: false,
      ...notification
    }

    // Verificar preferencias del usuario
    if (!notificationPreferences.value[newNotification.category]) {
      return newNotification
    }

    notifications.value.unshift(newNotification)

    if (!newNotification.read) {
      unreadCount.value++
    }

    // Mostrar toast si está habilitado
    if (desktopNotifications.value) {
      showToast(newNotification)
    }

    // Mostrar notificación push si está habilitado
    if (pushNotifications.value && newNotification.priority === 'critical') {
      showPushNotification(newNotification)
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

  const dismissNotification = (notificationId) => {
    const notification = notifications.value.find(n => n.id === notificationId)
    if (notification) {
      notification.dismissed = true
      if (!notification.read) {
        unreadCount.value = Math.max(0, unreadCount.value - 1)
      }
    }
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

  const clearByCategory = (category) => {
    notifications.value = notifications.value.filter(n => n.category !== category)
    unreadCount.value = notifications.value.filter(n => !n.read).length
  }

  const clearRead = () => {
    notifications.value = notifications.value.filter(n => !n.read)
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

  // Push notifications del navegador
  const showPushNotification = (notification) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const pushNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.id,
        requireInteraction: notification.priority === 'critical',
        data: notification
      })

      // Manejar clic en la notificación
      pushNotification.onclick = () => {
        window.focus()
        pushNotification.close()

        // Marcar como leída
        markAsRead(notification.id)

        // Aquí se podría navegar a la página relevante
        if (notification.category === 'ticket') {
          // Navegar a tickets
          console.log('Navegando a tickets...')
        }
      }

      // Auto-cerrar después de 10 segundos (excepto críticas)
      if (notification.priority !== 'critical') {
        setTimeout(() => {
          pushNotification.close()
        }, 10000)
      }
    }
  }

  const requestPushPermission = async () => {
    if ('Notification' in window) {
      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission()
        pushNotifications.value = permission === 'granted'
        return permission === 'granted'
      } else if (Notification.permission === 'granted') {
        pushNotifications.value = true
        return true
      } else {
        pushNotifications.value = false
        return false
      }
    }
    return false
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

  const showInfo = (message) => {
    addNotification({
      type: 'info',
      title: 'Información',
      message,
      priority: priorities.LOW,
      category: 'info'
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

  const notifyTicketCompleted = (ticketId, zoneName) => {
    addNotification({
      type: notificationTypes.TICKET_COMPLETED,
      title: 'Ticket Completado',
      message: `Ticket #${ticketId} completado en ${zoneName}`,
      priority: priorities.MEDIUM,
      category: 'ticket',
      data: { ticketId, zoneName }
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

  const notifyUserCreated = (username, role) => {
    addNotification({
      type: notificationTypes.USER_CREATED,
      title: 'Nuevo Usuario Creado',
      message: `Usuario ${username} creado con rol ${role}`,
      priority: priorities.MEDIUM,
      category: 'user',
      data: { username, role }
    })
  }

  const notifyUserUpdated = (username, changes) => {
    addNotification({
      type: notificationTypes.USER_UPDATED,
      title: 'Usuario Actualizado',
      message: `Usuario ${username} ha sido actualizado`,
      priority: priorities.LOW,
      category: 'user',
      data: { username, changes }
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

  const notifyReportExported = (reportType, format, filename) => {
    addNotification({
      type: notificationTypes.REPORT_EXPORTED,
      title: 'Reporte Exportado',
      message: `Reporte ${reportType} exportado como ${filename}`,
      priority: priorities.LOW,
      category: 'report',
      data: { reportType, format, filename }
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

  const notifyBackupCreated = (backupType, filename) => {
    addNotification({
      type: notificationTypes.BACKUP_CREATED,
      title: 'Backup Creado',
      message: `Backup de ${backupType} creado: ${filename}`,
      priority: priorities.MEDIUM,
      category: 'system',
      data: { backupType, filename }
    })
  }

  const notifySecurityAlert = (message, threatLevel = 'medium') => {
    addNotification({
      type: notificationTypes.SECURITY_ALERT,
      title: 'Alerta de Seguridad',
      message,
      priority: threatLevel === 'high' ? priorities.HIGH : priorities.MEDIUM,
      category: 'security',
      data: { threatLevel }
    })
  }

  const notifyPermissionDenied = (username, resource, action) => {
    addNotification({
      type: notificationTypes.PERMISSION_DENIED,
      title: 'Acceso Denegado',
      message: `Usuario ${username} intentó ${action} en ${resource}`,
      priority: priorities.HIGH,
      category: 'security',
      data: { username, resource, action }
    })
  }

  const notifySuspiciousActivity = (username, activity, ipAddress) => {
    addNotification({
      type: notificationTypes.SUSPICIOUS_ACTIVITY,
      title: 'Actividad Sospechosa',
      message: `Usuario ${username}: ${activity} desde ${ipAddress}`,
      priority: priorities.CRITICAL,
      category: 'security',
      data: { username, activity, ipAddress }
    })
  }

  const notifySystemMaintenance = (message, scheduledTime) => {
    addNotification({
      type: notificationTypes.SYSTEM_MAINTENANCE,
      title: 'Mantenimiento del Sistema',
      message,
      priority: priorities.HIGH,
      category: 'system',
      data: { scheduledTime }
    })
  }

  // Sonidos de notificación
  const playNotificationSound = (priority) => {
    // Por ahora solo simulamos el sonido
    // En una implementación real, se reproducirían archivos de audio
    console.log(`Playing ${priority} priority notification sound`)

    // Aquí se podría implementar la reproducción real de sonidos
    // const audio = new Audio(`/sounds/${priority}_notification.mp3`)
    // audio.play().catch(console.error)
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

  const togglePushNotifications = async () => {
    if (pushNotifications.value) {
      pushNotifications.value = false
    } else {
      const granted = await requestPushPermission()
      pushNotifications.value = granted
    }
    localStorage.setItem('notifications_push_enabled', pushNotifications.value)
  }

  const updateNotificationPreferences = (category, enabled) => {
    notificationPreferences.value[category] = enabled
    localStorage.setItem('notification_preferences', JSON.stringify(notificationPreferences.value))
  }

  // Inicialización
  const initialize = async () => {
    // Cargar configuraciones guardadas
    const savedSound = localStorage.getItem('notifications_sound_enabled')
    if (savedSound !== null) {
      soundEnabled.value = savedSound === 'true'
    }

    const savedDesktop = localStorage.getItem('notifications_desktop_enabled')
    if (savedDesktop !== null) {
      desktopNotifications.value = savedDesktop === 'true'
    }

    const savedPush = localStorage.getItem('notifications_push_enabled')
    if (savedPush !== null) {
      pushNotifications.value = savedPush === 'true'
    }

    const savedPreferences = localStorage.getItem('notification_preferences')
    if (savedPreferences) {
      notificationPreferences.value = { ...notificationPreferences.value, ...JSON.parse(savedPreferences) }
    }

    // Solicitar permisos de notificación del navegador
    if ('Notification' in window && Notification.permission === 'default') {
      await requestPushPermission()
    }

    // Verificar conexión
    checkConnection()
  }

  const checkConnection = () => {
    isConnected.value = navigator.onLine

    window.addEventListener('online', () => {
      isConnected.value = true
      showSystemAlert('Conexión restaurada', 'success')
    })

    window.addEventListener('offline', () => {
      isConnected.value = false
      showSystemAlert('Conexión perdida', 'error')
    })
  }

  // Limpiar notificaciones antiguas (más de 30 días)
  const cleanupOldNotifications = () => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    notifications.value = notifications.value.filter(n =>
      new Date(n.timestamp) > thirtyDaysAgo
    )

    unreadCount.value = notifications.value.filter(n => !n.read).length
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
      read: n.read,
      dismissed: n.dismissed
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
        ['ID', 'Tipo', 'Título', 'Mensaje', 'Prioridad', 'Categoría', 'Timestamp', 'Leído', 'Descartado'],
        ...data.map(n => [
          n.id,
          n.type,
          n.title,
          n.message,
          n.priority,
          n.category,
          n.timestamp,
          n.read,
          n.dismissed
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

  // Estadísticas de notificaciones
  const getNotificationStats = (timeRange = '24h') => {
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

    const notificationsInRange = notifications.value.filter(n =>
      new Date(n.timestamp) >= startDate
    )

    return {
      total: notificationsInRange.length,
      unread: notificationsInRange.filter(n => !n.read).length,
      byCategory: notificationsInRange.reduce((acc, n) => {
        acc[n.category] = (acc[n.category] || 0) + 1
        return acc
      }, {}),
      byPriority: notificationsInRange.reduce((acc, n) => {
        acc[n.priority] = (acc[n.priority] || 0) + 1
        return acc
      }, {}),
      byType: notificationsInRange.reduce((acc, n) => {
        acc[n.type] = (acc[n.type] || 0) + 1
        return acc
      }, {})
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
    pushNotifications,
    notificationPreferences,

    // Getters
    hasUnread,
    recentNotifications,
    criticalNotifications,
    notificationsByCategory,

    // Constantes
    notificationTypes,
    priorities,

    // Acciones principales
    addNotification,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    removeNotification,
    clearAll,
    clearByCategory,
    clearRead,

    // Toast notifications
    showToast,
    hideToast,
    hideAllToasts,

    // Push notifications
    showPushNotification,
    requestPushPermission,

    // Notificaciones del sistema
    showSystemAlert,
    showError,
    showSuccess,
    showWarning,
    showInfo,

    // Notificaciones específicas
    notifyTicketCreated,
    notifyTicketUpdated,
    notifyTicketDeleted,
    notifyTicketCompleted,
    notifyZoneLimitReached,
    notifyUserActivity,
    notifyUserCreated,
    notifyUserUpdated,
    notifyReportGenerated,
    notifyReportExported,
    notifyCacheCleared,
    notifyBackupCreated,
    notifySecurityAlert,
    notifyPermissionDenied,
    notifySuspiciousActivity,
    notifySystemMaintenance,

    // Configuración
    toggleSound,
    toggleDesktopNotifications,
    togglePushNotifications,
    updateNotificationPreferences,

    // Utilidades
    initialize,
    cleanupOldNotifications,
    exportNotifications,
    getNotificationStats
  }
})
