import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import "./ProductGrid.css";
import { useCart } from "../context/CartContext";

const ProductGrid = ({ products, onProductClick }) => {
  const { addToCart } = useCart();
  const scrollRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 250;
      scrollRef.current.scrollLeft += direction === "left" ? -scrollAmount : scrollAmount;
    }
  };

  const nextProduct = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
  };

  const prevProduct = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    if (product.stock === 0) {
      alert("Articolo al momento esaurito, presto disponibile!");
    } else {
      addToCart(product);
    }
  };

  return (
    <div>
      {isMobile ? (
        <div className="product-carousel">
          <button className="carousel-button left" onClick={prevProduct}>❮</button>

          <div className="product-card" onClick={() => onProductClick(products[currentIndex])}>
            <Image
              src={products[currentIndex].imageUrl}
              alt={products[currentIndex].name}
              className="product-image"
              height={200}
              width={200}
            />
            <h3 className="product-name">{products[currentIndex].name}</h3>
            <p className="product-price">€ {products[currentIndex].price.toFixed(2)}</p>
            {products[currentIndex].stock === 0 ? (
              <div className="out-of-stock-button">Presto disponibile</div>
            ) : (
              <button className="product-button" onClick={(e) => handleAddToCart(e, products[currentIndex])}>
                Aggiungi 🛒
              </button>
            )}
          </div>

          <button className="carousel-button right" onClick={nextProduct}>❯</button>
        </div>
      ) : (
        <div className="product-container">
          <div className="carousel-buttons">
            <button className="carousel-button" onClick={() => scroll("left")}>❮</button>
            <button className="carousel-button" onClick={() => scroll("right")}>❯</button>
          </div>

          <div className="product-grid" ref={scrollRef}>
            {products.map((product) => (
              <div key={product._id} className="product-card" onClick={() => onProductClick(product)}>
                <Image src={product.imageUrl} alt={product.name} className="product-image" height={200} width={200} />
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">€ {product.price.toFixed(2)}</p>
                {product.stock === 0 ? (
                  <div className="out-of-stock-button">Presto disponibile</div>
                ) : (
                  <button className="product-button" onClick={(e) => handleAddToCart(e, product)}>
                    Aggiungi 🛒
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;