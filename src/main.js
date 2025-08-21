import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Inicializar stores de forma estática para evitar mezcla de imports
import { useThemeStore } from './stores/theme'
import { useNotificationsStore } from './stores/notifications'

// Inicializar stores
const themeStore = useThemeStore()
const notificationsStore = useNotificationsStore()

// Inicializar temas y notificaciones
themeStore.initializeTheme()
notificationsStore.initialize()

app.mount('#app')
