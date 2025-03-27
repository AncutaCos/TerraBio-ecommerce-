// app/admin/access/page.js
"use client";

import { useState } from "react";

const AdminAccess = () => {
  const [secretCode, setSecretCode] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setSecretCode(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Sostituisci 'tuoCodiceSegreto' con il codice segreto effettivo
    if (secretCode === "123456") {
      sessionStorage.setItem("adminAccess", "granted");
      window.location.href = "/admin/products"; // Reindirizza alla prima pagina amministrativa
    } else {
      setError("Codice segreto non valido");
    }
  };

  return (
    <div className="admin-access">
      <h2>Accesso Amministratore</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Inserisci il codice segreto:
          <input type="password" value={secretCode} onChange={handleChange} required />
        </label>
        <button type="submit">Accedi</button>
      </form>
    </div>
  );
};

export default AdminAccess;