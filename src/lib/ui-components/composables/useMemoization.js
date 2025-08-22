import { ref, computed, watch, nextTick, onUnmounted } from 'vue'

/**
 * Composable para memoización de valores computados
 * @param {Function} fn - Función a memoizar
 * @param {Array} deps - Dependencias para recalcular
 * @param {Object} options - Opciones de configuración
 * @returns {Object} - Objeto con valor memoizado y métodos de control
 */
export function useMemoized(fn, deps = [], options = {}) {
  const {
    maxAge = 5 * 60 * 1000, // 5 minutos por defecto
    maxSize = 100, // Máximo 100 entradas en caché
    keyFn = null, // Función para generar clave de caché
    onExpire = null // Callback cuando expira un valor
  } = options

  const cache = ref(new Map())
  const lastUpdate = ref(new Map())
  const hitCount = ref(new Map())

  // Generar clave de caché
  const generateKey = (deps) => {
    if (keyFn) {
      return keyFn(deps)
    }
    return JSON.stringify(deps)
  }

  // Verificar si un valor ha expirado
  const isExpired = (key) => {
    const timestamp = lastUpdate.value.get(key)
    if (!timestamp) return true
    return Date.now() - timestamp > maxAge
  }

  // Limpiar valores expirados
  const cleanupExpired = () => {
    for (const [key] of cache.value) {
      if (isExpired(key)) {
        if (onExpire) {
          onExpire(key, cache.value.get(key))
        }
        cache.value.delete(key)
        lastUpdate.value.delete(key)
        hitCount.value.delete(key)
      }
    }
  }

  // Limpiar caché si excede el tamaño máximo
  const cleanupSize = () => {
    if (cache.value.size > maxSize) {
      // Eliminar las entradas menos usadas
      const entries = Array.from(cache.value.entries())
      entries.sort((a, b) => {
        const hitsA = hitCount.value.get(a[0]) || 0
        const hitsB = hitCount.value.get(b[0]) || 0
        return hitsA - hitsB
      })

      const toDelete = entries.slice(0, cache.value.size - maxSize)
      toDelete.forEach(([key]) => {
        cache.value.delete(key)
        lastUpdate.value.delete(key)
        hitCount.value.delete(key)
      })
    }
  }

  // Obtener valor memoizado
  const getMemoizedValue = (deps) => {
    const key = generateKey(deps)
    
    // Limpiar valores expirados
    cleanupExpired()
    
    // Verificar si existe en caché y no ha expirado
    if (cache.value.has(key) && !isExpired(key)) {
      hitCount.value.set(key, (hitCount.value.get(key) || 0) + 1)
      return cache.value.get(key)
    }

    // Calcular nuevo valor
    const value = fn(...deps)
    cache.value.set(key, value)
    lastUpdate.value.set(key, Date.now())
    hitCount.value.set(key, 1)

    // Limpiar si es necesario
    cleanupSize()

    return value
  }

  // Valor computado memoizado
  const memoizedValue = computed(() => {
    return getMemoizedValue(deps)
  })

  // Métodos de control
  const clearCache = () => {
    cache.value.clear()
    lastUpdate.value.clear()
    hitCount.value.clear()
  }

  const invalidate = (depsToInvalidate) => {
    const key = generateKey(depsToInvalidate)
    cache.value.delete(key)
    lastUpdate.value.delete(key)
    hitCount.value.delete(key)
  }

  const getCacheStats = () => {
    return {
      size: cache.value.size,
      maxSize,
      hitRate: Array.from(hitCount.value.values()).reduce((sum, hits) => sum + hits, 0) / cache.value.size || 0,
      entries: Array.from(cache.value.entries()).map(([key, value]) => ({
        key,
        value,
        hits: hitCount.value.get(key) || 0,
        lastUpdate: lastUpdate.value.get(key)
      }))
    }
  }

  // Limpiar caché al desmontar
  onUnmounted(() => {
    clearCache()
  })

  return {
    value: memoizedValue,
    clearCache,
    invalidate,
    getCacheStats,
    cache: cache.value
  }
}

/**
 * Composable para debounce de funciones
 * @param {Function} fn - Función a debouncear
 * @param {number} delay - Delay en milisegundos
 * @returns {Function} - Función debounceada
 */
export function useDebounce(fn, delay = 300) {
  let timeoutId = null

  const debouncedFn = (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    return new Promise((resolve) => {
      timeoutId = setTimeout(() => {
        const result = fn(...args)
        resolve(result)
      }, delay)
    })
  }

  // Limpiar timeout al desmontar
  onUnmounted(() => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  })

  return debouncedFn
}

