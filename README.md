# 🎫 Sistema de Emisión de Tickets - Frontend

Un sistema administrativo moderno y completo para la gestión de tickets de venta, construido con Vue 3, Pinia y Tailwind CSS.

## ✨ Características Principales

### 🎨 **Sistema de Temas Avanzado**
- **8 Temas Predefinidos**: Claro, Oscuro, Azul Profesional, Verde Naturaleza, Púrpura Creativo, Atardecer, Océano y Medianoche
- **Personalización de Colores**: 12 colores primarios y de acento disponibles
- **Estilos de Sidebar**: 8 estilos diferentes incluyendo cristal y gradientes
- **Tamaños de Fuente**: 5 opciones desde pequeño hasta extra grande
- **Modo Compacto**: Reduce espaciado para mayor densidad de información
- **Alto Contraste**: Mejora la accesibilidad visual
- **Sin Animaciones**: Opción para usuarios sensibles al movimiento
- **Exportar/Importar**: Guarda y comparte configuraciones de tema

### ⌨️ **Atajos de Teclado Personalizables**
- **Categorías Organizadas**: Navegación, Acciones, Sistema, Reportes, Tickets, Usuarios
- **Atajos por Defecto**: 40+ atajos preconfigurados para todas las funciones
- **Editor Visual**: Interfaz intuitiva para personalizar combinaciones de teclas
- **Estadísticas de Uso**: Seguimiento de frecuencia y tiempo ahorrado
- **Gestión de Estado**: Activar/desactivar atajos individuales
- **Exportar/Importar**: Backup y restauración de configuraciones

### 📱 **Modo Offline Completo**
- **Detección Automática**: Monitorea estado de conexión en tiempo real
- **Almacenamiento Local**: IndexedDB para datos críticos
- **Cola de Sincronización**: Gestiona operaciones pendientes
- **Sincronización Inteligente**: Prioriza datos importantes
- **Configuración Avanzada**: Intervalos, timeouts y reintentos personalizables
- **Historial de Sincronización**: Auditoría completa de operaciones

### 🔔 **Sistema de Notificaciones Avanzado**
- **Tipos Múltiples**: In-app, toast, push del navegador
- **Categorías**: Tickets, Usuarios, Sistema, Seguridad, Reportes
- **Prioridades**: Baja, Media, Alta, Crítica
- **Preferencias del Usuario**: Control granular por categoría
- **Sonidos y Vibración**: Alertas auditivas personalizables
- **Notificaciones Push**: Integración con API del navegador
- **Estadísticas**: Análisis de uso y patrones

### 📊 **Dashboard en Tiempo Real**
- **Métricas Dinámicas**: Actualización automática cada 30 segundos
- **Gráficos Interactivos**: Chart.js para visualizaciones avanzadas
- **Filtros Temporales**: Períodos personalizables para análisis
- **Alertas Críticas**: Notificaciones de eventos importantes
- **Métricas de Rendimiento**: Uptime, tiempo de respuesta, throughput
- **Auto-refresh**: Configurable y pausable

### 📈 **Reportes y Exportación**
- **Múltiples Formatos**: PDF, Excel, CSV, JSON, XML
- **Templates Personalizables**: Diseños reutilizables
- **Programación**: Exportación automática por horarios
- **Cache Inteligente**: Redis para optimización de rendimiento
- **Filtros Avanzados**: Por fecha, zona, tipo de sorteo, usuario
- **Historial de Exportaciones**: Seguimiento completo

### 🔍 **Auditoría y Logs del Sistema**
- **Categorización**: Info, Warning, Error, Critical
- **Filtros Avanzados**: Por usuario, acción, recurso, período
- **Estadísticas**: Análisis de patrones y tendencias
- **Exportación**: Múltiples formatos para análisis externo
- **Retención Configurable**: Políticas de limpieza automática
- **Búsqueda Semántica**: Encuentra eventos específicos rápidamente

## 🚀 Tecnologías Utilizadas

### Frontend
- **Vue 3** - Framework progresivo con Composition API
- **Pinia** - Gestión de estado moderna y tipada
- **Vue Router** - Enrutamiento del lado del cliente
- **Tailwind CSS** - Framework CSS utility-first
- **Chart.js** - Gráficos interactivos y responsivos
- **Heroicons** - Iconografía SVG de alta calidad

### Backend
- **Django** - Framework web Python robusto
- **Django REST Framework** - API RESTful completa
- **Django Simple JWT** - Autenticación segura
- **Redis** - Cache en memoria y colas
- **PostgreSQL** - Base de datos relacional

### Herramientas de Desarrollo
- **Vite** - Build tool moderno y rápido
- **ESLint** - Linting de código JavaScript
- **Prettier** - Formateo automático de código
- **Docker** - Containerización y despliegue

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ 
- npm 9+
- Docker y Docker Compose

### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd tickets-admin-frontend
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

### 4. Iniciar el Backend
```bash
cd ../emision-tickets
docker-compose up -d
```

### 5. Ejecutar el Frontend
```bash
npm run dev
```

## 🔧 Configuración

