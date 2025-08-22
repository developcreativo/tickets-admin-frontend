<template>
  <div class="base-textarea-wrapper">
    <!-- Label -->
    <label 
      v-if="label" 
      :for="textareaId" 
      class="base-textarea-label"
      :class="[
        `base-textarea-label--${size}`,
        `base-textarea-label--${variant}`,
        { 'base-textarea-label--required': required }
      ]"
    >
      {{ label }}
      <span v-if="required" class="base-textarea-required">*</span>
    </label>

    <!-- Textarea Container -->
    <div 
      class="base-textarea-container"
      :class="[
        `base-textarea-container--${size}`,
        `base-textarea-container--${variant}`,
        { 
          'base-textarea-container--error': !!errorMessage,
          'base-textarea-container--disabled': disabled,
          'base-textarea-container--focused': isFocused
        }
      ]"
    >
      <!-- Start Icon -->
      <div v-if="startIcon" class="base-textarea-start-icon">
        <component :is="startIcon" class="w-4 h-4" />
      </div>

      <!-- Textarea -->
      <textarea
        :id="textareaId"
        ref="textareaRef"
        v-model="localValue"
        :placeholder="placeholder"
        :rows="rows"
        :maxlength="maxLength"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :name="name"
        class="base-textarea"
        :class="[
          `base-textarea--${size}`,
          `base-textarea--${variant}`,
          { 'base-textarea--with-start-icon': startIcon, 'base-textarea--with-end-icon': endIcon }
        ]"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
        @keydown="handleKeydown"
        @paste="handlePaste"
      />

      <!-- End Icon -->
      <div v-if="endIcon" class="base-textarea-end-icon">
        <component :is="endIcon" class="w-4 h-4" />
      </div>

      <!-- Clear Button -->
      <button
        v-if="clearable && localValue && !disabled"
        type="button"
        class="base-textarea-clear-btn"
        @click="handleClear"
        :title="clearButtonTitle"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="base-textarea-error">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {{ errorMessage }}
    </div>

    <!-- Helper Text -->
    <div v-if="helperText && !errorMessage" class="base-textarea-helper">
      {{ helperText }}
    </div>

    <!-- Character Count -->
    <div v-if="showCharacterCount" class="base-textarea-character-count">
      <span :class="{ 'text-red-500': isOverLimit }">
        {{ currentLength }}
      </span>
      <span v-if="maxLength">/ {{ maxLength }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue'

// Props
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  rows: {
    type: Number,
    default: 3
  },
  maxLength: {
    type: Number,
    default: null
  },
  minLength: {
    type: Number,
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    default: ''
  },
  errorMessage: {
    type: String,
    default: ''
  },
  helperText: {
    type: String,
    default: ''
  },
  startIcon: {
    type: [String, Object],
    default: null
  },
  endIcon: {
    type: [String, Object],
    default: null
  },
  clearable: {
    type: Boolean,
    default: false
  },
  showCharacterCount: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'outlined', 'filled', 'minimal'].includes(value)
  },
  autoResize: {
    type: Boolean,
    default: false
  },
  clearButtonTitle: {
    type: String,
    default: 'Limpiar'
  }
})

// Emits
const emit = defineEmits([
  'update:modelValue',
  'focus',
  'blur',
  'input',
  'keydown',
  'paste',
  'clear',
  'validation-change'
])

// Refs
const textareaRef = ref(null)
const isFocused = ref(false)

// Computed
const textareaId = computed(() => `textarea_${Math.random().toString(36).substr(2, 9)}`)

const localValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const currentLength = computed(() => localValue.value?.length || 0)

const isOverLimit = computed(() => {
  if (!props.maxLength) return false
  return currentLength.value > props.maxLength
})

// Methods
const handleFocus = (event) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event) => {
  isFocused.value = false
  emit('blur', event)
  
  // Validar al perder el foco
  validateField()
}

const handleInput = (event) => {
  emit('input', event)
  
  // Auto-resize si está habilitado
  if (props.autoResize) {
    nextTick(() => {
      autoResizeTextarea()
    })
  }
  
  // Validar en tiempo real si hay error
  if (props.errorMessage) {
    validateField()
  }
}

const handleKeydown = (event) => {
  emit('keydown', event)
}

const handlePaste = (event) => {
  emit('paste', event)
}

const handleClear = () => {
  localValue.value = ''
  emit('clear')
  emit('update:modelValue', '')
  
  // Enfocar el textarea después de limpiar
  nextTick(() => {
    textareaRef.value?.focus()
  })
}

const validateField = () => {
  const errors = []
  
  // Validación de longitud mínima
  if (props.minLength && currentLength.value < props.minLength) {
    errors.push(`Mínimo ${props.minLength} caracteres`)
  }
  
  // Validación de longitud máxima
  if (props.maxLength && currentLength.value > props.maxLength) {
    errors.push(`Máximo ${props.maxLength} caracteres`)
  }
  
  // Validación de requerido
  if (props.required && !localValue.value?.trim()) {
    errors.push('Este campo es requerido')
  }
  
  emit('validation-change', {
    isValid: errors.length === 0,
    errors,
    value: localValue.value
  })
}

