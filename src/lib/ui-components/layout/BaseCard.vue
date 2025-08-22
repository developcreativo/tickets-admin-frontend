<template>
  <div 
    :id="cardId"
    class="base-card"
    :class="[
      `base-card--${size}`,
      `base-card--${variant}`,
      `base-card--${elevation}`,
      { 
        'base-card--hoverable': hoverable,
        'base-card--loading': loading,
        'base-card--full-width': fullWidth
      }
    ]"
  >
    <!-- Loading Overlay -->
    <div v-if="loading" class="base-card-loading-overlay">
      <div class="base-card-loading-spinner">
        <svg class="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    </div>

    <!-- Header -->
    <div 
      v-if="showHeader"
      class="base-card-header"
      :class="[
        `base-card-header--${size}`,
        { 'base-card-header--bordered': headerBordered }
      ]"
    >
      <div class="base-card-header-content">
        <!-- Header Icon -->
        <div v-if="headerIcon" class="base-card-header-icon">
          <component :is="headerIcon" class="w-5 h-5" />
        </div>

        <!-- Header Text -->
        <div class="base-card-header-text">
          <h3 v-if="title" class="base-card-title">
            {{ title }}
          </h3>
          <p v-if="subtitle" class="base-card-subtitle">
            {{ subtitle }}
          </p>
        </div>
      </div>

      <!-- Header Actions -->
      <div v-if="showHeaderActions" class="base-card-header-actions">
        <slot name="header-actions">
          <BaseButton
            v-if="headerActionText"
            :variant="headerActionVariant"
            :size="headerActionSize"
            @click="handleHeaderAction"
          >
            {{ headerActionText }}
          </BaseButton>
        </slot>
      </div>
    </div>

    <!-- Image -->
    <div v-if="image" class="base-card-image">
      <img 
        :src="image" 
        :alt="imageAlt || title"
        class="base-card-image-element"
        :class="`base-card-image-element--${imagePosition}`"
      />
    </div>

    <!-- Body -->
    <div 
      class="base-card-body"
      :class="[
        `base-card-body--${size}`,
        { 'base-card-body--bordered': bodyBordered }
      ]"
    >
      <slot />
    </div>

    <!-- Footer -->
    <div 
      v-if="showFooter"
      class="base-card-footer"
      :class="[
        `base-card-footer--${size}`,
        { 'base-card-footer--bordered': footerBordered }
      ]"
    >
      <slot name="footer">
        <div v-if="footerText" class="base-card-footer-text">
          {{ footerText }}
        </div>
      </slot>
    </div>

    <!-- Expandable Content -->
    <div 
      v-if="expandable && isExpanded"
      class="base-card-expandable"
      :class="`base-card-expandable--${size}`"
    >
      <slot name="expandable" />
    </div>

    <!-- Expand/Collapse Button -->
    <div v-if="expandable" class="base-card-expand-button">
      <BaseButton
        :variant="expandButtonVariant"
        :size="expandButtonSize"
        @click="toggleExpanded"
      >
        <span>{{ isExpanded ? 'Ver menos' : 'Ver más' }}</span>
        <svg 
          class="w-4 h-4 ml-2 transition-transform duration-200"
          :class="{ 'rotate-180': isExpanded }"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BaseButton from '../forms/BaseButton.vue'

// Props
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'elevated', 'outlined', 'filled', 'minimal'].includes(value)
  },
  elevation: {
    type: String,
    default: 'md',
    validator: (value) => ['none', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  hoverable: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  showFooter: {
    type: Boolean,
    default: false
  },
  showHeaderActions: {
    type: Boolean,
    default: false
  },
  headerIcon: {
    type: [String, Object],
    default: null
  },
  headerActionText: {
    type: String,
    default: ''
  },
  headerActionVariant: {
    type: String,
    default: 'primary'
  },
  headerActionSize: {
    type: String,
    default: 'sm'
  },
  headerBordered: {
    type: Boolean,
    default: true
  },
  bodyBordered: {
    type: Boolean,
    default: false
  },
  footerBordered: {
    type: Boolean,
    default: true
  },
  image: {
    type: String,
    default: ''
  },
  imageAlt: {
    type: String,
    default: ''
  },
  imagePosition: {
    type: String,
    default: 'top',
    validator: (value) => ['top', 'bottom'].includes(value)
  },
  footerText: {
    type: String,
    default: ''
  },
  expandable: {
    type: Boolean,
    default: false
  },
  expandButtonVariant: {
    type: String,
    default: 'outline'
  },
  expandButtonSize: {
    type: String,
    default: 'sm'
  }
})

// Emits
const emit = defineEmits([
  'header-action-click',
  'expand',
  'collapse'
])

// Refs
const isExpanded = ref(false)

// Computed
const cardId = computed(() => `card_${Math.random().toString(36).substr(2, 9)}`)

// Methods
const handleHeaderAction = () => {
  emit('header-action-click')
}

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
  
  if (isExpanded.value) {
    emit('expand')
  } else {
    emit('collapse')
  }
}

