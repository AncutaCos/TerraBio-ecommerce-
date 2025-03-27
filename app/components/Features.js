import Image from "next/image";
import "./Features.css"; // Assicurati di avere il file CSS

const Features = () => {
  const featuresLeft = [
    { id: 1, name: "Biologico", icon: "/images/bio.jpg" },
    { id: 2, name: "Oli Essenziali", icon: "/images/oliessenziali.jpg" },
    { id: 3, name: "Handmade", icon: "/images/handmade.jpg" },
  ];

  const featuresRight = [
    { id: 4, name: "Cruelty-Free", icon: "/images/crueltyfree.jpg" },
    { id: 5, name: "Vegan", icon: "/images/vegan.jpg" },
    { id: 6, name: "Eco-Packaging", icon: "/images/packaging.jpg" },
  ];

  return (
    <section className="features-container">
      {/* Testo introduttivo */}
      <div className="features-description">
        <h2>Perché Scegliere Terra Bio? </h2>
        <p>
          Noi di <strong>Terra Bio - Gli Essenziali</strong> siamo produttori artigianali, amanti della natura e della qualità.
          Ogni nostro prodotto nasce da una profonda passione per il benessere autentico, utilizzando ingredienti naturali e biologici selezionati con cura.
        </p>
      </div>

      {/* Contenitore flessibile con icone a sinistra, lista al centro, icone a destra */}
      <div className="features-layout">
        {/* Colonna sinistra */}
        <div className="features-column">
          {featuresLeft.map((feature) => (
            <div key={feature.id} className="feature-item">
              <Image src={feature.icon} alt={feature.name} width={70} height={70} className="feature-icon" />
              <p>{feature.name}</p>
            </div>
          ))}
        </div>

        {/* Lista centrale */}
        <ul className="features-list">
          <li>✅ <strong>Produzione Artigianale</strong> – Realizziamo ogni articolo con metodi tradizionali per garantire purezza e qualità.</li>
          <li>✅ <strong>Ingredienti 100% Naturali</strong> – Materie prime certificate, senza additivi chimici.</li>
          <li>✅ <strong>Eco-Packaging</strong> – Packaging ecologico, riciclabile e a basso impatto ambientale.</li>
          <li>✅ <strong>Vegan & Cruelty-Free</strong> – Nessun ingrediente animale e nessun test sugli animali.</li>
          <li>✅ <strong>Oli Essenziali Puri</strong> – Formulazioni arricchite con oli essenziali selezionati.</li>
        </ul>

        {/* Colonna destra */}
        <div className="features-column">
          {featuresRight.map((feature) => (
            <div key={feature.id} className="feature-item">
              <Image src={feature.icon} alt={feature.name} width={70} height={70} className="feature-icon" />
              <p>{feature.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testo conclusivo */}
      <div className="features-description">
        <p>
        <strong>Scegliere Terra Bio significa scegliere autenticità, natura e rispetto per l’ambiente.</strong>
        </p>
      </div>
    </section>
  );
};

export default Features;
