# 🛒 E-Commerce con GraphQL y Gestión de Pedidos

## 📋 Descripción

Evolución del Portal de Productos hacia un E-commerce completo con integración de GraphQL, sistema de carrito de compras y gestión completa de pedidos.

## 🎯 Características Principales

### Para Usuarios (role: user)
- ✅ Registro e inicio de sesión con JWT
- 🛍️ Navegación de catálogo de productos
- 🛒 Sistema de carrito de compras persistente
- 💳 Simulación de compra (conversión de carrito a orden)
- 📦 Visualización de historial de pedidos
- 💬 Chat en tiempo real con Socket.IO

### Para Administradores (role: admin)
- 👥 CRUD completo de usuarios (listar, cambiar roles, eliminar)
- 📦 CRUD de productos vía GraphQL
- 📊 Gestión de pedidos (listar, filtrar por estado, cambiar estado)
- 🔍 Filtrado de pedidos por estado (pending/completed)
- 📈 Visualización detallada de cada pedido

## 🏗️ Arquitectura

### Backend
- **Node.js + Express**: Servidor HTTP y API REST
- **Apollo Server**: Servidor GraphQL
- **MongoDB + Mongoose**: Base de datos y ODM
- **JWT**: Autenticación y autorización
- **Socket.IO**: Chat en tiempo real
- **bcrypt**: Hash de contraseñas

### Frontend
- **Vanilla JavaScript**: Sin frameworks (ES6 Modules)
- **HTML5 + CSS3**: Interfaz responsive
- **GraphQL Client**: Fetch nativo para queries/mutations

## 📂 Estructura del Proyecto

```
/src
  /models
    - User.js           # Modelo de usuario
    - Product.js        # Modelo de producto
    - Order.js          # Modelo de pedido (NUEVO)
  
  /routes
    - authRoutes.js     # Login y registro
    - productRoutes.js  # CRUD productos REST
    - userRoutes.js     # CRUD usuarios REST (NUEVO)
    - chatRoutes.js     # Ruta del chat
  
  /middleware
    - authenticateJWT.js # Middleware de autenticación
    - isAdmin.js        # Middleware de autorización admin
  
  /graphql
    - schema.js         # TypeDefs GraphQL (NUEVO)
    - resolvers.js      # Resolvers GraphQL (NUEVO)
  
  /public
    - index.html        # SPA principal
    - chat.html         # Vista del chat
    - styles.css        # Estilos
    - app.js            # Lógica principal (NUEVO)
    - graphqlClient.js  # Cliente GraphQL (NUEVO)
    - cartManager.js    # Gestión del carrito (NUEVO)
  
  - server.js           # Punto de entrada
  - config.js           # Configuración
  - package.json
```

## 🚀 Instalación y Ejecución

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=tu_secreto_super_seguro_aqui
```

### 3. Iniciar MongoDB

Asegúrate de tener MongoDB corriendo:

```bash
# Linux/Mac
mongod

# Windows
net start MongoDB
```

### 4. Iniciar el servidor

```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start
```

El servidor estará disponible en:
- **API REST**: http://localhost:3000
- **GraphQL**: http://localhost:3000/graphql
- **Frontend**: http://localhost:3000

## 📊 Esquema GraphQL

### Tipos

```graphql
type User {
  id: ID!
  username: String!
  role: String!
  createdAt: String!
}

type Product {
  id: ID!
  name: String!
  description: String
  price: Float!
  createdAt: String!
}

type Order {
  id: ID!
  user: User!
  items: [OrderItem!]!
  total: Float!
  status: String!  # "pending" o "completed"
  createdAt: String!
}

type OrderItem {
  product: Product
  name: String!
  price: Float!
  quantity: Int!
}
```

### Queries

#### Productos
```graphql
# Listar todos los productos
query {
  products {
    id
    name
    description
    price
  }
}

# Obtener un producto por ID
query {
  product(id: "ID_DEL_PRODUCTO") {
    id
    name
    price
  }
}
```

#### Pedidos (requiere autenticación)
```graphql
# Mis pedidos
query {
  myOrders {
    id
    total
    status
    createdAt
    items {
      name
      price
      quantity
    }
  }
}

# Todos los pedidos (solo admin)
query {
  orders {
    id
    total
    status
    user {
      username
    }
  }
}

# Filtrar pedidos por estado (solo admin)
query {
  ordersByStatus(status: "pending") {
    id
    total
    user {
      username
    }
  }
}
```

#### Usuarios (solo admin)
```graphql
query {
  users {
    id
    username
    role
    createdAt
  }
}
```

### Mutations

#### Crear Pedido
```graphql
mutation {
  createOrder(input: {
    items: [
      { productId: "ID_PRODUCTO_1", quantity: 2 },
      { productId: "ID_PRODUCTO_2", quantity: 1 }
    ]
  }) {
    id
    total
    status
  }
}
```

#### Actualizar Estado de Pedido (solo admin)
```graphql
mutation {
  updateOrderStatus(input: {
    orderId: "ID_DEL_PEDIDO"
    status: "completed"
  }) {
    id
    status
  }
}
```

#### Gestión de Productos (solo admin)
```graphql
# Crear producto
mutation {
  createProduct(input: {
    name: "Laptop HP"
    description: "16GB RAM, 512GB SSD"
    price: 899.99
  }) {
    id
    name
  }
}

