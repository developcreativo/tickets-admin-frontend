import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/LoginView.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/',
        name: 'Dashboard',
        component: () => import('../views/DashboardView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/catalog',
        name: 'Catalog',
        component: () => import('../views/CatalogView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/users',
        name: 'Users',
        component: () => import('../views/UsersView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/reports',
        name: 'Reports',
        component: () => import('../views/ReportsView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/tickets',
        name: 'Tickets',
        component: () => import('../views/TicketsView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/settings',
        name: 'Settings',
        component: () => import('../views/SettingsView.vue'),
        meta: { requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Guardia de navegación
router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()

    // Si vamos a login, permitir siempre
    if (to.path === '/login') {
        console.log('Going to login page')
        next()
        return
    }

    // Esperar a que se complete la inicialización
    let attempts = 0
    while (!authStore.isInitialized && attempts < 10) {
        console.log('Waiting for auth initialization...', attempts)
        await new Promise(resolve => setTimeout(resolve, 50))
        attempts++
    }

    console.log('Router guard:', {
        to: to.path,
        requiresAuth: to.meta.requiresAuth,
        isAuthenticated: authStore.isAuthenticated,
        token: !!authStore.token,
        user: !!authStore.user,
        initialized: authStore.isInitialized
    })

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        console.log('Redirecting to login - not authenticated')
        next('/login')
    } else {
        console.log('Proceeding to:', to.path)
        next()
    }
})

export default router
