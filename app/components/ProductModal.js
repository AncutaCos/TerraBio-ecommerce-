import Image from "next/image";
import "./ProductModal.css";
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishContext";

const ProductModal = ({ product, onClose, onAddToCart }) => {
  const { addToCart } = useCart();
  const { addToWishlist, wishlistItems } = useWishlist();

  const isInWishlist = wishlistItems.some((item) => item._id === product._id);

  const handleAddToCart = () => {
    if (product.stock === 0) {
      alert("Articolo al momento esaurito, presto disponibile!");
    } else {
      addToCart(product);
      if (onAddToCart) onAddToCart(); // Notifica il componente padre (opzionale)
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>
        <Image
          src={product.imageUrl}
          alt={product.name}
          className="modal-image"
          height={200}
          width={200}
        />
        <h2>{product.name}</h2>
        <p className="modal-price">€{product.price.toFixed(2)}</p>
        {product.stock === 0 && (
          <p className="out-of-stock">Esaurito</p>
        )}
        <div>
          <button
            className="product-button"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? "Esaurito" : "Aggiungi 🛒"}
          </button>
          <button
            className={`wishlist-btn ${isInWishlist ? "active" : ""}`}
            onClick={() => addToWishlist(product)}
          >
            {isInWishlist ? "❤️" : "🤍"}
          </button>
        </div>
        <p className="modal-description">{product.description}</p>
        {product.ingredients && (
          <div className="modal-section">
            <h4>Ingredienti</h4>
            <p>{product.ingredients}</p>
          </div>
        )}
        {product.usage && (
          <div className="modal-section">
            <h4>Modalità d’uso</h4>
            <p>{product.usage}</p>
          </div>
        )}
        {product.certifications && product.certifications.length > 0 && (
          <div className="modal-section">
            <h4>Certificazioni</h4>
            <ul className="certifications-list">
              {product.certifications.map((cert, index) => (
                <li key={index}>{cert}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductModal;