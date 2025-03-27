import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  shortDescription: { type: String, required: true }, // Descrizione breve
  description: { type: String, required: true }, // Descrizione dettagliata
  price: { type: Number, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
  stock: { type: Number, required: true },
  ingredients: { type: String }, // Ingredienti
  usage: { type: String }, // Modalità d’uso
  certifications: [{ type: String }] // Certificazioni (es. Vegan, Bio, Cruelty-Free)
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
