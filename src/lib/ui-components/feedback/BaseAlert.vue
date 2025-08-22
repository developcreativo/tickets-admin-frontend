<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform -translate-y-2 opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform -translate-y-2 opacity-0"
  >
    <div
      v-if="show"
      :id="alertId"
      role="alert"
      :aria-live="ariaLive"
      class="base-alert"
      :class="[
        `base-alert--${type}`,
        `base-alert--${size}`,
        `base-alert--${variant}`,
        { 'base-alert--dismissible': dismissible }
      ]"
    >
      <!-- Icon -->
      <div v-if="showIcon" class="base-alert-icon">
        <component :is="alertIcon" class="w-5 h-5" />
      </div>

      <!-- Content -->
      <div class="base-alert-content">
        <!-- Title -->
        <h4 v-if="title" class="base-alert-title">
          {{ title }}
        </h4>

        <!-- Message -->
        <div v-if="message" class="base-alert-message">
          {{ message }}
        </div>

        <!-- Default Slot -->
        <div v-if="$slots.default" class="base-alert-slot">
          <slot />
        </div>
      </div>

      <!-- Actions -->
      <div v-if="showActions" class="base-alert-actions">
        <slot name="actions">
          <BaseButton
            v-if="actionButtonText"
            :variant="actionButtonVariant"
            :size="actionButtonSize"
            @click="handleActionClick"
          >
            {{ actionButtonText }}
          </BaseButton>
        </slot>
      </div>

      <!-- Close Button -->
      <button
        v-if="dismissible"
        type="button"
        class="base-alert-close"
        :aria-label="closeButtonLabel"
        @click="handleClose"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import BaseButton from '../forms/BaseButton.vue'

// Props
const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['info', 'success', 'warning', 'error'].includes(value)
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'outlined', 'filled', 'minimal'].includes(value)
  },
  dismissible: {
    type: Boolean,
    default: false
  },
  showIcon: {
    type: Boolean,
    default: true
  },
  showActions: {
    type: Boolean,
    default: false
  },
  actionButtonText: {
    type: String,
    default: ''
  },
  actionButtonVariant: {
    type: String,
    default: 'primary'
  },
  actionButtonSize: {
    type: String,
    default: 'sm'
  },
  closeButtonLabel: {
    type: String,
    default: 'Cerrar alerta'
  },
  autoClose: {
    type: [Boolean, Number],
    default: false
  },
  ariaLive: {
    type: String,
    default: 'polite',
    validator: (value) => ['polite', 'assertive', 'off'].includes(value)
  }
})

// Emits
const emit = defineEmits([
  'close',
  'action-click',
  'show',
  'hide'
])

// Refs
const show = ref(true)
let autoCloseTimer = null

// Computed
const alertId = computed(() => `alert_${Math.random().toString(36).substr(2, 9)}`)

const alertIcon = computed(() => {
  const icons = {
    info: 'InformationCircleIcon',
    success: 'CheckCircleIcon',
    warning: 'ExclamationTriangleIcon',
    error: 'XCircleIcon'
  }
  return icons[props.type] || 'InformationCircleIcon'
})

// Methods
const handleClose = () => {
  show.value = false
  emit('close')
  emit('hide')
}

const handleActionClick = () => {
  emit('action-click')
}

const startAutoClose = () => {
  if (props.autoClose) {
    const delay = typeof props.autoClose === 'number' ? props.autoClose : 5000
    autoCloseTimer = setTimeout(() => {
      handleClose()
    }, delay)
  }
}

const stopAutoClose = () => {
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer)
    autoCloseTimer = null
  }
}

// Lifecycle
onMounted(() => {
  emit('show')
  startAutoClose()
})

onUnmounted(() => {
  stopAutoClose()
})

// Expose methods for parent components
defineExpose({
  show: () => {
    show.value = true
    emit('show')
    startAutoClose()
  },
  hide: () => {
    show.value = false
    emit('hide')
    stopAutoClose()
  },
  close: handleClose
})
</script>

<style scoped>
.base-alert {
  @apply relative flex items-start p-4 rounded-lg border;
}

.base-alert--sm {
  @apply p-3;
}

