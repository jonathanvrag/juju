# API de Gestión de Libros - Book Management API

> Sistema RESTful completo para la gestión de libros, reservas y préstamos en una biblioteca digital, construido con **Node.js**, **TypeScript**, **Express** y **MongoDB** siguiendo principios de **Clean Architecture** y **Domain-Driven Design (DDD)**.

---

## Tabla de Contenidos

1. [Características](#características)
2. [Requisitos Previos](#requisitos-previos)
3. [Instalación](#instalación)
4. [Configuración](#configuración)
5. [Ejecución](#ejecución)
6. [Arquitectura](#arquitectura)
7. [Patrones de Diseño](#patrones-de-diseño)
8. [Diagramas](#diagramas)
9. [Endpoints de la API](#endpoints-de-la-api)
10. [Ejemplos de Uso](#ejemplos-de-uso)
11. [Estructura del Proyecto](#estructura-del-proyecto)
12. [Tecnologías Utilizadas](#tecnologías-utilizadas)

---

## Características

### Funcionalidades Principales

- **Autenticación y Autorización** - Basada en JWT con manejo seguro de contraseñas
- **Gestión de Libros** - CRUD completo con paginación y filtros avanzados
- **Sistema de Reservas** - Reservar libros con fechas de expiración automáticas
- **Gestión de Préstamos** - Tomar prestado y devolver libros con seguimiento
- **Trabajos Automatizados** - Cron job para expirar reservas automáticamente cada 30 minutos
- **Documentación Interactiva** - Swagger UI para explorar y probar endpoints
- **Arquitectura Limpia** - Separación clara de responsabilidades con DDD
- **Manejo Centralizado de Errores** - Sistema robusto de gestión de errores
- **Validación de Requests** - Esquemas Joi para todos los endpoints
- **Logging Estructurado** - Winston para trazabilidad completa
- **Seguridad** - Helmet, CORS y Rate Limiting implementados

---

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** >= 18.x
- **npm** >= 9.x
- **MongoDB** >= 6.x (local o MongoDB Atlas)
- **Git**

Verifica las versiones instaladas:

```bash
node --version    # v18.x.x o superior
npm --version     # 9.x.x o superior
mongod --version  # 6.x.x o superior
```

---

## Instalación

### Paso 1: Clonar el Repositorio

```bash
git clone <https://github.com/jonathanvrag/juju.git>
cd backend
```

### Paso 2: Instalar Dependencias

```bash
npm install
```

### Paso 3: Instalar Dependencias de Desarrollo

```bash
npm install --save-dev
```

Verifica la instalación exitosa:

```bash
npm list | head -20
```

---

## Configuración

### Paso 1: Crear Archivo .env

Crea un archivo `.env` en la raíz del proyecto:

```bash
touch .env
```

### Paso 2: Configurar Variables de Entorno

Copia el siguiente contenido en tu archivo `.env`:

```env
# =====================================
# CONFIGURACIÓN DEL SERVIDOR
# =====================================
PORT=3000
NODE_ENV=development

# =====================================
# CONFIGURACIÓN DE BASE DE DATOS
# =====================================
# Para MongoDB local:
MONGO_URI=mongodb://localhost:27017/book-management

# Para MongoDB Atlas (nube):
# MONGO_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/book-management?retryWrites=true&w=majority

# =====================================
# CONFIGURACIÓN JWT
# =====================================
JWT_SECRET=
JWT_EXPIRATION=24h

# =====================================
# CONFIGURACIÓN CORS
# =====================================
CORS_ORIGIN=*

# Para producción (localhost específico):
# CORS_ORIGIN=

# =====================================
# CONFIGURACIÓN DE LOGGING
# =====================================
LOG_LEVEL=info
LOG_FILE=logs/app.log
```

### Configuración Detallada de Variables

| Variable         | Descripción              | Ejemplo                                     | Obligatoria |
| ---------------- | ------------------------ | ------------------------------------------- | ----------- |
| `PORT`           | Puerto del servidor      | `3000`                                      | Sí          |
| `NODE_ENV`       | Modo de ejecución        | `development` o `production`                | Sí          |
| `MONGO_URI`      | Conexión a MongoDB       | `mongodb://localhost:27017/book-management` | Sí          |
| `JWT_SECRET`     | Clave secreta para JWT   | Mínimo 32 caracteres                        | Sí          |
| `JWT_EXPIRATION` | Expiración del token     | `7d`, `24h`, `30m`                          | Sí          |
| `CORS_ORIGIN`    | Orígenes CORS permitidos | `*` o URL específica                        | No          |

---

## Ejecución

### Opción 1: Modo Desarrollo (con Nodemon)

Para desarrollo con recarga automática:

```bash
npm run dev
```

Salida esperada:

```
[dotenv] injecting env (7) from .env
[MongoDB] Connected successfully
2026-01-30 22:30:36:3036 info: [Server] Running on port 3000
2026-01-30 22:30:36:3036 info: [Server] Environment: development
2026-01-30 22:30:36:3036 info: [Server] Health check: http://localhost:3000/health
2026-01-30 22:30:36:3036 info: [Server] API: http://localhost:3000/api
[Cron] Reservation expiration job scheduled (every 30 minutes)
```

### Opción 2: Modo Producción

Compilar y ejecutar:

```bash
npm run build
npm start
```

---

## Acceder a la Aplicación

Una vez que el servidor esté corriendo:

- **API Principal:** http://localhost:3000/api
- **Documentación Swagger:** http://localhost:3000/api-docs
- **Health Check:** http://localhost:3000/health

---

## Arquitectura

### Visión General de la Arquitectura

El proyecto implementa **Clean Architecture** divida en 4 capas principales:

```
┌─────────────────────────────────────────────────────────┐
│                   INTERFACES (HTTP)                      │
│  Controllers → Routes → Middlewares → Validators         │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                  APLICACIÓN                             │
│  Use Cases → DTOs → Lógica de Negocio                   │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                    DOMINIO                              │
│  Entities → Value Objects → Repository Interfaces       │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│               INFRAESTRUCTURA                           │
│  MongoDB → Logger → Cron → Swagger → Errors             │
└─────────────────────────────────────────────────────────┘
```

### Estructura del Código

```
src/
├── domain/                          # Capa de Dominio
│   ├── entities/                    # Entidades del negocio
│   │   ├── User.ts                  # Entidad Usuario
│   │   ├── Book.ts                  # Entidad Libro
│   │   ├── Reservation.ts           # Entidad Reserva
│   │   └── Loan.ts                  # Entidad Préstamo
│   └── repositories/                # Interfaces de repositorios
│       ├── IUserRepository.ts
│       ├── IBookRepository.ts
│       ├── IReservationRepository.ts
│       └── ILoanRepository.ts
│
├── application/                     # Capa de Aplicación
│   ├── use-cases/                   # Casos de uso
│   │   ├── auth/
│   │   ├── books/
│   │   ├── reservations/
│   │   └── loans/
│   └── dtos/                        # Objetos de Transferencia de Datos
│       ├── UserDTO.ts
│       ├── BookDTO.ts
│       ├── ReservationDTO.ts
│       └── LoanDTO.ts
│
├── infrastructure/                  # Capa de Infraestructura
│   ├── database/
│   │   └── mongodb/
│   │       ├── connection.ts        # Conexión a MongoDB
│   │       ├── models/              # Esquemas de Mongoose
│   │       └── repositories/        # Implementaciones de repositorios
│   ├── logging/                     # Logging con Winston
│   ├── cron/                        # Trabajos programados
│   └── swagger/                     # Configuración de Swagger
│
├── interfaces/                      # Capa HTTP
│   └── http/
│       ├── controllers/             # Manejadores de requests
│       ├── routes/                  # Definición de rutas
│       ├── middlewares/             # Middlewares personalizados
│       └── validators/              # Esquemas de validación Joi
│
└── shared/                          # Compartido
    └── errors/                      # Clases de errores personalizadas
        ├── AppError.ts
        ├── NotFoundError.ts
        ├── ConflictError.ts
        ├── ValidationError.ts
        └── UnauthorizedError.ts
```

---

## Patrones de Diseño

### 1. **Clean Architecture**

Separa la aplicación en capas independientes, cada una con una responsabilidad específica:

- **Dominio:** Sin dependencias externas, contiene lógica pura del negocio
- **Aplicación:** Orquesta el flujo de negocio usando casos de uso
- **Infraestructura:** Implementa detalles técnicos (BD, logs, etc.)
- **Interfaces:** Maneja la comunicación HTTP

**Ventajas:**

- Fácil de testear
- Código mantenible
- Bajo acoplamiento
- Facilita cambios tecnológicos

### 2. **Domain-Driven Design (DDD)**

Modelado del dominio con entidades, value objects y repositorios:

```typescript
// Ejemplo: Entidad de Dominio
export interface Book {
  id?: string;
  title: string;
  author: string;
  isbn: string;
  status: 'available' | 'reserved' | 'loaned';
  createdAt?: Date;
}

// Repositorio (Interfaz)
export interface IBookRepository {
  create(book: Book): Promise<Book>;
  findById(id: string): Promise<Book | null>;
  update(id: string, data: Partial<Book>): Promise<Book | null>;
}
```

### 3. **Repository Pattern**

Abstracción de acceso a datos, desacoplando la lógica de negocio de la persistencia:

```typescript
// Interfaz en Dominio
export interface IBookRepository {
  create(book: Book): Promise<Book>;
  findById(id: string): Promise<Book | null>;
}

// Implementación en Infraestructura
export class MongoBookRepository implements IBookRepository {
  async create(book: Book): Promise<Book> {
    // Implementación con MongoDB
  }
}
```

### 4. **Use Case Pattern**

Cada operación de negocio es un caso de uso independiente:

```typescript
export class CreateBook {
  constructor(private bookRepository: IBookRepository) {}

  async execute(dto: CreateBookDTO): Promise<Book> {
    // Validar lógica de negocio
    // Crear libro
    // Persistir
    // Retornar
  }
}
```

### 5. **Dependency Injection**

Las dependencias se inyectan en lugar de crear instancias internas:

```typescript
// ❌ Incorrecto (acoplado)
export class BookController {
  private repository = new MongoBookRepository();
}

// ✅ Correcto (inyectado)
export class BookController {
  constructor(private repository: IBookRepository) {}
}
```

### 6. **DTO Pattern (Data Transfer Objects)**

Transferencia de datos entre capas sin exponer entidades internas:

```typescript
export interface CreateBookDTO {
  title: string;
  author: string;
  isbn: string;
  publishedYear: number;
  genre: string;
}
```

### 7. **Error Handling Centralizado**

Jerarquía de errores personalizados:

```typescript
AppError (base)
├── NotFoundError (404)
├── ConflictError (409)
├── ValidationError (400)
└── UnauthorizedError (401)
```

---

## Diagramas

### Diagrama 1: Flujo de Ciclo de Vida del Libro

```
┌──────────────┐
│  AVAILABLE   │ ← Estado inicial
└──────┬───────┘
       │
       │ Usuario reserva
       ▼
┌──────────────┐
│  RESERVED    │ ← Libro apartado (hasta fecha expiración)
└──────┬───────┘
       │
       ├─────────────────────────┬──────────────────────┐
       │                         │                      │
    (Cancel)              (Fulfill)              (Expired)
       │                         │                      │
       ▼                         ▼                      ▼
┌──────────────┐          ┌──────────────┐      ┌──────────────┐
│  AVAILABLE   │          │   LOANED     │      │  AVAILABLE   │
│(devuelto)    │          │(préstamo)    │      │(expiración)  │
└──────────────┘          └──────┬───────┘      └──────────────┘
                                 │
                            (Return)
                                 │
                                 ▼
                          ┌──────────────┐
                          │  AVAILABLE   │
                          └──────────────┘
```

### Diagrama 2: Flujo de Autenticación y Autorización

```
┌─────────────────┐
│  Cliente        │
└────────┬────────┘
         │
         │ POST /api/auth/register
         │ {name, email, password}
         ▼
    ┌─────────────────────────────┐
    │ AuthController.register()   │
    └──────────┬──────────────────┘
               │
               ▼
    ┌─────────────────────────────┐
    │ RegisterUser UseCase        │
    │ - Validar email único       │
    │ - Hash password (bcrypt)    │
    │ - Crear usuario             │
    └──────────┬──────────────────┘
               │
               ▼
    ┌─────────────────────────────┐
    │ MongoUserRepository         │
    │ Guardar en MongoDB          │
    └──────────┬──────────────────┘
               │
               ▼
    ┌─────────────────────────────┐
    │ JWT Token generado          │
    │ {userId, role, exp: 24h}    │
    └──────────┬──────────────────┘
               │
               ▼
         ┌──────────────────┐
         │ Respuesta 201    │
         │ {user, token}    │
         └──────────────────┘
```

### Diagrama 3: Flujo de Creación de Reserva

```
┌──────────────────────────────┐
│ Cliente autenticado          │
│ POST /api/reservations       │
│ {bookId, expirationDate}     │
└──────────────┬───────────────┘
               │
               ▼
        ┌──────────────────────┐
        │ Validación Joi       │
        │ - bookId válido      │
        │ - fecha en futuro    │
        └──────────┬───────────┘
                   │
                   ▼
    ┌─────────────────────────────────┐
    │ CreateReservation UseCase       │
    │                                 │
    │ 1. Validar libro existe         │
    │ 2. Validar status == available  │
    │ 3. Validar sin reserva activa   │
    │ 4. Crear reserva                │
    │ 5. Actualizar libro a reserved  │
    └──────────┬──────────────────────┘
               │
               ▼
    ┌─────────────────────────────────┐
    │ MongoReservationRepository      │
    │ Guardar reserva en MongoDB      │
    └──────────┬──────────────────────┘
               │
               ▼
    ┌─────────────────────────────────┐
    │ MongoBookRepository             │
    │ Actualizar status a 'reserved'  │
    └──────────┬──────────────────────┘
               │
               ▼
         ┌──────────────────┐
         │ Respuesta 201    │
         │ {reservation}    │
         └──────────────────┘
```

### Diagrama 4: Arquitectura de Capas en Acción

```
REQUEST HTTP
    │
    │ POST /api/books
    │ {title, author, isbn, ...}
    │ Authorization: Bearer TOKEN
    ▼
┌────────────────────────────────────────────────┐
│ INTERFACES LAYER                               │
│ ┌──────────────────────────────────────────┐   │
│ │ authMiddleware                           │   │ ← Verificar JWT
│ └──────────────────────────────────────────┘   │
│ ┌──────────────────────────────────────────┐   │
│ │ validationMiddleware + createBookSchema  │   │ ← Validar datos
│ └──────────────────────────────────────────┘   │
│ ┌──────────────────────────────────────────┐   │
│ │ BookController.create()                  │   │ ← Manejar request
│ └──────────────────────────────────────────┘   │
└──────────────┬─────────────────────────────────┘
               │
               ▼
┌────────────────────────────────────────────────┐
│ APPLICATION LAYER                              │
│ ┌──────────────────────────────────────────┐   │
│ │ CreateBook UseCase                       │   │ ← Orquestar lógica
│ │ - Validar ISBN único                     │   │
│ │ - Crear DTO                              │   │
│ │ - Llamar a repositorio                   │   │
│ └──────────────────────────────────────────┘   │
└──────────────┬─────────────────────────────────┘
               │
               ▼
┌────────────────────────────────────────────────┐
│ DOMAIN LAYER                                   │
│ ┌──────────────────────────────────────────┐   │
│ │ IBookRepository (interfaz)               │   │ ← Contrato
│ └──────────────────────────────────────────┘   │
└──────────────┬─────────────────────────────────┘
               │
               ▼
┌────────────────────────────────────────────────┐
│ INFRASTRUCTURE LAYER                           │
│ ┌──────────────────────────────────────────┐   │
│ │ MongoBookRepository.create()             │   │ ← Implementación
│ │ → BookModel.create(data)                 │   │
│ │ → Guardar en MongoDB                     │   │
│ └──────────────────────────────────────────┘   │
└──────────────┬─────────────────────────────────┘
               │
               ▼
         RESPONSE JSON
         {status: 'success', data: {book}}
```

### Diagrama 5: Cron Job de Expiración de Reservas

```
┌─────────────────────────────────┐
│ Servidor Node.js iniciado       │
└──────────────┬──────────────────┘
               │
               ▼
    ┌──────────────────────────────┐
    │ ReservationExpirationJob     │
    │ start() llamado              │
    └──────────────┬───────────────┘
                   │
                   ▼
    ┌──────────────────────────────┐
    │ node-cron schedule           │
    │ Pattern: */30 * * * *        │
    │ (cada 30 minutos)            │
    └──────────────┬───────────────┘
                   │
    ┌──────────────┴─────────────┬────────────────┐
    │                            │                │
  Minuto 00:30            Minuto 01:00      Minuto 01:30
    │                            │                │
    ▼                            ▼                ▼
  Execute()                  Execute()         Execute()
    │                            │                │
    └─────────┬──────────────────┴────────────────┘
              │
              ▼
    ┌──────────────────────────────┐
    │ MongoReservationRepository   │
    │ findExpired()                │
    │ Buscar: status='active' AND  │
    │         expirationDate < NOW │
    └──────────────┬───────────────┘
                   │
                   ▼
    ┌──────────────────────────────┐
    │ Por cada reserva expirada:   │
    │ 1. Marcar como 'expired'     │
    │ 2. Liberar libro             │
    │ 3. Loguear acción            │
    └──────────────┬───────────────┘
                   │
                   ▼
    ┌──────────────────────────────┐
    │ Log: "[Cron] Expired X       │
    │ reservation(s)"              │
    └──────────────────────────────┘
```

---

## Endpoints de la API

### Autenticación

```
POST   /api/auth/register      Registrar nuevo usuario
POST   /api/auth/login         Iniciar sesión
```

### Libros

```
GET    /api/books              Listar todos los libros (con paginación)
GET    /api/books/:id          Obtener libro por ID
POST   /api/books              Crear nuevo libro (requiere auth)
PUT    /api/books/:id          Actualizar libro (requiere auth)
DELETE /api/books/:id          Eliminar libro (requiere auth)
```

### Reservas

```
POST   /api/reservations                    Crear reserva
DELETE /api/reservations/:id/cancel         Cancelar reserva
POST   /api/reservations/:id/fulfill        Cumplir reserva (convertir a préstamo)
GET    /api/reservations/my-reservations    Obtener mis reservas
```

### Préstamos

```
POST   /api/loans              Crear préstamo
PUT    /api/loans/:id/return   Devolver libro
GET    /api/loans/my-loans     Obtener mis préstamos
```

### Administración

```
POST   /api/admin/expire-reservations   Expirar reservas manualmente
GET    /api/admin/health                Health check extendido
```

---

## Ejemplos de Uso

### 1. Registrar Usuario

**Request:**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "MiContraseña123!"
  }'
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "679d4680452aaa6de8fdf1ae",
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Crear Libro

**Request:**

```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Código Limpio",
    "author": "Robert C. Martin",
    "isbn": "978-0132350884",
    "publishedYear": 2008,
    "genre": "Tecnología"
  }'
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "book": {
      "id": "679d4680452aaa6de8fdf1bf",
      "title": "Código Limpio",
      "author": "Robert C. Martin",
      "isbn": "978-0132350884",
      "publishedYear": 2008,
      "genre": "Tecnología",
      "status": "available",
      "createdAt": "2026-01-30T22:45:00Z",
      "updatedAt": "2026-01-30T22:45:00Z"
    }
  }
}
```

### 3. Reservar Libro

**Request:**

```bash
curl -X POST http://localhost:3000/api/reservations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "bookId": "679d4680452aaa6de8fdf1bf",
    "expirationDate": "2026-02-05T23:59:59.000Z"
  }'
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "reservation": {
      "id": "679d4680452aaa6de8fdf1c0",
      "bookId": "679d4680452aaa6de8fdf1bf",
      "userId": "679d4680452aaa6de8fdf1ae",
      "reservationDate": "2026-01-30T22:50:00Z",
      "expirationDate": "2026-02-05T23:59:59.000Z",
      "status": "active",
      "createdAt": "2026-01-30T22:50:00Z"
    }
  }
}
```

### 4. Cumplir Reserva (Recoger Libro)

**Request:**

```bash
curl -X POST http://localhost:3000/api/reservations/679d4680452aaa6de8fdf1c0/fulfill \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "loanDueDate": "2026-02-20T23:59:59.000Z"
  }'
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "loan": {
      "id": "679d4680452aaa6de8fdf1c1",
      "bookId": "679d4680452aaa6de8fdf1bf",
      "userId": "679d4680452aaa6de8fdf1ae",
      "loanDate": "2026-01-30T22:55:00Z",
      "dueDate": "2026-02-20T23:59:59.000Z",
      "status": "active",
      "createdAt": "2026-01-30T22:55:00Z"
    }
  }
}
```

### 5. Devolver Libro

**Request:**

```bash
curl -X PUT http://localhost:3000/api/loans/679d4680452aaa6de8fdf1c1/return \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{}'
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "loan": {
      "id": "679d4680452aaa6de8fdf1c1",
      "status": "returned",
      "returnDate": "2026-01-30T23:00:00Z"
    }
  }
}
```

---

## Estructura Detallada del Proyecto

### Capa de Dominio

```
domain/
├── entities/
│   ├── User.ts                    # Interface del Usuario
│   ├── Book.ts                    # Interface del Libro
│   ├── Reservation.ts             # Interface de Reserva
│   └── Loan.ts                    # Interface de Préstamo
└── repositories/
    ├── IUserRepository.ts         # Contrato de repositorio de usuarios
    ├── IBookRepository.ts         # Contrato de repositorio de libros
    ├── IReservationRepository.ts  # Contrato de repositorio de reservas
    └── ILoanRepository.ts         # Contrato de repositorio de préstamos
```

**Propósito:** Define las reglas de negocio sin dependencias externas.

### Capa de Aplicación

```
application/
├── use-cases/
│   ├── auth/
│   │   ├── RegisterUser.ts        # UC: Registrar usuario
│   │   └── LoginUser.ts           # UC: Iniciar sesión
│   ├── books/
│   │   ├── CreateBook.ts          # UC: Crear libro
│   │   ├── GetBooks.ts            # UC: Obtener libros
│   │   ├── UpdateBook.ts          # UC: Actualizar libro
│   │   └── DeleteBook.ts          # UC: Eliminar libro
│   ├── reservations/
│   │   ├── CreateReservation.ts   # UC: Crear reserva
│   │   ├── CancelReservation.ts   # UC: Cancelar reserva
│   │   ├── FulfillReservation.ts  # UC: Cumplir reserva
│   │   ├── GetUserReservations.ts # UC: Obtener mis reservas
│   │   └── ExpireReservations.ts  # UC: Expirar reservas
│   └── loans/
│       ├── CreateLoan.ts          # UC: Crear préstamo
│       ├── ReturnBook.ts          # UC: Devolver libro
│       └── GetUserLoans.ts        # UC: Obtener mis préstamos
└── dtos/
    ├── UserDTO.ts                 # DTO del Usuario
    ├── BookDTO.ts                 # DTO del Libro
    ├── ReservationDTO.ts          # DTO de Reserva
    └── LoanDTO.ts                 # DTO de Préstamo
```

**Propósito:** Orquesta la lógica de negocio y coordina entre capas.

### Capa de Infraestructura

```
infrastructure/
├── database/
│   └── mongodb/
│       ├── connection.ts          # Conexión a MongoDB
│       ├── models/
│       │   ├── UserModel.ts       # Schema de Usuario
│       │   ├── BookModel.ts       # Schema de Libro
│       │   ├── ReservationModel.ts # Schema de Reserva
│       │   └── LoanModel.ts       # Schema de Préstamo
│       └── repositories/
│           ├── MongoUserRepository.ts
│           ├── MongoBookRepository.ts
│           ├── MongoReservationRepository.ts
│           └── MongoLoanRepository.ts
├── logging/
│   └── Logger.ts                  # Configuración de Winston
├── cron/
│   └── ReservationExpirationJob.ts # Job de expiración de reservas
└── swagger/
    └── swaggerConfig.ts           # Configuración de Swagger
```

**Propósito:** Implementa detalles técnicos de almacenamiento y logging.

### Capa HTTP

```
interfaces/http/
├── controllers/
│   ├── AuthController.ts          # Maneja requests de autenticación
│   ├── BookController.ts          # Maneja requests de libros
│   ├── ReservationController.ts   # Maneja requests de reservas
│   ├── LoanController.ts          # Maneja requests de préstamos
│   └── AdminController.ts         # Maneja requests de admin
├── routes/
│   ├── authRoutes.ts              # Rutas de autenticación
│   ├── bookRoutes.ts              # Rutas de libros
│   ├── reservationRoutes.ts       # Rutas de reservas
│   ├── loanRoutes.ts              # Rutas de préstamos
│   ├── adminRoutes.ts             # Rutas administrativas
│   └── index.ts                   # Agregador de rutas
├── middlewares/
│   ├── authMiddleware.ts          # Validación de JWT
│   ├── validationMiddleware.ts    # Validación con Joi
│   ├── errorHandler.ts            # Manejo global de errores
│   └── loggerMiddleware.ts        # Logging de requests
└── validators/
    ├── authValidators.ts          # Esquemas de validación de auth
    ├── bookValidators.ts          # Esquemas de validación de libros
    ├── reservationValidators.ts   # Esquemas de validación de reservas
    └── loanValidators.ts          # Esquemas de validación de préstamos
```

**Propósito:** Maneja la comunicación HTTP entre cliente y servidor.

---

## Tecnologías Utilizadas

### Core del Servidor

| Tecnología     | Versión | Propósito             |
| -------------- | ------- | --------------------- |
| **Node.js**    | 18.x+   | Runtime de JavaScript |
| **TypeScript** | 5.x     | Tipado estático       |
| **Express**    | 4.x     | Framework web         |
| **MongoDB**    | 6.x+    | Base de datos NoSQL   |
| **Mongoose**   | 7.x+    | ODM para MongoDB      |

### Seguridad y Validación

| Tecnología             | Propósito              |
| ---------------------- | ---------------------- |
| **jsonwebtoken**       | Autenticación JWT      |
| **bcryptjs**           | Hashing de contraseñas |
| **joi**                | Validación de esquemas |
| **helmet**             | Headers de seguridad   |
| **cors**               | CORS middleware        |
| **express-rate-limit** | Rate limiting          |

### Documentación y Logging

| Tecnología             | Propósito            |
| ---------------------- | -------------------- |
| **swagger-ui-express** | Interfaz Swagger     |
| **swagger-jsdoc**      | Anotaciones Swagger  |
| **winston**            | Logging estructurado |

### Automatización y Utilidades

| Tecnología    | Propósito                        |
| ------------- | -------------------------------- |
| **node-cron** | Trabajos programados             |
| **dotenv**    | Variables de entorno             |
| **nodemon**   | Recarga automática en desarrollo |

---

## Principios de Diseño Aplicados

### SOLID

- **S**ingle Responsibility: Cada clase tiene una única razón para cambiar
- **O**pen/Closed: Abierto para extensión, cerrado para modificación
- **L**iskov Substitution: Las subclases pueden reemplazar a sus clases base
- **I**nterface Segregation: Interfaces específicas para cada cliente
- **D**ependency Inversion: Depender de abstracciones, no de concreciones

### DRY (Don't Repeat Yourself)

- Código reutilizable en utilidades
- Servicios compartidos
- Middlewares centralizados

### KISS (Keep It Simple, Stupid)

- Código simple y directo
- Evitar sobre-ingeniería
- Soluciones pragmáticas
