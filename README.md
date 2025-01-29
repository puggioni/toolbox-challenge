# Toolbox Challenge

Aplicación full-stack que consiste en una API en Node.js y un frontend en React. La aplicación obtiene y muestra datos de archivos desde una API externa.

## Características

- API Node.js + Express con los siguientes endpoints:
  - GET /files/data - Obtener datos formateados de todos los archivos
  - GET /files/data?fileName={name} - Obtener datos formateados de un archivo específico
  - GET /files/list - Obtener lista de archivos disponibles
- Frontend React + Bootstrap con:
  - Visualización de datos en formato de tabla responsive
  - Capacidad de filtrado de archivos
  - Estados de carga y manejo de errores
  - Gestión de estado con Redux
- Soporte para Docker

## Estructura del Proyecto

```
.
├── api/                        # API Backend
│   ├── src/                   # Archivos fuente del backend
│   │   ├── index.js          # Punto de entrada de la API
│   │   ├── routes/           # Definición de rutas
│   │   │   └── files.routes.js  # Rutas para el manejo de archivos
│   │   └── services/         # Lógica de negocio
│   │       └── files.service.js # Servicio para procesar archivos
│   ├── test/                 # Archivos de prueba
│   │   └── files.test.js    # Pruebas para endpoints de archivos
│   └── package.json         # Dependencias y scripts del backend
│
├── frontend/                  # Frontend React
│   ├── src/                 # Archivos fuente del frontend
│   │   ├── index.js        # Punto de entrada de React
│   │   ├── App.js         # Componente principal
│   │   └── store/         # Configuración de Redux
│   │       ├── index.js   # Configuración del store
│   │       └── filesSlice.js # Slice para manejo de archivos
│   ├── public/             # Archivos públicos
│   │   └── index.html     # Template HTML principal
│   ├── package.json       # Dependencias y scripts del frontend
│   └── webpack.config.js  # Configuración de Webpack
│
├── Dockerfile.api            # Configuración Docker para API
├── Dockerfile.frontend       # Configuración Docker para Frontend
├── docker-compose.yml        # Configuración Docker Compose
└── package.json             # Scripts globales del proyecto

```

### Detalles de los Componentes Principales

#### Backend (api/)

- `src/index.js`: Configuración del servidor Express, middleware y manejo de errores
- `src/routes/files.routes.js`: Define los endpoints para `/files/data` y `/files/list`
- `src/services/files.service.js`: Implementa la lógica para procesar archivos CSV y comunicación con API externa
- `test/`: Contiene pruebas de integración usando Mocha y Chai

#### Frontend (frontend/)

- `src/App.js`: Componente principal que implementa la interfaz de usuario con React Bootstrap
- `src/store/`: Implementación de Redux para manejo del estado
  - `filesSlice.js`: Define acciones y reducers para manejo de archivos
  - `index.js`: Configura el store de Redux
- `public/index.html`: Template HTML base
- `webpack.config.js`: Configuración de desarrollo y producción de Webpack

#### Configuración Docker

- `Dockerfile.api`: Instrucciones para construir el contenedor de la API
- `Dockerfile.frontend`: Instrucciones para construir el contenedor del frontend
- `docker-compose.yml`: Orquestación de contenedores y configuración de red

#### Configuración Global

- `package.json`: Scripts para instalar dependencias, ejecutar aplicaciones y pruebas

## Ejecutar la Aplicación

### Usando Docker (Recomendado)

1. Construir e iniciar los contenedores:

   ```bash
   docker-compose up --build
   ```

2. Acceder a la aplicación:
   - Frontend: http://localhost:3000
   - API: http://localhost:3001

### Configuración Manual

1. Instalar dependencias para ambos proyectos:

   ```bash
   npm run install:all
   ```

2. Iniciar el servidor API:

   ```bash
   npm run start:api
   ```

3. En una nueva terminal, iniciar el servidor de desarrollo frontend:

   ```bash
   npm run start:frontend
   ```

4. Acceder a la aplicación:
   - Frontend: http://localhost:3000
   - API: http://localhost:3001

## Ejecutar Pruebas

### Pruebas API

```bash
npm run test:api
```

### Pruebas Frontend

```bash
npm run test:frontend
```

## Documentación API

### GET /files/data

Retorna datos formateados de todos los archivos o de un archivo específico si se proporciona el parámetro fileName.

Formato de respuesta:

```json
[
  {
    "file": "file1.csv",
    "lines": [
      {
        "text": "texto ejemplo",
        "number": 123,
        "hex": "a1b2c3..."
      }
    ]
  }
]
```

### GET /files/list

Retorna una lista de archivos disponibles.

Formato de respuesta:

```json
{
  "files": ["file1.csv", "file2.csv"]
}
```

## Tecnologías Utilizadas

### Backend

- Node.js 14
- Express.js
- Mocha & Chai para pruebas
- StandardJS para linting

### Frontend

- React 18
- React Bootstrap
- Redux Toolkit
- Webpack
- Jest para pruebas

### DevOps

- Docker
- Docker Compose

## Características Opcionales Implementadas

- Endpoint GET /files/list
- Filtrado de archivos por nombre
- Integración con Redux
- Soporte para Docker
- Pruebas Jest para frontend
- Linting con StandardJS
