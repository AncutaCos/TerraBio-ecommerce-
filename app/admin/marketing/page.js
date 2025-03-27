// app/marketing/page.js
"use client";

import AdminNavbar from "@/app/components/AdminNavbar";
import React, { useState, useEffect } from "react";

export default function MarketingDashboard() {
  const [campaignName, setCampaignName] = useState("");
  const [offerDetails, setOfferDetails] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [emailList, setEmailList] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    // Verifica se l'utente ha inserito il codice segreto
    const hasAccess = sessionStorage.getItem("adminAccess");
    if (!hasAccess) {
      window.location.href = "/admin/access"; // Reindirizza alla pagina di accesso
    }
  }, []);

  useEffect(() => {
    // Fetch degli utenti dal database
    fetch("/api/users")
      .then((response) => response.json())
      .then((data) => {
        const emails = data.map((user) => user.email);
        setEmailList(emails);
      })
      .catch((error) => console.error("Errore nel recupero degli utenti:", error));

    // Fetch delle campagne dal database
    fetch("/api/campaigns")
      .then((response) => response.json())
      .then((data) => setCampaigns(data))
      .catch((error) => console.error("Errore nel recupero delle campagne:", error));
  }, []);

  const handleCreateCampaign = async () => {
    try {
      const response = await fetch("/api/sendCampaign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          campaignName,
          offerDetails,
          emailContent,
          emailList,
        }),
      });

      if (response.ok) {
        setSuccessMessage("Campagna inviata con successo!");
        setCampaignName("");
        setOfferDetails("");
        setEmailContent("");
        // Aggiorna la lista delle campagne
        fetch("/api/campaigns")
          .then((response) => response.json())
          .then((data) => setCampaigns(data))
          .catch((error) => console.error("Errore nel recupero delle campagne:", error));
      } else {
        console.error("Errore nell'invio della campagna");
      }
    } catch (error) {
      console.error("Errore nell'invio della campagna:", error);
    }
  };

  return (
    <>
    <AdminNavbar />
    <div style={styles.container}>
      <h1>Gestione Campagne di Marketing</h1>
      {successMessage && <p style={styles.successMessage}>{successMessage}</p>}
      <div style={styles.formGroup}>
        <label>
          Nome Campagna:
          <input
            type="text"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            style={styles.input}
          />
        </label>
      </div>
      <div style={styles.formGroup}>
        <label>
          Dettagli Offerta:
          <textarea
            value={offerDetails}
            onChange={(e) => setOfferDetails(e.target.value)}
            style={styles.textarea}
          />
        </label>
      </div>
      <div style={styles.formGroup}>
        <label>
          Contenuto Email:
          <textarea
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            style={styles.textarea}
          />
        </label>
      </div>
      <button onClick={handleCreateCampaign} style={styles.button}>Crea Campagna</button>

      <h2>Campagne Create</h2>
      <ul style={styles.campaignList}>
        {campaigns.map((campaign, index) => (
          <li key={index} style={styles.campaignItem}>
            <strong>{campaign.campaignName}</strong>: {campaign.offerDetails}
            {/* Aggiungi pulsanti per modificare o riattivare */}
          </li>
        ))}
      </ul>
    </div>
    </>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "auto",
    padding: "20px",
  },
  formGroup: {
    marginBottom: "15px",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  button: {
    backgroundColor: "#004225",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  successMessage: {
    color: "green",
  },
  campaignList: {
    listStyleType: "none",
    padding: "0",
  },
  campaignItem: {
    padding: "10px",
    borderBottom: "1px solid #ccc",
  },
};

// Aggiungi media query per la responsività
const mediaQueryStyles = `
  @media (max-width: 600px) {
    div {
      padding: 10px;
    }

    input, textarea {
      font-size: 14px;
    }

    button {
      width: 100%;
    }
  }
`;

// Aggiungi i media query al documento
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = mediaQueryStyles;
  document.head.appendChild(styleSheet);
}