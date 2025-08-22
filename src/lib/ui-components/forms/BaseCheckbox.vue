<template>
  <div class="base-checkbox-wrapper">
    <label 
      :for="checkboxId" 
      class="base-checkbox-label"
      :class="[
        `base-checkbox-label--${size}`,
        `base-checkbox-label--${variant}`,
        { 
          'base-checkbox-label--disabled': disabled,
          'base-checkbox-label--error': !!errorMessage
        }
      ]"
    >
      <!-- Checkbox Input -->
      <div class="base-checkbox-input-container">
        <input
          :id="checkboxId"
          ref="checkboxRef"
          v-model="localValue"
          type="checkbox"
          :name="name"
          :value="value"
          :disabled="disabled"
          :required="required"
          :indeterminate="indeterminate"
          class="base-checkbox-input"
          :class="[
            `base-checkbox-input--${size}`,
            `base-checkbox-input--${variant}`,
            { 
              'base-checkbox-input--error': !!errorMessage,
              'base-checkbox-input--indeterminate': indeterminate
            }
          ]"
          @change="handleChange"
          @focus="handleFocus"
          @blur="handleBlur"
        />
        
        <!-- Custom Checkbox Visual -->
        <div 
          class="base-checkbox-visual"
          :class="[
            `base-checkbox-visual--${size}`,
            `base-checkbox-visual--${variant}`,
            { 
              'base-checkbox-visual--checked': isChecked,
              'base-checkbox-visual--indeterminate': indeterminate,
              'base-checkbox-visual--error': !!errorMessage,
              'base-checkbox-visual--disabled': disabled
            }
          ]"
        >
          <!-- Check Icon -->
          <svg 
            v-if="isChecked && !indeterminate" 
            class="base-checkbox-check-icon" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
          </svg>
          
          <!-- Indeterminate Icon -->
          <svg 
            v-if="indeterminate" 
            class="base-checkbox-indeterminate-icon" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 12h12" />
          </svg>
        </div>
      </div>

      <!-- Label Text -->
      <span class="base-checkbox-text">
        {{ label }}
        <span v-if="required" class="base-checkbox-required">*</span>
      </span>

      <!-- Description -->
      <span v-if="description" class="base-checkbox-description">
        {{ description }}
      </span>
    </label>

    <!-- Error Message -->
    <div v-if="errorMessage" class="base-checkbox-error">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {{ errorMessage }}
    </div>

    <!-- Helper Text -->
    <div v-if="helperText && !errorMessage" class="base-checkbox-helper">
      {{ helperText }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue'

// Props
const props = defineProps({
  modelValue: {
    type: [Boolean, Array],
    default: false
  },
  label: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  value: {
    type: [String, Number, Boolean],
    default: true
  },
  name: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  indeterminate: {
    type: Boolean,
    default: false
  },
  errorMessage: {
    type: String,
    default: ''
  },
  helperText: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'success', 'warning', 'error'].includes(value)
  },
  validateOnChange: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits([
  'update:modelValue',
  'change',
  'focus',
  'blur',
  'validation-change'
])

// Refs
const checkboxRef = ref(null)

// Computed
const checkboxId = computed(() => `checkbox_${Math.random().toString(36).substr(2, 9)}`)

const localValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isChecked = computed(() => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue.includes(props.value)
  }
  return !!props.modelValue
})

// Methods
const handleChange = (event) => {
  const checked = event.target.checked
  
  if (Array.isArray(props.modelValue)) {
    // Manejo de array para múltiples selecciones
    const newValue = [...props.modelValue]
    if (checked) {
      if (!newValue.includes(props.value)) {
        newValue.push(props.value)
      }
    } else {
      const index = newValue.indexOf(props.value)
      if (index > -1) {
        newValue.splice(index, 1)
      }
    }
    localValue.value = newValue
  } else {
    // Manejo de boolean para selección única
    localValue.value = checked
  }
  
  emit('change', {
    checked,
    value: props.value,
    event
  })
  
  // Validar si está habilitado
  if (props.validateOnChange) {
    validateField()
  }
}

const handleFocus = (event) => {
  emit('focus', event)
}

const handleBlur = (event) => {
  emit('blur', event)
  
  // Validar al perder el foco
  validateField()
}

const validateField = () => {
  const errors = []
  
  // Validación de requerido
  if (props.required) {
    if (Array.isArray(props.modelValue)) {
      if (props.modelValue.length === 0) {
        errors.push('Debe seleccionar al menos una opción')
      }
    } else if (!props.modelValue) {
      errors.push('Este campo es requerido')
    }
  }
  
  emit('validation-change', {
    isValid: errors.length === 0,
    errors,
    value: props.modelValue
  })
}

const setIndeterminate = (value) => {
  if (checkboxRef.value) {
    checkboxRef.value.indeterminate = value
  }
}

// Watchers
watch(() => props.indeterminate, (newValue) => {
  nextTick(() => {
    setIndeterminate(newValue)
  })
})

// Lifecycle
onMounted(() => {
  if (props.indeterminate) {
    setIndeterminate(true)
  }
})

// Expose methods for parent components
defineExpose({
  focus: () => checkboxRef.value?.focus(),
  blur: () => checkboxRef.value?.blur(),
  validate: validateField,
  setIndeterminate
})
</script>

<style scoped>
.base-checkbox-wrapper {
  @apply w-full;
}

.base-checkbox-label {
  @apply flex items-start cursor-pointer;
}

.base-checkbox-label--xs { @apply text-xs; }
.base-checkbox-label--sm { @apply text-sm; }
.base-checkbox-label--md { @apply text-base; }
.base-checkbox-label--lg { @apply text-lg; }
.base-checkbox-label--xl { @apply text-xl; }

