import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  items: [{
    product: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Product", 
      required: true 
    },
    name: { type: String, required: true }, // Guardamos nombre por si se borra el producto
    price: { type: Number, required: true }, // Precio en el momento de la compra
    quantity: { type: Number, required: true, min: 1 }
  }],
  total: { 
    type: Number, 
    required: true,
    default: 0  // AGREGAMOS DEFAULT
  },
  status: { 
    type: String, 
    enum: ["pending", "completed"], 
    default: "pending" 
  }
}, { timestamps: true });

// Método para calcular el total
orderSchema.methods.calculateTotal = function() {
  this.total = this.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
  return this.total;
};

// Pre-save hook para calcular total automáticamente
orderSchema.pre("save", function(next) {
  // Calcular el total antes de guardar
  if (this.items && this.items.length > 0) {
    this.total = this.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
  }
  next();
});

export default mongoose.model("Order", orderSchema);