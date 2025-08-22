<template>
  <div class="base-radio-wrapper">
    <fieldset class="base-radio-fieldset">
      <legend v-if="legend" class="base-radio-legend">
        {{ legend }}
        <span v-if="required" class="base-radio-required">*</span>
      </legend>
      
      <div class="base-radio-options">
        <label 
          v-for="option in options" 
          :key="option.value"
          :for="`${radioGroupId}_${option.value}`"
          class="base-radio-option"
          :class="[
            `base-radio-option--${size}`,
            `base-radio-option--${variant}`,
            { 
              'base-radio-option--disabled': disabled || option.disabled,
              'base-radio-option--error': !!errorMessage
            }
          ]"
        >
          <!-- Radio Input -->
          <div class="base-radio-input-container">
            <input
              :id="`${radioGroupId}_${option.value}`"
              :name="name"
              type="radio"
              :value="option.value"
              :disabled="disabled || option.disabled"
              :required="required"
              :checked="isOptionSelected(option.value)"
              class="base-radio-input"
              :class="[
                `base-radio-input--${size}`,
                `base-radio-input--${variant}`,
                { 'base-radio-input--error': !!errorMessage }
              ]"
              @change="handleChange(option.value)"
              @focus="handleFocus"
              @blur="handleBlur"
            />
            
            <!-- Custom Radio Visual -->
            <div 
              class="base-radio-visual"
              :class="[
                `base-radio-visual--${size}`,
                `base-radio-visual--${variant}`,
                { 
                  'base-radio-visual--checked': isOptionSelected(option.value),
                  'base-radio-visual--error': !!errorMessage,
                  'base-radio-visual--disabled': disabled || option.disabled
                }
              ]"
            >
              <!-- Radio Dot -->
              <div 
                v-if="isOptionSelected(option.value)"
                class="base-radio-dot"
                :class="`base-radio-dot--${size}`"
              ></div>
            </div>
          </div>

          <!-- Option Content -->
          <div class="base-radio-content">
            <span class="base-radio-label">
              {{ option.label }}
            </span>
            
            <span v-if="option.description" class="base-radio-description">
              {{ option.description }}
            </span>
          </div>
        </label>
      </div>
    </fieldset>

    <!-- Error Message -->
    <div v-if="errorMessage" class="base-radio-error">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {{ errorMessage }}
    </div>

    <!-- Helper Text -->
    <div v-if="helperText && !errorMessage" class="base-radio-helper">
      {{ helperText }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'

// Props
const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    default: null
  },
  options: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(option => 
        typeof option === 'object' && 
        'value' in option && 
        'label' in option
      )
    }
  },
  name: {
    type: String,
    required: true
  },
  legend: {
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

// Computed
const radioGroupId = computed(() => `radio_${Math.random().toString(36).substr(2, 9)}`)

// Methods
const isOptionSelected = (value) => {
  return props.modelValue === value
}

const handleChange = (value) => {
  emit('update:modelValue', value)
  
  emit('change', {
    value,
    event: event
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
  if (props.required && props.modelValue === null) {
    errors.push('Debe seleccionar una opción')
  }
  
  emit('validation-change', {
    isValid: errors.length === 0,
    errors,
    value: props.modelValue
  })
}

// Expose methods for parent components
defineExpose({
  validate: validateField
})
</script>

<style scoped>
.base-radio-wrapper {
  @apply w-full;
}

.base-radio-fieldset {
  @apply border-0 p-0 m-0;
}

.base-radio-legend {
  @apply block font-medium text-gray-700 dark:text-gray-300 mb-3;
}

.base-radio-required {
  @apply text-red-500 ml-1;
}

.base-radio-options {
  @apply space-y-3;
}

.base-radio-option {
  @apply flex items-start cursor-pointer;
}

.base-radio-option--xs { @apply text-xs; }
.base-radio-option--sm { @apply text-sm; }
.base-radio-option--md { @apply text-base; }
.base-radio-option--lg { @apply text-lg; }
.base-radio-option--xl { @apply text-xl; }

.base-radio-option--disabled {
  @apply cursor-not-allowed opacity-60;
}

.base-radio-option--error {
  @apply text-red-600 dark:text-red-400;
}

.base-radio-input-container {
  @apply relative flex-shrink-0;
}

.base-radio-input {
  @apply sr-only;
}

.base-radio-visual {
  @apply border-2 rounded-full transition-all duration-200 ease-in-out;
  @apply flex items-center justify-center;
}

.base-radio-visual--xs { @apply w-3 h-3; }
.base-radio-visual--sm { @apply w-4 h-4; }
.base-radio-visual--md { @apply w-5 h-5; }
.base-radio-visual--lg { @apply w-6 h-6; }
.base-radio-visual--xl { @apply w-7 h-7; }

.base-radio-visual--default {
  @apply border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800;
}

.base-radio-visual--primary {
  @apply border-blue-500 dark:border-blue-400 bg-white dark:bg-gray-800;
}

.base-radio-visual--success {
  @apply border-green-500 dark:border-green-400 bg-white dark:bg-gray-800;
}

.base-radio-visual--warning {
  @apply border-yellow-500 dark:border-yellow-400 bg-white dark:bg-gray-800;
}

.base-radio-visual--error {
  @apply border-red-500 dark:border-red-400 bg-white dark:bg-gray-800;
}

.base-radio-visual--checked.base-radio-visual--default {
  @apply border-gray-900 dark:border-white;
}

.base-radio-visual--checked.base-radio-visual--primary {
  @apply border-blue-600 dark:border-blue-500;
}

.base-radio-visual--checked.base-radio-visual--success {
  @apply border-green-600 dark:border-green-500;
}

.base-radio-visual--checked.base-radio-visual--warning {
  @apply border-yellow-600 dark:border-yellow-500;
}

.base-radio-visual--checked.base-radio-visual--error {
  @apply border-red-600 dark:border-red-500;
}

.base-radio-visual--disabled {
  @apply opacity-50 cursor-not-allowed;
}

.base-radio-dot {
  @apply bg-current rounded-full;
}

.base-radio-dot--xs { @apply w-1 h-1; }
.base-radio-dot--sm { @apply w-1.5 h-1.5; }
.base-radio-dot--md { @apply w-2 h-2; }
.base-radio-dot--lg { @apply w-2.5 h-2.5; }
.base-radio-dot--xl { @apply w-3 h-3; }

.base-radio-dot.base-radio-visual--default {
  @apply text-gray-900 dark:text-white;
}

.base-radio-dot.base-radio-visual--primary {
  @apply text-blue-600 dark:text-blue-500;
}

.base-radio-dot.base-radio-visual--success {
  @apply text-green-600 dark:text-green-500;
}

.base-radio-dot.base-radio-visual--warning {
  @apply text-yellow-600 dark:text-yellow-500;
}

.base-radio-dot.base-radio-visual--error {
  @apply text-red-600 dark:text-red-500;
}

.base-radio-content {
  @apply ml-3 flex-1;
}

.base-radio-label {
  @apply block font-medium text-gray-700 dark:text-gray-300;
}

.base-radio-description {
  @apply block mt-1 text-sm text-gray-500 dark:text-gray-400;
}

.base-radio-error {
  @apply flex items-center mt-2 text-sm text-red-600 dark:text-red-400;
}

.base-radio-error svg {
  @apply mr-2 flex-shrink-0;
}

.base-radio-helper {
  @apply mt-2 text-sm text-gray-500 dark:text-gray-400;
}

/* Hover states */
.base-radio-option:not(.base-radio-option--disabled):hover .base-radio-visual:not(.base-radio-visual--checked) {
  @apply border-gray-400 dark:border-gray-500;
}

.base-radio-option:not(.base-radio-option--disabled):hover .base-radio-visual--primary:not(.base-radio-visual--checked) {
  @apply border-blue-600 dark:border-blue-500;
}

.base-radio-option:not(.base-radio-option--disabled):hover .base-radio-visual--success:not(.base-radio-visual--checked) {
  @apply border-green-600 dark:border-green-500;
}

.base-radio-option:not(.base-radio-option--disabled):hover .base-radio-visual--warning:not(.base-radio-visual--checked) {
  @apply border-yellow-600 dark:border-yellow-500;
}

.base-radio-option:not(.base-radio-option--disabled):hover .base-radio-visual--error:not(.base-radio-visual--checked) {
  @apply border-red-600 dark:border-red-500;
}

/* Focus states */
.base-radio-input:focus + .base-radio-visual {
  @apply ring-2 ring-blue-500 ring-opacity-50;
}

/* Transitions */
.base-radio-visual,
.base-radio-dot {
  @apply transition-all duration-200 ease-in-out;
}
</style>
