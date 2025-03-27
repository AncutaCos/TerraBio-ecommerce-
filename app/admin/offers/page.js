// app/admin/offers/page.js
"use client";
import { useState, useEffect } from "react";
import "./AdminOffers.css";
import AdminNavbar from "@/app/components/AdminNavbar";

export default function AdminOffers() {
  const [offers, setOffers] = useState([]);
  const [newOffer, setNewOffer] = useState({
    type: "percentuale",
    value: "",
    description: "",
    expiresAt: "",
    forNewCustomers: false,
  });

  useEffect(() => {
    // Verifica se l'utente ha inserito il codice segreto
    const hasAccess = sessionStorage.getItem("adminAccess");
    if (!hasAccess) {
      window.location.href = "/admin/access"; // Reindirizza alla pagina di accesso
    }
  }, []);

  // Carica le offerte
  useEffect(() => {
    fetch("/api/offers")
      .then((res) => res.json())
      .then((data) => setOffers(data));
  }, []);

  // Gestisce l'invio del form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOffer),
      });

      if (response.ok) {
        const createdOffer = await response.json();
        setOffers([...offers, createdOffer]);
        setNewOffer({
          type: "percentuale",
          value: "",
          description: "",
          expiresAt: "",
          forNewCustomers: false,
        });
      } else {
        console.error("Errore nella creazione dell'offerta");
      }
    } catch (error) {
      console.error("Errore nella richiesta:", error);
    }
  };

  // Elimina un'offerta
  const deleteOffer = async (id) => {
    try {
      const response = await fetch("/api/offers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setOffers(offers.filter((offer) => offer._id !== id));
      } else {
        console.error("Errore nell'eliminazione dell'offerta");
      }
    } catch (error) {
      console.error("Errore nella richiesta:", error);
    }
  };

  return (
    <>
    <AdminNavbar />
    <div className="admin-offers">
      <h1>Gestione Offerte</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Tipo:
          <select
            value={newOffer.type}
            onChange={(e) => setNewOffer({ ...newOffer, type: e.target.value })}
          >
            <option value="percentuale">Percentuale</option>
            <option value="articolo-regalo">Articolo Regalo</option>
            <option value="trasporto-gratuito">Trasporto Gratuito</option>
          </select>
        </label>
        <label>
          Valore:
          <input
            type="text"
            value={newOffer.value}
            onChange={(e) => setNewOffer({ ...newOffer, value: e.target.value })}
            required
          />
        </label>
        <label>
          Descrizione:
          <textarea
            value={newOffer.description}
            onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
            required
          />
        </label>
        <label>
          Data di Scadenza:
          <input
            type="date"
            value={newOffer.expiresAt}
            onChange={(e) => setNewOffer({ ...newOffer, expiresAt: e.target.value })}
          />
        </label>
        <label>
          <input
            type="checkbox"
            checked={newOffer.forNewCustomers}
            onChange={(e) => setNewOffer({ ...newOffer, forNewCustomers: e.target.checked })}
          />
          Solo per nuovi clienti
        </label>
        <button type="submit">Crea Offerta</button>
      </form>

      <h2>Offerte Attive</h2>
      {offers.length === 0 ? (
        <p>Nessuna offerta disponibile.</p>
      ) : (
        <ul>
          {offers.map((offer) => (
            <li key={offer._id}>
              <p><strong>Tipo:</strong> {offer.type}</p>
              <p><strong>Valore:</strong> {offer.value}</p>
              <p><strong>Descrizione:</strong> {offer.description}</p>
              <p><strong>Scadenza:</strong> {offer.expiresAt || "Nessuna scadenza"}</p>
              <p><strong>Per nuovi clienti:</strong> {offer.forNewCustomers ? "Sì" : "No"}</p>
              <button onClick={() => deleteOffer(offer._id)}>Elimina</button>
            </li>
          ))}
        </ul>
      )}
    </div>
    </>
  );
}