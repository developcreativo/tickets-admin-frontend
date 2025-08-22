import BaseButton from './BaseButton.vue'

export default {
  title: 'Forms/BaseButton',
  component: BaseButton,
  parameters: {
    docs: {
      description: {
        component: 'Componente de botón reutilizable con múltiples variantes, tamaños y estados.'
      }
    }
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'outline', 'ghost', 'link'],
      description: 'Variante visual del botón'
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Tamaño del botón'
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Estado deshabilitado'
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Estado de carga con spinner'
    },
    fullWidth: {
      control: { type: 'boolean' },
      description: 'Ancho completo del contenedor'
    },
    icon: {
      control: { type: 'text' },
      description: 'Icono SVG como string'
    },
    iconPosition: {
      control: { type: 'select' },
      options: ['left', 'right'],
      description: 'Posición del icono'
    },
    onClick: {
      action: 'clicked',
      description: 'Evento de clic'
    }
  },
  args: {
    label: 'Botón de ejemplo',
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    fullWidth: false,
    icon: '',
    iconPosition: 'left'
  }
}

// Historia básica
export const Default = {
  args: {
    label: 'Botón Primario'
  }
}

// Historia con diferentes variantes
export const Variants = {
  render: (args) => ({
    components: { BaseButton },
    setup() {
      return { args }
    },
    template: `
      <div class="space-y-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <BaseButton v-bind="args" variant="primary" label="Primary" />
          <BaseButton v-bind="args" variant="secondary" label="Secondary" />
          <BaseButton v-bind="args" variant="success" label="Success" />
          <BaseButton v-bind="args" variant="danger" label="Danger" />
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <BaseButton v-bind="args" variant="warning" label="Warning" />
          <BaseButton v-bind="args" variant="info" label="Info" />
          <BaseButton v-bind="args" variant="outline" label="Outline" />
          <BaseButton v-bind="args" variant="ghost" label="Ghost" />
        </div>
      </div>
    `
  }),
  args: {
    size: 'md'
  }
}

// Historia con diferentes tamaños
export const Sizes = {
  render: (args) => ({
    components: { BaseButton },
    setup() {
      return { args }
    },
    template: `
      <div class="flex items-center space-x-4">
        <BaseButton v-bind="args" size="xs" label="Extra Small" />
        <BaseButton v-bind="args" size="sm" label="Small" />
        <BaseButton v-bind="args" size="md" label="Medium" />
        <BaseButton v-bind="args" size="lg" label="Large" />
        <BaseButton v-bind="args" size="xl" label="Extra Large" />
      </div>
    `
  }),
  args: {
    variant: 'primary'
  }
}

// Historia con iconos
export const WithIcons = {
  render: (args) => ({
    components: { BaseButton },
    setup() {
      return { args }
    },
    template: `
      <div class="space-y-4">
        <div class="flex items-center space-x-4">
          <BaseButton 
            v-bind="args" 
            label="Guardar" 
            icon="<svg class='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7'/></svg>"
            iconPosition="left"
          />
          <BaseButton 
            v-bind="args" 
            label="Descargar" 
            icon="<svg class='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'/></svg>"
            iconPosition="right"
          />
        </div>
        <div class="flex items-center space-x-4">
          <BaseButton 
            v-bind="args" 
            label="" 
            icon="<svg class='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 6v6m0 0v6m0-6h6m-6 0H6'/></svg>"
            size="sm"
          />
          <BaseButton 
            v-bind="args" 
            label="" 
            icon="<svg class='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'/></svg>"
            variant="danger"
            size="sm"
          />
        </div>
      </div>
    `
  }),
  args: {
    variant: 'primary',
    size: 'md'
  }
}

// Historia con estados
export const States = {
  render: (args) => ({
    components: { BaseButton },
    setup() {
      return { args }
    },
    template: `
      <div class="space-y-4">
        <div class="flex items-center space-x-4">
          <BaseButton v-bind="args" label="Normal" />
          <BaseButton v-bind="args" label="Loading" :loading="true" />
          <BaseButton v-bind="args" label="Disabled" :disabled="true" />
        </div>
        <div class="flex items-center space-x-4">
          <BaseButton v-bind="args" label="Full Width" :fullWidth="true" />
        </div>
      </div>
    `
  }),
  args: {
    variant: 'primary',
    size: 'md'
  }
}

// Historia interactiva
export const Interactive = {
  render: (args) => ({
    components: { BaseButton },
    setup() {
      const handleClick = () => {
        console.log('Botón clickeado!')
      }
      return { args, handleClick }
    },
    template: `
      <div class="space-y-4">
        <BaseButton 
          v-bind="args" 
          label="Click me!" 
          @click="handleClick"
        />
        <p class="text-sm text-gray-600">
          Abre la consola del navegador para ver el log del clic.
        </p>
      </div>
    `
  }),
  args: {
    variant: 'primary',
    size: 'md'
  }
}

// Historia de accesibilidad
export const Accessibility = {
  render: (args) => ({
    components: { BaseButton },
    setup() {
      return { args }
    },
    template: `
      <div class="space-y-4">
        <BaseButton 
          v-bind="args" 
          label="Botón accesible" 
          aria-label="Botón para realizar acción principal"
        />
        <BaseButton 
          v-bind="args" 
          label="Botón con descripción" 
          aria-describedby="button-description"
        />
        <p id="button-description" class="text-sm text-gray-600">
          Este botón realiza una acción específica cuando se hace clic.
        </p>
      </div>
    `
  }),
  args: {
    variant: 'primary',
    size: 'md'
  }
}
