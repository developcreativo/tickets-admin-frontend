// Tipos base para componentes
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type ComponentVariant = 'default' | 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'outline' | 'ghost' | 'link'
export type ButtonType = 'button' | 'submit' | 'reset'

// Tipos para BaseButton
export interface BaseButtonProps {
  label: string
  variant?: ComponentVariant
  size?: ComponentSize
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  type?: ButtonType
  icon?: string
  iconPosition?: 'left' | 'right'
  'aria-label'?: string
  'aria-describedby'?: string
}

export interface BaseButtonEmits {
  (e: 'click', event: MouseEvent): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}

// Tipos para BaseInput
export interface BaseInputProps {
  modelValue?: string | number
  label?: string
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  name?: string
  errorMessage?: string
  helperText?: string
  startIcon?: string | object
  endIcon?: string | object
  clearable?: boolean
  showCharacterCount?: boolean
  maxLength?: number
  minLength?: number
  size?: ComponentSize
  variant?: 'default' | 'outlined' | 'filled' | 'minimal'
  validateOnChange?: boolean
}

export interface BaseInputEmits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
  (e: 'input', event: Event): void
  (e: 'keydown', event: KeyboardEvent): void
  (e: 'paste', event: ClipboardEvent): void
  (e: 'clear'): void
  (e: 'validation-change', result: ValidationResult): void
}

// Tipos para BaseSelect
export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
  description?: string
}

export interface BaseSelectProps {
  modelValue?: string | number | (string | number)[]
  options: SelectOption[]
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  name?: string
  errorMessage?: string
  helperText?: string
  searchable?: boolean
  multiple?: boolean
  clearable?: boolean
  size?: ComponentSize
  variant?: 'default' | 'outlined' | 'filled' | 'minimal'
  validateOnChange?: boolean
}

export interface BaseSelectEmits {
  (e: 'update:modelValue', value: string | number | (string | number)[]): void
  (e: 'change', value: string | number | (string | number)[]): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
  (e: 'validation-change', result: ValidationResult): void
}

// Tipos para BaseTextarea
export interface BaseTextareaProps {
  modelValue?: string
  label?: string
  placeholder?: string
  rows?: number
  maxLength?: number
  minLength?: number
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  name?: string
  errorMessage?: string
  helperText?: string
  startIcon?: string | object
  endIcon?: string | object
  clearable?: boolean
  showCharacterCount?: boolean
  size?: ComponentSize
  variant?: 'default' | 'outlined' | 'filled' | 'minimal'
  autoResize?: boolean
  clearButtonTitle?: string
}

export interface BaseTextareaEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
  (e: 'input', event: Event): void
  (e: 'keydown', event: KeyboardEvent): void
  (e: 'paste', event: ClipboardEvent): void
  (e: 'clear'): void
  (e: 'validation-change', result: ValidationResult): void
}

// Tipos para BaseCheckbox
export interface BaseCheckboxProps {
  modelValue?: boolean | (string | number)[]
  label: string
  description?: string
  value?: string | number | boolean
  name?: string
  disabled?: boolean
  required?: boolean
  indeterminate?: boolean
  errorMessage?: string
  helperText?: string
  size?: ComponentSize
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error'
  validateOnChange?: boolean
}

export interface BaseCheckboxEmits {
  (e: 'update:modelValue', value: boolean | (string | number)[]): void
  (e: 'change', event: { checked: boolean; value: string | number | boolean; event: Event }): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
  (e: 'validation-change', result: ValidationResult): void
}

// Tipos para BaseRadio
export interface RadioOption {
  value: string | number | boolean
  label: string
  description?: string
  disabled?: boolean
}

export interface BaseRadioProps {
  modelValue?: string | number | boolean
  options: RadioOption[]
  name: string
  legend?: string
  disabled?: boolean
  required?: boolean
  errorMessage?: string
  helperText?: string
  size?: ComponentSize
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error'
  validateOnChange?: boolean
}

export interface BaseRadioEmits {
  (e: 'update:modelValue', value: string | number | boolean): void
  (e: 'change', event: { value: string | number | boolean; event: Event }): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
  (e: 'validation-change', result: ValidationResult): void
}

// Tipos para BaseAlert
export type AlertType = 'info' | 'success' | 'warning' | 'error'
export type AlertVariant = 'default' | 'outlined' | 'filled' | 'minimal'
export type AlertSize = 'sm' | 'md' | 'lg'
export type AriaLive = 'polite' | 'assertive' | 'off'

export interface BaseAlertProps {
  type?: AlertType
  title?: string
  message?: string
  size?: AlertSize
  variant?: AlertVariant
  dismissible?: boolean
  showIcon?: boolean
  showActions?: boolean
  actionButtonText?: string
  actionButtonVariant?: ComponentVariant
  actionButtonSize?: ComponentSize
  closeButtonLabel?: string
  autoClose?: boolean | number
  ariaLive?: AriaLive
}

export interface BaseAlertEmits {
  (e: 'close'): void
  (e: 'action-click'): void
  (e: 'show'): void
  (e: 'hide'): void
}

// Tipos para BaseTabs
export interface TabItem {
  id?: string | number
  label: string
  icon?: string | object
  badge?: string | number
  badgeVariant?: 'default' | 'primary' | 'success' | 'warning' | 'error'
  disabled?: boolean
  closable?: boolean
  content?: string
}

export interface BaseTabsProps {
  modelValue?: string | number
  tabs: TabItem[]
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'pills' | 'underline' | 'cards' | 'minimal'
  vertical?: boolean
  lazy?: boolean
  closable?: boolean
  addable?: boolean
}

