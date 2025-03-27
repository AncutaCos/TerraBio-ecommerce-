import Image from "next/image";
import { useState } from "react";

const LogoInteraction = () => {
  const [clickStart, setClickStart] = useState(null);

  const handleMouseDown = () => {
    setClickStart(Date.now());
  };

  const handleMouseUp = () => {
    const clickDuration = Date.now() - clickStart;
    if (clickDuration >= 3000) { // 3 secondi
      window.location.href = "/admin/secure-login"; // Reindirizza alla pagina di login
    }
    setClickStart(null);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{ cursor: "pointer" }}
    >
      <Image src="/images/LogoTerraBio.jpg" alt="Logo" width={40} height={40}/>
    </div>
  );
};

export default LogoInteraction;