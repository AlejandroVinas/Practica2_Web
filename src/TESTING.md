# 🧪 Guía de Pruebas - E-Commerce

Esta guía te ayudará a probar todas las funcionalidades implementadas.

## 📋 Checklist de Funcionalidades

### ✅ Autenticación (REST)

#### Test 1: Registro de Usuario
1. Abre http://localhost:3000
2. Completa el formulario de registro:
   - Usuario: `testuser`
   - Contraseña: `password123`
   - Rol: `user`
3. Click en "Registrar"
4. **Resultado esperado**: Mensaje "✅ Usuario registrado. Haz login."

#### Test 2: Registro de Admin
1. Registra otro usuario:
   - Usuario: `admin`
   - Contraseña: `admin123`
   - Rol: `admin`
2. **Resultado esperado**: Usuario creado con rol admin

#### Test 3: Login Correcto
1. Introduce credenciales del usuario
2. Click en "Entrar"
3. **Resultado esperado**: 
   - Se oculta el formulario de auth
   - Aparece el menú de navegación
   - Se muestra el nombre de usuario y rol

#### Test 4: Login Incorrecto
1. Introduce usuario inexistente
2. **Resultado esperado**: Error "Usuario/contraseña inválidos"

---

### 🛍️ Catálogo de Productos (GraphQL)

#### Test 5: Ver Productos Vacío
1. Haz login como usuario normal
2. Click en "🛍️ Productos"
3. **Resultado esperado**: "No hay productos disponibles"

#### Test 6: Crear Producto (Admin)
1. Cierra sesión y haz login como admin
2. Click en "⚙️ Admin"
3. En la tab "Productos", completa:
   - Nombre: `Laptop Dell XPS 15`
   - Precio: `1299.99`
   - Descripción: `Intel i7, 16GB RAM, 512GB SSD`
4. Click "Crear Producto"
5. **Resultado esperado**: Producto aparece en la lista

#### Test 7: Crear Más Productos
Crea al menos 3 productos más:
- `iPhone 14 Pro` - $999.99
- `Mouse Logitech MX Master` - $99.99
- `Teclado Mecánico RGB` - $149.99

#### Test 8: Ver Catálogo Poblado
1. Click en "🛍️ Productos"
2. **Resultado esperado**: Grid con todos los productos creados

---

### 🛒 Sistema de Carrito

#### Test 9: Añadir al Carrito
1. Haz login como usuario normal (no admin)
2. Ve a "🛍️ Productos"
3. Click en "🛒 Añadir al carrito" en varios productos
4. **Resultado esperado**: 
   - Mensaje "✅ [Producto] añadido al carrito"
   - Badge de carrito muestra contador

#### Test 10: Ver Carrito
1. Click en "🛒 Mi Carrito"
2. **Resultado esperado**: 
   - Tabla con productos añadidos
   - Cantidades correctas
   - Cálculo del total correcto

#### Test 11: Modificar Cantidad
1. En el carrito, cambia la cantidad de un producto
2. **Resultado esperado**: 
   - Subtotal se actualiza
   - Total se recalcula
   - Badge se actualiza

#### Test 12: Eliminar del Carrito
1. Click en "❌" de un producto
2. **Resultado esperado**: Producto se elimina de la lista

#### Test 13: Persistencia del Carrito
1. Añade productos al carrito
2. Cierra la pestaña del navegador
3. Abre nuevamente http://localhost:3000
4. Haz login
5. Ve al carrito
6. **Resultado esperado**: Los productos siguen en el carrito

---

### 💳 Proceso de Compra (GraphQL Mutation)

#### Test 14: Finalizar Compra
1. Añade productos al carrito
2. Ve a "🛒 Mi Carrito"
3. Click en "💳 Finalizar Compra"
4. **Resultado esperado**:
   - Mensaje "✅ ¡Pedido realizado con éxito!"
   - Carrito se vacía
   - Badge muestra 0
   - Redirige a "Mis Pedidos"

#### Test 15: Verificar Pedido Creado
1. En "📦 Mis Pedidos"
2. **Resultado esperado**:
   - Aparece la orden recién creada
   - Estado: "⏳ En curso"
   - Total correcto
   - Lista de productos correcta

---

### 📦 Gestión de Pedidos (Usuario)

#### Test 16: Ver Detalle de Pedido
1. En "📦 Mis Pedidos"
2. Click en "Ver productos"
3. **Resultado esperado**: Despliega lista de items con cantidades

#### Test 17: Múltiples Pedidos
1. Vuelve a productos
2. Añade otros productos al carrito
3. Finaliza otra compra
4. **Resultado esperado**: Ambos pedidos visibles en "Mis Pedidos"

---

### 👥 Gestión de Usuarios (Admin)

#### Test 18: Ver Usuarios
1. Login como admin
2. Click en "⚙️ Admin"
3. Click en tab "Usuarios"
4. **Resultado esperado**: Tabla con todos los usuarios registrados

