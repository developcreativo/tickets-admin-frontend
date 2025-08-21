<template>
  <div class="example-components">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        🎨 Componentes UI Reutilizables
      </h1>
      
      <!-- Sección de Formularios -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
          📝 Componentes de Formularios
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- BaseInput Examples -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300">
              BaseInput
            </h3>
            
            <BaseInput
              v-model="formData.name"
              label="Nombre completo"
              placeholder="Ingresa tu nombre"
              required
              :error-message="errors.name"
              help-text="Tu nombre completo como aparece en documentos oficiales"
              clearable
              show-character-count
              maxlength="50"
            />
            
            <BaseInput
              v-model="formData.email"
              label="Correo electrónico"
              type="email"
              placeholder="tu@email.com"
              required
              :error-message="errors.email"
              start-icon="MailIcon"
            />
            
            <BaseInput
              v-model="formData.phone"
              label="Teléfono"
              type="tel"
              placeholder="+1 (555) 123-4567"
              :error-message="errors.phone"
              end-icon="PhoneIcon"
            />
            
            <BaseInput
              v-model="formData.password"
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              required
              :error-message="errors.password"
              help-text="Mínimo 8 caracteres"
              minlength="8"
            />
          </div>
          
          <!-- BaseSelect Examples -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300">
              BaseSelect
            </h3>
            
            <BaseSelect
              v-model="formData.zone"
              label="Zona"
              :options="zoneOptions"
              placeholder="Selecciona una zona"
              required
              :error-message="errors.zone"
            />
            
            <BaseSelect
              v-model="formData.drawTypes"
              label="Tipos de sorteo"
              :options="drawTypeOptions"
              placeholder="Selecciona tipos de sorteo"
              multiple
              searchable
              :error-message="errors.drawTypes"
              help-text="Puedes seleccionar múltiples tipos"
            />
            
            <BaseSelect
              v-model="formData.status"
              label="Estado"
              :options="statusOptions"
              placeholder="Selecciona el estado"
              :error-message="errors.status"
            />
          </div>
        </div>
      </section>
      
      <!-- Sección de Botones -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
          🔘 Componentes de Botones
        </h2>
        
        <div class="space-y-6">
          <!-- Variantes de botones -->
          <div>
            <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
              Variantes
            </h3>
            <div class="flex flex-wrap gap-3">
              <BaseButton variant="primary">Primary</BaseButton>
              <BaseButton variant="secondary">Secondary</BaseButton>
              <BaseButton variant="success">Success</BaseButton>
              <BaseButton variant="danger">Danger</BaseButton>
              <BaseButton variant="warning">Warning</BaseButton>
              <BaseButton variant="info">Info</BaseButton>
              <BaseButton variant="ghost">Ghost</BaseButton>
              <BaseButton variant="outline">Outline</BaseButton>
              <BaseButton variant="link">Link</BaseButton>
            </div>
          </div>
          
          <!-- Tamaños de botones -->
          <div>
            <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
              Tamaños
            </h3>
            <div class="flex flex-wrap items-center gap-3">
              <BaseButton size="xs">Extra Small</BaseButton>
              <BaseButton size="sm">Small</BaseButton>
              <BaseButton size="md">Medium</BaseButton>
              <BaseButton size="lg">Large</BaseButton>
              <BaseButton size="xl">Extra Large</BaseButton>
            </div>
          </div>
          
          <!-- Estados de botones -->
          <div>
            <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
              Estados
            </h3>
            <div class="flex flex-wrap gap-3">
              <BaseButton :loading="true">Loading</BaseButton>
              <BaseButton disabled>Disabled</BaseButton>
              <BaseButton rounded>Rounded</BaseButton>
              <BaseButton full-width>Full Width</BaseButton>
            </div>
          </div>
          
          <!-- Botones con iconos -->
          <div>
            <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
              Con Iconos
            </h3>
            <div class="flex flex-wrap gap-3">
              <BaseButton start-icon="PlusIcon">
                Agregar
              </BaseButton>
              <BaseButton end-icon="ArrowRightIcon">
                Continuar
              </BaseButton>
              <BaseButton start-icon="DownloadIcon" variant="success">
                Descargar
              </BaseButton>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Sección de Tabla de Datos -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
          📊 Tabla de Datos
        </h2>
        
        <DataTable
          :data="tableData"
          :columns="tableColumns"
          :loading="tableLoading"
          selectable
          show-export
          @selection-change="handleSelectionChange"
          @export="handleExport"
          @row-click="handleRowClick"
        >
          <!-- Filtros personalizados -->
          <template #filters>
            <BaseSelect
              v-model="statusFilter"
              :options="statusOptions"
              placeholder="Filtrar por estado"
              size="sm"
            />
            <BaseInput
              v-model="searchFilter"
              placeholder="Buscar por título"
              size="sm"
              clearable
            />
          </template>
          
          <!-- Acciones del header -->
          <template #header-actions>
            <BaseButton
              variant="success"
              size="sm"
              start-icon="PlusIcon"
              @click="createNewItem"
            >
              Nuevo Item
            </BaseButton>
          </template>
          
          <!-- Celdas personalizadas -->
          <template #cell-status="{ value }">
            <span :class="getStatusClass(value)">
              {{ value }}
            </span>
          </template>
          
          <template #cell-created_at="{ value }">
            {{ formatDate(value) }}
          </template>
          
          <!-- Acciones por fila -->
          <template #actions="{ row }">
            <ActionButtons
              :show-view="true"
              :show-edit="true"
              :show-delete="true"
              @view="viewItem(row)"
              @edit="editItem(row)"
              @delete="deleteItem(row)"
            />
          </template>
        </DataTable>
      </section>
      
      <!-- Sección de Modales -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
          🪟 Modales
        </h2>
        
        <div class="flex flex-wrap gap-3">
          <BaseButton @click="showSimpleModal = true">
            Modal Simple
          </BaseButton>
          
          <BaseButton @click="showConfirmModal = true" variant="danger">
            Modal de Confirmación
          </BaseButton>
          
          <BaseButton @click="showFormModal = true" variant="success">
            Modal con Formulario
          </BaseButton>
          
          <BaseButton @click="showFullscreenModal = true" variant="info">
            Modal Pantalla Completa
          </BaseButton>
        </div>
        
        <!-- Modal Simple -->
        <BaseModal
          v-model="showSimpleModal"
          title="Información"
          size="md"
        >
          <p class="text-gray-600 dark:text-gray-400">
            Este es un modal simple que muestra información al usuario.
          </p>
        </BaseModal>
        
        <!-- Modal de Confirmación -->
        <BaseModal
          v-model="showConfirmModal"
          title="Confirmar Eliminación"
          size="md"
          confirm-button-variant="danger"
          confirm-button-text="Eliminar"
          @confirm="handleDeleteConfirm"
        >
          <div class="text-center">
            <svg class="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              ¿Estás seguro?
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Esta acción no se puede deshacer. Se eliminará permanentemente el elemento seleccionado.
            </p>
          </div>
        </BaseModal>
        
        <!-- Modal con Formulario -->
        <BaseModal
          v-model="showFormModal"
          title="Crear Nuevo Item"
          size="lg"
          @confirm="handleFormSubmit"
        >
          <div class="space-y-4">
            <BaseInput
              v-model="modalForm.title"
              label="Título"
              placeholder="Ingresa el título"
              required
            />
            
            <BaseSelect
              v-model="modalForm.category"
              label="Categoría"
              :options="categoryOptions"
              placeholder="Selecciona una categoría"
              required
            />
            
            <BaseInput
              v-model="modalForm.description"
              label="Descripción"
              placeholder="Ingresa la descripción"
              type="textarea"
              rows="3"
            />
          </div>
        </BaseModal>
        
        <!-- Modal Pantalla Completa -->
        <BaseModal
          v-model="showFullscreenModal"
          title="Vista Detallada"
          fullscreen
        >
          <div class="h-full flex flex-col">
            <div class="flex-1 overflow-auto">
              <div class="prose dark:prose-invert max-w-none">
                <h2>Contenido del Modal Pantalla Completa</h2>
                <p>Este modal ocupa toda la pantalla y es útil para mostrar contenido extenso o formularios complejos.</p>
                
                <h3>Características</h3>
                <ul>
                  <li>Ocupa toda la pantalla</li>
                  <li>Ideal para contenido extenso</li>
                  <li>Mantiene la navegación</li>
                  <li>Responsive en todos los dispositivos</li>
                </ul>
                
                <h3>Casos de Uso</h3>
                <p>Perfecto para:</p>
                <ul>
                  <li>Editores de texto</li>
                  <li>Vistas de datos complejas</li>
                  <li>Formularios extensos</li>
                  <li>Presentaciones</li>
                </ul>
              </div>
            </div>
          </div>
        </BaseModal>
      </section>
      
      <!-- Sección de Utilidades -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
          🛠️ Utilidades
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300">
              Formateo de Datos
            </h3>
            
            <div class="space-y-2">
              <p><strong>Fecha:</strong> {{ formatDate(new Date()) }}</p>
              <p><strong>Moneda:</strong> {{ formatCurrency(1234.56) }}</p>
              <p><strong>Número:</strong> {{ formatNumber(1234567.89) }}</p>
              <p><strong>Email válido:</strong> {{ isValidEmail('test@example.com') ? '✅' : '❌' }}</p>
              <p><strong>ID único:</strong> {{ generateId('example') }}</p>
            </div>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300">
              Validación de Formularios
            </h3>
            
            <div class="space-y-2">
              <p><strong>Form válido:</strong> {{ isFormValid ? '✅' : '❌' }}</p>
              <p><strong>Errores:</strong> {{ Object.keys(errors).length }}</p>
            </div>
            
            <BaseButton
              @click="validateForm"
              variant="outline"
              size="sm"
            >
              Validar Formulario
            </BaseButton>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  BaseInput, 
  BaseSelect, 
  BaseButton, 
  DataTable, 
  BaseModal, 
  ActionButtons,
  Utils,
  useFormValidation
} from '@/lib/ui-components'

