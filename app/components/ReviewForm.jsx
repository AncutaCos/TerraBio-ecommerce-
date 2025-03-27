import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ReviewForm = () => {
  // Definisci lo stato per i campi del form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState('');

  // Funzione per inviare la recensione
  const submitReview = async (event) => {
    event.preventDefault();

    const reviewData = {
      name,
      email,
      rating,
      comment,
    };

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Recensione inviata con successo!');
      } else {
        alert('Errore nell\'invio della recensione');
      }
    } catch (error) {
      console.error('Errore nella richiesta:', error);
      alert('Errore nel connettersi al server');
    }

    // Resetta i campi del form
    setName('');
    setEmail('');
    setRating(1);
    setComment('');
  };

  return (
    <div>
      <h2>Lascia una Recensione</h2>
      <form className="nature-form" onSubmit={submitReview}>
        <div className="form-group">
          <label htmlFor="name">Nome</label>
          <input
            type="text"
            id="name"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Il tuo nome"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="La tua email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="rating">Valutazione</label>
          <input
            type="number"
            id="rating"
            className="form-input"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            min="1"
            max="5"
            placeholder="Valutazione (1-5)"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="comment">Commento</label>
          <textarea
            id="comment"
            className="form-textarea"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Scrivi la tua recensione"
            rows="4"
            required
          />
        </div>
        <motion.button
          type="submit"
          className="nature-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Invia Recensione
        </motion.button>
      </form>
    </div>
  );
};

export default ReviewForm;