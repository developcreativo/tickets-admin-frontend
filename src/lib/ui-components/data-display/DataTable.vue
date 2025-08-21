<template>
  <div class="data-table-container">
    <!-- Header con filtros y acciones -->
    <div class="table-header">
      <!-- Filtros de búsqueda -->
      <div class="search-filters">
        <div class="search-box">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="searchPlaceholder"
            class="search-input"
            @input="handleSearch"
          />
          <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <!-- Filtros adicionales -->
        <div v-if="showFilters" class="additional-filters">
          <slot name="filters" />
        </div>
      </div>
      
      <!-- Acciones del header -->
      <div class="header-actions">
        <slot name="header-actions" />
        
        <!-- Botón de exportar -->
        <button
          v-if="showExport"
          @click="exportData"
          class="export-btn"
          :disabled="loading"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Exportar
        </button>
      </div>
    </div>
    
    <!-- Tabla -->
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <!-- Checkbox para selección múltiple -->
            <th v-if="selectable" class="select-header">
              <input
                type="checkbox"
                :checked="allSelected"
                :indeterminate="someSelected"
                @change="toggleSelectAll"
                class="select-checkbox"
              />
            </th>
            
            <!-- Columnas de la tabla -->
            <th
              v-for="column in visibleColumns"
              :key="column.key"
              :class="[
                'table-header-cell',
                { 'sortable': column.sortable },
                { 'sorted': sortBy === column.key }
              ]"
              @click="column.sortable ? sortByColumn(column.key) : null"
            >
              <div class="header-content">
                <span>{{ column.label }}</span>
                
                <!-- Indicador de ordenamiento -->
                <div v-if="column.sortable" class="sort-indicator">
                  <svg
                    v-if="sortBy === column.key"
                    class="sort-icon"
                    :class="{ 'rotate-180': sortOrder === 'desc' }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                  </svg>
                  <svg
                    v-else
                    class="sort-icon-placeholder"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                  </svg>
                </div>
              </div>
            </th>
            
            <!-- Columna de acciones -->
            <th v-if="showActions" class="actions-header">
              Acciones
            </th>
          </tr>
        </thead>
        
        <tbody>
          <!-- Estado de carga -->
          <tr v-if="loading" class="loading-row">
            <td :colspan="totalColumns" class="loading-cell">
              <div class="loading-content">
                <svg class="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span class="ml-2">Cargando datos...</span>
              </div>
            </td>
          </tr>
          
          <!-- Estado vacío -->
          <tr v-else-if="filteredData.length === 0" class="empty-row">
            <td :colspan="totalColumns" class="empty-cell">
              <div class="empty-content">
                <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 class="empty-title">No hay datos</h3>
                <p class="empty-description">
                  {{ searchQuery ? 'No se encontraron resultados para tu búsqueda.' : 'No hay datos disponibles en este momento.' }}
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Filas de datos -->
          <tr
            v-else
            v-for="(row, index) in paginatedData"
            :key="getRowKey(row, index)"
            :class="[
              'table-row',
              { 'selected': isRowSelected(row) },
              { 'hover': true }
            ]"
            @click="handleRowClick(row)"
          >
            <!-- Checkbox de selección -->
            <td v-if="selectable" class="select-cell">
              <input
                type="checkbox"
                :checked="isRowSelected(row)"
                @change="toggleRowSelection(row)"
                @click.stop
                class="row-checkbox"
              />
            </td>
            
            <!-- Celdas de datos -->
            <td
              v-for="column in visibleColumns"
              :key="column.key"
              :class="['table-cell', column.cellClass]"
            >
              <slot
                :name="`cell-${column.key}`"
                :row="row"
                :column="column"
                :value="getCellValue(row, column)"
              >
                {{ formatCellValue(getCellValue(row, column), column) }}
              </slot>
            </td>
            
            <!-- Celdas de acciones -->
            <td v-if="showActions" class="actions-cell">
              <slot
                name="actions"
                :row="row"
                :index="index"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Footer con paginación y estadísticas -->
    <div class="table-footer">
      <!-- Estadísticas -->
      <div class="table-stats">
        <span class="stats-text">
          Mostrando {{ startIndex + 1 }}-{{ endIndex }} de {{ totalItems }} resultados
        </span>
      </div>
      
      <!-- Paginación -->
      <div v-if="showPagination && totalPages > 1" class="pagination">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage <= 1"
          class="pagination-btn"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <!-- Números de página -->
        <div class="page-numbers">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="goToPage(page)"
            :class="[
              'page-btn',
              { 'active': page === currentPage }
            ]"
          >
            {{ page }}
          </button>
        </div>
        
        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage >= totalPages"
          class="pagination-btn"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <!-- Selector de tamaño de página -->
      <div v-if="showPageSizeSelector" class="page-size-selector">
        <label class="page-size-label">Mostrar:</label>
        <select
          v-model="pageSize"
          @change="handlePageSizeChange"
          class="page-size-select"
        >
          <option v-for="size in pageSizeOptions" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'

