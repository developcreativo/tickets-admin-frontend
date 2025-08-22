<template>
  <div class="space-y-2">
    <!-- Label -->
    <label 
      v-if="label" 
      :for="id" 
      class="block text-sm font-semibold text-gray-700 dark:text-gray-300"
      :class="{ 'text-red-600 dark:text-red-400': hasError }"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>

    <!-- Input Container -->
    <div class="relative">
      <!-- Left Icon -->
      <div 
        v-if="leftIcon" 
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <component 
          :is="leftIcon" 
          class="h-5 w-5 text-gray-400" 
          :class="{ 'text-red-400': hasError, 'text-green-500': isValid }"
        />
      </div>

      <!-- Input Field -->
      <input
        :id="id"
        :value="modelValue"
        :type="inputType"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :autocomplete="autocomplete"
        :maxlength="maxlength"
        :minlength="minlength"
        :pattern="pattern"
        :readonly="readonly"
        novalidate
        class="block w-full border rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        :class="inputClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        @keydown="handleKeydown"
        @invalid="handleInvalid"
      />

      <!-- Right Icon or Action -->
      <div 
        v-if="rightIcon || showPasswordToggle || isValid" 
        class="absolute inset-y-0 right-0 pr-3 flex items-center"
      >
        <!-- Password Toggle -->
        <button
          v-if="showPasswordToggle"
          type="button"
          class="text-gray-400 hover:text-gray-600 transition-colors"
          @click="togglePassword"
          :disabled="disabled"
        >
          <EyeIcon v-if="showPassword" class="h-5 w-5" />
          <EyeSlashIcon v-else class="h-5 w-5" />
        </button>

        <!-- Success Icon -->
        <CheckCircleIcon 
          v-else-if="isValid" 
          class="h-5 w-5 text-green-500" 
        />

        <!-- Custom Right Icon -->
        <component 
          v-else-if="rightIcon"
          :is="rightIcon" 
          class="h-5 w-5 text-gray-400" 
        />
      </div>
    </div>

    <!-- Helper Text -->
    <p 
      v-if="helperText || hasError" 
      class="text-sm"
      :class="{
        'text-gray-500 dark:text-gray-400': !hasError,
        'text-red-600 dark:text-red-400': hasError
      }"
    >
      {{ hasError ? errorMessage : helperText }}
    </p>

    <!-- Character Counter -->
    <div 
      v-if="showCounter && maxlength" 
      class="text-xs text-gray-500 dark:text-gray-400 text-right"
    >
      {{ (modelValue || '').length }} / {{ maxlength }}
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { 
  EyeIcon, 
  EyeSlashIcon, 
  CheckCircleIcon 
} from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
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
  autocomplete: {
    type: String,
    default: 'off'
  },
  maxlength: {
    type: Number,
    default: null
  },
  minlength: {
    type: Number,
    default: null
  },
  pattern: {
    type: String,
    default: ''
  },
  readonly: {
    type: Boolean,
    default: false
  },
  leftIcon: {
    type: [String, Object],
    default: null
  },
  rightIcon: {
    type: [String, Object],
    default: null
  },
  helperText: {
    type: String,
    default: ''
  },
  errorMessage: {
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
    validator: (value) => ['default', 'filled', 'outlined'].includes(value)
  },
  showPasswordToggle: {
    type: Boolean,
    default: false
  },
  showCounter: {
    type: Boolean,
    default: false
  },
  id: {
    type: String,
    default: () => `input-${Math.random().toString(36).substr(2, 9)}`
  }
})

// Emits
const emit = defineEmits([
  'update:modelValue',
  'blur',
  'focus',
  'keydown',
  'validation',
  'invalid'
])

// Reactive data
const showPassword = ref(false)
const isFocused = ref(false)

// Computed properties
const inputType = computed(() => {
  if (props.showPasswordToggle && props.type === 'password') {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})

const hasError = computed(() => {
  return !!props.errorMessage
})

const isValid = computed(() => {
  return !hasError.value && props.modelValue && props.modelValue.length > 0
})

const inputClasses = computed(() => {
  const baseClasses = [
    'border-gray-300 dark:border-gray-600',
    'bg-white dark:bg-gray-700',
    'text-gray-900 dark:text-white',
    'placeholder-gray-400 dark:placeholder-gray-500'
  ]

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-4 py-4 text-lg'
  }

  const paddingClasses = props.leftIcon ? 'pl-10' : 'pl-4'
  const rightPaddingClasses = (props.rightIcon || props.showPasswordToggle || isValid.value) ? 'pr-10' : 'pr-4'

  const stateClasses = []
  if (hasError.value) {
    stateClasses.push(
      'border-red-300 focus:ring-red-500 focus:border-red-500',
      'dark:border-red-600 dark:focus:ring-red-400 dark:focus:border-red-400'
    )
  } else if (isValid.value) {
    stateClasses.push(
      'border-green-300 focus:ring-green-500 focus:border-green-500',
      'dark:border-green-600 dark:focus:ring-green-400 dark:focus:border-green-400'
    )
  } else {
    stateClasses.push(
      'focus:ring-blue-500 focus:border-blue-500',
      'dark:focus:ring-blue-400 dark:focus:border-blue-400'
    )
  }

  return [
    ...baseClasses,
    sizeClasses[props.size],
    paddingClasses,
    rightPaddingClasses,
    ...stateClasses
  ]
})

// Methods
const handleInput = (event) => {
  const value = event.target.value
  emit('update:modelValue', value)
  
  // Emit validation event
  emit('validation', {
    value,
    isValid: !hasError.value && value.length > 0,
    hasError: hasError.value
  })
}

const handleBlur = (event) => {
  isFocused.value = false
  emit('blur', event)
}

const handleFocus = (event) => {
  isFocused.value = true
  emit('focus', event)
}

const handleKeydown = (event) => {
  emit('keydown', event)
}

const handleInvalid = (event) => {
  // Prevenir el mensaje de validación del navegador
  event.preventDefault()
  emit('invalid', event)
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}
</script>
