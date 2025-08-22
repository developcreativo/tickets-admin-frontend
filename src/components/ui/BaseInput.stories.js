import BaseInput from './BaseInput.vue'
import { 
  UserIcon, 
  LockClosedIcon, 
  EnvelopeIcon, 
  PhoneIcon,
  MagnifyingGlassIcon,
  CurrencyDollarIcon
} from '@heroicons/vue/24/outline'

export default {
  title: 'UI/Forms/BaseInput',
  component: BaseInput,
  parameters: {
    docs: {
      description: {
        component: 'Componente de input moderno y reutilizable con validación, iconos y estados'
      }
    }
  },
  argTypes: {
    modelValue: {
      control: 'text',
      description: 'Valor del input (v-model)'
    },
    label: {
      control: 'text',
      description: 'Etiqueta del input'
    },
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'tel', 'url', 'search'],
      description: 'Tipo de input'
    },
    placeholder: {
      control: 'text',
      description: 'Texto placeholder'
    },
    disabled: {
      control: 'boolean',
      description: 'Estado deshabilitado'
    },
    required: {
      control: 'boolean',
      description: 'Campo requerido'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Tamaño del input'
    },
    leftIcon: {
      control: 'select',
      options: ['UserIcon', 'LockClosedIcon', 'EnvelopeIcon', 'PhoneIcon', 'MagnifyingGlassIcon', 'CurrencyDollarIcon'],
      description: 'Icono izquierdo'
    },
    showPasswordToggle: {
      control: 'boolean',
      description: 'Mostrar toggle de contraseña'
    },
    showCounter: {
      control: 'boolean',
      description: 'Mostrar contador de caracteres'
    },
    maxlength: {
      control: 'number',
      description: 'Longitud máxima'
    },
    errorMessage: {
      control: 'text',
      description: 'Mensaje de error'
    },
    helperText: {
      control: 'text',
      description: 'Texto de ayuda'
    }
  }
}

// Template básico
const Template = (args) => ({
  components: { BaseInput },
  setup() {
    return { args }
  },
  template: '<BaseInput v-bind="args" />'
})

// Template con v-model
const TemplateWithModel = (args) => ({
  components: { BaseInput },
  setup() {
    return { args }
  },
  data() {
    return {
      value: args.modelValue || ''
    }
  },
  template: `
    <div class="space-y-4">
      <BaseInput v-model="value" v-bind="args" />
      <p class="text-sm text-gray-600">Valor actual: {{ value }}</p>
    </div>
  `
})

// Stories básicas
export const Default = Template.bind({})
Default.args = {
  label: 'Nombre',
  placeholder: 'Ingresa tu nombre'
}

export const WithIcon = Template.bind({})
WithIcon.args = {
  label: 'Usuario',
  placeholder: 'Ingresa tu usuario',
  leftIcon: 'UserIcon'
}

export const Password = Template.bind({})
Password.args = {
  label: 'Contraseña',
  type: 'password',
  placeholder: 'Ingresa tu contraseña',
  leftIcon: 'LockClosedIcon',
  showPasswordToggle: true
}

export const Email = Template.bind({})
Email.args = {
  label: 'Email',
  type: 'email',
  placeholder: 'ejemplo@correo.com',
  leftIcon: 'EnvelopeIcon'
}

export const Phone = Template.bind({})
Phone.args = {
  label: 'Teléfono',
  type: 'tel',
  placeholder: '+1 (555) 123-4567',
  leftIcon: 'PhoneIcon'
}

export const Search = Template.bind({})
Search.args = {
  label: 'Buscar',
  type: 'search',
  placeholder: 'Buscar productos...',
  leftIcon: 'MagnifyingGlassIcon'
}

// Estados
export const Disabled = Template.bind({})
Disabled.args = {
  label: 'Campo deshabilitado',
  placeholder: 'No puedes editar esto',
  disabled: true
}

export const Required = Template.bind({})
Required.args = {
  label: 'Campo requerido',
  placeholder: 'Este campo es obligatorio',
  required: true
}

export const WithError = Template.bind({})
WithError.args = {
  label: 'Email',
  type: 'email',
  placeholder: 'ejemplo@correo.com',
  leftIcon: 'EnvelopeIcon',
  errorMessage: 'Por favor ingresa un email válido'
}

export const WithHelperText = Template.bind({})
WithHelperText.args = {
  label: 'Contraseña',
  type: 'password',
  placeholder: 'Ingresa tu contraseña',
  leftIcon: 'LockClosedIcon',
  helperText: 'La contraseña debe tener al menos 8 caracteres'
}

export const WithCounter = Template.bind({})
WithCounter.args = {
  label: 'Descripción',
  placeholder: 'Escribe una descripción',
  maxlength: 100,
  showCounter: true
}

// Tamaños
export const Small = Template.bind({})
Small.args = {
  label: 'Input pequeño',
  placeholder: 'Tamaño sm',
  size: 'sm'
}

export const Large = Template.bind({})
Large.args = {
  label: 'Input grande',
  placeholder: 'Tamaño lg',
  size: 'lg'
}

// Variantes con v-model
export const Interactive = TemplateWithModel.bind({})
Interactive.args = {
  label: 'Input interactivo',
  placeholder: 'Escribe algo...',
  leftIcon: 'UserIcon'
}

export const InteractivePassword = TemplateWithModel.bind({})
InteractivePassword.args = {
  label: 'Contraseña interactiva',
  type: 'password',
  placeholder: 'Ingresa tu contraseña',
  leftIcon: 'LockClosedIcon',
  showPasswordToggle: true
}

// Ejemplos de uso
export const LoginForm = () => ({
  components: { BaseInput },
  data() {
    return {
      username: '',
      password: '',
      usernameError: '',
      passwordError: ''
    }
  },
  methods: {
    validateUsername() {
      if (!this.username) {
        this.usernameError = 'El usuario es requerido'
      } else if (this.username.length < 3) {
        this.usernameError = 'El usuario debe tener al menos 3 caracteres'
      } else {
        this.usernameError = ''
      }
    },
    validatePassword() {
      if (!this.password) {
        this.passwordError = 'La contraseña es requerida'
      } else if (this.password.length < 6) {
        this.passwordError = 'La contraseña debe tener al menos 6 caracteres'
      } else {
        this.passwordError = ''
      }
    },
    clearError(field) {
      if (field === 'username') this.usernameError = ''
      if (field === 'password') this.passwordError = ''
    }
  },
  template: `
    <div class="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg space-y-4">
      <h3 class="text-lg font-semibold text-gray-900">Formulario de Login</h3>
      
      <BaseInput
        v-model="username"
        label="Usuario"
        placeholder="Ingresa tu usuario"
        :left-icon="UserIcon"
        :error-message="usernameError"
        required
        @blur="validateUsername"
        @input="clearError('username')"
      />
      
      <BaseInput
        v-model="password"
        label="Contraseña"
        type="password"
        placeholder="Ingresa tu contraseña"
        :left-icon="LockClosedIcon"
        :error-message="passwordError"
        :show-password-toggle="true"
        required
        @blur="validatePassword"
        @input="clearError('password')"
      />
      
      <button 
        class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        :disabled="!username || !password || usernameError || passwordError"
      >
        Iniciar Sesión
      </button>
    </div>
  `
})

// Mapeo de iconos
const iconMap = {
  UserIcon,
  LockClosedIcon,
  EnvelopeIcon,
  PhoneIcon,
  MagnifyingGlassIcon,
  CurrencyDollarIcon
}

// Función para resolver iconos
export const resolveIcon = (iconName) => {
  return iconMap[iconName] || null
}
