<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="modelValue"
        class="modal-overlay"
        :class="[
          `modal-${size}`,
          { 'modal-fullscreen': fullscreen }
        ]"
        @click="handleOverlayClick"
      >
        <!-- Backdrop -->
        <div class="modal-backdrop" />
        
        <!-- Modal Container -->
        <div
          class="modal-container"
          :class="[
            `modal-${size}`,
            { 'modal-fullscreen': fullscreen }
          ]"
          @click.stop
        >
          <!-- Header -->
          <div v-if="showHeader" class="modal-header">
            <div class="header-content">
              <h3 v-if="title" class="modal-title">
                {{ title }}
              </h3>
              <slot name="header" />
            </div>
            
            <!-- Botón de cerrar -->
            <button
              v-if="showCloseButton"
              @click="closeModal"
              class="close-button"
              :aria-label="closeButtonLabel"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Body -->
          <div class="modal-body">
            <slot />
          </div>
          
          <!-- Footer -->
          <div v-if="showFooter || $slots.footer" class="modal-footer">
            <slot name="footer">
              <!-- Botones por defecto -->
              <div class="default-footer">
                <button
                  v-if="showCancelButton"
                  @click="handleCancel"
                  class="cancel-button"
                  :disabled="loading"
                >
                  {{ cancelButtonText }}
                </button>
                
                <button
                  v-if="showConfirmButton"
                  @click="handleConfirm"
                  class="confirm-button"
                  :class="confirmButtonVariant"
                  :disabled="loading"
                >
                  <svg
                    v-if="loading"
                    class="animate-spin -ml-1 mr-2 h-4 w-4"
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
                  {{ confirmButtonText }}
                </button>
              </div>
            </slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  size: { 
    type: String, 
    default: 'md', 
    validator: value => ['sm', 'md', 'lg', 'xl', 'full'].includes(value) 
  },
  fullscreen: { type: Boolean, default: false },
  showHeader: { type: Boolean, default: true },
  showFooter: { type: Boolean, default: true },
  showCloseButton: { type: Boolean, default: true },
  showCancelButton: { type: Boolean, default: true },
  showConfirmButton: { type: Boolean, default: true },
  closeOnOverlay: { type: Boolean, default: true },
  closeOnEscape: { type: Boolean, default: true },
  persistent: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  closeButtonLabel: { type: String, default: 'Cerrar' },
  cancelButtonText: { type: String, default: 'Cancelar' },
  confirmButtonText: { type: String, default: 'Confirmar' },
  confirmButtonVariant: { 
    type: String, 
    default: 'primary',
    validator: value => ['primary', 'success', 'danger', 'warning', 'info'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue', 'close', 'cancel', 'confirm'])

// Computed properties para las clases CSS
const modalSizeClasses = computed(() => {
  if (props.fullscreen) return 'modal-fullscreen'
  
  const sizeMap = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full'
  }
  
  return sizeMap[props.size] || sizeMap.md
})

const confirmButtonClasses = computed(() => {
  const variantMap = {
    primary: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
    info: 'bg-cyan-600 hover:bg-cyan-700 focus:ring-cyan-500'
  }
  
  return variantMap[props.confirmButtonVariant] || variantMap.primary
})

// Métodos
const closeModal = () => {
  if (!props.persistent) {
    emit('update:modelValue', false)
    emit('close')
  }
}

const handleOverlayClick = () => {
  if (props.closeOnOverlay && !props.persistent) {
    closeModal()
  }
}

const handleCancel = () => {
  emit('cancel')
  closeModal()
}

const handleConfirm = () => {
  emit('confirm')
}

// Manejo de tecla Escape
const handleEscape = (event) => {
  if (event.key === 'Escape' && props.closeOnEscape && !props.persistent) {
    closeModal()
  }
}

// Bloquear scroll del body cuando el modal está abierto
const toggleBodyScroll = (lock) => {
  if (lock) {
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = '0px' // Compensar scrollbar
  } else {
    document.body.style.overflow = ''
    document.body.style.paddingRight = ''
  }
}

// Lifecycle
onMounted(() => {
  if (props.modelValue) {
    toggleBodyScroll(true)
  }
})

onUnmounted(() => {
  toggleBodyScroll(false)
})

// Watchers
watch(() => props.modelValue, (newValue) => {
  toggleBodyScroll(newValue)
})

// Event listeners
onMounted(() => {
  if (props.closeOnEscape) {
    document.addEventListener('keydown', handleEscape)
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
.modal-overlay {
  @apply fixed inset-0 z-50 flex items-center justify-center p-4;
}

.modal-backdrop {
  @apply absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm;
}

.modal-container {
  @apply relative bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-hidden;
  animation: modalSlideIn 0.3s ease-out;
}

.modal-sm {
  @apply max-w-sm;
}

.modal-md {
  @apply max-w-md;
}

.modal-lg {
  @apply max-w-lg;
}

.modal-xl {
  @apply max-w-xl;
}

.modal-fullscreen {
  @apply w-full h-full max-w-none max-h-none rounded-none;
}

.modal-header {
  @apply flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700;
}

.header-content {
  @apply flex-1;
}

.modal-title {
  @apply text-lg font-semibold text-gray-900 dark:text-white;
}

.close-button {
  @apply p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
}

.modal-body {
  @apply p-4 overflow-y-auto;
  max-height: calc(90vh - 140px); /* Ajustar para header y footer */
}

.modal-footer {
  @apply flex items-center justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50;
}

.default-footer {
  @apply flex items-center gap-3;
}

.cancel-button {
  @apply px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200;
}

.confirm-button {
  @apply px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200;
}

/* Animaciones */
@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Responsive */
@media (max-width: 640px) {
  .modal-overlay {
    @apply p-2;
  }
  
  .modal-container {
    @apply w-full max-w-none mx-2;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    @apply p-3;
  }
  
  .default-footer {
    @apply flex-col w-full;
  }
  
  .cancel-button,
  .confirm-button {
    @apply w-full justify-center;
  }
}

/* Scrollbar personalizado para el body del modal */
.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.dark .modal-body::-webkit-scrollbar-track {
  background: #374151;
}

.dark .modal-body::-webkit-scrollbar-thumb {
  background: #6b7280;
}

.dark .modal-body::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Transiciones suaves */
.modal-container {
  @apply transition-all duration-300 ease-out;
}

/* Focus visible para accesibilidad */
.close-button:focus-visible,
.cancel-button:focus-visible,
.confirm-button:focus-visible {
  @apply ring-2 ring-offset-2;
}
</style>