/**
 * Composable para throttle de funciones
 * @param {Function} fn - Función a throttlear
 * @param {number} limit - Límite de tiempo en milisegundos
 * @returns {Function} - Función throttled
 */
export function useThrottle(fn, limit = 300) {
  let inThrottle = false
  let lastResult = null

  const throttledFn = (...args) => {
    if (!inThrottle) {
      inThrottle = true
      lastResult = fn(...args)
      
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }

    return lastResult
  }

  return throttledFn
}

/**
 * Composable para lazy loading de datos
 * @param {Function} loader - Función que carga los datos
 * @param {Object} options - Opciones de configuración
 * @returns {Object} - Objeto con datos, estado y métodos
 */
export function useLazyData(loader, options = {}) {
  const {
    immediate = false,
    cache = true,
    cacheKey = null,
    retryAttempts = 3,
    retryDelay = 1000
  } = options

  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const attempts = ref(0)
  const cacheData = ref(new Map())

  const load = async (force = false) => {
    if (loading.value) return

    const key = cacheKey ? cacheKey() : 'default'
    
    // Verificar caché
    if (cache && !force && cacheData.value.has(key)) {
      data.value = cacheData.value.get(key)
      return
    }

    loading.value = true
    error.value = null

    try {
      const result = await loader()
      data.value = result
      
      // Guardar en caché
      if (cache) {
        cacheData.value.set(key, result)
      }
      
      attempts.value = 0
    } catch (err) {
      error.value = err
      attempts.value++
      
      // Reintentar automáticamente
      if (attempts.value < retryAttempts) {
        setTimeout(() => {
          load(force)
        }, retryDelay * attempts.value)
      }
    } finally {
      loading.value = false
    }
  }

  const refresh = () => load(true)
  const clearCache = () => cacheData.value.clear()

  // Cargar inmediatamente si se especifica
  if (immediate) {
    nextTick(() => {
      load()
    })
  }

  return {
    data: readonly(data),
    loading: readonly(loading),
    error: readonly(error),
    attempts: readonly(attempts),
    load,
    refresh,
    clearCache
  }
}

/**
 * Composable para virtualización de listas
 * @param {Array} items - Lista de elementos
 * @param {Object} options - Opciones de configuración
 * @returns {Object} - Objeto con elementos virtualizados
 */
export function useVirtualList(items, options = {}) {
  const {
    itemHeight = 50,
    containerHeight = 400,
    overscan = 5
  } = options

  const scrollTop = ref(0)
  const containerRef = ref(null)

  const totalHeight = computed(() => items.value.length * itemHeight)
  
  const visibleRange = computed(() => {
    const start = Math.floor(scrollTop.value / itemHeight)
    const end = Math.min(
      start + Math.ceil(containerHeight / itemHeight) + overscan,
      items.value.length
    )
    
    return {
      start: Math.max(0, start - overscan),
      end
    }
  })

  const visibleItems = computed(() => {
    const { start, end } = visibleRange.value
    return items.value.slice(start, end).map((item, index) => ({
      item,
      index: start + index,
      style: {
        position: 'absolute',
        top: `${(start + index) * itemHeight}px`,
        height: `${itemHeight}px`,
        width: '100%'
      }
    }))
  })

  const handleScroll = (event) => {
    scrollTop.value = event.target.scrollTop
  }

  return {
    containerRef,
    totalHeight,
    visibleItems,
    handleScroll,
    scrollTop: readonly(scrollTop)
  }
}

/**
 * Composable para optimización de re-renders
 * @param {Function} fn - Función a optimizar
 * @param {Array} deps - Dependencias
 * @returns {ComputedRef} - Valor computado optimizado
 */
export function useOptimizedComputed(fn, deps) {
  const lastDeps = ref([])
  const lastResult = ref(null)

  return computed(() => {
    const currentDeps = deps.map(dep => unref(dep))
    
    // Verificar si las dependencias han cambiado
    const depsChanged = currentDeps.some((dep, index) => {
      return !Object.is(dep, lastDeps.value[index])
    })

    if (depsChanged) {
      lastDeps.value = currentDeps
      lastResult.value = fn(...currentDeps)
    }

    return lastResult.value
  })
}

// Exportar todos los composables
export {
  useMemoized,
  useDebounce,
  useThrottle,
  useLazyData,
  useVirtualList,
  useOptimizedComputed
}
