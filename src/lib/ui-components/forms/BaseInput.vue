<template>
  <div class="form-field">
    <label 
      v-if="label" 
      :for="id" 
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      :class="{ 'text-red-600 dark:text-red-400': hasError }"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    
    <div class="relative">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :minlength="minlength"
        :pattern="pattern"
        :autocomplete="autocomplete"
        :inputmode="inputmode"
        class="w-full px-3 py-2 border rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
        :class="inputClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        @keydown="handleKeydown"
      />
      
      <!-- Icono de inicio -->
      <div 
        v-if="startIcon" 
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <component 
          :is="startIcon" 
          class="h-5 w-5 text-gray-400"
          :class="{ 'text-red-500': hasError }"
        />
      </div>
      
      <!-- Icono de fin -->
      <div 
        v-if="endIcon" 
        class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
      >
        <component 
          :is="endIcon" 
          class="h-5 w-5 text-gray-400"
          :class="{ 'text-red-500': hasError }"
        />
      </div>
      
      <!-- Botón de limpiar -->
      <button
        v-if="clearable && modelValue && !disabled"
        type="button"
        @click="clearInput"
        class="absolute inset-y-0 right-0 pr-3 flex items-center"
        :class="{ 'pr-10': endIcon }"
      >
        <svg class="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    
    <!-- Mensaje de error -->
    <p 
      v-if="hasError && errorMessage" 
      class="mt-1 text-sm text-red-600 dark:text-red-400"
    >
      {{ errorMessage }}
    </p>
    
    <!-- Mensaje de ayuda -->
    <p 
      v-if="helpText && !hasError" 
      class="mt-1 text-sm text-gray-500 dark:text-gray-400"
    >
      {{ helpText }}
    </p>
    
    <!-- Contador de caracteres -->
    <div 
      v-if="showCharacterCount" 
      class="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right"
    >
      {{ (modelValue || '').length }}{{ maxlength ? `/${maxlength}` : '' }}
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  id: { type: String, default: '' },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  maxlength: { type: [String, Number], default: null },
  minlength: { type: [String, Number], default: null },
  pattern: { type: String, default: '' },
  autocomplete: { type: String, default: '' },
  inputmode: { type: String, default: '' },
  startIcon: { type: Object, default: null },
  endIcon: { type: Object, default: null },
  clearable: { type: Boolean, default: false },
  helpText: { type: String, default: '' },
  errorMessage: { type: String, default: '' },
  showCharacterCount: { type: Boolean, default: false },
  size: { type: String, default: 'md', validator: value => ['sm', 'md', 'lg'].includes(value) },
  variant: { type: String, default: 'default', validator: value => ['default', 'filled', 'outlined'].includes(value) }
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus', 'keydown', 'clear'])

const hasError = computed(() => !!props.errorMessage)

const inputClasses = computed(() => {
  const baseClasses = 'focus:ring-blue-500'
  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2 text-base',
    lg: 'px-4 py-3 text-lg'
  }
  const variantClasses = {
    default: 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800 dark:text-white',
    filled: 'border-transparent bg-gray-50 dark:bg-gray-700 dark:text-white',
    outlined: 'border-gray-300 bg-transparent dark:border-gray-600 dark:text-white'
  }
  const stateClasses = hasError.value 
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
    : 'hover:border-gray-400'
  
  return [
    baseClasses,
    sizeClasses[props.size],
    variantClasses[props.variant],
    stateClasses,
    props.disabled && 'bg-gray-100 text-gray-500 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400',
    props.readonly && 'bg-gray-50 text-gray-700 cursor-default dark:bg-gray-700 dark:text-gray-300'
  ].filter(Boolean).join(' ')
})

const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
}

const handleBlur = (event) => {
  emit('blur', event)
}

const handleFocus = (event) => {
  emit('focus', event)
}

const handleKeydown = (event) => {
  emit('keydown', event)
}

const clearInput = () => {
  emit('update:modelValue', '')
  emit('clear')
}
</script>

<style scoped>
.form-field {
  @apply w-full;
}

/* Transiciones suaves */
input {
  @apply transition-all duration-200 ease-in-out;
}

/* Estilos para autofill */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0px 1000px white inset;
  -webkit-text-fill-color: inherit;
}

.dark input:-webkit-autofill,
.dark input:-webkit-autofill:hover,
.dark input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0px 1000px #1f2937 inset;
  -webkit-text-fill-color: white;
}
</style>
