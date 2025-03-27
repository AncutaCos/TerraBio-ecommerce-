"use client";
import React from "react";
import "./ChiSiamo.css";
import { motion } from "framer-motion";
import NavBarChiSiamo from "../components/NavBarChiSiamo.js";
import Footer from "../components/Footer";

const ChiSiamo = () => {
  const rotateVariants = {
    hidden: { opacity: 0, rotate: -20, scale: 0.9 },
    visible: {
      opacity: 1,
      rotate: 0,
      scale: 1,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  return (
    <>
      <NavBarChiSiamo />
      <div className="chi-siamo-container">
        <div className="grid-container">
          <motion.div
            className="quadrante quadrante-bg1"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={rotateVariants}
          >
            <h2>La Nostra Storia</h2>
            <p>
              TerraBio è nata dalla passione per la natura e il desiderio di offrire
              benessere autentico. Tutto è iniziato nel 2021, quando i fondatori,
              immersi tra piante aromatiche e oli essenziali, hanno realizzato il
              primo prodotto nella loro cucina. Non era solo un idea
              imprenditoriale, ma una vera necessità: creare qualcosa di puro,
              rispettoso della natura e del corpo.
            </p>
            <p>
              Il 2022 ha segnato il debutto dei nostri prodotti sul mercato. Gli oli
              essenziali, i burri corpo e i saponi naturali sono stati accolti con
              entusiasmo. Abbiamo partecipato a mercatini locali, ascoltato le
              storie dei clienti, appreso dai loro feedback e migliorato
              continuamente.
            </p>
            <p>
              Nel 2023, spinti dalla crescente domanda e dall amore per il nostro
              progetto, abbiamo ampliato la gamma di prodotti e abbracciato
              l eco-sostenibilità. Ogni confezione è diventata eco-friendly, ogni
              formula è stata affinata per garantire qualità e rispetto per
              l ambiente.
            </p>
            <p>
              Oggi, il nostro obiettivo rimane lo stesso: portare benessere naturale
              in ogni casa, ispirando uno stile di vita sano e consapevole. TerraBio
              non è solo un marchio, è una filosofia di vita, un viaggio verso un
              mondo più green.
            </p>
          </motion.div>

          <motion.div
            className="quadrante"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={rotateVariants}
          >
            <h2>Ingredienti e Benefici</h2>
            <p>
              Usiamo solo ingredienti naturali, bio e vegan, selezionati con cura
              per i loro benefici:
            </p>
            
            
                <strong>. Aloe Vera:</strong> Idratante, lenitiva, perfetta per pelli
                sensibili.
             
             
                <strong>. Olio di Jojoba:</strong> Regola la produzione di sebo,
                ottimo per pelli grasse e miste.
             
              
                <strong>. Burro di Karité:</strong> Nutre profondamente, ideale per
                pelli secche.
             
             
                <strong>. Olio Essenziale di Lavanda:</strong> Rilassante, favorisce
                il sonno e calma la mente.
             
             
                <strong>Tè Verde:</strong> Antiossidante, combatte l invecchiamento
                della pelle.
             
             
                <strong>. Olio di Argan:</strong> Ristrutturante per capelli secchi e
                sfibrati.
          
          
            <p>
              Ogni ingrediente è scelto per offrire il massimo dei benefici,
              rispettando sempre l ambiente e la salute della pelle.
            </p>
          </motion.div>
          <motion.div
            className="quadrante quadrante-bg2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={rotateVariants}
          >
            <h2>Ricette e Consigli</h2>
            <p>Ecco alcune delle nostre ricette preferite e consigli utili:</p>
           
           
            <p> <strong>Scrub corpo naturale:</strong> Mescola zucchero di canna,
                olio di cocco e olio essenziale di arancia per una pelle liscia e
                profumata.</p>
              
              <p><strong>Maschera viso idratante:</strong> Yogurt naturale, miele e
              qualche goccia di olio di jojoba per nutrire la pelle in profondità.</p>
                
                
              
                <p> <strong>Bagno rilassante:</strong> Aggiungi all acqua calda del
 bagno olio essenziale di lavanda e sali di Epsom per rilassare
 muscoli e mente.</p>
             
                <p><strong>Consiglio:</strong> Utilizza un panno caldo per aprire i
                pori del viso prima di applicare una maschera.</p>
                
                
             
                <p><strong>Consiglio:</strong> Bevi acqua e tè verde per mantenere la
                pelle luminosa e idratata.</p>
                
                
            
            
          </motion.div>

          <motion.div
            className="quadrante"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={rotateVariants}
          >
            <h2>Novità e Articoli</h2>
            <div className="article">
              <div className="article-title">L importanza del Bio nel Benessere Quotidiano</div>
              <div className="article-content">
                <p>
                  Negli ultimi anni, il movimento biologico ha guadagnato sempre più
                  attenzione, ma cosa significa davvero bio e perché è
                  così importante per il nostro benessere quotidiano? I prodotti
                  biologici sono coltivati senza l uso di pesticidi chimici,
                  fertilizzanti sintetici o organismi geneticamente modificati (OGM).
                  Questo non solo garantisce un alimentazione più sana, ma riduce
                  anche l impatto ambientale. Un aspetto fondamentale del bio è
                  il suo legame con la sostenibilità. Le pratiche agricole biologiche
                  promuovono la biodiversità, migliorano la salute del suolo e
                  riducono l inquinamento delle acque. Inoltre, gli alimenti
                  biologici sono spesso più ricchi di nutrienti, poiché il suolo sano
                  produce frutti e verdure più nutrienti. Anche nella cosmesi,
                  scegliere bio significa evitare parabeni, siliconi e altre sostanze
                  chimiche dannose. La pelle assorbe gran parte dei prodotti
                  applicati, perciò usare cosmetici naturali e biologici può
                  migliorare la salute della pelle nel lungo termine, prevenendo
                  irritazioni e reazioni allergiche.
                </p>
              </div>
            </div>
            <div className="article">
              <div className="article-title">Come Creare una Routine di Bellezza 100% Naturale</div>
              <div className="article-content">
                <p>
                  Creare una routine di benessere bio non significa rivoluzionare
                  tutto dall oggi al domani, ma piuttosto integrare piccoli
                  cambiamenti quotidiani che possano migliorare la qualità della
                  vita. Inizia sostituendo i prodotti per la cura della pelle con
                  alternative naturali e prive di sostanze chimiche. Prova a
                  scegliere alimenti biologici e di stagione, che non solo
                  supportano l agricoltura sostenibile ma offrono anche un
                  valore nutrizionale maggiore. Integra oli essenziali nella tua
                  routine, ad esempio diffondendo oli rilassanti prima di dormire o
                  utilizzando oli tonificanti durante la doccia. Anche
                  l attività fisica all aperto e il contatto con la natura
                  sono fondamentali. Dedica del tempo a passeggiate nel verde,
                  praticando mindfulness e respirando profondamente. Con il tempo,
                  noterai come questi piccoli cambiamenti possano portare a un
                  grande impatto sulla tua salute fisica e mentale.
                </p>
              </div>
            </div>
            {/* Continua con gli altri articoli */}
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ChiSiamo;