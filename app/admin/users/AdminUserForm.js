import { useState, useEffect } from "react";
import "./AdminUserForm.css";

const AdminUserForm = ({ user, onClose, refreshUsers }) => {
  const [formData, setFormData] = useState({
    name: user ? user.name : "",
    email: user ? user.email : "",
    password: "", // Assicurati che password sia sempre una stringa
    role: user ? user.role : "customer",
    consentToMarketing: user ? user.consentToMarketing : false, // Assicurati che sia sempre un booleano
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "", // Assicurati che sia sempre una stringa
        email: user.email || "", // Assicurati che sia sempre una stringa
        password: "", // Assicurati che password sia sempre una stringa
        role: user.role || "customer", // Assicurati che sia sempre una stringa
        consentToMarketing: user.consentToMarketing || false, // Assicurati che sia sempre un booleano
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = user ? "PUT" : "POST";
    const url = user ? `/api/users/${user._id}` : "/api/users";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Errore nell'invio dei dati");

      refreshUsers();
      onClose();
    } catch (error) {
      console.error("Errore:", error);
    }
  };

  return (
    <div className="user-form-overlay">
      <div className="user-form-modal">
        <button className="form-close-btn" onClick={onClose}>×</button>
        <h2>{user ? "Modifica Utente" : "Aggiungi Nuovo Utente"}</h2>
        <form onSubmit={handleSubmit} className="user-form">
          <label>Nome: <input type="text" name="name" value={formData.name} onChange={handleChange} required /></label>
          <label>Email: <input type="email" name="email" value={formData.email} onChange={handleChange} required /></label>
          {!user && (
            <label>Password: <input type="password" name="password" value={formData.password} onChange={handleChange} required /></label>
          )}
          <label>Ruolo:
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="customer">Cliente</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          <label>
            <input
              type="checkbox"
              name="consentToMarketing"
              checked={formData.consentToMarketing}
              onChange={handleChange}
            />
            Consenso al Marketing
          </label>
          <button type="submit">{user ? "Salva Modifiche" : "Aggiungi Utente"}</button>
        </form>
      </div>
    </div>
  );
};

export default AdminUserForm;