"use client";
import { useState, useEffect } from "react";
import "./AdminDashboard.css";
import ReviewsSection from "@/app/components/ReviewsSection";
import AdminNavbar from "@/app/components/AdminNavbar";

export default function AdminDashboard() {
  const [reviews, setReviews] = useState([]);
  const [messages, setMessages] = useState([]);
  const [showUnreadOnly, setShowUnreadOnly] = useState(true);

  useEffect(() => {
    // Verifica se l'utente ha inserito il codice segreto
    const hasAccess = sessionStorage.getItem("adminAccess");
    if (!hasAccess) {
      window.location.href = "/admin/access"; // Reindirizza alla pagina di accesso
    }
  }, []);

  // Carica le recensioni e i messaggi
  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => setReviews(data.filter((r) => !r.approved)));

    fetch("/api/messages")
      .then((res) => res.json())
      .then((data) => setMessages(data));
  }, []);

  // Filtra i messaggi
  const filteredMessages = showUnreadOnly
    ? messages.filter((m) => !m.read)
    : messages;

  const approveReview = async (id) => {
    try {
      const response = await fetch(`/api/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved: true }),
      });

      if (response.ok) {
        alert("Recensione approvata!");
        fetch("/api/reviews")
          .then((res) => res.json())
          .then((data) => setReviews(data.filter((r) => !r.approved)));
      } else {
        console.error("Errore nell'approvazione della recensione");
      }
    } catch (error) {
      console.error("Errore nella richiesta:", error);
    }
  };

  const deleteReview = async (id) => {
    try {
      const response = await fetch(`/api/reviews/${id}`, { method: "DELETE" });

      if (response.ok) {
        alert("Recensione eliminata!");
        fetch("/api/reviews")
          .then((res) => res.json())
          .then((data) => setReviews(data.filter((r) => !r.approved)));
      } else {
        console.error("Errore nell'eliminazione della recensione");
      }
    } catch (error) {
      console.error("Errore nella richiesta:", error);
    }
  };

  const markMessageAsRead = async (id) => {
    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });

      if (response.ok) {
        alert("Messaggio segnato come letto!");
        fetch("/api/messages")
          .then((res) => res.json())
          .then((data) => setMessages(data));
      } else {
        console.error("Errore nell'aggiornamento del messaggio");
      }
    } catch (error) {
      console.error("Errore nella richiesta:", error);
    }
  };

  return (
    <>
    <AdminNavbar />
    <div className="admin-dashboard">
      
      <h1>Dashboard Admin</h1>
     
      <h2>Recensioni in Attesa di Approvazione</h2>
      {reviews.length === 0 ? (
        <p className="no-data">Nessuna recensione in attesa.</p>
      ) : (
        <ul>
          {reviews.map((review) => (
            <li key={review._id}>
              <p><strong>{review.name}</strong> ({review.email})</p>
              <p>⭐ {review.rating}/5</p>
              <p>{review.comment}</p>
              <button className="approve" onClick={() => approveReview(review._id)}>✅ Approva</button>
              <button className="delete" onClick={() => deleteReview(review._id)}>❌ Elimina</button>
            </li>
          ))}
        </ul>
      )}
      <ReviewsSection />
      <h2>Messaggi</h2>
      <button
        className="toggle-messages"
        onClick={() => setShowUnreadOnly(!showUnreadOnly)}
      >
        {showUnreadOnly ? "Mostra Tutti i Messaggi" : "Mostra Solo Non Letti"}
      </button>
      {filteredMessages.length === 0 ? (
        <p className="no-data">Nessun messaggio disponibile.</p>
      ) : (
        <ul>
          {filteredMessages.map((message) => (
            <li key={message._id}>
              <p><strong>{message.name}</strong> ({message.email})</p>
              <p>{message.message}</p>
              {!message.read && (
                <button className="mark-read" onClick={() => markMessageAsRead(message._id)}>✅ Segna come letto</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
    </>
  );
}