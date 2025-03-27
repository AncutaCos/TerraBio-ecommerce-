import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { userEmail, orderDetails } = await req.json();

    if (!userEmail || !orderDetails) {
      return new Response(JSON.stringify({ message: "Dati mancanti" }), { status: 400 });
    }

    console.log("🛒 Dettagli Ordine Ricevuti:", orderDetails);

    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT, 10),
      secure: process.env.EMAIL_PORT == "465",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // **Verifica e Formatta i Prodotti**
    let productListHTML = "";
    if (orderDetails.products && Array.isArray(orderDetails.products)) {
      productListHTML = orderDetails.products.map(({ product, quantity }) => `
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">${product.name || 'Nome non disponibile'}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${quantity || 1}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${product.price ? product.price + '€' : 'Prezzo non disponibile'}</td>
        </tr>
      `).join("");
    } else {
      console.warn("⚠ Nessun prodotto trovato nell'ordine.");
      productListHTML = `<tr><td colspan="3" style="padding: 10px; text-align: center;">Nessun prodotto disponibile</td></tr>`;
    }

    let emailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #004225; padding: 20px; text-align: center;">
          <h2 style="color: white;"> TerraBio - Conferma Ordine</h2>
        </div>
        <div style="padding: 20px;">
          <h2 style="color: #004225;">Grazie per il tuo ordine!</h2>
          <p>Abbiamo ricevuto il tuo ordine per un totale di <strong>${orderDetails.totalAmount}€</strong>.</p>
          <h3 style="color: #004225;">📦 Dettagli dell'Ordine:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="border: 1px solid #ddd; padding: 8px; background-color: #f4f4f4;">Prodotto</th>
                <th style="border: 1px solid #ddd; padding: 8px; background-color: #f4f4f4;">Quantità</th>
                <th style="border: 1px solid #ddd; padding: 8px; background-color: #f4f4f4;">Prezzo</th>
              </tr>
            </thead>
            <tbody>
              ${productListHTML}
            </tbody>
          </table>
          <h3 style="color: #004225;">📍 Indirizzo di Spedizione:</h3>
          <p>${orderDetails.shippingAddress.address}, ${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.postalCode}</p>
          <p>Ti aggiorneremo non appena l'ordine verrà spedito. 🚀</p>
        </div>
        <div style="background-color: #004225; padding: 15px; text-align: center; color: white;">
          <p> TerraBio - Gli Essenziali | Tutti i diritti riservati</p>
        </div>
      </div>
    `;

    let userMailOptions = {
      from: `"TerraBio - Gli Essenziali" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: " Conferma Ordine - TerraBio",
      html: emailHTML,
    };

    let adminMailOptions = {
      from: `"TerraBio - Gli Essenziali" <${process.env.EMAIL_USER}>`,
      to: process.env.NOTIFICATION_EMAIL,
      subject: "🚀 Nuovo Ordine Ricevuto",
      html: emailHTML,
    };

    await transporter.sendMail(userMailOptions);
    console.log("✅ Email inviata all'utente con successo");

    await transporter.sendMail(adminMailOptions);
    console.log("✅ Email inviata all'admin con successo");

    return new Response(JSON.stringify({ message: "Email inviate con successo" }), { status: 200 });
  } catch (error) {
    console.error("❌ Errore nell'invio dell'email:", error);
    return new Response(JSON.stringify({ message: "Errore nell'invio dell'email", error }), { status: 500 });
  }
}
