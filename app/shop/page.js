"use client";
import { useState, useEffect } from "react";
import ProductGrid from "../components/ProductGrid";
import ProductModal from "../components/ProductModal";
import CartModal from "../components/CartModal";
import NavbarShop from "../components/NavbarShop";
import "./Shop.css";
import Footer from "../components/Footer";
import OffersSection from "../components/OffersSection";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [scrolling, setScrolling] = useState(false);

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

  // Controllo dello scrolling per animare la navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const addToWishlist = (product) => {
    setWishlist((prevWishlist) => {
      if (prevWishlist.some((item) => item._id === product._id)) {
        return prevWishlist.filter((item) => item._id !== product._id);
      } else {
        return [...prevWishlist, product];
      }
    });
  };

  return (
    <>
      <NavbarShop className={scrolling ? "scrolled" : ""} />
      <section className="shop-container">
        <div className="shop-header">
          <h1 className="shop-title">Scopri i nostri Essenziali</h1>
          <p className="shop-subtitle">Qualità bio per il tuo benessere.</p>
        </div>

        {/* Sezione offerte con conto alla rovescia */}
        <div className="promo-section">
          <h2>Offerta speciale!</h2>
          <OffersSection />
          
        </div>

        {products.length > 0 ? (
          <ProductGrid products={products} onProductClick={handleProductClick} />
        ) : (
          <p className="loading-message">Caricamento prodotti...</p>
        )}

        <CartModal />
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToWishlist={addToWishlist}
            isInWishlist={wishlist.some((item) => item._id === selectedProduct?._id)}
          />
        )}
      </section>
      <Footer />
    </>
  );
};

export default ShopPage;
