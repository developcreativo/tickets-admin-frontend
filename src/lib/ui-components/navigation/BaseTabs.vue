<template>
  <div class="base-tabs-wrapper">
    <!-- Tabs Navigation -->
    <div class="base-tabs-nav" :class="`base-tabs-nav--${variant}`">
      <div 
        v-for="(tab, index) in tabs" 
        :key="tab.id || index"
        :id="`tab-${tab.id || index}`"
        role="tab"
        :aria-selected="activeTab === (tab.id || index)"
        :aria-controls="`panel-${tab.id || index}`"
        class="base-tabs-tab"
        :class="[
          `base-tabs-tab--${size}`,
          `base-tabs-tab--${variant}`,
          { 
            'base-tabs-tab--active': activeTab === (tab.id || index),
            'base-tabs-tab--disabled': tab.disabled
          }
        ]"
        @click="handleTabClick(tab.id || index)"
        @keydown="handleTabKeydown"
      >
        <!-- Tab Icon -->
        <component 
          v-if="tab.icon" 
          :is="tab.icon" 
          class="base-tabs-tab-icon"
          :class="`base-tabs-tab-icon--${size}`"
        />
        
        <!-- Tab Label -->
        <span class="base-tabs-tab-label">
          {{ tab.label }}
        </span>
        
        <!-- Tab Badge -->
        <span 
          v-if="tab.badge" 
          class="base-tabs-tab-badge"
          :class="`base-tabs-tab-badge--${tab.badgeVariant || 'default'}`"
        >
          {{ tab.badge }}
        </span>
        
        <!-- Tab Close Button (for closable tabs) -->
        <button
          v-if="tab.closable"
          type="button"
          class="base-tabs-tab-close"
          :aria-label="`Cerrar pestaña ${tab.label}`"
          @click.stop="handleTabClose(tab.id || index)"
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Tab Indicator -->
      <div 
        v-if="variant !== 'minimal'"
        class="base-tabs-indicator"
        :class="`base-tabs-indicator--${variant}`"
        :style="indicatorStyle"
      ></div>
    </div>

    <!-- Tab Panels -->
    <div class="base-tabs-panels">
      <div
        v-for="(tab, index) in tabs"
        :key="tab.id || index"
        :id="`panel-${tab.id || index}`"
        role="tabpanel"
        :aria-labelledby="`tab-${tab.id || index}`"
        class="base-tabs-panel"
        :class="[
          `base-tabs-panel--${size}`,
          { 'base-tabs-panel--active': activeTab === (tab.id || index) }
        ]"
      >
        <slot 
          :name="tab.id || index" 
          :tab="tab" 
          :isActive="activeTab === (tab.id || index)"
        >
          {{ tab.content }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'

// Props
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: null
  },
  tabs: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(tab => 
        typeof tab === 'object' && 
        'label' in tab
      )
    }
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'pills', 'underline', 'cards', 'minimal'].includes(value)
  },
  vertical: {
    type: Boolean,
    default: false
  },
  lazy: {
    type: Boolean,
    default: false
  },
  closable: {
    type: Boolean,
    default: false
  },
  addable: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits([
  'update:modelValue',
  'tab-change',
  'tab-close',
  'tab-add'
])

// Refs
const activeTab = ref(props.modelValue || (props.tabs[0]?.id || 0))
const tabRefs = ref({})

// Computed
const indicatorStyle = computed(() => {
  if (props.vertical || !tabRefs.value[activeTab.value]) return {}
  
  const activeTabElement = tabRefs.value[activeTab.value]
  if (!activeTabElement) return {}
  
  const rect = activeTabElement.getBoundingClientRect()
  const parentRect = activeTabElement.parentElement.getBoundingClientRect()
  
  if (props.variant === 'underline') {
    return {
      left: `${rect.left - parentRect.left}px`,
      width: `${rect.width}px`
    }
  }
  
  return {
    transform: `translateX(${rect.left - parentRect.left}px)`,
    width: `${rect.width}px`
  }
})