#### Test 19: Cambiar Rol
1. En la lista de usuarios
2. Cambia el select de rol de un usuario
3. **Resultado esperado**: 
   - Mensaje "✅ Rol actualizado"
   - Rol cambia inmediatamente

#### Test 20: Eliminar Usuario
1. Click en "🗑️" de un usuario (no tú mismo)
2. Confirma
3. **Resultado esperado**: 
   - Usuario desaparece de la lista
   - Mensaje de confirmación

#### Test 21: No Auto-eliminarse
1. Intenta eliminar tu propio usuario admin
2. **Resultado esperado**: Botón deshabilitado

---

### 📦 Gestión de Pedidos (Admin)

#### Test 22: Ver Todos los Pedidos
1. Login como admin
2. "⚙️ Admin" → tab "Pedidos"
3. **Resultado esperado**: 
   - Todos los pedidos de todos los usuarios
   - Nombre del usuario en cada pedido

#### Test 23: Filtrar por Estado
1. En el select, elige "En curso (Pending)"
2. Click "Filtrar"
3. **Resultado esperado**: Solo pedidos pendientes

#### Test 24: Cambiar Estado de Pedido
1. Click en "✅ Marcar completado" de un pedido
2. **Resultado esperado**:
   - Estado cambia a "✅ Completado"
   - Badge verde

#### Test 25: Eliminar Pedido
1. Click en "🗑️ Eliminar" de un pedido
2. Confirma
3. **Resultado esperado**: Pedido desaparece

---

### 🛠️ Gestión de Productos (Admin GraphQL)

#### Test 26: Editar Producto
1. En "Admin" → "Productos"
2. Click "✏️" en un producto
3. Cambia nombre o precio
4. **Resultado esperado**: 
   - Producto se actualiza
   - Cambios visibles inmediatamente

#### Test 27: Eliminar Producto
1. Click "🗑️" en un producto
2. Confirma
3. **Resultado esperado**: Producto desaparece

---

### 💬 Chat en Tiempo Real

#### Test 28: Acceder al Chat
1. Login como usuario
2. Click en "💬 Chat"
3. **Resultado esperado**: 
   - Redirección a /chat.html
   - Se muestra nombre de usuario

#### Test 29: Enviar Mensajes
1. Escribe un mensaje
2. Click "Enviar"
3. **Resultado esperado**: 
   - Mensaje aparece en el chat
   - Formato: [hora] usuario: mensaje

#### Test 30: Chat Multi-usuario
1. Abre dos navegadores (o uno normal + uno incógnito)
2. Inicia sesión con diferentes usuarios en cada uno
3. Envía mensajes desde ambos
4. **Resultado esperado**: 
   - Mensajes se ven en tiempo real en ambas ventanas
   - Nombres correctos de cada usuario

---

## 🔍 Tests de GraphQL (Apollo Studio / Postman)

### Test 31: Query de Productos
```graphql
query {
  products {
    id
    name
    price
  }
}
```

### Test 32: Crear Orden (con Auth)
```graphql
mutation {
  createOrder(input: {
    items: [
      { productId: "PRODUCTO_ID_AQUI", quantity: 1 }
    ]
  }) {
    id
    total
    status
  }
}
```

### Test 33: Filtrar Pedidos (Admin)
```graphql
query {
  ordersByStatus(status: "pending") {
    id
    user {
      username
    }
    total
  }
}
```

---

## 🐛 Tests de Error

### Test 34: Crear Pedido sin Auth
1. En GraphQL, sin token
2. Ejecuta `createOrder`
3. **Resultado esperado**: Error "No autenticado"

### Test 35: Ver Usuarios como User
1. Login como usuario normal
2. Query `users`
3. **Resultado esperado**: Error "No autorizado"

### Test 36: Carrito Vacío
1. Ve al carrito sin productos
2. Click "Finalizar Compra"
3. **Resultado esperado**: Error "El carrito está vacío"

---

## ✅ Criterios de Éxito

Para aprobar la práctica, todos estos tests deben pasar:

- ✅ Auth funciona (login/registro)
- ✅ CRUD de usuarios (admin)
- ✅ CRUD de productos vía GraphQL
- ✅ Sistema de carrito con persistencia
- ✅ Flujo completo de compra
- ✅ Gestión de pedidos (filtros, estados)
- ✅ Chat en tiempo real
- ✅ Roles respetados (permisos)
- ✅ GraphQL funcionando con auth

---

## 📊 Puntuación Esperada

Basado en los criterios del PDF:

| Criterio | Puntos | Tests |
|----------|--------|-------|
| GraphQL (Schemas, Queries, Mutations) | 30% | 5, 6, 14, 22-27, 31-33 |
| Carrito y Pedidos | 25% | 9-17 |
| CRUD Usuarios (admin) | 15% | 18-21 |
| Auth, Chat, CRUD productos previos | 15% | 1-8, 28-30 |
| Calidad del código | 10% | Estructura general |
| Documentación | 5% | README.md |

**Total esperado: 100%** ✅