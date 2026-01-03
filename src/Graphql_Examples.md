# 🔍 GraphQL - Ejemplos de Queries y Mutations

Esta guía contiene ejemplos prácticos listos para copiar y pegar en Apollo Studio o tu cliente GraphQL.

## 🔐 Configuración del Header de Autenticación

Para usar queries/mutations que requieren autenticación, añade este header:

```json
{
  "Authorization": "Bearer TU_TOKEN_JWT_AQUI"
}
```

**Cómo obtener el token:**
1. Haz login en la interfaz web o vía REST
2. Copia el token de localStorage o de la respuesta
3. Pégalo en el header de Apollo Studio

---

## 📦 QUERIES - Productos

### 1. Listar todos los productos (público)

```graphql
query GetAllProducts {
  products {
    id
    name
    description
    price
    createdAt
  }
}
```

**Respuesta esperada:**
```json
{
  "data": {
    "products": [
      {
        "id": "675a1b2c3d4e5f6g7h8i9j0k",
        "name": "Laptop Dell XPS 15",
        "description": "Intel i7, 16GB RAM",
        "price": 1299.99,
        "createdAt": "2025-01-03T10:30:00.000Z"
      }
    ]
  }
}
```

### 2. Obtener un producto específico

```graphql
query GetProduct {
  product(id: "675a1b2c3d4e5f6g7h8i9j0k") {
    id
    name
    description
    price
  }
}
```

---

## 📋 QUERIES - Pedidos

### 3. Ver mis pedidos (requiere auth como user)

```graphql
query GetMyOrders {
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
```

**Respuesta esperada:**
```json
{
  "data": {
    "myOrders": [
      {
        "id": "675b2c3d4e5f6g7h8i9j0k1l",
        "total": 1549.98,
        "status": "pending",
        "createdAt": "2025-01-03T15:45:00.000Z",
        "items": [
          {
            "name": "Laptop Dell XPS 15",
            "price": 1299.99,
            "quantity": 1
          },
          {
            "name": "Mouse Logitech",
            "price": 99.99,
            "quantity": 2
          }
        ]
      }
    ]
  }
}
```

### 4. Ver todos los pedidos (requiere auth como admin)

```graphql
query GetAllOrders {
  orders {
    id
    total
    status
    createdAt
    user {
      id
      username
    }
    items {
      name
      price
      quantity
    }
  }
}
```

### 5. Filtrar pedidos por estado (admin)

```graphql
query GetPendingOrders {
  ordersByStatus(status: "pending") {
    id
    total
    createdAt
    user {
      username
    }
    items {
      name
      quantity
    }
  }
}
```

**Otro ejemplo - pedidos completados:**
```graphql
query GetCompletedOrders {
  ordersByStatus(status: "completed") {
    id
    total
    user {
      username
    }
  }
}
```

### 6. Ver un pedido específico

```graphql
query GetOrder {
  order(id: "675b2c3d4e5f6g7h8i9j0k1l") {
    id
    total
    status
    createdAt
    user {
      username
      role
    }
    items {
      product {
        id
        name
      }
      name
      price
      quantity
    }
  }
}
```

---

## 👥 QUERIES - Usuarios (solo admin)

### 7. Listar todos los usuarios

```graphql
query GetAllUsers {
  users {
    id
    username
    role
    createdAt
  }
}
```

### 8. Obtener un usuario específico

```graphql
query GetUser {
  user(id: "675a1b2c3d4e5f6g7h8i9j0k") {
    id
    username
    role
    createdAt
  }
}
```

---

## 🛒 MUTATIONS - Pedidos

### 9. Crear un pedido (requiere auth como user)

```graphql
mutation CreateOrder {
  createOrder(input: {
    items: [
      { productId: "675a1b2c3d4e5f6g7h8i9j0k", quantity: 1 },
      { productId: "675a2b3c4d5e6f7g8h9i0j1k", quantity: 2 }
    ]
  }) {
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
```

**Con variables:**
```graphql
mutation CreateOrder($input: CreateOrderInput!) {
  createOrder(input: $input) {
    id
    total
    status
  }
}
```

**Variables:**
```json
{
  "input": {
    "items": [
      { "productId": "675a1b2c3d4e5f6g7h8i9j0k", "quantity": 1 }
    ]
  }
}
```

### 10. Actualizar estado de pedido (admin)

```graphql
mutation UpdateOrderStatus {
  updateOrderStatus(input: {
    orderId: "675b2c3d4e5f6g7h8i9j0k1l"
    status: "completed"
  }) {
    id
    status
  }
}
```

### 11. Eliminar un pedido (admin)

```graphql
mutation DeleteOrder {
  deleteOrder(orderId: "675b2c3d4e5f6g7h8i9j0k1l")
}
```

---

## 📦 MUTATIONS - Productos (admin)

### 12. Crear producto

```graphql
mutation CreateProduct {
  createProduct(input: {
    name: "Laptop HP Pavilion"
    description: "Intel i5, 8GB RAM, 256GB SSD"
    price: 799.99
  }) {
    id
    name
    price
  }
}
```