// Methods
const handleTabClick = (tabId) => {
  const tab = props.tabs.find(t => (t.id || props.tabs.indexOf(t)) === tabId)
  
  if (tab?.disabled) return
  
  activeTab.value = tabId
  emit('update:modelValue', tabId)
  emit('tab-change', { tabId, tab })
}

const handleTabKeydown = (event) => {
  const currentIndex = props.tabs.findIndex(t => (t.id || props.tabs.indexOf(t)) === activeTab.value)
  
  switch (event.key) {
    case 'ArrowLeft':
    case 'ArrowUp':
      event.preventDefault()
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : props.tabs.length - 1
      handleTabClick(props.tabs[prevIndex]?.id || prevIndex)
      break
      
    case 'ArrowRight':
    case 'ArrowDown':
      event.preventDefault()
      const nextIndex = currentIndex < props.tabs.length - 1 ? currentIndex + 1 : 0
      handleTabClick(props.tabs[nextIndex]?.id || nextIndex)
      break
      
    case 'Home':
      event.preventDefault()
      handleTabClick(props.tabs[0]?.id || 0)
      break
      
    case 'End':
      event.preventDefault()
      handleTabClick(props.tabs[props.tabs.length - 1]?.id || props.tabs.length - 1)
      break
  }
}

const handleTabClose = (tabId) => {
  emit('tab-close', { tabId })
  
  // Si se cierra la pestaña activa, cambiar a la anterior
  if (activeTab.value === tabId) {
    const currentIndex = props.tabs.findIndex(t => (t.id || props.tabs.indexOf(t)) === tabId)
    const newIndex = currentIndex > 0 ? currentIndex - 1 : currentIndex + 1
    if (newIndex >= 0 && newIndex < props.tabs.length) {
      handleTabClick(props.tabs[newIndex]?.id || newIndex)
    }
  }
}

const addTab = () => {
  emit('tab-add')
}

// Watchers
watch(() => props.modelValue, (newValue) => {
  if (newValue !== activeTab.value) {
    activeTab.value = newValue
  }
})

watch(() => props.tabs, (newTabs) => {
  // Si la pestaña activa ya no existe, cambiar a la primera disponible
  if (newTabs.length > 0 && !newTabs.find(t => (t.id || newTabs.indexOf(t)) === activeTab.value)) {
    activeTab.value = newTabs[0]?.id || 0
    emit('update:modelValue', activeTab.value)
  }
}, { deep: true })

// Expose methods for parent components
defineExpose({
  setActiveTab: (tabId) => handleTabClick(tabId),
  getActiveTab: () => activeTab.value,
  addTab,
  closeTab: handleTabClose
})
</script>

<style scoped>
.base-tabs-wrapper {
  @apply w-full;
}

.base-tabs-nav {
  @apply relative flex border-b border-gray-200 dark:border-gray-700;
}

.base-tabs-nav--vertical {
  @apply flex-col border-b-0 border-r border-gray-200 dark:border-gray-700;
}

.base-tabs-nav--pills {
  @apply border-b-0 space-x-1;
}

.base-tabs-nav--underline {
  @apply border-b-2 border-gray-200 dark:border-gray-700;
}

.base-tabs-nav--cards {
  @apply border-b-0 space-x-1;
}

.base-tabs-nav--minimal {
  @apply border-b-0;
}

.base-tabs-tab {
  @apply relative flex items-center px-4 py-2 text-sm font-medium cursor-pointer;
  @apply text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300;
  @apply transition-all duration-200 ease-in-out;
}

.base-tabs-tab--sm {
  @apply px-3 py-1.5 text-xs;
}

.base-tabs-tab--md {
  @apply px-4 py-2 text-sm;
}

.base-tabs-tab--lg {
  @apply px-5 py-3 text-base;
}