// Expose methods for parent components
defineExpose({
  expand: () => {
    isExpanded.value = true
    emit('expand')
  },
  collapse: () => {
    isExpanded.value = false
    emit('collapse')
  },
  toggle: toggleExpanded
})
</script>

<style scoped>
.base-card {
  @apply relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden;
  @apply transition-all duration-200 ease-in-out;
}

.base-card--sm {
  @apply text-sm;
}

.base-card--md {
  @apply text-base;
}

.base-card--lg {
  @apply text-lg;
}

.base-card--xl {
  @apply text-xl;
}

/* Variants */
.base-card--default {
  @apply border border-gray-200 dark:border-gray-700;
}

.base-card--elevated {
  @apply border-0;
}

.base-card--outlined {
  @apply border-2 border-gray-200 dark:border-gray-700 bg-transparent;
}

.base-card--filled {
  @apply border-0 bg-gray-50 dark:bg-gray-900;
}

.base-card--minimal {
  @apply border-0 bg-transparent;
}

/* Elevations */
.base-card--elevation-none {
  @apply shadow-none;
}

.base-card--elevation-sm {
  @apply shadow-sm;
}

.base-card--elevation-md {
  @apply shadow-md;
}

.base-card--elevation-lg {
  @apply shadow-lg;
}

.base-card--elevation-xl {
  @apply shadow-xl;
}

.base-card--hoverable:hover {
  @apply transform -translate-y-1 shadow-lg;
}

.base-card--loading {
  @apply pointer-events-none;
}

.base-card--full-width {
  @apply w-full;
}

/* Loading Overlay */
.base-card-loading-overlay {
  @apply absolute inset-0 bg-white/80 dark:bg-gray-800/80 flex items-center justify-center;
  @apply z-10;
}

.base-card-loading-spinner {
  @apply text-blue-600 dark:text-blue-400;
}

/* Header */
.base-card-header {
  @apply flex items-center justify-between p-4;
}

.base-card-header--sm { @apply p-3; }
.base-card-header--md { @apply p-4; }
.base-card-header--lg { @apply p-5; }
.base-card-header--xl { @apply p-6; }

.base-card-header--bordered {
  @apply border-b border-gray-200 dark:border-gray-700;
}

.base-card-header-content {
  @apply flex items-center flex-1;
}

.base-card-header-icon {
  @apply mr-3 text-gray-500 dark:text-gray-400;
}

.base-card-header-text {
  @apply flex-1;
}

.base-card-title {
  @apply text-lg font-semibold text-gray-900 dark:text-white;
}

.base-card-subtitle {
  @apply text-sm text-gray-500 dark:text-gray-400 mt-1;
}

.base-card-header-actions {
  @apply flex-shrink-0 ml-4;
}

/* Image */
.base-card-image {
  @apply relative;
}

.base-card-image-element {
  @apply w-full h-auto object-cover;
}

.base-card-image-element--top {
  @apply order-first;
}

.base-card-image-element--bottom {
  @apply order-last;
}

/* Body */
.base-card-body {
  @apply p-4;
}

.base-card-body--sm { @apply p-3; }
.base-card-body--md { @apply p-4; }
.base-card-body--lg { @apply p-5; }
.base-card-body--xl { @apply p-6; }

.base-card-body--bordered {
  @apply border-t border-b border-gray-200 dark:border-gray-700;
}

/* Footer */
.base-card-footer {
  @apply flex items-center justify-between p-4;
}

.base-card-footer--sm { @apply p-3; }
.base-card-footer--md { @apply p-4; }
.base-card-footer--lg { @apply p-5; }
.base-card-footer--xl { @apply p-6; }

.base-card-footer--bordered {
  @apply border-t border-gray-200 dark:border-gray-700;
}

.base-card-footer-text {
  @apply text-sm text-gray-500 dark:text-gray-400;
}

/* Expandable */
.base-card-expandable {
  @apply p-4 border-t border-gray-200 dark:border-gray-700;
}

.base-card-expandable--sm { @apply p-3; }
.base-card-expandable--md { @apply p-4; }
.base-card-expandable--lg { @apply p-5; }
.base-card-expandable--xl { @apply p-6; }

.base-card-expand-button {
  @apply flex justify-center p-4 border-t border-gray-200 dark:border-gray-700;
}

/* Responsive */
@media (max-width: 640px) {
  .base-card-header {
    @apply flex-col items-start space-y-3;
  }
  
  .base-card-header-actions {
    @apply ml-0 w-full;
  }
  
  .base-card-footer {
    @apply flex-col items-start space-y-3;
  }
}

/* Transitions */
.base-card,
.base-card-header,
.base-card-body,
.base-card-footer {
  @apply transition-all duration-200 ease-in-out;
}

/* Focus states */
.base-card:focus-within {
  @apply ring-2 ring-blue-500 ring-opacity-50;
}
</style>
