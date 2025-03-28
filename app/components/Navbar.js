"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faStore, faInfoCircle, faEnvelope, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  let pressTimer = null;
  const [tapCount, setTapCount] = useState(0);

useEffect(() => {
  if (tapCount === 3) {
    const code = prompt("Inserisci il codice segreto:");
    if (code === "123456") {
      router.push("/admin/products");
    } else {
      alert("Codice errato!");
    }
    setTapCount(0);
  }

  const timeout = setTimeout(() => {
    setTapCount(0);
  }, 800); // reset se l'utente non preme abbastanza velocemente

  return () => clearTimeout(timeout);
}, [tapCount, router]);

const handleLogoClick = () => {
  setTapCount((prev) => prev + 1);
};


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
          <div onClick={handleLogoClick} style={{ cursor: "pointer" }}>
  <Image 
    src="/images/LogoTerraBio.jpg" 
    alt="Terra Bio Logo" 
    className="logo-img"
    width={150} 
    height={0} 
    style={{ height: "auto" }} 
  />
</div>

        </div>

        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          <li><Link href="/" onClick={toggleMenu}><FontAwesomeIcon icon={faHome} /> Home</Link></li>
          <li><Link href="/shop" onClick={toggleMenu}><FontAwesomeIcon icon={faStore} /> Shop</Link></li>
          <li><Link href="/ChiSiamo" onClick={toggleMenu}><FontAwesomeIcon icon={faInfoCircle} /> Chi Siamo</Link></li>
          <li><Link href="/contact" onClick={toggleMenu}><FontAwesomeIcon icon={faEnvelope} /> Contatti</Link></li>
          <li><Link href="/cart&wish" onClick={toggleMenu}>🛒 & 🤍</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