const props = defineProps({
  data: { type: Array, default: () => [] },
  columns: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  selectable: { type: Boolean, default: false },
  showActions: { type: Boolean, default: true },
  showFilters: { type: Boolean, default: true },
  showExport: { type: Boolean, default: false },
  showPagination: { type: Boolean, default: true },
  showPageSizeSelector: { type: Boolean, default: true },
  searchable: { type: Boolean, default: true },
  searchPlaceholder: { type: String, default: 'Buscar...' },
  pageSize: { type: Number, default: 10 },
  pageSizeOptions: { type: Array, default: () => [10, 25, 50, 100] },
  rowKey: { type: String, default: 'id' },
  sortable: { type: Boolean, default: true },
  defaultSort: { type: String, default: '' },
  defaultSortOrder: { type: String, default: 'asc' }
})

const emit = defineEmits([
  'row-click',
  'selection-change',
  'sort-change',
  'page-change',
  'page-size-change',
  'search',
  'export'
])

// Estado interno
const searchQuery = ref('')
const currentPage = ref(1)
const sortBy = ref(props.defaultSort)
const sortOrder = ref(props.defaultSortOrder)
const selectedRows = ref(new Set())

// Computed properties
const visibleColumns = computed(() => {
  return props.columns.filter(col => !col.hidden)
})

const totalColumns = computed(() => {
  let count = visibleColumns.value.length
  if (props.selectable) count++
  if (props.showActions) count++
  return count
})

const filteredData = computed(() => {
  let filtered = [...props.data]
  
  // Aplicar búsqueda
  if (searchQuery.value && props.searchable) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(row => {
      return visibleColumns.value.some(column => {
        const value = getCellValue(row, column)
        return String(value).toLowerCase().includes(query)
      })
    })
  }
  
  // Aplicar ordenamiento
  if (sortBy.value && props.sortable) {
    filtered.sort((a, b) => {
      const aValue = getCellValue(a, { key: sortBy.value })
      const bValue = getCellValue(b, { key: sortBy.value })
      
      if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1
      return 0
    })
  }
  
  return filtered
})

const totalItems = computed(() => filteredData.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / props.pageSize)

const startIndex = computed(() => (currentPage.value - 1) * props.pageSize)
const endIndex = computed(() => Math.min(startIndex.value + props.pageSize, totalItems.value))

const paginatedData = computed(() => {
  return filteredData.value.slice(startIndex.value, endIndex.value)
})

const allSelected = computed(() => {
  return paginatedData.value.length > 0 && 
         paginatedData.value.every(row => isRowSelected(row))
})

const someSelected = computed(() => {
  const selectedCount = paginatedData.value.filter(row => isRowSelected(row)).length
  return selectedCount > 0 && selectedCount < paginatedData.value.length
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Métodos
const getRowKey = (row, index) => {
  return row[props.rowKey] || index
}

const getCellValue = (row, column) => {
  if (column.value) {
    return typeof column.value === 'function' ? column.value(row) : column.value
  }
  return row[column.key]
}

const formatCellValue = (value, column) => {
  if (column.formatter) {
    return column.formatter(value, column)
  }
  
  if (value === null || value === undefined) return '-'
  if (typeof value === 'boolean') return value ? 'Sí' : 'No'
  
  return value
}

const handleSearch = () => {
  currentPage.value = 1
  emit('search', searchQuery.value)
}

const sortByColumn = (columnKey) => {
  if (sortBy.value === columnKey) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = columnKey
    sortOrder.value = 'asc'
  }
  
  emit('sort-change', { column: sortBy.value, order: sortOrder.value })
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    emit('page-change', page)
  }
}

const handlePageSizeChange = () => {
  currentPage.value = 1
  emit('page-size-change', props.pageSize)
}

const toggleSelectAll = () => {
  if (allSelected.value) {
    paginatedData.value.forEach(row => {
      selectedRows.value.delete(getRowKey(row))
    })
  } else {
    paginatedData.value.forEach(row => {
      selectedRows.value.add(getRowKey(row))
    })
  }
  
  emitSelectionChange()
}

