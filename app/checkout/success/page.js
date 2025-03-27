"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import "./CheckoutSuccess.css";

const CheckoutSuccessPage = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("orderId");

  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    if (!orderId) return;
    const fetchOrderDetails = async () => {
      try {
        const res = await fetch(`/api/orderDetails?orderId=${orderId}`);
        const data = await res.json();
        setOrderDetails(data);
      } catch (error) {
        console.error("Errore nel recupero dei dettagli dell'ordine:", error);
      }
    };
    fetchOrderDetails();
  }, [orderId]);

  useEffect(() => {
    if (!orderDetails) return;
    
    const sendOrderEmail = async () => {
      try {
        const response = await fetch("/api/sendEmail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userEmail: orderDetails.user.email, // Usa l'email popolata dall'utente
            orderDetails,
          }),
        });
        const result = await response.json();
        console.log("Email inviata con successo:", result.message);
      } catch (error) {
        console.error("Errore nell'invio dell'email:", error);
      }
    };

    sendOrderEmail();
  }, [orderDetails]);

  return (
    <div className="checkout-success-container">
      <h1>Pagamento Completato!</h1>
      {sessionId && (
        <p>
          La tua transazione è stata completata con successo. Il tuo ID sessione:{" "}
          <strong>{sessionId}</strong>
        </p>
      )}
      <p>Grazie per aver acquistato da TerraBio...gli Essenziali.</p>
      <Link href="/" className="back-to-shop-btn">
        Torna al Negozio
      </Link>
    </div>
  );
};

export default CheckoutSuccessPage;
