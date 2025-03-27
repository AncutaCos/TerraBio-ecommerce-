"use client";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ProductModal from "./ProductModal";
import CheckoutForm from "./CheckoutForm";
import "./CartModal.css";
import Image from "next/image";

const CartModal = () => {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    isCartOpen,
    toggleCart,
    clearCart,
    addToCart,
  } = useCart();

  const { user, login, register } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    consentToMarketing: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const fetchOffers = async () => {
      const response = await fetch("/api/offers/active");
      if (response.ok) {
        const data = await response.json();
        setOffers(data);
      }
    };

    fetchOffers();
  }, []);

  // Filtra i prodotti nel carrello per rimuovere quelli esauriti
  const availableCartItems = cartItems.filter((item) => item.stock > 0);

  // Rimuove automaticamente i prodotti esauriti dal carrello
  useEffect(() => {
    const outOfStockItems = cartItems.filter((item) => item.stock === 0);
    if (outOfStockItems.length > 0) {
      outOfStockItems.forEach((item) => removeFromCart(item._id));
    }
  }, [cartItems, removeFromCart]); // Aggiunto removeFromCart alle dipendenze

  // Ricalcola il totale solo per i prodotti disponibili
  const totalPrice = availableCartItems
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2);

  const handleCheckoutClick = () => {
    if (user) {
      // Controlla se ci sono prodotti esauriti nel carrello
      const outOfStockItems = cartItems.filter((item) => item.stock === 0);
      if (outOfStockItems.length > 0) {
        alert(
          "Alcuni prodotti nel tuo carrello sono esauriti. Rimuovili per procedere."
        );
        return;
      }

      const { finalTotal, shippingCost, discount, appliedOffers } =
        calculateTotal();
      setShowCheckout({
        finalTotal,
        shippingCost,
        discount,
        appliedOffers,
      });
    }
  };

  const calculateTotal = () => {
    let total = availableCartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    let shippingCost = 3.5; // Costo di spedizione predefinito
    let discount = 0;
    let appliedOffers = [];

    // Applica le offerte
    offers.forEach((offer) => {
      if (offer.forNewCustomers && !isNewCustomer) return; // Salta se l'offerta è solo per nuovi clienti

      switch (offer.type) {
        case "percentuale":
          const discountAmount = (parseFloat(offer.value) / 100) * total;
          discount += discountAmount;
          appliedOffers.push(offer);
          break;
        case "trasporto-gratuito":
          shippingCost = 0;
          appliedOffers.push(offer);
          break;
        case "articolo-regalo":
          // Qui puoi gestire la logica per l'articolo regalo
          appliedOffers.push(offer);
          break;
        default:
          break;
      }
    });

    const finalTotal = (total - discount + shippingCost).toFixed(2);
    return { finalTotal, shippingCost, discount, appliedOffers };
  };

  const handleCheckoutComplete = async () => {
    // Chiamata alla funzione email prima di svuotare il carrello

    // Ora svuota il carrello e pulisci il localStorage
    clearCart();
    localStorage.removeItem("cartItems");
    localStorage.removeItem("wishlistItems");
    localStorage.removeItem("user");

    setShowCheckout(false);
    toggleCart();
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isRegistering ? "/api/auth/register" : "/api/auth/login";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Credenziali non valide o utente già esistente");
      }

      const userData = await response.json();
      isRegistering ? register(userData) : login(userData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isCartOpen) return null;

  return (
    <div className="cart-overlay" onClick={toggleCart}>
      <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
        <button className="cart-close-btn" onClick={toggleCart}>
          ×
        </button>
        <h2>Il tuo Carrello</h2>

        {availableCartItems.length === 0 ? (
          <p className="empty-message">Il carrello è vuoto.</p>
        ) : showCheckout ? (
          <CheckoutForm
            onClose={toggleCart}
            onCheckoutComplete={handleCheckoutComplete}
          />
        ) : (
          <>
            <ul className="cart-items">
              {availableCartItems.map((item, index) => (
                <li
                  key={index}
                  className="cart-item"
                  onClick={() => setSelectedProduct(item)}
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    className="cart-image"
                    height={45}
                    width={45}
                  />
                  <div className="cart-item-info">
                    <p className="cart-item-name">{item.name}</p>
                    <p className="cart-item-price">€{item.price.toFixed(2)}</p>
                    {item.stock === 0 && (
                      <p className="out-of-stock">Esaurito</p>
                    )}
                  </div>
                  <div className="quantity-controls">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        decreaseQuantity(item._id);
                      }}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const product = availableCartItems.find(
                          (i) => i._id === item._id
                        );
                        if (product.quantity < product.stock) {
                          increaseQuantity(item._id);
                        } else {
                          alert("Quantità massima raggiunta");
                        }
                      }}
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="cart-remove-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromCart(item._id);
                    }}
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>

            <div className="cart-total">
              <p>
                Totale: <strong>€{totalPrice}</strong>
              </p>
            </div>

            {user ? (
              <button className="checkout-btn" onClick={handleCheckoutClick}>
                Procedi al Pagamento
              </button>
            ) : (
              <div className="cart-login">
                <button className="checkout-btn" onClick={toggleCart}>
                  Continua sul Shop
                </button>
                <br />
                <h3>
                  {isRegistering ? "Registrati" : "Accedi"} per completare l
                  acquisto
                </h3>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleAuth} className="auth-form">
                  {isRegistering && (
                    <input
                      type="text"
                      className="auth-input"
                      placeholder="Nome"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  )}
                  <input
                    type="email"
                    className="auth-input"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                  <input
                    type="password"
                    className="auth-input"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                  {isRegistering && (
                    <label className="consent-label">
                      <input
                        type="checkbox"
                        checked={formData.consentToMarketing}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            consentToMarketing: e.target.checked,
                          })
                        }
                      />
                      Accetto di ricevere email promozionali
                    </label>
                  )}
                  <button type="submit" className="auth-btn" disabled={loading}>
                    {loading
                      ? "Caricamento..."
                      : isRegistering
                      ? "Registrati"
                      : "Accedi"}
                  </button>
                </form>
                <button
                  className="toggle-auth-mode"
                  onClick={() => setIsRegistering(!isRegistering)}
                >
                  {isRegistering
                    ? "Hai già un account? Accedi"
                    : "Non hai un account? Registrati"}
                </button>
              </div>
            )}
          </>
        )}

        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={() => {
              if (selectedProduct.stock === 0) {
                alert("Articolo al momento esaurito, presto disponibile!");
              } else {
                addToCart(selectedProduct);
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CartModal;