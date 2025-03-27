"use client";
import { useState } from "react";
import "./CheckoutLoginForm.css";

const CheckoutLoginForm = ({ onLoginSuccess }) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
  
      if (!response.ok) {
        throw new Error("Errore nel login");
      }
  
      const userData = await response.json();
      localStorage.setItem("user", JSON.stringify(userData));
      onLoginSuccess(userData);
    } catch (error) {
      console.error("Errore nel login:", error);
      alert("Email o password errati");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-login-form-overlay">
      <div className="checkout-login-form-modal">
        <h2>Effettua il Login</h2>
        <form onSubmit={handleLogin} className="checkout-login-form">
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? "Accedendo..." : "Accedi"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutLoginForm;