.base-checkbox-label--disabled {
  @apply cursor-not-allowed opacity-60;
}

.base-checkbox-label--error {
  @apply text-red-600 dark:text-red-400;
}

.base-checkbox-input-container {
  @apply relative flex-shrink-0;
}

.base-checkbox-input {
  @apply sr-only;
}

.base-checkbox-visual {
  @apply border-2 rounded transition-all duration-200 ease-in-out;
  @apply flex items-center justify-center;
}

.base-checkbox-visual--xs { @apply w-3 h-3; }
.base-checkbox-visual--sm { @apply w-4 h-4; }
.base-checkbox-visual--md { @apply w-5 h-5; }
.base-checkbox-visual--lg { @apply w-6 h-6; }
.base-checkbox-visual--xl { @apply w-7 h-7; }

.base-checkbox-visual--default {
  @apply border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800;
}

.base-checkbox-visual--primary {
  @apply border-blue-500 dark:border-blue-400 bg-white dark:bg-gray-800;
}

.base-checkbox-visual--success {
  @apply border-green-500 dark:border-green-400 bg-white dark:bg-gray-800;
}

.base-checkbox-visual--warning {
  @apply border-yellow-500 dark:border-yellow-400 bg-white dark:bg-gray-800;
}

.base-checkbox-visual--error {
  @apply border-red-500 dark:border-red-400 bg-white dark:bg-gray-800;
}

.base-checkbox-visual--checked.base-checkbox-visual--default {
  @apply bg-gray-900 dark:bg-white border-gray-900 dark:border-white;
}

.base-checkbox-visual--checked.base-checkbox-visual--primary {
  @apply bg-blue-600 dark:bg-blue-500 border-blue-600 dark:border-blue-500;
}

.base-checkbox-visual--checked.base-checkbox-visual--success {
  @apply bg-green-600 dark:bg-green-500 border-green-600 dark:border-green-500;
}

.base-checkbox-visual--checked.base-checkbox-visual--warning {
  @apply bg-yellow-600 dark:bg-yellow-500 border-yellow-600 dark:border-yellow-500;
}

.base-checkbox-visual--checked.base-checkbox-visual--error {
  @apply bg-red-600 dark:bg-red-500 border-red-600 dark:border-red-500;
}

.base-checkbox-visual--indeterminate {
  @apply bg-gray-600 dark:bg-gray-400 border-gray-600 dark:border-gray-400;
}

.base-checkbox-visual--disabled {
  @apply opacity-50 cursor-not-allowed;
}

.base-checkbox-check-icon {
  @apply text-white dark:text-gray-900;
}

.base-checkbox-check-icon--xs { @apply w-1.5 h-1.5; }
.base-checkbox-check-icon--sm { @apply w-2 h-2; }
.base-checkbox-check-icon--md { @apply w-2.5 h-2.5; }
.base-checkbox-check-icon--lg { @apply w-3 h-3; }
.base-checkbox-check-icon--xl { @apply w-3.5 h-3.5; }

.base-checkbox-indeterminate-icon {
  @apply text-white dark:text-gray-900;
}

.base-checkbox-indeterminate-icon--xs { @apply w-1.5 h-1.5; }
.base-checkbox-indeterminate-icon--sm { @apply w-2 h-2; }
.base-checkbox-indeterminate-icon--md { @apply w-2.5 h-2.5; }
.base-checkbox-indeterminate-icon--lg { @apply w-3 h-3; }
.base-checkbox-indeterminate-icon--xl { @apply w-3.5 h-3.5; }

.base-checkbox-text {
  @apply ml-3 font-medium text-gray-700 dark:text-gray-300;
}

.base-checkbox-required {
  @apply text-red-500 ml-1;
}

.base-checkbox-description {
  @apply ml-3 mt-1 text-sm text-gray-500 dark:text-gray-400;
}

.base-checkbox-error {
  @apply flex items-center mt-2 text-sm text-red-600 dark:text-red-400;
}

.base-checkbox-error svg {
  @apply mr-2 flex-shrink-0;
}

.base-checkbox-helper {
  @apply mt-2 text-sm text-gray-500 dark:text-gray-400;
}

/* Hover states */
.base-checkbox-label:not(.base-checkbox-label--disabled):hover .base-checkbox-visual:not(.base-checkbox-visual--checked):not(.base-checkbox-visual--indeterminate) {
  @apply border-gray-400 dark:border-gray-500;
}

.base-checkbox-label:not(.base-checkbox-label--disabled):hover .base-checkbox-visual--primary:not(.base-checkbox-visual--checked) {
  @apply border-blue-600 dark:border-blue-500;
}

.base-checkbox-label:not(.base-checkbox-label--disabled):hover .base-checkbox-visual--success:not(.base-checkbox-visual--checked) {
  @apply border-green-600 dark:border-green-500;
}

.base-checkbox-label:not(.base-checkbox-label--disabled):hover .base-checkbox-visual--warning:not(.base-checkbox-visual--checked) {
  @apply border-yellow-600 dark:border-yellow-500;
}

.base-checkbox-label:not(.base-checkbox-label--disabled):hover .base-checkbox-visual--error:not(.base-checkbox-visual--checked) {
  @apply border-red-600 dark:border-red-500;
}

/* Focus states */
.base-checkbox-input:focus + .base-checkbox-visual {
  @apply ring-2 ring-blue-500 ring-opacity-50;
}

/* Transitions */
.base-checkbox-visual,
.base-checkbox-check-icon,
.base-checkbox-indeterminate-icon {
  @apply transition-all duration-200 ease-in-out;
}
</style>
