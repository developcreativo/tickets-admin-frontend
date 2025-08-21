<template>
  <div class="flex items-center space-x-2">
    <!-- Botón Ver -->
    <button 
      v-if="showView"
      @click="$emit('view')"
      class="inline-flex items-center p-2 text-sm font-medium text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
      :title="viewTitle || 'Ver'"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    </button>
    
    <!-- Botón Editar -->
    <button 
      v-if="showEdit"
      @click="$emit('edit')"
      class="inline-flex items-center p-2 text-sm font-medium text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
      :title="editTitle || 'Editar'"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    </button>
    
    <!-- Botón Activar/Desactivar -->
    <button 
      v-if="showToggle"
      @click="$emit('toggle')"
      :class="[
        'inline-flex items-center p-2 text-sm font-medium rounded-lg transition-colors duration-200',
        isActive 
          ? 'text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100' 
          : 'text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100'
      ]"
      :title="isActive ? (toggleTitle || 'Desactivar') : (toggleTitle || 'Activar')"
    >
      <svg v-if="isActive" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
      <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
    </button>
    
    <!-- Botón Eliminar -->
    <button 
      v-if="showDelete"
      @click="$emit('delete')"
      class="inline-flex items-center p-2 text-sm font-medium text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200"
      :title="deleteTitle || 'Eliminar'"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
    
    <!-- Botón Personalizado -->
    <button 
      v-if="showCustom"
      @click="$emit('custom')"
      :class="[
        'inline-flex items-center p-2 text-sm font-medium rounded-lg transition-colors duration-200',
        customClass || 'text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100'
      ]"
      :title="customTitle"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="customIcon" />
      </svg>
    </button>
  </div>
</template>

<script setup>
defineProps({
  showView: { type: Boolean, default: false },
  showEdit: { type: Boolean, default: false },
  showToggle: { type: Boolean, default: false },
  showDelete: { type: Boolean, default: false },
  showCustom: { type: Boolean, default: false },
  isActive: { type: Boolean, default: false },
  viewTitle: { type: String, default: '' },
  editTitle: { type: String, default: '' },
  toggleTitle: { type: String, default: '' },
  deleteTitle: { type: String, default: '' },
  customTitle: { type: String, default: '' },
  customClass: { type: String, default: '' },
  customIcon: { type: String, default: 'M13 10V3L4 14h7v7l9-11h-7z' }
})

defineEmits(['view', 'edit', 'toggle', 'delete', 'custom'])
</script>