.base-alert--md {
  @apply p-4;
}

.base-alert--lg {
  @apply p-5;
}

/* Type variants */
.base-alert--info {
  @apply bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800;
}

.base-alert--success {
  @apply bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800;
}

.base-alert--warning {
  @apply bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800;
}

.base-alert--error {
  @apply bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800;
}

/* Visual variants */
.base-alert--outlined {
  @apply bg-transparent;
}

.base-alert--filled {
  @apply border-transparent;
}

.base-alert--filled.base-alert--info {
  @apply bg-blue-100 dark:bg-blue-800;
}

.base-alert--filled.base-alert--success {
  @apply bg-green-100 dark:bg-green-800;
}

.base-alert--filled.base-alert--warning {
  @apply bg-yellow-100 dark:bg-yellow-800;
}

.base-alert--filled.base-alert--error {
  @apply bg-red-100 dark:bg-red-800;
}

.base-alert--minimal {
  @apply border-l-4 bg-transparent;
}

.base-alert--minimal.base-alert--info {
  @apply border-l-blue-500 dark:border-l-blue-400;
}

.base-alert--minimal.base-alert--success {
  @apply border-l-green-500 dark:border-l-green-400;
}

.base-alert--minimal.base-alert--warning {
  @apply border-l-yellow-500 dark:border-l-yellow-400;
}

.base-alert--minimal.base-alert--error {
  @apply border-l-red-500 dark:border-l-red-400;
}

.base-alert--dismissible {
  @apply pr-12;
}

.base-alert-icon {
  @apply flex-shrink-0 mr-3 mt-0.5;
}

.base-alert--info .base-alert-icon {
  @apply text-blue-500 dark:text-blue-400;
}

.base-alert--success .base-alert-icon {
  @apply text-green-500 dark:text-green-400;
}

.base-alert--warning .base-alert-icon {
  @apply text-yellow-500 dark:text-yellow-400;
}

.base-alert--error .base-alert-icon {
  @apply text-red-500 dark:text-red-400;
}

.base-alert-content {
  @apply flex-1 min-w-0;
}

.base-alert-title {
  @apply text-sm font-medium mb-1;
}

.base-alert--info .base-alert-title {
  @apply text-blue-800 dark:text-blue-200;
}

.base-alert--success .base-alert-title {
  @apply text-green-800 dark:text-green-200;
}

.base-alert--warning .base-alert-title {
  @apply text-yellow-800 dark:text-yellow-200;
}

.base-alert--error .base-alert-title {
  @apply text-red-800 dark:text-red-200;
}

.base-alert-message {
  @apply text-sm;
}

.base-alert--info .base-alert-message {
  @apply text-blue-700 dark:text-blue-300;
}

.base-alert--success .base-alert-message {
  @apply text-green-700 dark:text-green-300;
}

.base-alert--warning .base-alert-message {
  @apply text-yellow-700 dark:text-yellow-300;
}

.base-alert--error .base-alert-message {
  @apply text-red-700 dark:text-red-300;
}

.base-alert-slot {
  @apply mt-2;
}

.base-alert-actions {
  @apply flex-shrink-0 ml-3;
}

.base-alert-close {
  @apply absolute top-4 right-4 p-1 rounded-md;
  @apply text-gray-400 hover:text-gray-600 dark:hover:text-gray-300;
  @apply hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors;
}

.base-alert--info .base-alert-close:hover {
  @apply text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800;
}

.base-alert--success .base-alert-close:hover {
  @apply text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-800;
}

.base-alert--warning .base-alert-close:hover {
  @apply text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-800;
}

.base-alert--error .base-alert-close:hover {
  @apply text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .base-alert {
    @apply flex-col items-start;
  }
  
  .base-alert-actions {
    @apply ml-0 mt-3 w-full;
  }
  
  .base-alert--dismissible {
    @apply pr-4;
  }
  
  .base-alert-close {
    @apply relative top-0 right-0 mt-2;
  }
}

/* Transitions */
.base-alert {
  @apply transition-all duration-200 ease-in-out;
}

/* Focus states */
.base-alert-close:focus {
  @apply outline-none ring-2 ring-blue-500 ring-opacity-50;
}
</style>
