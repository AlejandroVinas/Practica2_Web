export const typeDefs = `#graphql
  # Tipos básicos
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

  type OrderItem {
    product: Product
    name: String!
    price: Float!
    quantity: Int!
  }

  type Order {
    id: ID!
    user: User!
    items: [OrderItem!]!
    total: Float!
    status: String!
    createdAt: String!
  }

  # Input types para mutations
  input OrderItemInput {
    productId: ID!
    quantity: Int!
  }

  input CreateOrderInput {
    items: [OrderItemInput!]!
  }

  input UpdateOrderStatusInput {
    orderId: ID!
    status: String!
  }

  input UpdateUserInput {
    userId: ID!
    role: String
    username: String
  }

  input CreateProductInput {
    name: String!
    description: String
    price: Float!
  }

  input UpdateProductInput {
    id: ID!
    name: String
    description: String
    price: Float
  }

  # Queries
  type Query {
    # Productos
    products: [Product!]!
    product(id: ID!): Product

    # Pedidos
    orders: [Order!]!
    order(id: ID!): Order
    myOrders: [Order!]!
    ordersByStatus(status: String!): [Order!]!

    # Usuarios (solo admin)
    users: [User!]!
    user(id: ID!): User
  }

  # Mutations
  type Mutation {
    # Pedidos
    createOrder(input: CreateOrderInput!): Order!
    updateOrderStatus(input: UpdateOrderStatusInput!): Order!
    deleteOrder(orderId: ID!): Boolean!

    # Productos (admin)
    createProduct(input: CreateProductInput!): Product!
    updateProduct(input: UpdateProductInput!): Product!
    deleteProduct(id: ID!): Boolean!

    # Usuarios (admin)
    updateUser(input: UpdateUserInput!): User!
    deleteUser(userId: ID!): Boolean!
  }
`;