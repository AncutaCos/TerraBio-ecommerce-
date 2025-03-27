// components/CookieBanner.js
"use client";

import CookieConsent from "react-cookie-consent";

export default function CookieBanner() {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Accetta"
      style={{background: "#2c6e49"}}
      buttonStyle={{ color: "#white", background: "#f1d600", fontSize: "13px" }}
      expires={150}
    >
      Questo sito utilizza i cookie per migliorare l&apos;esperienza utente.{" "}
      <a href="/legal/cookie-policy" style={{ color: "#f1d600" }}>
        Leggi di più
      </a>
    </CookieConsent>
  );
}