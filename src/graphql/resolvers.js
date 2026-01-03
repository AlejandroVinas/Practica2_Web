import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

export const resolvers = {
  Query: {
    // PRODUCTOS
    products: async () => {
      return await Product.find().sort({ createdAt: -1 });
    },
    
    product: async (_, { id }) => {
      return await Product.findById(id);
    },

    // PEDIDOS
    orders: async (_, __, context) => {
      // Solo admin puede ver todos los pedidos
      if (!context.user || context.user.role !== "admin") {
        throw new Error("No autorizado");
      }
      return await Order.find()
        .populate("user")
        .populate("items.product")
        .sort({ createdAt: -1 });
    },

    order: async (_, { id }, context) => {
      if (!context.user) throw new Error("No autenticado");
      
      const order = await Order.findById(id)
        .populate("user")
        .populate("items.product");
      
      if (!order) throw new Error("Pedido no encontrado");
      
      // Solo el dueño o admin puede ver el pedido
      if (order.user._id.toString() !== context.user.id && context.user.role !== "admin") {
        throw new Error("No autorizado");
      }
      
      return order;
    },

    myOrders: async (_, __, context) => {
      if (!context.user) throw new Error("No autenticado");
      
      return await Order.find({ user: context.user.id })
        .populate("items.product")
        .sort({ createdAt: -1 });
    },

    ordersByStatus: async (_, { status }, context) => {
      if (!context.user || context.user.role !== "admin") {
        throw new Error("No autorizado");
      }
      
      return await Order.find({ status })
        .populate("user")
        .populate("items.product")
        .sort({ createdAt: -1 });
    },

    // USUARIOS (solo admin)
    users: async (_, __, context) => {
      if (!context.user || context.user.role !== "admin") {
        throw new Error("No autorizado");
      }
      return await User.find().select("-password").sort({ createdAt: -1 });
    },

    user: async (_, { id }, context) => {
      if (!context.user || context.user.role !== "admin") {
        throw new Error("No autorizado");
      }
      return await User.findById(id).select("-password");
    }
  },

  Mutation: {
    // CREAR PEDIDO
    createOrder: async (_, { input }, context) => {
      if (!context.user) throw new Error("No autenticado");

      const { items } = input;

      // Validar que hay items
      if (!items || items.length === 0) {
        throw new Error("El carrito está vacío");
      }

      // Obtener productos y construir items del pedido
      const orderItems = [];
      let totalCalculado = 0;
      
      for (const item of items) {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw new Error(`Producto ${item.productId} no encontrado`);
        }
        
        // Calcular subtotal de este item
        const subtotal = product.price * item.quantity;
        totalCalculado += subtotal;
        
        orderItems.push({
          product: product._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity
        });
      }

      // Crear orden con total calculado
      const order = new Order({
        user: context.user.id,
        items: orderItems,
        total: totalCalculado, // AGREGAMOS EL TOTAL EXPLÍCITAMENTE
        status: "pending"
      });

      await order.save();
      
      // Poblar datos para respuesta
      await order.populate("user");
      await order.populate("items.product");

      console.log("✅ Orden creada:", {
        id: order._id,
        user: order.user.username,
        items: order.items.length,
        total: order.total
      });

      return order;
    },

    // ACTUALIZAR ESTADO DE PEDIDO (solo admin)
    updateOrderStatus: async (_, { input }, context) => {
      if (!context.user || context.user.role !== "admin") {
        throw new Error("No autorizado");
      }

      const { orderId, status } = input;

      if (!["pending", "completed"].includes(status)) {
        throw new Error("Estado inválido");
      }

      const order = await Order.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      )
        .populate("user")
        .populate("items.product");

      if (!order) throw new Error("Pedido no encontrado");

      return order;
    },

    // ELIMINAR PEDIDO (solo admin)
    deleteOrder: async (_, { orderId }, context) => {
      if (!context.user || context.user.role !== "admin") {
        throw new Error("No autorizado");
      }

      const order = await Order.findByIdAndDelete(orderId);
      return !!order;
    },

    // CREAR PRODUCTO (admin)
    createProduct: async (_, { input }, context) => {
      if (!context.user || context.user.role !== "admin") {
        throw new Error("No autorizado");
      }

      const product = new Product(input);
      await product.save();
      return product;
    },

    // ACTUALIZAR PRODUCTO (admin)
    updateProduct: async (_, { input }, context) => {
      if (!context.user || context.user.role !== "admin") {
        throw new Error("No autorizado");
      }

      const { id, ...updates } = input;
      const product = await Product.findByIdAndUpdate(id, updates, { new: true });
      
      if (!product) throw new Error("Producto no encontrado");
      return product;
    },

    // ELIMINAR PRODUCTO (admin)
    deleteProduct: async (_, { id }, context) => {
      if (!context.user || context.user.role !== "admin") {
        throw new Error("No autorizado");
      }

      const product = await Product.findByIdAndDelete(id);
      return !!product;
    },

    // ACTUALIZAR USUARIO (admin)
    updateUser: async (_, { input }, context) => {
      if (!context.user || context.user.role !== "admin") {
        throw new Error("No autorizado");
      }

      const { userId, ...updates } = input;
      
      // No permitir cambiar la contraseña por GraphQL (usar endpoint REST)
      delete updates.password;

      const user = await User.findByIdAndUpdate(userId, updates, { new: true })
        .select("-password");
      
      if (!user) throw new Error("Usuario no encontrado");
      return user;
    },

    // ELIMINAR USUARIO (admin)
    deleteUser: async (_, { userId }, context) => {
      if (!context.user || context.user.role !== "admin") {
        throw new Error("No autorizado");
      }

      // No permitir que el admin se elimine a sí mismo
      if (userId === context.user.id) {
        throw new Error("No puedes eliminarte a ti mismo");
      }

      const user = await User.findByIdAndDelete(userId);
      return !!user;
    }
  },

  // Resolvers de campos personalizados
  Order: {
    user: async (parent) => {
      if (parent.user && parent.user.username) return parent.user;
      return await User.findById(parent.user).select("-password");
    }
  },

  OrderItem: {
    product: async (parent) => {
      if (parent.product && parent.product.name) return parent.product;
      return await Product.findById(parent.product);
    }
  }
};