const autoResizeTextarea = () => {
  if (!textareaRef.value) return
  
  const textarea = textareaRef.value
  textarea.style.height = 'auto'
  textarea.style.height = `${textarea.scrollHeight}px`
}

// Watchers
watch(() => props.modelValue, () => {
  if (props.autoResize) {
    nextTick(() => {
      autoResizeTextarea()
    })
  }
})

// Expose methods for parent components
defineExpose({
  focus: () => textareaRef.value?.focus(),
  blur: () => textareaRef.value?.blur(),
  select: () => textareaRef.value?.select(),
  validate: validateField
})
</script>

<style scoped>
.base-textarea-wrapper {
  @apply w-full;
}

.base-textarea-label {
  @apply block font-medium text-gray-700 dark:text-gray-300 mb-2;
}

.base-textarea-label--xs { @apply text-xs; }
.base-textarea-label--sm { @apply text-sm; }
.base-textarea-label--md { @apply text-base; }
.base-textarea-label--lg { @apply text-lg; }
.base-textarea-label--xl { @apply text-xl; }

.base-textarea-label--required .base-textarea-required {
  @apply text-red-500 ml-1;
}

.base-textarea-container {
  @apply relative flex items-start;
}

.base-textarea-container--xs { @apply text-xs; }
.base-textarea-container--sm { @apply text-sm; }
.base-textarea-container--md { @apply text-base; }
.base-textarea-container--lg { @apply text-lg; }
.base-textarea-container--xl { @apply text-xl; }

.base-textarea-container--default {
  @apply border border-gray-300 dark:border-gray-600 rounded-md;
}

.base-textarea-container--outlined {
  @apply border-2 border-gray-300 dark:border-gray-600 rounded-md;
}

.base-textarea-container--filled {
  @apply bg-gray-50 dark:bg-gray-800 border-b-2 border-gray-300 dark:border-gray-600 rounded-none;
}

.base-textarea-container--minimal {
  @apply border-b border-gray-300 dark:border-gray-600 rounded-none;
}

.base-textarea-container--error {
  @apply border-red-500 dark:border-red-400;
}

.base-textarea-container--disabled {
  @apply bg-gray-100 dark:bg-gray-700 cursor-not-allowed;
}

.base-textarea-container--focused {
  @apply ring-2 ring-blue-500 ring-opacity-50;
}

.base-textarea-start-icon {
  @apply absolute left-3 top-3 text-gray-400 dark:text-gray-500 pointer-events-none;
}

.base-textarea-end-icon {
  @apply absolute right-3 top-3 text-gray-400 dark:text-gray-500 pointer-events-none;
}

.base-textarea {
  @apply w-full bg-transparent border-0 outline-none resize-none;
  @apply text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400;
}

.base-textarea--xs { @apply text-xs px-2 py-1; }
.base-textarea--sm { @apply text-sm px-3 py-2; }
.base-textarea--md { @apply text-base px-3 py-2; }
.base-textarea--lg { @apply text-lg px-4 py-3; }
.base-textarea--xl { @apply text-xl px-4 py-3; }

.base-textarea--with-start-icon.base-textarea--xs { @apply pl-8; }
.base-textarea--with-start-icon.base-textarea--sm { @apply pl-10; }
.base-textarea--with-start-icon.base-textarea--md { @apply pl-10; }
.base-textarea--with-start-icon.base-textarea--lg { @apply pl-12; }
.base-textarea--with-start-icon.base-textarea--xl { @apply pl-12; }

.base-textarea--with-end-icon.base-textarea--xs { @apply pr-8; }
.base-textarea--with-end-icon.base-textarea--sm { @apply pr-10; }
.base-textarea--with-end-icon.base-textarea--md { @apply pr-10; }
.base-textarea--with-end-icon.base-textarea--lg { @apply pr-12; }
.base-textarea--with-end-icon.base-textarea--xl { @apply pr-12; }

.base-textarea:disabled {
  @apply cursor-not-allowed text-gray-500 dark:text-gray-400;
}

.base-textarea:focus {
  @apply outline-none;
}

.base-textarea-clear-btn {
  @apply absolute right-2 top-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300;
  @apply rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors;
}

.base-textarea-error {
  @apply flex items-center mt-2 text-sm text-red-600 dark:text-red-400;
}

.base-textarea-error svg {
  @apply mr-2 flex-shrink-0;
}

.base-textarea-helper {
  @apply mt-2 text-sm text-gray-500 dark:text-gray-400;
}

.base-textarea-character-count {
  @apply mt-2 text-xs text-gray-500 dark:text-gray-400 text-right;
}

/* Variantes de tamaño específicas */
.base-textarea-container--xs .base-textarea { @apply text-xs; }
.base-textarea-container--sm .base-textarea { @apply text-sm; }
.base-textarea-container--md .base-textarea { @apply text-base; }
.base-textarea-container--lg .base-textarea { @apply text-lg; }
.base-textarea-container--xl .base-textarea { @apply text-xl; }

/* Estados de hover */
.base-textarea-container:not(.base-textarea-container--disabled):not(.base-textarea-container--error):hover {
  @apply border-gray-400 dark:border-gray-500;
}

/* Transiciones */
.base-textarea-container,
.base-textarea,
.base-textarea-clear-btn {
  @apply transition-all duration-200 ease-in-out;
}
</style>
