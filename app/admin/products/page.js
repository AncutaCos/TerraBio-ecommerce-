// app/admin/products/page.js
"use client";

import { useState, useEffect } from "react";
import AdminNavbar from "@/app/components/AdminNavbar";
import ProductForm from "@/app/admin/products/ProductForm";
import Image from "next/image";
import "./AdminProducts.css";

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const hasAccess = sessionStorage.getItem("adminAccess");
    if (!hasAccess) {
      window.location.href = "/admin/access";
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Errore nel caricamento dei prodotti:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleNewProduct = () => {
    setSelectedProduct(null);
    setShowForm(true);
  };

  const deleteProduct = async (id) => {
    if (confirm("Sei sicuro di voler eliminare questo prodotto?")) {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      setProducts(products.filter((product) => product._id !== id));
    }
  };

  return (
    <div className="admin-page">
      <AdminNavbar />
      <div className="admin-content">
        <h1>Gestione Prodotti</h1>
        <button onClick={handleNewProduct} className="new-product-btn">
          Aggiungi Nuovo Prodotto
        </button>
        <div className="products-list">
          {products.map((product) => (
            <div key={product._id} className="admin-product-card">
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={150}
                height={150}
              />
              <div className="admin-product-info">
                <h3>{product.name}</h3>
                <p>€{product.price.toFixed(2)}</p>
                <p>Stock: {product.stock}</p>
                {product.stock < 10 && (
                  <p style={{ color: "red" }}>Attenzione: Stock basso!</p>
                )}
                <button onClick={() => handleEdit(product)}>Modifica</button>
                <button onClick={() => deleteProduct(product._id)}>🗑 Elimina</button>
              </div>
            </div>
          ))}
        </div>
        {showForm && (
          <ProductForm
            product={selectedProduct}
            onClose={() => setShowForm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default AdminProductsPage;