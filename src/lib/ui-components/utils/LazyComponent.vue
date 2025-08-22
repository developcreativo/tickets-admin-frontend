<template>
  <div class="lazy-component-wrapper">
    <!-- Loading State -->
    <div 
      v-if="loading" 
      class="lazy-component-loading"
      :class="`lazy-component-loading--${loadingVariant}`"
    >
      <slot name="loading">
        <div class="lazy-component-spinner">
          <svg class="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span v-if="loadingText" class="lazy-component-loading-text">
            {{ loadingText }}
          </span>
        </div>
      </slot>
    </div>

    <!-- Error State -->
    <div 
      v-else-if="error" 
      class="lazy-component-error"
      :class="`lazy-component-error--${errorVariant}`"
    >
      <slot name="error" :error="error" :retry="retry">
        <div class="lazy-component-error-content">
          <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="lazy-component-error-text">
            <h3 class="lazy-component-error-title">
              {{ errorTitle || 'Error al cargar' }}
            </h3>
            <p class="lazy-component-error-message">
              {{ errorMessage || 'No se pudo cargar el componente' }}
            </p>
          </div>
          <BaseButton 
            v-if="showRetryButton"
            variant="outline" 
            size="sm"
            @click="retry"
          >
            Reintentar
          </BaseButton>
        </div>
      </slot>
    </div>

    <!-- Success State -->
    <div v-else class="lazy-component-content">
      <component 
        :is="loadedComponent" 
        v-bind="$attrs"
        v-on="$listeners"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, defineAsyncComponent } from 'vue'
import BaseButton from '../forms/BaseButton.vue'

// Props
const props = defineProps({
  // Componente a cargar (puede ser una función async o un import)
  component: {
    type: [Function, String, Object],
    required: true
  },
  // Tiempo de retraso antes de mostrar loading (ms)
  delay: {
    type: Number,
    default: 200
  },
  // Tiempo de timeout para la carga (ms)
  timeout: {
    type: Number,
    default: 10000
  },
  // Variante del loading
  loadingVariant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'skeleton', 'spinner', 'dots'].includes(value)
  },
  // Texto de loading
  loadingText: {
    type: String,
    default: ''
  },
  // Variante del error
  errorVariant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'minimal', 'detailed'].includes(value)
  },
  // Título del error
  errorTitle: {
    type: String,
    default: ''
  },
  // Mensaje del error
  errorMessage: {
    type: String,
    default: ''
  },
  // Mostrar botón de reintentar
  showRetryButton: {
    type: Boolean,
    default: true
  },
  // Suspense mode
  suspense: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits([
  'load',
  'error',
  'loading',
  'loaded'
])

// Refs
const loading = ref(false)
const error = ref(null)
const loadedComponent = ref(null)
const loadingTimer = ref(null)
const timeoutTimer = ref(null)

// Computed
const shouldShowLoading = computed(() => {
  return loading.value && props.delay === 0
})

// Methods
const loadComponent = async () => {
  try {
    loading.value = true
    error.value = null
    emit('loading')

    // Configurar timeout
    if (props.timeout > 0) {
      timeoutTimer.value = setTimeout(() => {
        throw new Error('Timeout: Component took too long to load')
      }, props.timeout)
    }

    // Configurar delay para mostrar loading
    if (props.delay > 0) {
      loadingTimer.value = setTimeout(() => {
        if (loading.value) {
          emit('loading')
        }
      }, props.delay)
    }

    // Cargar el componente
    let componentToLoad = props.component

    if (typeof componentToLoad === 'string') {
      // Si es un string, asumimos que es un import dinámico
      componentToLoad = () => import(componentToLoad)
    }

    if (typeof componentToLoad === 'function') {
      // Si es una función, la ejecutamos
      const result = await componentToLoad()
      
      // Manejar diferentes formatos de resultado
      if (result && typeof result === 'object') {
        if (result.default) {
          loadedComponent.value = result.default
        } else {
          loadedComponent.value = result
        }
      } else {
        loadedComponent.value = result
      }
    } else {
      // Si es un objeto, lo usamos directamente
      loadedComponent.value = componentToLoad
    }

    // Limpiar timers
    clearTimeout(loadingTimer.value)
    clearTimeout(timeoutTimer.value)
    
    loading.value = false
    emit('loaded', loadedComponent.value)
    emit('load', loadedComponent.value)

  } catch (err) {
    // Limpiar timers
    clearTimeout(loadingTimer.value)
    clearTimeout(timeoutTimer.value)
    
    loading.value = false
    error.value = err
    emit('error', err)
  }
}

const retry = () => {
  loadComponent()
}

// Lifecycle
onMounted(() => {
  if (!props.suspense) {
    loadComponent()
  }
})

// Watchers
watch(() => props.component, () => {
  if (!props.suspense) {
    loadComponent()
  }
})

// Expose methods
defineExpose({
  load: loadComponent,
  retry,
  reload: loadComponent
})
</script>

<style scoped>
.lazy-component-wrapper {
  @apply relative;
}

.lazy-component-loading {
  @apply flex items-center justify-center p-8;
}

.lazy-component-loading--default {
  @apply min-h-[200px];
}

.lazy-component-loading--skeleton {
  @apply animate-pulse;
}

.lazy-component-loading--spinner {
  @apply min-h-[100px];
}

.lazy-component-loading--dots {
  @apply min-h-[60px];
}

.lazy-component-spinner {
  @apply flex flex-col items-center space-y-2;
}

.lazy-component-spinner svg {
  @apply text-blue-600 dark:text-blue-400;
}

.lazy-component-loading-text {
  @apply text-sm text-gray-500 dark:text-gray-400;
}

.lazy-component-error {
  @apply p-6;
}

.lazy-component-error--default {
  @apply border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20;
}

.lazy-component-error--minimal {
  @apply text-center;
}

.lazy-component-error--detailed {
  @apply border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20 p-6;
}

.lazy-component-error-content {
  @apply flex flex-col items-center space-y-4 text-center;
}

.lazy-component-error-text {
  @apply space-y-2;
}

.lazy-component-error-title {
  @apply text-lg font-semibold text-red-800 dark:text-red-200;
}

.lazy-component-error-message {
  @apply text-sm text-red-600 dark:text-red-300;
}

.lazy-component-content {
  @apply w-full;
}

/* Skeleton loading variant */
.lazy-component-loading--skeleton .lazy-component-spinner {
  @apply hidden;
}

.lazy-component-loading--skeleton::before {
  content: '';
  @apply block w-full h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse;
}

/* Dots loading variant */
.lazy-component-loading--dots .lazy-component-spinner {
  @apply hidden;
}

.lazy-component-loading--dots::before {
  content: '';
  @apply block w-16 h-16 mx-auto;
  background-image: radial-gradient(circle, currentColor 1px, transparent 1px);
  background-size: 4px 4px;
  background-repeat: space;
  @apply text-blue-600 dark:text-blue-400 animate-pulse;
}

/* Responsive */
@media (max-width: 640px) {
  .lazy-component-loading {
    @apply p-4;
  }
  
  .lazy-component-error {
    @apply p-4;
  }
}

/* Transitions */
.lazy-component-wrapper {
  @apply transition-all duration-200 ease-in-out;
}

.lazy-component-loading,
.lazy-component-error,
.lazy-component-content {
  @apply transition-opacity duration-200 ease-in-out;
}
</style>
