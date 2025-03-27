"use client";
import { loadStripe } from "@stripe/stripe-js";

// Carica la chiave pubblicabile da Stripe (presente nel file .env.local)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CheckoutButton = ({ orderId }) => {
  const handleCheckout = async () => {
    // Crea una sessione di checkout inviando l'ID dell'ordine al nostro endpoint API
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),  // Assicurati di avere l'ID dell'ordine da inviare
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Errore nel creare la sessione di checkout:", errorText);
      return;
    }

    const { id: sessionId } = await res.json();
    const stripe = await stripePromise;
    // Reindirizza l'utente alla pagina di pagamento di Stripe
    const { error } = await stripe.redirectToCheckout({ sessionId });
    if (error) {
      console.error("Errore nel redirect:", error);
    }
  };

  return (
    <button onClick={handleCheckout} className="checkout-btn">
      Procedi al Pagamento
    </button>
  );
};

export default CheckoutButton;
