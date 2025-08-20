# 🎟️ Tickets Admin Frontend

Dashboard de administración para el sistema de emisión de tickets construido con Vue.js 3.

## 🚀 Características

- **Vue.js 3** con Composition API
- **Tailwind CSS** para estilos
- **Pinia** para gestión de estado
- **Vue Router** para navegación
- **Chart.js** para gráficos
- **Axios** para peticiones HTTP
- **Heroicons** para iconografía

## 📋 Requisitos

- Node.js 18+
- npm o yarn

## ⚙️ Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de producción
npm run preview
```

## 🔧 Configuración

El frontend está configurado para conectarse al backend en `http://localhost:8000`.

### Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:8000
VITE_APP_TITLE=Tickets Admin
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   └── layout/         # Componentes de layout
├── views/              # Vistas de la aplicación
├── stores/             # Stores de Pinia
├── router/             # Configuración de rutas
├── assets/             # Recursos estáticos
├── style.css           # Estilos globales
└── main.js             # Punto de entrada
```

## 🎨 Componentes Principales

- **AdminLayout**: Layout principal con sidebar y header
- **DashboardView**: Vista principal con estadísticas y gráficos
- **LoginView**: Formulario de autenticación
- **CatalogView**: Gestión de catálogos (zonas, tipos de sorteo)
- **UsersView**: Gestión de usuarios
- **ReportsView**: Reportes y análisis

## 🔐 Autenticación

El sistema usa JWT tokens para autenticación:

- Los tokens se almacenan en localStorage
- Refresh automático de tokens
- Protección de rutas con guardias

## 📱 Responsive Design

El dashboard es completamente responsive y funciona en:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🧪 Testing

```bash
# Ejecutar tests
npm run test

# Tests con cobertura
npm run test:coverage

# Tests E2E
npm run test:e2e
```

## 🚀 Deployment

### Build para producción

```bash
npm run build
```

Los archivos se generan en `dist/` y pueden ser servidos por cualquier servidor web estático.

### Docker

```bash
# Construir imagen
docker build -t tickets-admin-frontend .

# Ejecutar contenedor
docker run -p 3000:80 tickets-admin-frontend
```

## 🔗 Integración con Backend

El frontend se conecta al backend Django a través de la API REST:

- **Autenticación**: `/api/auth/`
- **Catálogos**: `/api/catalog/`
- **Ventas**: `/api/sales/`
- **Usuarios**: `/api/auth/users/`

## 📈 Roadmap

### Fase 1 ✅
- [x] Dashboard principal
- [x] Autenticación
- [x] Layout responsive
- [x] Gráficos básicos

### Fase 2 🚧
- [ ] Gestión completa de catálogos
- [ ] Reportes avanzados
- [ ] Exportación de datos
- [ ] Notificaciones en tiempo real

### Fase 3 📋
- [ ] PWA para vendedores
- [ ] Componentes reutilizables
- [ ] Tests E2E
- [ ] Optimización de rendimiento

## 🤝 Contribución

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para más detalles.

---

Desarrollado con ❤️ para el sistema de emisión de tickets.
