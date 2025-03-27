// components/OffersSection.js
"use client";
import { useState, useEffect } from "react";
import "./OffersSection.css";

const OffersSection = () => {
  const [offers, setOffers] = useState([]);

  // Carica le offerte
  useEffect(() => {
    fetch("/api/offers")
      .then((res) => res.json())
      .then((data) => setOffers(data));
  }, []);

  return (
    <section className="offers-section">
     
      {offers.length === 0 ? (
        <p>Nessuna offerta disponibile al momento.</p>
      ) : (
        <ul>
          {offers.map((offer) => (
            <li key={offer._id}>
              <p><strong>{offer.description}</strong></p>
              
              {offer.expiresAt && <p>Valida fino al: {new Date(offer.expiresAt).toLocaleDateString()}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default OffersSection;