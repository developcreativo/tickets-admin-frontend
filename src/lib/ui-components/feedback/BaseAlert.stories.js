import BaseAlert from './BaseAlert.vue'

export default {
    title: 'Feedback/BaseAlert',
    component: BaseAlert,
    parameters: {
        docs: {
            description: {
                component: 'Componente de alerta para mostrar mensajes informativos, de éxito, advertencia o error.'
            }
        }
    },
    argTypes: {
        type: {
            control: { type: 'select' },
            options: ['info', 'success', 'warning', 'error'],
            description: 'Tipo de alerta'
        },
        size: {
            control: { type: 'select' },
            options: ['sm', 'md', 'lg'],
            description: 'Tamaño de la alerta'
        },
        variant: {
            control: { type: 'select' },
            options: ['default', 'outlined', 'filled', 'minimal'],
            description: 'Variante visual'
        },
        dismissible: {
            control: { type: 'boolean' },
            description: 'Permite cerrar la alerta'
        },
        showIcon: {
            control: { type: 'boolean' },
            description: 'Mostrar icono'
        },
        showActions: {
            control: { type: 'boolean' },
            description: 'Mostrar botones de acción'
        },
        actionButtonText: {
            control: { type: 'text' },
            description: 'Texto del botón de acción'
        },
        actionButtonVariant: {
            control: { type: 'select' },
            options: ['primary', 'secondary', 'success', 'danger', 'warning', 'info'],
            description: 'Variante del botón de acción'
        },
        autoClose: {
            control: { type: 'number' },
            description: 'Auto-cierre en milisegundos'
        },
        onClose: {
            action: 'closed',
            description: 'Evento al cerrar'
        },
        onActionClick: {
            action: 'action-clicked',
            description: 'Evento al hacer clic en acción'
        }
    },
    args: {
        title: 'Título de la alerta',
        message: 'Este es un mensaje de ejemplo para la alerta.',
        type: 'info',
        size: 'md',
        variant: 'default',
        dismissible: false,
        showIcon: true,
        showActions: false,
        actionButtonText: 'Acción',
        actionButtonVariant: 'primary',
        autoClose: false
    }
}

// Historia básica
export const Default = {
    args: {
        title: 'Información',
        message: 'Esta es una alerta informativa básica.'
    }
}

// Historia con diferentes tipos
export const Types = {
    render: (args) => ({
        components: { BaseAlert },
        setup() {
            return { args }
        },
        template: `
      <div class="space-y-4">
        <BaseAlert 
          v-bind="args" 
          type="info"
          title="Información"
          message="Esta es una alerta informativa."
        />
        <BaseAlert 
          v-bind="args" 
          type="success"
          title="¡Éxito!"
          message="La operación se completó correctamente."
        />
        <BaseAlert 
          v-bind="args" 
          type="warning"
          title="Advertencia"
          message="Ten cuidado con esta acción."
        />
        <BaseAlert 
          v-bind="args" 
          type="error"
          title="Error"
          message="Ocurrió un error inesperado."
        />
      </div>
    `
    }),
    args: {
        size: 'md',
        variant: 'default',
        showIcon: true
    }
}

// Historia con diferentes variantes
export const Variants = {
    render: (args) => ({
        components: { BaseAlert },
        setup() {
            return { args }
        },
        template: `
      <div class="space-y-4">
        <BaseAlert 
          v-bind="args" 
          variant="default"
          title="Default"
          message="Variante por defecto con borde y fondo."
        />
        <BaseAlert 
          v-bind="args" 
          variant="outlined"
          title="Outlined"
          message="Variante con solo borde, sin fondo."
        />
        <BaseAlert 
          v-bind="args" 
          variant="filled"
          title="Filled"
          message="Variante con fondo sólido."
        />
        <BaseAlert 
          v-bind="args" 
          variant="minimal"
          title="Minimal"
          message="Variante minimalista con solo borde izquierdo."
        />
      </div>
    `
    }),
    args: {
        type: 'info',
        size: 'md',
        showIcon: true
    }
}

// Historia con diferentes tamaños
export const Sizes = {
    render: (args) => ({
        components: { BaseAlert },
        setup() {
            return { args }
        },
        template: `
      <div class="space-y-4">
        <BaseAlert 
          v-bind="args" 
          size="sm"
          title="Small"
          message="Alerta de tamaño pequeño."
        />
        <BaseAlert 
          v-bind="args" 
          size="md"
          title="Medium"
          message="Alerta de tamaño mediano."
        />
        <BaseAlert 
          v-bind="args" 
          size="lg"
          title="Large"
          message="Alerta de tamaño grande."
        />
      </div>
    `
    }),
    args: {
        type: 'info',
        variant: 'default',
        showIcon: true
    }
}

