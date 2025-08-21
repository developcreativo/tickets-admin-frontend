<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- Spinner de carga -->
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-2 h-4 w-4"
      :class="spinnerClasses"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    
    <!-- Icono de inicio -->
    <component
      v-if="startIcon && !loading"
      :is="startIcon"
      :class="iconClasses"
    />
    
    <!-- Contenido del botón -->
    <span v-if="$slots.default" class="flex items-center">
      <slot />
    </span>
    
    <!-- Icono de fin -->
    <component
      v-if="endIcon && !loading"
      :is="endIcon"
      :class="iconClasses"
    />
    
    <!-- Badge -->
    <span
      v-if="badge"
      class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
      :class="badgeClasses"
    >
      {{ badge }}
    </span>
  </button>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  type: { type: String, default: 'button', validator: value => ['button', 'submit', 'reset'].includes(value) },
  variant: { 
    type: String, 
    default: 'primary', 
    validator: value => ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'ghost', 'outline', 'link'].includes(value) 
  },
  size: { type: String, default: 'md', validator: value => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value) },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  rounded: { type: Boolean, default: false },
  fullWidth: { type: Boolean, default: false },
  startIcon: { type: Object, default: null },
  endIcon: { type: Object, default: null },
  badge: { type: [String, Number], default: null },
  badgeVariant: { 
    type: String, 
    default: 'default', 
    validator: value => ['default', 'primary', 'success', 'danger', 'warning', 'info'].includes(value) 
  }
})

const emit = defineEmits(['click', 'mouseenter', 'mouseleave'])

const isHovered = ref(false)

const buttonClasses = computed(() => {
  const baseClasses = [
    'inline-flex items-center justify-center font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
    props.fullWidth ? 'w-full' : '',
    props.rounded ? 'rounded-full' : 'rounded-lg'
  ]
  
  const sizeClasses = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  }
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 active:bg-blue-800',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 active:bg-gray-800',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 active:bg-green-800',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 active:bg-red-800',
    warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500 active:bg-yellow-800',
    info: 'bg-cyan-600 text-white hover:bg-cyan-700 focus:ring-cyan-500 active:bg-cyan-800',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-700',
    outline: 'bg-transparent border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800',
    link: 'bg-transparent text-blue-600 hover:text-blue-800 hover:underline focus:ring-blue-500 dark:text-blue-400 dark:hover:text-blue-300'
  }
  
  return [
    ...baseClasses,
    sizeClasses[props.size],
    variantClasses[props.variant]
  ].join(' ')
})

const iconClasses = computed(() => {
  const sizeMap = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
    xl: 'h-6 w-6'
  }
  
  return sizeMap[props.size]
})

const spinnerClasses = computed(() => {
  const sizeMap = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
    xl: 'h-6 w-6'
  }
  
  return sizeMap[props.size]
})

const badgeClasses = computed(() => {
  const variantMap = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    primary: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    info: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300'
  }
  
  return variantMap[props.badgeVariant]
})

const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}

const handleMouseEnter = (event) => {
  emit('mouseenter', event)
  isHovered.value = true
}

const handleMouseLeave = (event) => {
  emit('mouseleave', event)
  isHovered.value = false
}
</script>

<style scoped>
/* Transiciones suaves para todos los estados */
button {
  @apply transition-all duration-200 ease-in-out;
}

/* Efectos de hover mejorados */
button:hover:not(:disabled) {
  @apply transform scale-[1.02];
}

button:active:not(:disabled) {
  @apply transform scale-[0.98];
}

/* Focus visible para accesibilidad */
button:focus-visible {
  @apply ring-2 ring-offset-2;
}

/* Estados de carga */
button:disabled {
  @apply cursor-not-allowed;
}

/* Animación del spinner */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Responsive para botones de ancho completo */
@media (max-width: 640px) {
  button.w-full {
    @apply text-sm px-3 py-2;
  }
}
</style>
