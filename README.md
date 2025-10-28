# 🛒 E-Commerce Backend - NestJS

## 📋 Descripción del Proyecto

Aplicación backend de e-commerce desarrollada con **NestJS**, **TypeORM** y **PostgreSQL**. El proyecto implementa un sistema completo de gestión de productos, usuarios, órdenes de compra y autenticación JWT con control de roles.

## 🚀 Características Principales

- **Arquitectura Modular**: Estructura organizada en módulos independientes
- **Autenticación JWT**: Sistema seguro de login y registro
- **Control de Roles**: Administradores y usuarios con permisos diferenciados
- **Base de Datos Relacional**: PostgreSQL con TypeORM y relaciones complejas
- **Validación de Datos**: Validaciones robustas con class-validator
- **Subida de Imágenes**: Integración con Cloudinary
- **Documentación API**: Swagger/OpenAPI integrado
- **Pruebas**: Suite completa de tests unitarios y e2e
- **Paginación**: Sistema de paginación para listados
- **Middleware Global**: Logging de todas las peticiones

## 🛠️ Tecnologías Utilizadas

### Backend
- **NestJS** - Framework de Node.js
- **TypeScript** - Tipado estático
- **TypeORM** - ORM para base de datos
- **PostgreSQL** - Base de datos relacional
- **JWT** - Autenticación con tokens
- **bcrypt** - Encriptación de contraseñas
- **class-validator** - Validación de datos
- **class-transformer** - Transformación de objetos

### Servicios Externos
- **Cloudinary** - Gestión de imágenes
- **Swagger** - Documentación de API

### Testing
- **Jest** - Framework de testing
- **Supertest** - Testing de APIs

## 📁 Estructura del Proyecto

```
src/
├── auth/                    # Módulo de autenticación
│   ├── dto/                # DTOs de login
│   ├── guards/             # Guards de autenticación y roles
│   ├── auth.controller.ts  # Controlador de auth
│   ├── auth.service.ts     # Servicio de auth
│   └── roles.enum.ts       # Enum de roles
├── users/                  # Módulo de usuarios
│   ├── dto/                # DTOs de usuarios
│   ├── entities/           # Entidad Users
│   ├── users.controller.ts # Controlador de usuarios
│   ├── users.service.ts    # Servicio de usuarios
│   └── users.repository.ts # Repositorio de usuarios
├── products/               # Módulo de productos
│   ├── dto/                # DTOs de productos
│   ├── entities/           # Entidad Products
│   ├── products.controller.ts
│   ├── products.service.ts
│   └── products.repository.ts
├── categories/             # Módulo de categorías
├── orders/                 # Módulo de órdenes
├── file-upload/            # Módulo de subida de archivos
├── config/                 # Configuraciones
├── middlewares/            # Middlewares globales
├── decorators/             # Decoradores personalizados
└── test/                   # Pruebas e2e
```

## 🗄️ Modelo de Datos

### Entidades Principales

#### Users
- `id` (UUID) - Clave primaria
- `name` (string) - Nombre del usuario
- `email` (string, único) - Email del usuario
- `password` (string) - Contraseña encriptada
- `address` (string) - Dirección
- `phone` (number) - Teléfono
- `country` (string) - País
- `city` (string) - Ciudad
- `isAdmin` (boolean) - Rol de administrador
- `orders` (relación 1:N) - Órdenes del usuario

#### Products
- `id` (UUID) - Clave primaria
- `name` (string) - Nombre del producto
- `description` (text) - Descripción
- `price` (decimal) - Precio
- `stock` (number) - Stock disponible
- `imgUrl` (string) - URL de imagen
- `category` (relación N:1) - Categoría del producto
- `orderDetails` (relación N:N) - Detalles de órdenes

#### Categories
- `id` (UUID) - Clave primaria
- `name` (string, único) - Nombre de la categoría
- `products` (relación 1:N) - Productos de la categoría

#### Orders
- `id` (UUID) - Clave primaria
- `user` (relación N:1) - Usuario que realizó la orden
- `date` (date) - Fecha de la orden
- `orderDetails` (relación 1:1) - Detalles de la orden

