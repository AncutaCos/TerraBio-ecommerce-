"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faStore,
  faInfoCircle,
  faEnvelope,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import "./NavBarChiSiamo.css";

const NavBarChiSiamo = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  let pressTimer = null;

  useEffect(() => {
    setScrolled(false);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // 🔥 Funzione per gestire la pressione prolungata
  const handleMouseDown = () => {
    pressTimer = setTimeout(() => {
      console.log("🚀 Reindirizzamento a /admin/products..."); // 🔍 Debug
      router.push("/admin/products");
    }, 2000); // 2 secondi di pressione
  };

  const handleMouseUp = () => {
    clearTimeout(pressTimer); // Cancella il timer se il logo viene rilasciato prima
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="container">
        <div className="nav-header">
          <button className="menu-toggle" onClick={toggleMenu}>
            <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
          </button>

          {/* ✅ Logo con funzione di pressione prolungata */}
          <div
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp} // Se il mouse esce, annulla l'azione
            style={{ cursor: "pointer" }}
          ></div>
        </div>

        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          <li>
            <Link href="/" onClick={toggleMenu}>
              <FontAwesomeIcon icon={faHome} /> Home
            </Link>
          </li>
          <li>
            <Link href="/shop" onClick={toggleMenu}>
              <FontAwesomeIcon icon={faStore} /> Shop
            </Link>
          </li>

          <li>
            <Link href="/ChiSiamo" onClick={toggleMenu}>
              <FontAwesomeIcon icon={faEnvelope} /> Chi Siamo
            </Link>
          </li>
          <li>
            <Link href="/cart&wish" onClick={toggleMenu}>
              🛒 & 🤍
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBarChiSiamo;
