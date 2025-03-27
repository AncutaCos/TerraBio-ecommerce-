"use client";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "@/app/context/WishContext";
import CheckoutForm from "../components/CheckoutForm";
import Image from "next/image";
import Link from "next/link";
import "./CartWishlistPage.css";

const CartWishlistPage = () => {
  const [activeTab, setActiveTab] = useState("cart");
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    toggleCart,
    addToCart,
    clearCart,
  } = useCart();
  const { wishlistItems, removeFromWishlist } = useWishlist();

  // Filtra i prodotti nel carrello per rimuovere quelli esauriti
  const availableCartItems = cartItems.filter((item) => item.stock > 0);

  // Ricalcola il totale solo per i prodotti disponibili
  const totalPrice = availableCartItems
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2);

  const { user, login, register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    consentToMarketing: false,
  });
  const [showCheckout, setShowCheckout] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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

  const handleAddAllToCart = () => {
    let addedCount = 0;
    let outOfStockCount = 0;
  
    wishlistItems.forEach((product) => {
      if (product.stock > 0) {
        addToCart(product);
        removeFromWishlist(product._id);
        addedCount++;
      } else {
        outOfStockCount++;
      }
    });
  
    if (addedCount > 0) {
      alert(`${addedCount} prodotti aggiunti al carrello!`);
    }
    if (outOfStockCount > 0) {
      alert(`${outOfStockCount} prodotti esauriti non sono stati aggiunti.`);
    }
  };

  const handleCheckoutComplete = () => {
    // Svuota il carrello dallo stato globale
    clearCart();

    // Rimuove i dati dal localStorage
    localStorage.removeItem("cartItems");
    localStorage.removeItem("wishlistItems");
    localStorage.removeItem("user");

    // Mostra un messaggio di conferma o reindirizza
    alert("Ordine completato con successo!");
    window.location.href = "/success"; // Reindirizza alla pagina di successo
    // Chiude il modale checkout e il carrello
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

  return (
    <div className="cart-wishlist-page">
      <h1 className="page-title">Il tuo Spazio Shopping</h1>
      <div className="tabs">
        <button
          className={activeTab === "cart" ? "active" : ""}
          onClick={() => setActiveTab("cart")}
        >
          Carrello 🛒 ({availableCartItems.length})
        </button>
        <button
          className={activeTab === "wishlist" ? "active" : ""}
          onClick={() => setActiveTab("wishlist")}
        >
          Wishlist ❤️ ({wishlistItems.length})
        </button>
      </div>

      {activeTab === "cart" && (
        <div className="cart-section">
          {availableCartItems.length === 0 ? (
            <p className="empty-message">Il carrello è vuoto.</p>
          ) : showCheckout ? (
            <CheckoutForm
              onClose={toggleCart}
              onCheckoutComplete={handleCheckoutComplete}
            />
          ) : (
            <>
              <ul className="cart-list">
                {availableCartItems.map((item) => (
                  <li key={item._id} className="cart-item">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={50}
                      height={50}
                    />
                    <div className="item-info">
                      <p className="item-name">{item.name}</p>
                      <p className="item-price">€{item.price.toFixed(2)}</p>
                      <div className="quantity-controls">
                        <button onClick={() => decreaseQuantity(item._id)}>
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => {
                            const product = availableCartItems.find(
                              (i) => i._id === item._id
                            );
                            if (product.quantity < product.stock) {
                              increaseQuantity(item._id);
                            } else {
                              alert("Quantità massima raggiunta");
                            }
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item._id)}
                    >
                      🗑️
                    </button>
                  </li>
                ))}
              </ul>
              <div className="cart-footer">
                <p className="total-price">Totale: €{totalPrice}</p>
              </div>
              {user ? (
                <button className="checkout-btn" onClick={handleCheckoutClick}>
                  Procedi al Pagamento
                </button>
              ) : (
                <div className="cart-login">
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
                    <button
                      type="submit"
                      className="auth-btn"
                      disabled={loading}
                    >
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
        </div>
      )}

      {activeTab === "wishlist" && (
        <div className="wishlist-section">
          {wishlistItems.length === 0 ? (
            <p className="empty-message">La tua wishlist è vuota.</p>
          ) : (
            <>
              <ul className="wishlist-list">
                {wishlistItems.map((item) => (
                  <li key={item._id} className="wishlist-item">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={50}
                      height={50}
                    />
                    <div className="item-info">
                      <p className="item-name">{item.name}</p>
                      <p className="item-price">€{item.price.toFixed(2)}</p>
                      {item.stock === 0 && (
                        <p className="out-of-stock">Esaurito</p>
                      )}
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromWishlist(item._id)}
                    >
                      🗑️
                    </button>
                  </li>
                ))}
              </ul>
              <button
                className="add-all-btn"
                onClick={handleAddAllToCart} // Usa la nuova funzione
              >
                Aggiungi Tutto al Carrello
              </button>
            </>
          )}
        </div>
      )}

      <div className="back-home">
        <Link href="/">Torna alla Home</Link>
      </div>
    </div>
  );
};

export default CartWishlistPage;