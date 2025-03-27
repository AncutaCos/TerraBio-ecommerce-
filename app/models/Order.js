// app/models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: { type: Number, required: true },
  }],
  shippingAddress: {
    address: String,
    city: String,
    postalCode: String,
  },
  totalAmount: { type: Number, required: true },
  shippingCost: { type: Number, default: 3.5 }, // Costo di spedizione predefinito
  discount: { type: Number, default: 0 }, // Sconto applicato
  appliedOffers: [{
    type: { type: String, enum: ["percentuale", "articolo-regalo", "trasporto-gratuito"] },
    value: String, // Valore dell'offerta (es. "25%", "Spedizione gratuita")
    description: String, // Descrizione dell'offerta
  }],
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model("Order", orderSchema);