# 📚 Documentación GraphQL – Queries y Mutations

Esta documentación describe todas las **Queries** y **Mutations** disponibles en la API GraphQL del proyecto **Practica2_Web**, junto con ejemplos de uso.

---

## 🔍 Queries

### 🛒 Obtener todos los productos

```graphql
query {
  products {
    id
    name
    description
    price
    createdAt
  }
}
```

---

### 📦 Obtener un producto por ID

```graphql
query {
  product(id: "PRODUCT_ID") {
    id
    name
    description
    price
    createdAt
  }
}
```

---

### 📑 Obtener pedidos

```graphql
query {
  orders {
    id
    status
    createdAt
    user {
      id
      username
    }
    items {
      quantity
      product {
        name
        price
      }
    }
  }
}
```

---

### 👤 Obtener usuarios (admin)

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

---

## ✏️ Mutations

### 🔐 Registro de usuario

```graphql
mutation {
  register(input: {
    username: "usuario"
    password: "password123"
  }) {
    id
    username
  }
}
```

---

### 🔑 Login

```graphql
mutation {
  login(input: {
    username: "usuario"
    password: "password123"
  }) {
    token
    user {
      id
      username
      role
    }
  }
}
```

---

### 🛍️ Crear producto (admin)

```graphql
mutation {
  createProduct(input: {
    name: "Producto ejemplo"
    description: "Descripción"
    price: 19.99
  }) {
    id
    name
    price
  }
}
```

---

### 🧾 Crear pedido

```graphql
mutation {
  createOrder(input: {
    items: [
      { productId: "PRODUCT_ID", quantity: 2 }
    ]
  }) {
    id
    status
  }
}
```

---

### 🔄 Actualizar estado del pedido (admin)

```graphql
mutation {
  updateOrderStatus(input: {
    orderId: "ORDER_ID"
    status: "COMPLETED"
  }) {
    id
    status
  }
}
```

---

### ❌ Eliminar pedido

```graphql
mutation {
  deleteOrder(orderId: "ORDER_ID")
}
```

---

### 👥 Actualizar usuario (admin)

```graphql
mutation {
  updateUser(input: {
    userId: "USER_ID"
    role: "ADMIN"
  }) {
    id
    username
    role
  }
}
```

---

## 🔐 Autenticación

* Las mutaciones y queries protegidas requieren un **JWT** en la cabecera:

```
Authorization: Bearer <TOKEN>
```

---

## ✅ Notas finales

* Los permisos **admin** son obligatorios para operaciones críticas.
* Los IDs corresponden a documentos MongoDB.
* Esta documentación puede utilizarse directamente en **GraphQL Playground** o **Apollo Studio**.

---
