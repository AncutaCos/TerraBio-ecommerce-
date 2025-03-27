"use client";
import Link from "next/link";
import "./CheckoutCancel.css";

const CheckoutCancelPage = () => {
  return (
    <div className="checkout-cancel-container">
      <h1>Pagamento Annullato</h1>
      <p>Il tuo pagamento è stato annullato. Se desideri riprovare, torna al negozio.</p>
      <Link href="/" className="back-to-shop-btn">Torna al Negozio</Link>
    </div>
  );
};

export default CheckoutCancelPage;
