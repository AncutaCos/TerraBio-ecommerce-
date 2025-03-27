// app/api/sendCampaign/route.js
import nodemailer from "nodemailer";
import Campaign from "@/app/models/Campaign";
import User from "@/app/models/User"; // Assicurati di importare il modello User
import { dbConnect } from "../utils/dbConnect";

export async function POST(req) {
  await dbConnect();
  try {
    const { campaignName, offerDetails, emailContent } = await req.json();

    if (!campaignName || !offerDetails || !emailContent) {
      return new Response(JSON.stringify({ message: "Dati mancanti" }), { status: 400 });
    }

    // Recupera gli utenti che hanno dato il consenso al marketing
    const users = await User.find({ consentToMarketing: true });
    const emailList = users.map(user => user.email);

    // Salva la campagna nel database
    const newCampaign = new Campaign({ campaignName, offerDetails, emailContent });
    await newCampaign.save();

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

    // Invia l'email a ciascun destinatario
    for (const email of emailList) {
      let mailOptions = {
        from: `"TerraBio - Gli Essenziali" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Offerta Speciale: ${campaignName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #004225; padding: 20px; text-align: center;">
              <h2 style="color: white;">${campaignName}</h2>
            </div>
            <div style="padding: 20px;">
              <h2 style="color: #004225;">${offerDetails}</h2>
              <p>${emailContent}</p>
              <a href="https://tuo-negozio.com" style="display: inline-block; padding: 10px 20px; margin-top: 20px; background-color: #f1d600; color: #000; text-decoration: none; border-radius: 5px;">Visita il nostro negozio</a>
            </div>
            <div style="background-color: #004225; padding: 15px; text-align: center; color: white;">
              <p>TerraBio - Gli Essenziali | Tutti i diritti riservati</p>
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
    }

    return new Response(JSON.stringify({ message: "Campagna inviata con successo" }), { status: 200 });
  } catch (error) {
    console.error("Errore nell'invio della campagna:", error);
    return new Response(JSON.stringify({ message: "Errore nell'invio della campagna", error }), { status: 500 });
  }
}