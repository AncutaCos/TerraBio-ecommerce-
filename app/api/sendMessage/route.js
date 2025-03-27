// app/api/sendMessage/route.js
import nodemailer from "nodemailer";
import Message from "@/app/models/Message";

export async function POST(req) {
  try {
    const { nome, email, messaggio } = await req.json();

    if (!nome || !email || !messaggio) {
      return new Response(JSON.stringify({ message: "Dati mancanti" }), { status: 400 });
    }

    console.log("📧 Dettagli Messaggio Ricevuti:", { nome, email, messaggio });

    // Salva il messaggio nel database
    const newMessage = new Message({ name: nome, email, message: messaggio });
    await newMessage.save();
    console.log("💾 Messaggio salvato nel database");

    // Configura il trasportatore Nodemailer
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

    // Crea il contenuto HTML per l'email
    let emailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #004225; padding: 20px; text-align: center;">
          <h2 style="color: white;"> TerraBio - Nuovo Messaggio di Contatto</h2>
        </div>
        <div style="padding: 20px;">
          <h2 style="color: #004225;">Hai ricevuto un nuovo messaggio!</h2>
          <p><strong>Nome:</strong> ${nome}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Messaggio:</strong></p>
          <p>${messaggio}</p>
        </div>
        <div style="background-color: #004225; padding: 15px; text-align: center; color: white;">
          <p> TerraBio - Gli Essenziali | Tutti i diritti riservati</p>
        </div>
      </div>
    `;

    // Opzioni dell'email per l'admin
    let adminMailOptions = {
      from: `"TerraBio - Gli Essenziali" <${process.env.EMAIL_USER}>`,
      to: process.env.NOTIFICATION_EMAIL,
      subject: "📩 Nuovo Messaggio di Contatto",
      html: emailHTML,
    };

    // Opzioni dell'email per l'utente (conferma ricezione)
    let userMailOptions = {
      from: `"TerraBio - Gli Essenziali" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: " Grazie per averci contattato!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #004225; padding: 20px; text-align: center;">
            <h2 style="color: white;"> TerraBio - Conferma Ricezione Messaggio</h2>
          </div>
          <div style="padding: 20px;">
            <h2 style="color: #004225;">Grazie per averci contattato, ${nome}!</h2>
            <p>Abbiamo ricevuto il tuo messaggio e ti risponderemo al più presto.</p>
            <p><strong>Il tuo messaggio:</strong></p>
            <p>${messaggio}</p>
          </div>
          <div style="background-color: #004225; padding: 15px; text-align: center; color: white;">
            <p> TerraBio - Gli Essenziali | Tutti i diritti riservati</p>
          </div>
        </div>
      `,
    };

    // Invia l'email all'admin
    await transporter.sendMail(adminMailOptions);
    console.log("✅ Email inviata all'admin con successo");

    // Invia l'email di conferma all'utente
    await transporter.sendMail(userMailOptions);
    console.log("✅ Email di conferma inviata all'utente con successo");

    return new Response(JSON.stringify({ message: "Messaggio inviato con successo" }), { status: 200 });
  } catch (error) {
    console.error("❌ Errore nell'invio del messaggio:", error);
    return new Response(JSON.stringify({ message: "Errore nell'invio del messaggio", error }), { status: 500 });
  }
}