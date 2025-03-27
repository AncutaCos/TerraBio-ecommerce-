"use client";
import { useState } from "react";
import Link from "next/link";
import "./AdminNavbar.css";
import LogoInteraction from "./LogoInteraction";

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false); // Stato per gestire l'apertura/chiusura del menu

  const toggleNavbar = () => {
    setIsOpen(!isOpen); // Cambia lo stato per aprire/chiudere il menu
  };

  return (
    <>
     <LogoInteraction /> 
      {/* Hamburger Icon */}
      <div className="hamburger" onClick={toggleNavbar}>
        <div className={`hamburger-line ${isOpen ? "open" : ""}`}></div>
        <div className={`hamburger-line ${isOpen ? "open" : ""}`}></div>
        <div className={`hamburger-line ${isOpen ? "open" : ""}`}></div>
      </div>

      {/* Navbar */}
      <nav className={`admin-navbar ${isOpen ? "open" : ""}`}>
        <h2>TerraBio</h2>
        <ul>
          <li>
            <Link href="/admin/products">Prodotti</Link>
          </li>
          <li>
            <Link href="/admin/users">Clienti</Link>
          </li>
          <li>
            <Link href="/admin/orders">Ordini</Link>
          </li>
          <li>
            <Link href="/admin/stats">Stats</Link>
          </li>
          <li>
            <Link href="/admin/reviews&messages">Reviews e Messages</Link>
          </li>
          <li>
            <Link href="/admin/offers">Offerte</Link>
          </li>
          <li>
  <Link href="/admin/marketing">Marketing</Link>
</li>
          <li>
            <Link href="/">Home</Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default AdminNavbar;