const toggleRowSelection = (row) => {
  const key = getRowKey(row)
  if (selectedRows.value.has(key)) {
    selectedRows.value.delete(key)
  } else {
    selectedRows.value.add(key)
  }
  
  emitSelectionChange()
}

const isRowSelected = (row) => {
  return selectedRows.value.has(getRowKey(row))
}

const emitSelectionChange = () => {
  const selectedData = props.data.filter(row => 
    selectedRows.value.has(getRowKey(row))
  )
  emit('selection-change', selectedData)
}

const handleRowClick = (row) => {
  emit('row-click', row)
}

const exportData = () => {
  emit('export', {
    data: filteredData.value,
    columns: visibleColumns.value,
    searchQuery: searchQuery.value,
    sortBy: sortBy.value,
    sortOrder: sortOrder.value
  })
}

// Watchers
watch(() => props.data, () => {
  currentPage.value = 1
  selectedRows.value.clear()
})

watch(() => props.pageSize, () => {
  currentPage.value = 1
})

// Lifecycle
onMounted(() => {
  if (props.defaultSort) {
    sortBy.value = props.defaultSort
    sortOrder.value = props.defaultSortOrder
  }
})
</script>

<style scoped>
.data-table-container {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700;
}

.table-header {
  @apply flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b border-gray-200 dark:border-gray-700 gap-4;
}

.search-filters {
  @apply flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1;
}

.search-box {
  @apply relative;
}

.search-input {
  @apply pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400;
}

.search-icon {
  @apply absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400;
}

.additional-filters {
  @apply flex items-center gap-2;
}

.header-actions {
  @apply flex items-center gap-2;
}

.export-btn {
  @apply inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200;
}

.table-wrapper {
  @apply overflow-x-auto;
}

.data-table {
  @apply w-full;
}

.table-header-cell {
  @apply px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700;
}

.table-header-cell.sortable {
  @apply cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150;
}

.table-header-cell.sorted {
  @apply bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400;
}

.header-content {
  @apply flex items-center justify-between;
}

.sort-indicator {
  @apply flex items-center;
}

.sort-icon,
.sort-icon-placeholder {
  @apply w-4 h-4 text-gray-400;
}

.sort-icon {
  @apply text-blue-600 dark:text-blue-400 transition-transform duration-200;
}

.select-header,
.select-cell {
  @apply w-12 text-center;
}

.select-checkbox,
.row-checkbox {
  @apply rounded border-gray-300 text-blue-600 focus:ring-blue-500;
}

.actions-header,
.actions-cell {
  @apply w-24 text-center;
}

.table-row {
  @apply hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150;
}

.table-row.selected {
  @apply bg-blue-50 dark:bg-blue-900/20;
}

.table-cell {
  @apply px-4 py-3 text-sm text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700;
}

.loading-row,
.empty-row {
  @apply border-b border-gray-200 dark:border-gray-700;
}

.loading-cell,
.empty-cell {
  @apply px-4 py-12 text-center;
}

.loading-content {
  @apply flex items-center justify-center text-gray-500 dark:text-gray-400;
}

.empty-content {
  @apply flex flex-col items-center text-gray-500 dark:text-gray-400;
}

.empty-title {
  @apply mt-2 text-sm font-medium text-gray-900 dark:text-gray-100;
}

.empty-description {
  @apply mt-1 text-sm text-gray-500 dark:text-gray-400;
}

.table-footer {
  @apply flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-200 dark:border-gray-700 gap-4;
}

.table-stats {
  @apply text-sm text-gray-700 dark:text-gray-300;
}

.pagination {
  @apply flex items-center gap-1;
}

.pagination-btn {
  @apply inline-flex items-center px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200;
}

.page-numbers {
  @apply flex items-center gap-1;
}

.page-btn {
  @apply inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200;
}

.page-btn.active {
  @apply bg-blue-600 text-white border-blue-600 hover:bg-blue-700;
}

.page-size-selector {
  @apply flex items-center gap-2;
}

.page-size-label {
  @apply text-sm text-gray-700 dark:text-gray-300;
}

.page-size-select {
  @apply border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400;
}

/* Responsive */
@media (max-width: 640px) {
  .table-header {
    @apply flex-col items-stretch;
  }
  
  .search-filters {
    @apply flex-col items-stretch;
  }
  
  .header-actions {
    @apply justify-center;
  }
  
  .table-footer {
    @apply flex-col items-center;
  }
}
</style>