# Actualizar producto
mutation {
  updateProduct(input: {
    id: "ID_DEL_PRODUCTO"
    name: "Laptop HP Pro"
    price: 799.99
  }) {
    id
    name
  }
}

# Eliminar producto
mutation {
  deleteProduct(id: "ID_DEL_PRODUCTO")
}
```

#### Gestión de Usuarios (solo admin)
```graphql
# Cambiar rol de usuario
mutation {
  updateUser(input: {
    userId: "ID_DEL_USUARIO"
    role: "admin"
  }) {
    id
    username
    role
  }
}

# Eliminar usuario
mutation {
  deleteUser(userId: "ID_DEL_USUARIO")
}
```

## 🔐 Autenticación GraphQL

Para usar queries/mutations que requieren autenticación, incluye el token JWT en el header:

```javascript
const response = await fetch('/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer TU_TOKEN_JWT_AQUI'
  },
  body: JSON.stringify({
    query: '...',
    variables: {}
  })
});
```

## 🛠️ Endpoints REST (Autenticación)

### Registro
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "usuario",
  "password": "contraseña",
  "role": "user"  // o "admin"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "usuario",
  "password": "contraseña"
}

# Respuesta
{
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "username": "usuario",
    "role": "user"
  }
}
```

## 💾 Modelos de Datos

### User
```javascript
{
  username: String (unique, required),
  password: String (hashed, required),
  role: String (enum: ["user", "admin"]),
  createdAt: Date,
  updatedAt: Date
}
```

### Product
```javascript
{
  name: String (required),
  description: String,
  price: Number (required),
  createdAt: Date,
  updatedAt: Date
}
```

### Order
```javascript
{
  user: ObjectId (ref: User, required),
  items: [{
    product: ObjectId (ref: Product),
    name: String (required),
    price: Number (required),
    quantity: Number (required)
  }],
  total: Number (calculated, required),
  status: String (enum: ["pending", "completed"]),
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 Funcionalidades del Carrito

El carrito se gestiona en el **frontend** con persistencia en `localStorage`:

1. **Añadir productos**: Click en "Añadir al carrito"
2. **Ver carrito**: Badge con contador + vista detallada
3. **Modificar cantidades**: Input numérico en tabla
4. **Eliminar items**: Botón de eliminar individual
5. **Finalizar compra**: Convierte carrito en Order vía GraphQL
6. **Persistencia**: Se mantiene entre sesiones

## 🔄 Flujo de Compra

1. Usuario navega productos
2. Añade productos al carrito (localStorage)
3. Va a "Mi Carrito"
4. Revisa items y total
5. Click "Finalizar Compra"
6. Mutation `createOrder` se ejecuta
7. Orden se crea con estado "pending"
8. Carrito se vacía
9. Usuario puede ver el pedido en "Mis Pedidos"

## 👨‍💼 Panel de Administración

### Gestión de Productos
- Crear productos con GraphQL
- Editar precio/nombre/descripción
- Eliminar productos

### Gestión de Pedidos
- Ver todos los pedidos
- Filtrar por estado (pending/completed)
- Cambiar estado de pedidos
- Ver detalle completo (usuario, items, total)
- Eliminar pedidos

### Gestión de Usuarios
- Listar todos los usuarios
- Cambiar roles (user ↔ admin)
- Eliminar usuarios
- Ver fecha de registro

## 🧪 Testing con GraphQL Playground

Puedes probar las queries y mutations en:
```
http://localhost:3000/graphql
```

Ejemplo de uso:
1. Primero haz login por REST para obtener el token
2. En Apollo Studio/Playground, añade el header:
   ```
   {
     "Authorization": "Bearer TU_TOKEN"
   }
   ```
3. Ejecuta tus queries/mutations

## 📝 Decisiones de Diseño

### ¿Por qué GraphQL + REST?
- **REST para autenticación**: Más simple para login/registro
- **GraphQL para datos**: Queries flexibles, menos requests
- **Coexistencia**: Migración gradual sin romper funcionalidad

### Persistencia del Carrito
- **localStorage**: Simple, no requiere backend
- **Ventajas**: Rápido, sin latencia, sin DB
- **Limitaciones**: Solo cliente, no sincroniza entre dispositivos

### Estado de Pedidos
- **pending**: Orden creada, esperando procesamiento
- **completed**: Orden procesada/enviada/finalizada

## 🐛 Troubleshooting

### Error: "Token inválido"
- Verifica que el token no haya expirado (8h)
- Asegúrate de incluir "Bearer " antes del token

### Error: "No autorizado"
- Verifica que el usuario tenga rol "admin" si es requerido
- Confirma que el token esté en el header correcto

### Carrito no persiste
- Verifica que localStorage esté habilitado
- Comprueba que no estés en modo incógnito

### MongoDB no conecta
- Verifica que MongoDB esté corriendo
- Revisa la URI en `.env`

## 📦 Dependencias Principales

```json
{
  "@apollo/server": "^4.10.0",
  "express": "^4.22.1",
  "mongoose": "^8.0.0",
  "jsonwebtoken": "^9.0.2",
  "bcrypt": "^5.1.1",
  "socket.io": "^4.6.0",
  "graphql": "^16.8.1"
}
```

## 🎓 Créditos

Práctica 2 - Desarrollo de Aplicaciones Web
Universidad del Atlántico

## 📄 Licencia

ISC