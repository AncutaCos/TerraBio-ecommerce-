"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faStore, faInfoCircle, faEnvelope, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";



const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
 

  // 🔥 Disattiva lo scroll effect
  useEffect(() => {
    setScrolled(false);
  }, []);
  

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="container">
        {/* Wrapper per centrare l'icona menu e il logo */}
        <div className="nav-header">
          {/* ✅ Icona Menu centrale su mobile */}
          <button className="menu-toggle" onClick={toggleMenu}>
            <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
          </button>

        </div>

        {/* ✅ Navigazione */}
        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          <li><Link href="/" onClick={toggleMenu}><FontAwesomeIcon icon={faHome} /> Home</Link></li>
          
          <li><Link href="/ChiSiamo" onClick={toggleMenu}><FontAwesomeIcon icon={faInfoCircle} /> Chi Siamo</Link></li>
          <li><Link href="/contact" onClick={toggleMenu}><FontAwesomeIcon icon={faEnvelope} /> Contatti</Link></li>
          <li><Link href="/cart&wish" onClick={toggleMenu}>🛒 & 🤍</Link></li>
          
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
