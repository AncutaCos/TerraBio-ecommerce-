// app/models/Offer.js
import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["percentuale", "articolo-regalo", "trasporto-gratuito"],
  },
  value: {
    type: String,
    required: true,
  },
  giftProduct: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // Prodotto regalo
  expiresAt: {
    type: Date,
    default: null,
  },
  description: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    default: null, // Offerta senza scadenza
  },
  forNewCustomers: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Offer = mongoose.models.Offer || mongoose.model("Offer", offerSchema);

export default Offer;