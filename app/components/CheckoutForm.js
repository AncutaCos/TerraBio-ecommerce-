"use client";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import "./CheckoutForm.css";

const CheckoutForm = ({ onClose, onCheckoutComplete }) => {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [shippingData, setShippingData] = useState({
    address: "",
    city: "",
    postalCode: "",
  });
  const [offers, setOffers] = useState([]); // Offerte attive
  const [isNewCustomer, setIsNewCustomer] = useState(false); // Verifica se è un nuovo cliente

  // Recupera le offerte attive
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

  // Verifica se l'utente è un nuovo cliente
  useEffect(() => {
    if (user) {
      setIsNewCustomer(user.isNewCustomer);
    }
  }, [user]);

  // Calcola il totale con le offerte applicate
  const calculateTotal = () => {
    let total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
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

  const { finalTotal, shippingCost, discount, appliedOffers } = calculateTotal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Crea l'ordine
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: user._id,
          products: cartItems.map((item) => ({
            product: item._id,
            quantity: item.quantity,
          })),
          shippingAddress: shippingData,
          totalAmount: finalTotal,
          shippingCost,
          discount,
          appliedOffers,
        }),
      });

      if (!orderResponse.ok) throw new Error("Errore creazione ordine");

      const { orderId } = await orderResponse.json();

      // Processa pagamento
      const paymentResponse = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      if (!paymentResponse.ok) throw new Error("Errore pagamento");

      const { sessionId } = await paymentResponse.json();
      window.location.href = sessionId;
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-form-overlay">
      <div className="checkout-form-modal">
        <button className="form-close-btn" onClick={onClose}>×</button>
        <h2>Dati di Spedizione</h2>

        <form onSubmit={handleSubmit} className="checkout-form">
          <label>
            Indirizzo:
            <input
              type="text"
              required
              onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
            />
          </label>

          <label>
            Città:
            <input
              type="text"
              required
              onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
            />
          </label>

          <label>
            CAP:
            <input
              type="text"
              required
              onChange={(e) => setShippingData({ ...shippingData, postalCode: e.target.value })}
            />
          </label>

          <div className="checkout-summary">
            <h3>Riepilogo Ordine</h3>
            <p>Totale Prodotti: €{(finalTotal - shippingCost + discount).toFixed(2)}</p>
            <p>Spedizione: €{shippingCost.toFixed(2)}</p>
            <p>Sconto: €{discount.toFixed(2)}</p>
            <p><strong>Totale: €{finalTotal}</strong></p>

            <button type="submit" disabled={loading}>
              {loading ? "Processando..." : "Paga con Stripe"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;