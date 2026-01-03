// Cliente GraphQL sin dependencias externas (usando fetch nativo)

const GRAPHQL_URL = "/graphql";

/**
 * Ejecuta una query/mutation GraphQL
 */
async function graphqlRequest(query, variables = {}) {
  const token = localStorage.getItem("token");
  
  console.log("🔑 Token enviado a GraphQL:", token ? "Sí (token presente)" : "❌ NO HAY TOKEN");
  
  const headers = {
    "Content-Type": "application/json"
  };
  
  // Solo agregar Authorization si hay token
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      query,
      variables
    })
  });

  const result = await response.json();
  
  console.log("📊 Respuesta de GraphQL:", result);
  
  if (result.errors) {
    console.error("❌ Error en GraphQL:", result.errors);
    throw new Error(result.errors[0].message);
  }
  
  return result.data;
}

// ==================== QUERIES ====================

export const getProducts = () => graphqlRequest(`
  query {
    products {
      id
      name
      description
      price
      createdAt
    }
  }
`);

export const getMyOrders = () => graphqlRequest(`
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
`);

export const getAllOrders = () => graphqlRequest(`
  query {
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
`);

export const getOrdersByStatus = (status) => graphqlRequest(`
  query GetOrdersByStatus($status: String!) {
    ordersByStatus(status: $status) {
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
`, { status });

export const getAllUsers = () => graphqlRequest(`
  query {
    users {
      id
      username
      role
      createdAt
    }
  }
`);

// ==================== MUTATIONS ====================

export const createOrder = (items) => graphqlRequest(`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      total
      status
      createdAt
    }
  }
`, { input: { items } });

export const updateOrderStatus = (orderId, status) => graphqlRequest(`
  mutation UpdateOrderStatus($input: UpdateOrderStatusInput!) {
    updateOrderStatus(input: $input) {
      id
      status
    }
  }
`, { input: { orderId, status } });

export const deleteOrder = (orderId) => graphqlRequest(`
  mutation DeleteOrder($orderId: ID!) {
    deleteOrder(orderId: $orderId)
  }
`, { orderId });

export const createProduct = (input) => graphqlRequest(`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      name
      description
      price
    }
  }
`, { input });

export const updateProduct = (input) => graphqlRequest(`
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      id
      name
      description
      price
    }
  }
`, { input });

export const deleteProduct = (id) => graphqlRequest(`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`, { id });

export const updateUser = (input) => graphqlRequest(`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      username
      role
    }
  }
`, { input });

export const deleteUser = (userId) => graphqlRequest(`
  mutation DeleteUser($userId: ID!) {
    deleteUser(userId: $userId)
  }
`, { userId });