"use client";
import { useState, useEffect } from "react";
import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import ProductModal from "@/app/components/ProductModal";
import "./ProductList.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  const sliderProducts = products.length > 0 ? [...products, ...products] : [];

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    if (product.stock === 0) {
      alert("Articolo al momento esaurito, presto disponibile!");
    } else {
      addToCart(product);
    }
  };

  return (
    <section className="product-section">
      <div className="title-container">
        <h2 className="product-title">I Nostri Prodotti di Eccellenza</h2>
      </div>

      <div className="container">
        <div className="slider-wrapper">
          <div className="product-slider">
            {sliderProducts.length > 0 ? (
              sliderProducts.map((product, index) => (
                <div
                  key={index}
                  className="product-card"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="product-image">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={300}
                        height={200}
                        className="image"
                      />
                    ) : (
                      <div className="no-image">Nessuna immagine</div>
                    )}
                  </div>
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">
                    {product.shortDescription
                      ? product.shortDescription.substring(0, 50) + "..."
                      : "Descrizione non disponibile"}
                  </p>
                  <div className="product-footer">
                    <span className="product-price">
                      €{product.price ? product.price.toFixed(2) : "N/D"}
                    </span>
                    {product.stock === 0 ? (
                      <div className="out-of-stock-button">Presto disponibile</div>
                    ) : (
                      <button
                        className="product-button"
                        onClick={(e) => handleAddToCart(e, product)}
                      >
                        Aggiungi 🛒
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="loading-message">Caricamento prodotti...</p>
            )}
          </div>
        </div>
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
};

export default ProductList;