.base-tabs-tab--active {
  @apply text-blue-600 dark:text-blue-400;
}

.base-tabs-tab--disabled {
  @apply cursor-not-allowed opacity-50;
}

/* Variant styles */
.base-tabs-nav--default .base-tabs-tab--active {
  @apply text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400;
}

.base-tabs-nav--pills .base-tabs-tab {
  @apply rounded-lg;
}

.base-tabs-nav--pills .base-tabs-tab--active {
  @apply bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300;
}

.base-tabs-nav--underline .base-tabs-tab--active {
  @apply text-blue-600 dark:text-blue-400;
}

.base-tabs-nav--cards .base-tabs-tab {
  @apply rounded-t-lg border border-gray-200 dark:border-gray-700;
}

.base-tabs-nav--cards .base-tabs-tab--active {
  @apply bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400;
  @apply border-b-white dark:border-b-gray-800;
}

.base-tabs-nav--minimal .base-tabs-tab--active {
  @apply text-blue-600 dark:text-blue-400 font-semibold;
}

.base-tabs-tab-icon {
  @apply mr-2;
}

.base-tabs-tab-icon--sm { @apply w-3 h-3; }
.base-tabs-tab-icon--md { @apply w-4 h-4; }
.base-tabs-tab-icon--lg { @apply w-5 h-5; }

.base-tabs-tab-label {
  @apply whitespace-nowrap;
}

.base-tabs-tab-badge {
  @apply ml-2 px-2 py-0.5 text-xs font-medium rounded-full;
}

.base-tabs-tab-badge--default {
  @apply bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200;
}

.base-tabs-tab-badge--primary {
  @apply bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200;
}

.base-tabs-tab-badge--success {
  @apply bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200;
}

.base-tabs-tab-badge--warning {
  @apply bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200;
}

.base-tabs-tab-badge--error {
  @apply bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200;
}

.base-tabs-tab-close {
  @apply ml-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700;
  @apply text-gray-400 hover:text-gray-600 dark:hover:text-gray-300;
  @apply transition-colors duration-200;
}

.base-tabs-indicator {
  @apply absolute bottom-0 h-0.5 bg-blue-600 dark:bg-blue-400;
  @apply transition-all duration-300 ease-in-out;
}

.base-tabs-indicator--pills {
  @apply hidden;
}

.base-tabs-indicator--underline {
  @apply h-0.5;
}

.base-tabs-indicator--cards {
  @apply hidden;
}

.base-tabs-indicator--minimal {
  @apply hidden;
}

.base-tabs-panels {
  @apply mt-4;
}

.base-tabs-panel {
  @apply hidden;
}

.base-tabs-panel--active {
  @apply block;
}

.base-tabs-panel--sm {
  @apply text-sm;
}

.base-tabs-panel--md {
  @apply text-base;
}

.base-tabs-panel--lg {
  @apply text-lg;
}

/* Vertical tabs */
.base-tabs-nav--vertical .base-tabs-tab {
  @apply border-r-2 border-transparent;
}

.base-tabs-nav--vertical .base-tabs-tab--active {
  @apply border-r-blue-600 dark:border-r-blue-400;
}

.base-tabs-nav--vertical .base-tabs-indicator {
  @apply right-0 top-0 w-0.5 h-auto;
}

/* Responsive */
@media (max-width: 640px) {
  .base-tabs-nav {
    @apply flex-wrap;
  }
  
  .base-tabs-tab {
    @apply flex-1 justify-center;
  }
}

/* Transitions */
.base-tabs-tab,
.base-tabs-indicator {
  @apply transition-all duration-200 ease-in-out;
}

/* Focus states */
.base-tabs-tab:focus {
  @apply outline-none ring-2 ring-blue-500 ring-opacity-50;
}

.base-tabs-tab-close:focus {
  @apply outline-none ring-2 ring-blue-500 ring-opacity-50;
}
</style>