### Variables de Entorno
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_TITLE=Sistema de Emisión de Tickets
VITE_APP_VERSION=1.0.0
```

### Configuración de Temas
Los temas se configuran automáticamente desde el panel de configuración:
- Navega a **Configuración > Temas**
- Selecciona un tema predefinido
- Personaliza colores y estilos
- Guarda configuraciones personalizadas

### Configuración de Atajos
- Navega a **Configuración > Atajos de Teclado**
- Haz clic en cualquier atajo para editarlo
- Presiona la combinación de teclas deseada
- Los cambios se guardan automáticamente

## 📱 Uso

### Autenticación
- **Usuario por defecto**: `admin`
- **Contraseña**: `admin1234`
- **JWT**: Renovación automática de tokens

### Navegación Principal
- **Dashboard**: Vista general del sistema
- **Catálogo**: Gestión de zonas, tipos de sorteo y horarios
- **Usuarios**: Administración de usuarios y roles
- **Tickets**: Creación y gestión de tickets de venta
- **Reportes**: Generación y exportación de datos
- **Configuración**: Personalización del sistema

### Funcionalidades Avanzadas

#### Modo Offline
1. El sistema detecta automáticamente la pérdida de conexión
2. Los datos se almacenan localmente
3. Las operaciones se encolan para sincronización posterior
4. Al reconectar, se sincronizan automáticamente

#### Notificaciones
1. Configura preferencias por categoría
2. Habilita notificaciones push del navegador
3. Personaliza sonidos y alertas
4. Revisa estadísticas de uso

#### Temas
1. Selecciona un tema base
2. Personaliza colores primarios y de acento
3. Ajusta estilos de sidebar
4. Configura modo compacto y alto contraste

## 🎯 Características de Accesibilidad

- **Navegación por Teclado**: Todos los elementos son accesibles via teclado
- **Alto Contraste**: Modo especial para usuarios con problemas visuales
- **Reducción de Movimiento**: Respeta preferencias del sistema
- **Screen Readers**: Compatible con lectores de pantalla
- **Focus Management**: Indicadores visuales claros de foco
- **Responsive Design**: Funciona en todos los tamaños de pantalla

## 🔒 Seguridad

- **JWT Tokens**: Autenticación segura y renovable
- **HTTPS**: Comunicación encriptada
- **Validación de Entrada**: Sanitización de datos del usuario
- **CSRF Protection**: Protección contra ataques cross-site
- **Rate Limiting**: Prevención de abuso de API
- **Auditoría**: Logs completos de todas las acciones

## 📊 Rendimiento

- **Lazy Loading**: Carga de componentes bajo demanda
- **Cache Inteligente**: Redis para datos frecuentemente accedidos
- **Code Splitting**: División automática de bundles
- **Tree Shaking**: Eliminación de código no utilizado
- **Image Optimization**: Compresión automática de imágenes
- **Service Workers**: Cache offline para recursos estáticos

## 🧪 Testing

### Ejecutar Tests
```bash
# Tests unitarios
npm run test:unit

# Tests de integración
npm run test:integration

# Tests E2E
npm run test:e2e

# Cobertura de código
npm run test:coverage
```

### Estructura de Tests
```
tests/
├── unit/           # Tests unitarios
├── integration/    # Tests de integración
├── e2e/           # Tests end-to-end
└── fixtures/      # Datos de prueba
```

## 🚀 Despliegue

### Producción
```bash
npm run build
npm run preview
```

### Docker
```bash
docker build -t tickets-admin-frontend .
docker run -p 3000:80 tickets-admin-frontend
```

### Variables de Producción
```env
NODE_ENV=production
VITE_API_BASE_URL=https://api.tuempresa.com
VITE_APP_TITLE=Sistema de Tickets - Producción
```

## 📈 Monitoreo y Logs

### Métricas del Sistema
- **Uptime**: Disponibilidad del sistema
- **Response Time**: Tiempo de respuesta de la API
- **Error Rate**: Tasa de errores
- **User Activity**: Actividad de usuarios
- **Cache Hit Rate**: Efectividad del cache

### Logs Estructurados
- **Niveles**: Debug, Info, Warning, Error, Critical
- **Categorías**: Auth, API, Database, Cache, System
- **Contexto**: Usuario, IP, Timestamp, Acción
- **Retención**: Configurable por nivel y categoría

## 🤝 Contribución

### Guías de Contribución
1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Estándares de Código
- **ESLint**: Configuración estricta de JavaScript
- **Prettier**: Formateo automático de código
- **Vue Style Guide**: Mejores prácticas de Vue 3
- **TypeScript**: Tipado opcional para mejor mantenibilidad

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

### Documentación
- **API Docs**: `/api/docs/` (Swagger UI)
- **Component Library**: Storybook para componentes
- **Guías de Usuario**: Documentación interactiva

### Canales de Soporte
- **Issues**: GitHub Issues para bugs y features
- **Discussions**: GitHub Discussions para preguntas
- **Wiki**: Documentación colaborativa
- **Email**: soporte@tuempresa.com

### Comunidad
- **Slack**: Canal #tickets-system
- **Discord**: Servidor de desarrolladores
- **Meetups**: Eventos mensuales
- **Blog**: Artículos técnicos y tutoriales

## 🔮 Roadmap

### Versión 1.1 (Q2 2024)
- [ ] Integración con sistemas de pago
- [ ] Reportes avanzados con ML
- [ ] API GraphQL
- [ ] PWA completa

### Versión 1.2 (Q3 2024)
- [ ] Multi-tenancy
- [ ] Analytics avanzados
- [ ] Integración con BI tools
- [ ] Mobile app nativa

### Versión 2.0 (Q4 2024)
- [ ] Microservicios
- [ ] Event sourcing
- [ ] Machine Learning
- [ ] Blockchain integration

---

**Desarrollado con ❤️ por el equipo de desarrollo de [Tu Empresa]**

*Para más información, visita [tuempresa.com](https://tuempresa.com)*
