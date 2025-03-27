"use client";
import { useState } from "react";
import "./ProductForm.css";

const ProductForm = ({ product, onClose, refreshProducts }) => {
  // Se product esiste, siamo in modalità "modifica", altrimenti "nuovo prodotto"
  const [formData, setFormData] = useState({
    name: product ? product.name : "",
    shortDescription: product ? product.shortDescription : "",
    description: product ? product.description : "",
    price: product ? product.price : "",
    category: product ? product.category : "",
    imageUrl: product ? product.imageUrl : "",
    stock: product ? product.stock : "",
    ingredients: product ? product.ingredients : "",
    usage: product ? product.usage : "",
    certifications: product ? product.certifications.join(", ") : ""
  });

  // Gestione del cambiamento dei campi
  const handleChange = (e) => {
    console.log("Product ID:", product ? product._id : "Nessun prodotto passato");

    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Gestione dell'invio del modulo
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Converti le certificazioni da stringa separata da virgole ad un array
    const certificationsArray = formData.certifications
      .split(",")
      .map((cert) => cert.trim())
      .filter((cert) => cert !== "");
    const productData = { ...formData, certifications: certificationsArray };

    try {
      // Se 'product' esiste, siamo in modalità modifica (PUT), altrimenti in modalità creazione (POST)
      const method = product ? "PUT" : "POST";
      const url = product ? `/api/products/${product._id}` : "/api/products";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData)
      });
      if (!response.ok) {
        // Ottieni eventualmente il testo della risposta per maggiori dettagli
        const errorText = await response.text();
        throw new Error("Errore nell'invio dei dati: " + errorText);
      }
      const data = await response.json();
      refreshProducts && refreshProducts(); // Ricarica i prodotti, se la funzione è fornita
      onClose();
    } catch (error) {
      console.error("Errore:", error);
      alert("Errore: " + error.message);
    }
  };
  const deleteProduct = async (id) => {
    if (confirm("Sei sicuro di voler eliminare questo prodotto?")) {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      refreshProducts(); // Aggiorna la lista
    }
  };

  return (
    <div className="product-form-overlay">
      <div className="product-form-modal">
        <button className="form-close-btn" onClick={onClose}>×</button>
        <h2>{product ? "Modifica Prodotto" : "Aggiungi Nuovo Prodotto"}</h2>
        <form onSubmit={handleSubmit} className="product-form">
          <label>
            Nome:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Descrizione breve:
            <input
              type="text"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Descrizione dettagliata:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Prezzo:
            <input
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Categoria:
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            URL Immagine:
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Stock:
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Ingredienti:
            <textarea
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
            />
          </label>
          <label>
            Modalità di uso:
            <textarea
              name="usage"
              value={formData.usage}
              onChange={handleChange}
            />
          </label>
          <label>
            Certificazioni (separate da virgola):
            <input
              type="text"
              name="certifications"
              value={formData.certifications}
              onChange={handleChange}
            />
          </label>
          <button type="submit" className="form-submit-btn">
            {product ? "Salva Modifiche" : "Aggiungi Prodotto"}
          </button>
          
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