// Estado del formulario
const formData = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  zone: '',
  drawTypes: [],
  status: ''
})

// Estado de errores y validación
const { errors, isValid: isFormValid, validateField, clearError } = useFormValidation()

// Opciones para selects
const zoneOptions = ref([
  { value: 'norte', label: 'Zona Norte' },
  { value: 'sur', label: 'Zona Sur' },
  { value: 'este', label: 'Zona Este' },
  { value: 'oeste', label: 'Zona Oeste' }
])

const drawTypeOptions = ref([
  { value: 'loteria', label: 'Lotería' },
  { value: 'quiniela', label: 'Quiniela' },
  { value: 'bingo', label: 'Bingo' },
  { value: 'rifa', label: 'Rifa' }
])

const statusOptions = ref([
  { value: 'active', label: 'Activo' },
  { value: 'inactive', label: 'Inactivo' },
  { value: 'pending', label: 'Pendiente' }
])

const categoryOptions = ref([
  { value: 'general', label: 'General' },
  { value: 'premium', label: 'Premium' },
  { value: 'vip', label: 'VIP' }
])

// Estado de la tabla
const tableLoading = ref(false)
const statusFilter = ref('')
const searchFilter = ref('')

const tableColumns = ref([
  { key: 'id', label: 'ID', sortable: true },
  { key: 'title', label: 'Título', sortable: true },
  { key: 'category', label: 'Categoría', sortable: true },
  { key: 'status', label: 'Estado', sortable: true },
  { key: 'created_at', label: 'Fecha', sortable: true }
])