**Con variables:**
```graphql
mutation CreateProduct($input: CreateProductInput!) {
  createProduct(input: $input) {
    id
    name
    description
    price
    createdAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "name": "Mouse Razer DeathAdder",
    "description": "Gaming mouse con RGB",
    "price": 69.99
  }
}
```

### 13. Actualizar producto

```graphql
mutation UpdateProduct {
  updateProduct(input: {
    id: "675a1b2c3d4e5f6g7h8i9j0k"
    name: "Laptop Dell XPS 15 (2024)"
    price: 1199.99
  }) {
    id
    name
    price
  }
}
```

### 14. Eliminar producto

```graphql
mutation DeleteProduct {
  deleteProduct(id: "675a1b2c3d4e5f6g7h8i9j0k")
}
```

---

## 👥 MUTATIONS - Usuarios (admin)

### 15. Actualizar usuario (cambiar rol)

```graphql
mutation UpdateUser {
  updateUser(input: {
    userId: "675a1b2c3d4e5f6g7h8i9j0k"
    role: "admin"
  }) {
    id
    username
    role
  }
}
```

**Cambiar username y rol:**
```graphql
mutation UpdateUser {
  updateUser(input: {
    userId: "675a1b2c3d4e5f6g7h8i9j0k"
    username: "nuevo_nombre"
    role: "user"
  }) {
    id
    username
    role
  }
}
```

### 16. Eliminar usuario

```graphql
mutation DeleteUser {
  deleteUser(userId: "675a1b2c3d4e5f6g7h8i9j0k")
}
```

---

## 🔄 QUERIES COMPLEJAS

### 17. Obtener productos con estadísticas de pedidos

```graphql
query ProductsWithOrders {
  products {
    id
    name
    price
  }
  orders {
    items {
      product {
        id
      }
      quantity
    }
  }
}
```

### 18. Dashboard completo (admin)

```graphql
query AdminDashboard {
  users {
    id
    username
    role
  }
  products {
    id
    name
    price
  }
  orders {
    id
    status
    total
    user {
      username
    }
  }
}
```

---

## ⚠️ Manejo de Errores

### Error: No autenticado

```json
{
  "errors": [
    {
      "message": "No autenticado",
      "extensions": {
        "code": "UNAUTHENTICATED"
      }
    }
  ]
}
```

**Solución:** Añade el token JWT en el header Authorization

### Error: No autorizado

```json
{
  "errors": [
    {
      "message": "No autorizado",
      "extensions": {
        "code": "FORBIDDEN"
      }
    }
  ]
}
```

**Solución:** Esta operación requiere rol admin

### Error: Producto no encontrado

```json
{
  "errors": [
    {
      "message": "Producto 675a1b2c3d4e5f6g7h8i9j0k no encontrado"
    }
  ]
}
```

**Solución:** Verifica que el ID del producto sea correcto

---

## 🧪 Flujo de Prueba Completo

### Escenario 1: Usuario hace una compra

```graphql
# 1. Ver productos disponibles
query {
  products {
    id
    name
    price
  }
}

# 2. Crear pedido con productos
mutation {
  createOrder(input: {
    items: [
      { productId: "ID_PRODUCTO_1", quantity: 1 },
      { productId: "ID_PRODUCTO_2", quantity: 2 }
    ]
  }) {
    id
    total
    status
  }
}

# 3. Verificar mis pedidos
query {
  myOrders {
    id
    total
    status
    items {
      name
      quantity
    }
  }
}
```

### Escenario 2: Admin gestiona la tienda

```graphql
# 1. Crear producto
mutation {
  createProduct(input: {
    name: "Producto Nuevo"
    description: "Descripción"
    price: 99.99
  }) {
    id
  }
}

# 2. Ver todos los pedidos
query {
  orders {
    id
    user {
      username
    }
    status
    total
  }
}

# 3. Marcar pedido como completado
mutation {
  updateOrderStatus(input: {
    orderId: "ID_DEL_PEDIDO"
    status: "completed"
  }) {
    id
    status
  }
}

# 4. Gestionar usuarios
query {
  users {
    id
    username
    role
  }
}

mutation {
  updateUser(input: {
    userId: "ID_USUARIO"
    role: "admin"
  }) {
    id
    role
  }
}
```

---

## 💡 Tips y Buenas Prácticas

1. **Usar Variables:** Siempre que puedas, usa variables en lugar de hardcodear valores
2. **Seleccionar solo campos necesarios:** No pidas todos los campos si no los necesitas
3. **Aliases:** Usa aliases para queries múltiples del mismo tipo
4. **Fragmentos:** Reutiliza estructuras de campos comunes

### Ejemplo con Alias

```graphql
query {
  pendingOrders: ordersByStatus(status: "pending") {
    id
    total
  }
  completedOrders: ordersByStatus(status: "completed") {
    id
    total
  }
}
```

### Ejemplo con Fragmentos

```graphql
fragment OrderDetails on Order {
  id
  total
  status
  createdAt
}

query {
  myOrders {
    ...OrderDetails
    items {
      name
      quantity
    }
  }
}
```

---

## 🔗 Enlaces Útiles

- **Apollo Studio:** http://localhost:3000/graphql
- **Documentación GraphQL:** https://graphql.org/
- **Apollo Docs:** https://www.apollographql.com/docs/

¡Listo para probar! 🚀