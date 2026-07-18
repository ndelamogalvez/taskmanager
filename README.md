# TaskManager

Aplicación web tipo Trello para gestión de tareas con tableros, listas y tarjetas.

## Stack

| Capa       | Tecnología               |
|------------|--------------------------|
| Frontend   | Angular 17 (standalone) + Angular Material |
| Backend    | Spring Boot 3 + Spring Security + JWT |
| Base datos | MySQL 8                  |
| Contención | Docker + Docker Compose  |

## Funcionalidades

- Registro e inicio de sesión con JWT
- CRUD de tableros, listas y tarjetas
- Arrastrar y soltar tarjetas entre listas
- Reordenar listas
- Asignación de miembros a tableros
- Etiquetas en tarjetas
- Fechas de vencimiento
- Log de actividad por tablero
- Protección de rutas en frontend

## Requisitos

- Docker y Docker Compose

## Inicio rápido

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/taskmanager.git
cd taskmanager

# Iniciar todos los servicios
docker compose up -d
```

Esto levanta 4 contenedores:

| Servicio   | Puerto | URL                        |
|------------|--------|----------------------------|
| Frontend   | 4200   | http://localhost:4200       |
| Backend    | 8085   | http://localhost:8085       |
| MySQL      | 3308   |                            |
| phpMyAdmin | 8082   | http://localhost:8082       |

### phpMyAdmin

- **Servidor**: `mysql`
- **Usuario**: `root`
- **Contraseña**: `rootpassword`

## Variables de entorno

Crear archivo `.env` en la raíz:

```env
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=taskmanager
MYSQL_USER=taskmanager
MYSQL_PASSWORD=taskmanager
JWT_SECRET=tu_secreto_jwt
```

## Ejecutar sin Docker

### Backend

```bash
cd backend
mvn spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
ng serve
```

## Estructura del proyecto

```
taskmanager/
├── backend/                    # Spring Boot API
│   └── src/main/java/com/taskmanager/
│       ├── config/             # JWT, seguridad
│       ├── controller/         # Endpoints REST
│       ├── dto/                # Request/Response DTOs
│       ├── exception/          # Manejo global de errores
│       ├── model/              # Entidades JPA
│       ├── repository/         # Repositorios Spring Data
│       └── service/            # Lógica de negocio
├── frontend/                   # Angular SPA
│   └── src/app/
│       ├── core/               # Servicios, guards, interceptors, modelos
│       ├── features/           # Componentes por funcionalidad
│       └── shared/             # Componentes compartidos
├── docker-compose.yml
├── init.sql
└── .env
```

## API

### Autenticación

| Método | Ruta                | Descripción          |
|--------|---------------------|----------------------|
| POST   | `/api/auth/register` | Registrar usuario    |
| POST   | `/api/auth/login`    | Iniciar sesión       |

### Tableros (requieren JWT)

| Método | Ruta                | Descripción               |
|--------|---------------------|---------------------------|
| GET    | `/api/boards`       | Listar tableros propios   |
| POST   | `/api/boards`       | Crear tablero             |
| GET    | `/api/boards/{id}`  | Obtener tablero completo  |
| PUT    | `/api/boards/{id}`  | Actualizar tablero        |
| DELETE | `/api/boards/{id}`  | Eliminar tablero          |

### Listas

| Método | Ruta                                   | Descripción         |
|--------|----------------------------------------|---------------------|
| POST   | `/api/boards/{id}/lists`               | Crear lista         |
| PUT    | `/api/lists/{id}`                      | Actualizar lista    |
| DELETE | `/api/lists/{id}`                      | Eliminar lista      |
| PUT    | `/api/boards/{id}/lists/reorder`       | Reordenar listas    |

### Tarjetas

| Método | Ruta                                   | Descripción            |
|--------|----------------------------------------|------------------------|
| POST   | `/api/lists/{id}/cards`                | Crear tarjeta          |
| PUT    | `/api/cards/{id}`                      | Actualizar tarjeta     |
| DELETE | `/api/cards/{id}`                      | Eliminar tarjeta       |
| PUT    | `/api/cards/{id}/move`                 | Mover tarjeta de lista |