const tableData = ref([
  { id: 1, title: 'Ticket Premium', category: 'Premium', status: 'active', created_at: '2024-01-15' },
  { id: 2, title: 'Ticket General', category: 'General', status: 'pending', created_at: '2024-01-14' },
  { id: 3, title: 'Ticket VIP', category: 'VIP', status: 'active', created_at: '2024-01-13' },
  { id: 4, title: 'Ticket Básico', category: 'General', status: 'inactive', created_at: '2024-01-12' }
])

// Estado de modales
const showSimpleModal = ref(false)
const showConfirmModal = ref(false)
const showFormModal = ref(false)
const showFullscreenModal = ref(false)

const modalForm = ref({
  title: '',
  category: '',
  description: ''
})

// Métodos
const validateForm = () => {
  // Validar nombre
  validateField('name', formData.value.name, [
    { required: true, message: 'El nombre es requerido' },
    { minLength: 2, message: 'El nombre debe tener al menos 2 caracteres' }
  ])
  
  // Validar email
  validateField('email', formData.value.email, [
    { required: true, message: 'El email es requerido' },
    { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email inválido' }
  ])
  
  // Validar contraseña
  validateField('password', formData.value.password, [
    { required: true, message: 'La contraseña es requerida' },
    { minLength: 8, message: 'La contraseña debe tener al menos 8 caracteres' }
  ])
  
  // Validar zona
  validateField('zone', formData.value.zone, [
    { required: true, message: 'La zona es requerida' }
  ])
}

const handleSelectionChange = (selected) => {
  console.log('Elementos seleccionados:', selected)
}

const handleExport = (exportData) => {
  console.log('Exportando:', exportData)
  // Aquí iría la lógica real de exportación
}

const handleRowClick = (row) => {
  console.log('Fila clickeada:', row)
}

const createNewItem = () => {
  showFormModal.value = true
}

const viewItem = (row) => {
  console.log('Ver item:', row)
}

const editItem = (row) => {
  console.log('Editar item:', row)
}

const deleteItem = (row) => {
  console.log('Eliminar item:', row)
  showConfirmModal.value = true
}

const handleDeleteConfirm = () => {
  console.log('Confirmada eliminación')
  // Aquí iría la lógica real de eliminación
}

const handleFormSubmit = () => {
  console.log('Formulario enviado:', modalForm.value)
  // Aquí iría la lógica real de envío
}

const getStatusClass = (status) => {
  const classes = {
    active: 'px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full',
    inactive: 'px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full',
    pending: 'px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full'
  }
  return classes[status] || classes.inactive
}

// Utilidades
const formatDate = Utils.formatDate
const formatCurrency = Utils.formatCurrency
const formatNumber = Utils.formatNumber
const isValidEmail = Utils.isValidEmail
const generateId = Utils.generateId

// Lifecycle
onMounted(() => {
  // Simular carga de datos
  tableLoading.value = true
  setTimeout(() => {
    tableLoading.value = false
  }, 1000)
})
</script>

<style scoped>
.example-components {
  @apply min-h-screen bg-gray-50 dark:bg-gray-900;
}

.container {
  @apply max-w-7xl;
}

/* Estilos para el contenido del modal pantalla completa */
.prose {
  @apply text-gray-900 dark:text-gray-100;
}

.prose h2 {
  @apply text-2xl font-bold mb-4;
}

.prose h3 {
  @apply text-xl font-semibold mb-3;
}

.prose p {
  @apply mb-4;
}

.prose ul {
  @apply list-disc list-inside mb-4;
}

.prose li {
  @apply mb-1;
}
</style>
