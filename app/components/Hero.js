"use client";
import React from "react";
import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Benvenuto su Terra Bio</h1>
        <p>Scopri i migliori prodotti biologici e sostenibili.</p>
        <a href="/shop" className="btn-primary">Esplora lo Shop</a>
      </div>
    </section>
  );
};

export default Hero;