#### OrderDetails
- `id` (UUID) - Clave primaria
- `price` (decimal) - Precio total
- `order` (relación 1:1) - Orden asociada
- `products` (relación N:N) - Productos comprados

## 🔐 Sistema de Autenticación

### Roles
- **User**: Usuario estándar
- **Admin**: Administrador con permisos especiales

### Endpoints de Autenticación
- `POST /auth/signup` - Registro de usuarios
- `POST /auth/signin` - Inicio de sesión

### Protección de Rutas
- **AuthGuard**: Requiere token JWT válido
- **RolesGuard**: Requiere rol específico

## 📚 API Endpoints

### Usuarios
- `GET /users` - Listar usuarios (Admin)
- `GET /users/:id` - Obtener usuario por ID
- `PUT /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario

### Productos
- `GET /products` - Listar productos (paginado)
- `GET /products/:id` - Obtener producto por ID
- `PUT /products/:id` - Actualizar producto (Admin)
- `GET /products/seeder` - Cargar productos de prueba

### Categorías
- `GET /categories` - Listar categorías
- `GET /categories/seeder` - Cargar categorías de prueba

### Órdenes
- `POST /orders` - Crear orden de compra
- `GET /orders/:id` - Obtener orden por ID

### Archivos
- `POST /files/uploadImage/:id` - Subir imagen de producto

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v18 o superior)
- PostgreSQL
- Cuenta de Cloudinary

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd ecommerce-yohita86
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crear archivo `.env` en la raíz del proyecto:
```env
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=ecommerce_db

# JWT
JWT_SECRET=tu_jwt_secret_muy_seguro

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Puerto
PORT=3000
```

### 4. Configurar la base de datos
```bash
# Crear la base de datos en PostgreSQL
createdb ecommerce_db

# Ejecutar migraciones (si las hay)
npm run migration:run
```

### 5. Cargar datos de prueba
```bash
# Cargar categorías
curl http://localhost:3000/categories/seeder

# Cargar productos
curl http://localhost:3000/products/seeder
```

### 6. Ejecutar la aplicación
```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

## 🧪 Testing

### Ejecutar todas las pruebas
```bash
npm run test
```

### Ejecutar pruebas e2e
```bash
npm run test:e2e
```

### Ejecutar con cobertura
```bash
npm run test:cov
```

## 📖 Documentación de API

Una vez que la aplicación esté ejecutándose, puedes acceder a la documentación interactiva de Swagger en:

**http://localhost:3000/api**

La documentación incluye:
- Descripción de todos los endpoints
- Esquemas de request/response
- Ejemplos de uso
- Autenticación integrada para probar endpoints protegidos

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run start:dev          # Ejecutar en modo desarrollo
npm run start:debug        # Ejecutar en modo debug

# Construcción
npm run build              # Compilar TypeScript
npm run start:prod         # Ejecutar versión compilada

# Testing
npm run test               # Ejecutar pruebas unitarias
npm run test:e2e           # Ejecutar pruebas e2e
npm run test:cov           # Ejecutar con cobertura

# Calidad de código
npm run lint               # Ejecutar ESLint
npm run format             # Formatear código con Prettier
```

## 🛡️ Seguridad

- **Contraseñas encriptadas** con bcrypt
- **Tokens JWT** con expiración de 1 hora
- **Validación de datos** en todos los endpoints
- **Control de roles** para operaciones sensibles
- **Variables de entorno** para datos sensibles
- **Validación de archivos** para subida de imágenes

## 📊 Características de Rendimiento

- **Paginación** en listados para optimizar consultas
- **Relaciones optimizadas** en base de datos
- **Middleware de logging** para monitoreo
- **Validación temprana** de datos
- **Manejo de errores** robusto

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Yohita86** - Proyecto Integrador M4 Backend

## 📞 Soporte

Si tienes preguntas o necesitas ayuda, puedes:
- Abrir un issue en GitHub
- Contactar al desarrollador

---

**¡Gracias por usar este proyecto! 🚀**