export interface BaseTabsEmits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'tab-change', event: { tabId: string | number; tab: TabItem }): void
  (e: 'tab-close', event: { tabId: string | number }): void
  (e: 'tab-add'): void
}

// Tipos para BaseCard
export type CardSize = 'sm' | 'md' | 'lg' | 'xl'
export type CardVariant = 'default' | 'elevated' | 'outlined' | 'filled' | 'minimal'
export type CardElevation = 'none' | 'sm' | 'md' | 'lg' | 'xl'

export interface BaseCardProps {
  title?: string
  subtitle?: string
  size?: CardSize
  variant?: CardVariant
  elevation?: CardElevation
  hoverable?: boolean
  loading?: boolean
  fullWidth?: boolean
  showHeader?: boolean
  showFooter?: boolean
  showHeaderActions?: boolean
  headerIcon?: string | object
  headerActionText?: string
  headerActionVariant?: ComponentVariant
  headerActionSize?: ComponentSize
  headerBordered?: boolean
  bodyBordered?: boolean
  footerBordered?: boolean
  image?: string
  imageAlt?: string
  imagePosition?: 'top' | 'bottom'
  footerText?: string
  expandable?: boolean
  expandButtonVariant?: ComponentVariant
  expandButtonSize?: ComponentSize
}

export interface BaseCardEmits {
  (e: 'header-action-click'): void
  (e: 'expand'): void
  (e: 'collapse'): void
}

// Tipos para BaseModal
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface BaseModalProps {
  modelValue: boolean
  title?: string
  size?: ModalSize
  showHeader?: boolean
  showFooter?: boolean
  closeOnOverlay?: boolean
  closeOnEscape?: boolean
  persistent?: boolean
  fullscreen?: boolean
  scrollable?: boolean
  centered?: boolean
  backdrop?: boolean | 'static'
  zIndex?: number
}

export interface BaseModalEmits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
  (e: 'open'): void
  (e: 'before-close'): void
  (e: 'after-close'): void
}

// Tipos para DataTable
export interface DataTableColumn {
  key: string
  label: string
  sortable?: boolean
  filterable?: boolean
  width?: string | number
  align?: 'left' | 'center' | 'right'
  formatter?: (value: any, row: any) => string
}

export interface DataTableProps {
  data: any[]
  columns: DataTableColumn[]
  loading?: boolean
  pageSize?: number
  currentPage?: number
  totalItems?: number
  showPagination?: boolean
  showFilters?: boolean
  searchable?: boolean
  selectable?: boolean
  sortable?: boolean
  striped?: boolean
  hoverable?: boolean
  bordered?: boolean
  size?: 'sm' | 'md' | 'lg'
  emptyText?: string
  loadingText?: string
}

export interface DataTableEmits {
  (e: 'update:currentPage', page: number): void
  (e: 'update:pageSize', size: number): void
  (e: 'sort', event: { column: string; direction: 'asc' | 'desc' }): void
  (e: 'filter', event: { filters: Record<string, any> }): void
  (e: 'search', event: { query: string }): void
  (e: 'selection-change', event: { selectedRows: any[] }): void
  (e: 'row-click', event: { row: any; index: number }): void
}

// Tipos de validación
export interface ValidationResult {
  isValid: boolean
  errors: string[]
  value: any
}

// Tipos de utilidades
export interface ThemeConfig {
  colors: Record<string, Record<string, string>>
  sizes: Record<string, string>
  spacing: Record<string, string>
  borderRadius: Record<string, string>
  shadows: Record<string, string>
  transitions: Record<string, string>
}

export interface ComponentTypes {
  [key: string]: string
}

export interface DefaultProps {
  [componentName: string]: Record<string, any>
}

// Tipos para hooks
export interface UseFormValidationReturn {
  errors: Readonly<Ref<Record<string, string>>>
  isValid: ComputedRef<boolean>
  setError: (field: string, message: string) => void
  clearError: (field?: string) => void
  validateField: (field: string, value: any, rules: ValidationRule[]) => boolean
}

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  validator?: (value: any) => boolean
  message?: string
}

// Tipos para utilidades
export interface Utils {
  generateId: (prefix?: string) => string
  formatDate: (date: Date | string, options?: Intl.DateTimeFormatOptions) => string
  formatCurrency: (amount: number, currency?: string, locale?: string) => string
  formatNumber: (number: number, locale?: string, options?: Intl.NumberFormatOptions) => string
  isValidEmail: (email: string) => boolean
  isValidPhone: (phone: string) => boolean
  debounce: <T extends (...args: any[]) => any>(func: T, wait: number) => T
  throttle: <T extends (...args: any[]) => any>(func: T, limit: number) => T
}

// Exportar todos los tipos
export type {
  ComponentSize,
  ComponentVariant,
  ButtonType,
  BaseButtonProps,
  BaseButtonEmits,
  BaseInputProps,
  BaseInputEmits,
  SelectOption,
  BaseSelectProps,
  BaseSelectEmits,
  BaseTextareaProps,
  BaseTextareaEmits,
  BaseCheckboxProps,
  BaseCheckboxEmits,
  RadioOption,
  BaseRadioProps,
  BaseRadioEmits,
  AlertType,
  AlertVariant,
  AlertSize,
  AriaLive,
  BaseAlertProps,
  BaseAlertEmits,
  TabItem,
  BaseTabsProps,
  BaseTabsEmits,
  CardSize,
  CardVariant,
  CardElevation,
  BaseCardProps,
  BaseCardEmits,
  ModalSize,
  BaseModalProps,
  BaseModalEmits,
  DataTableColumn,
  DataTableProps,
  DataTableEmits,
  ValidationResult,
  ThemeConfig,
  ComponentTypes,
  DefaultProps,
  UseFormValidationReturn,
  ValidationRule,
  Utils
}
