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
      <!-- Select nativo para accesibilidad -->
      <select
        :id="id"
        :value="modelValue"
        :disabled="disabled"
        :multiple="multiple"
        :size="multiple ? 4 : undefined"
        class="sr-only"
        @change="handleNativeChange"
      >
        <option v-if="placeholder && !multiple" value="">{{ placeholder }}</option>
        <option 
          v-for="option in options" 
          :key="option.value" 
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>
      
      <!-- Select personalizado -->
      <div 
        class="relative cursor-pointer"
        :class="{ 'opacity-50 cursor-not-allowed': disabled }"
        @click="toggleDropdown"
      >
        <!-- Campo de búsqueda para opciones múltiples -->
        <input
          v-if="multiple && searchable"
          v-model="searchQuery"
          type="text"
          :placeholder="searchPlaceholder"
          class="w-full px-3 py-2 border rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          :class="inputClasses"
          @click.stop
          @input="handleSearch"
        />
        
        <!-- Campo de visualización para selección única -->
        <div 
          v-else
          class="w-full px-3 py-2 border rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-between"
          :class="inputClasses"
        >
          <span class="truncate">
            {{ displayValue || placeholder || 'Seleccionar opción' }}
          </span>
          <svg 
            class="w-5 h-5 text-gray-400 transition-transform duration-200"
            :class="{ 'rotate-180': isOpen }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        <!-- Dropdown de opciones -->
        <div 
          v-if="isOpen"
          class="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto"
        >
          <div class="py-1">
            <!-- Opción placeholder -->
            <div 
              v-if="placeholder && !multiple"
              class="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              @click="selectOption({ value: '', label: placeholder })"
            >
              {{ placeholder }}
            </div>
            
            <!-- Opciones filtradas -->
            <div 
              v-for="option in filteredOptions" 
              :key="option.value"
              class="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-150"
              :class="{
                'bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100': isSelected(option),
                'text-gray-900 dark:text-gray-100': !option.disabled,
                'text-gray-400 dark:text-gray-500 cursor-not-allowed': option.disabled
              }"
              @click="!option.disabled && selectOption(option)"
            >
              <div class="flex items-center">
                <!-- Checkbox para selección múltiple -->
                <div v-if="multiple" class="mr-2">
                  <input 
                    type="checkbox" 
                    :checked="isSelected(option)"
                    :disabled="option.disabled"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    @click.stop
                    @change="toggleOption(option)"
                  />
                </div>
                
                <!-- Icono de la opción -->
                <component 
                  v-if="option.icon" 
                  :is="option.icon" 
                  class="w-4 h-4 mr-2 text-gray-400"
                />
                
                <!-- Texto de la opción -->
                <span class="truncate">{{ option.label }}</span>
                
                <!-- Badge para opciones múltiples -->
                <span 
                  v-if="multiple && option.badge" 
                  class="ml-auto px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
                >
                  {{ option.badge }}
                </span>
              </div>
            </div>
            
            <!-- Mensaje de no hay resultados -->
            <div 
              v-if="filteredOptions.length === 0"
              class="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 text-center"
            >
              No se encontraron resultados
            </div>
          </div>
        </div>
      </div>
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
    
    <!-- Tags para selección múltiple -->
    <div v-if="multiple && selectedOptions.length > 0" class="mt-2 flex flex-wrap gap-2">
      <span 
        v-for="option in selectedOptions" 
        :key="option.value"
        class="inline-flex items-center px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-full"
      >
        {{ option.label }}
        <button
          type="button"
          @click="removeOption(option)"
          class="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number, Array], default: () => [] },
  options: { type: Array, default: () => [] },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  id: { type: String, default: '' },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  multiple: { type: Boolean, default: false },
  searchable: { type: Boolean, default: false },
  searchPlaceholder: { type: String, default: 'Buscar...' },
  helpText: { type: String, default: '' },
  errorMessage: { type: String, default: '' },
  size: { type: String, default: 'md', validator: value => ['sm', 'md', 'lg'].includes(value) },
  variant: { type: String, default: 'default', validator: value => ['default', 'filled', 'outlined'].includes(value) }
})

const emit = defineEmits(['update:modelValue', 'change', 'search'])

const isOpen = ref(false)
const searchQuery = ref('')

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
    props.disabled && 'bg-gray-100 text-gray-500 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400'
  ].filter(Boolean).join(' ')
})

const selectedOptions = computed(() => {
  if (!props.multiple) return []
  if (Array.isArray(props.modelValue)) {
    return props.options.filter(option => props.modelValue.includes(option.value))
  }
  return []
})

const displayValue = computed(() => {
  if (props.multiple) return ''
  const option = props.options.find(opt => opt.value === props.modelValue)
  return option ? option.label : ''
})

const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value) return props.options
  
  const query = searchQuery.value.toLowerCase()
  return props.options.filter(option => 
    option.label.toLowerCase().includes(query) ||
    (option.value && option.value.toString().toLowerCase().includes(query))
  )
})

const isSelected = (option) => {
  if (props.multiple) {
    return Array.isArray(props.modelValue) && props.modelValue.includes(option.value)
  }
  return props.modelValue === option.value
}

const toggleDropdown = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
}

const selectOption = (option) => {
  if (props.disabled || option.disabled) return
  
  if (props.multiple) {
    const newValue = [...(props.modelValue || [])]
    const index = newValue.indexOf(option.value)
    
    if (index > -1) {
      newValue.splice(index, 1)
    } else {
      newValue.push(option.value)
    }
    
    emit('update:modelValue', newValue)
    emit('change', newValue)
  } else {
    emit('update:modelValue', option.value)
    emit('change', option.value)
    isOpen.value = false
  }
}

const toggleOption = (option) => {
  if (props.disabled || option.disabled) return
  selectOption(option)
}

const removeOption = (option) => {
  if (props.disabled) return
  
  const newValue = props.modelValue.filter(value => value !== option.value)
  emit('update:modelValue', newValue)
  emit('change', newValue)
}

const handleSearch = (event) => {
  searchQuery.value = event.target.value
  emit('search', searchQuery.value)
}

const handleNativeChange = (event) => {
  if (props.multiple) {
    const selectedOptions = Array.from(event.target.selectedOptions).map(option => option.value)
    emit('update:modelValue', selectedOptions)
    emit('change', selectedOptions)
  } else {
    emit('update:modelValue', event.target.value)
    emit('change', event.target.value)
  }
}

const closeDropdown = (event) => {
  if (!event.target.closest('.form-field')) {
    isOpen.value = false
  }
}

// Cerrar dropdown al hacer clic fuera
onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})

// Cerrar dropdown al cambiar el valor
watch(() => props.modelValue, () => {
  if (!props.multiple) {
    isOpen.value = false
  }
})
</script>

<style scoped>
.form-field {
  @apply w-full;
}

/* Scrollbar personalizado para el dropdown */
.overflow-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.dark .overflow-auto::-webkit-scrollbar-track {
  background: #374151;
}

.dark .overflow-auto::-webkit-scrollbar-thumb {
  background: #6b7280;
}

.dark .overflow-auto::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