// Historia con acciones
export const WithActions = {
    render: (args) => ({
        components: { BaseAlert },
        setup() {
            return { args }
        },
        template: `
      <div class="space-y-4">
        <BaseAlert 
          v-bind="args" 
          type="info"
          title="Actualización disponible"
          message="Hay una nueva versión disponible. ¿Deseas actualizar ahora?"
          :showActions="true"
          actionButtonText="Actualizar"
          actionButtonVariant="primary"
        />
        <BaseAlert 
          v-bind="args" 
          type="warning"
          title="Acción requerida"
          message="Necesitas completar tu perfil para continuar."
          :showActions="true"
          actionButtonText="Completar perfil"
          actionButtonVariant="warning"
        />
        <BaseAlert 
          v-bind="args" 
          type="error"
          title="Error de conexión"
          message="No se pudo conectar al servidor. Inténtalo de nuevo."
          :showActions="true"
          actionButtonText="Reintentar"
          actionButtonVariant="danger"
        />
      </div>
    `
    }),
    args: {
        size: 'md',
        variant: 'default',
        showIcon: true
    }
}

// Historia con auto-cierre
export const AutoClose = {
    render: (args) => ({
        components: { BaseAlert },
        setup() {
            return { args }
        },
        template: `
      <div class="space-y-4">
        <BaseAlert 
          v-bind="args" 
          type="success"
          title="Guardado automático"
          message="Los cambios se guardaron automáticamente."
          :autoClose="3000"
        />
        <BaseAlert 
          v-bind="args" 
          type="info"
          title="Sesión activa"
          message="Tu sesión permanecerá activa por 30 minutos."
          :autoClose="5000"
        />
      </div>
    `
    }),
    args: {
        size: 'md',
        variant: 'default',
        showIcon: true
    }
}

// Historia con contenido personalizado
export const CustomContent = {
    render: (args) => ({
        components: { BaseAlert },
        setup() {
            return { args }
        },
        template: `
      <div class="space-y-4">
        <BaseAlert 
          v-bind="args" 
          type="info"
          title="Lista de cambios"
        >
          <ul class="mt-2 list-disc list-inside text-sm">
            <li>Nueva funcionalidad de búsqueda</li>
            <li>Mejoras en el rendimiento</li>
            <li>Corrección de errores menores</li>
          </ul>
        </BaseAlert>
        
        <BaseAlert 
          v-bind="args" 
          type="success"
          title="Proceso completado"
        >
          <div class="mt-2">
            <p class="text-sm">Se procesaron <strong>1,234</strong> registros exitosamente.</p>
            <div class="mt-2 flex items-center space-x-2">
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-green-600 h-2 rounded-full" style="width: 100%"></div>
              </div>
              <span class="text-xs text-gray-600">100%</span>
            </div>
          </div>
        </BaseAlert>
      </div>
    `
    }),
    args: {
        size: 'md',
        variant: 'default',
        showIcon: true
    }
}

// Historia interactiva
export const Interactive = {
    render: (args) => ({
        components: { BaseAlert },
        setup() {
            const handleClose = () => {
                console.log('Alerta cerrada')
            }
            const handleAction = () => {
                console.log('Acción ejecutada')
            }
            return { args, handleClose, handleAction }
        },
        template: `
      <div class="space-y-4">
        <BaseAlert 
          v-bind="args" 
          type="info"
          title="Alerta interactiva"
          message="Esta alerta tiene eventos personalizados."
          :dismissible="true"
          :showActions="true"
          actionButtonText="Ejecutar acción"
          @close="handleClose"
          @action-click="handleAction"
        />
        <p class="text-sm text-gray-600">
          Abre la consola del navegador para ver los logs de los eventos.
        </p>
      </div>
    `
    }),
    args: {
        size: 'md',
        variant: 'default',
        showIcon: true
    }
}

// Historia de accesibilidad
export const Accessibility = {
    render: (args) => ({
        components: { BaseAlert },
        setup() {
            return { args }
        },
        template: `
      <div class="space-y-4">
        <BaseAlert 
          v-bind="args" 
          type="info"
          title="Alerta accesible"
          message="Esta alerta incluye atributos ARIA para mejorar la accesibilidad."
          aria-live="polite"
        />
        <BaseAlert 
          v-bind="args" 
          type="error"
          title="Error crítico"
          message="Este es un error que requiere atención inmediata."
          aria-live="assertive"
        />
      </div>
    `
    }),
    args: {
        size: 'md',
        variant: 'default',
        showIcon: true
    }
}
