"use client";
import React, { useState, useEffect } from "react";
import "./Contatti.css";
import Footer from "../components/Footer";
import { motion, useTransform, useScroll } from "framer-motion";
import {
  Leaf,
  Sprout,
  Mail,
  Phone,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  CheckCircle,
} from "lucide-react";
import ReviewForm from "../components/ReviewForm";
import DisplayReviews from "../components/ReviewsSection";
import NavbarContact from "../components/NavbarContact";

const Contatti = () => {
  const { scrollYProgress } = useScroll();
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, 20]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, -10]);
  const [foglieRaccolte, setFoglieRaccolte] = useState(0);
  const [foglieCadute, setFoglieCadute] = useState([]);
  const [fogliePosizioni, setFogliePosizioni] = useState([]);
  const [isSending, setIsSending] = useState(false);
const [messageSent, setMessageSent] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSending(true);

  const formData = new FormData(e.target);
  const data = {
    nome: formData.get("nome"),
    email: formData.get("email"),
    messaggio: formData.get("messaggio"),
  };

  try {
    const response = await fetch("/api/sendMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      setMessageSent(true);
    } else {
      alert("Errore durante l'invio del messaggio");
    }
  } catch (error) {
    console.error(error);
    alert("Errore durante l'invio del messaggio");
  } finally {
    setIsSending(false);
  }
};

  // Genera le posizioni delle foglie
  useEffect(() => {
    const posizioni = Array.from({ length: 15 }).map(() => ({
      left: `${Math.random() * 90}%`,
      top: `${Math.random() * 90}%`,
      rotate: Math.random() * 360, // Rotazione casuale
    }));
    setFogliePosizioni(posizioni);
  }, []);

  const raccogliFoglia = (id) => {
    setFoglieRaccolte((prev) => prev + 1);
    setFoglieCadute((prev) => [...prev, id]);

    // Animazione di caduta
    const foglia = document.getElementById(`foglia-${id}`);
    if (foglia) {
      foglia.style.transition = "transform 1s ease, opacity 1s ease";
      foglia.style.transform = "translateY(100vh) rotate(360deg)";
      foglia.style.opacity = "0";
    }
  };

  return (
    <div className="contatti-container">
      {/* Navbar */}
      <NavbarContact />

      {/* Foglie cliccabili */}
      {fogliePosizioni.map((posizione, i) =>
        !foglieCadute.includes(i) ? (
          <motion.div
            key={i}
            id={`foglia-${i}`}
            className="foglia-gioco"
            style={{
              left: posizione.left,
              top: posizione.top,
              rotate: posizione.rotate,
              
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.2, rotate: posizione.rotate + 20 }}
            whileTap={{ scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => raccogliFoglia(i)}
          >
            <Leaf size={40} color="#a5d6a7" />
          </motion.div>
        ) : null
      )}

      {/* Contatore foglie raccolte */}
      <div className="contatore-foglie">
        <span>Foglie raccolte: {foglieRaccolte}</span>
        {foglieRaccolte >= 10 && (
          <motion.div
            className="vittoria-messaggio"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CheckCircle size={50} color="#66bb6a" />
            <p>Hai vinto un piccolo premio! 🐇</p>
          </motion.div>
        )}
      </div>

      {/* Sfondo con foglie animate */}
      <motion.div
        className="natura-background"
        style={{
          rotateY,
          rotateX,
          transformPerspective: 2000,
        }}
      >
        <motion.div className="foglie-layer foglie-1" />
        <motion.div className="foglie-layer foglie-2" />
        <motion.div className="foglie-layer foglie-3" />
      </motion.div>

      {/* Contenuto principale */}
      <div className="contatti-content">
        {/* Header */}
        <motion.div
          className="header-section"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="main-title">
            <Sprout className="icon-sprout" />
          </h1>
          <h2 className="main-title">
            Contattaci per qualsiasi domanda!
          </h2>
        </motion.div>

        {/* Sezione Contatti */}
        <div className="contatti-grid">
          {/* Form di contatto */}
          <motion.div
            className="contact-card form-card"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h2>
              <Mail className="card-icon" />
              Scrivici un Messaggio
            </h2>
            <form className="nature-form" onSubmit={handleSubmit}>
  <div className="form-group">
    <label htmlFor="nome">Il Tuo Nome</label>
    <input
      id="nome"
      type="text"
      className="form-input"
      placeholder="Come ti chiami?"
      name="nome"
      required
    />
  </div>
  <div className="form-group">
    <label htmlFor="email">La Tua Email</label>
    <input
      id="email"
      type="email"
      className="form-input"
      placeholder="nature@example.com"
      name="email"
      required
    />
  </div>
  <div className="form-group">
    <label htmlFor="messaggio">Il Tuo Messaggio</label>
    <textarea
      id="messaggio"
      className="form-textarea"
      placeholder="Scrivi qui il tuo pensiero..."
      rows="5"
      name="messaggio"
      required
    ></textarea>
  </div>
  <motion.button
    className="nature-button"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    disabled={isSending}
  >
    {isSending ? "Invio in corso..." : "Invia Messaggio"}
    <Sprout className="button-icon" />
  </motion.button>
  {messageSent && <p className="success-message">Messaggio inviato con successo!</p>}
</form>
          </motion.div>

          {/* Informazioni di contatto */}
          <div className="info-card">
            <h2>Contatti Diretti</h2>
            <ul className="contact-info">
              <li>📞 +39 0123 456789</li>
              <li>📧 info@terrabio.com</li>
            </ul>
            <h2>Seguici sui Social</h2>
            <div className="social-grid">
              <a href="#" className="social-link instagram">
                <Instagram size={24} />
              </a>
              <a href="#" className="social-link facebook">
                <Facebook size={24} />
              </a>
              <a href="#" className="social-link youtube">
                <Youtube size={24} />
              </a>
              <a href="#" className="social-link linkedin">
                <Linkedin size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Sezione Recensioni */}
        <div className="review-section1">
       
          <ReviewForm />
        </div>
        <div className="review-section2">
       
       
     </div>
      </div>
      <DisplayReviews />
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Contatti;
