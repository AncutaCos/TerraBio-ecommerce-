// api/register/route.js
import { NextResponse } from "next/server";
import { dbConnect } from "../../utils/dbConnect";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  // Connetti al database
  await dbConnect();
  
  try {
    // Estrai i dati dal body della richiesta
    const { name, email, password, consentToMarketing } = await req.json();
    
    // Controllo di validità dei dati
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Dati mancanti" }, { status: 400 });
    }
    
    // Verifica se l'email è già in uso
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email già in uso" }, { status: 400 });
    }
    
    // Hash della password per sicurezza
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Crea il nuovo utente nel database
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      consentToMarketing: consentToMarketing || false, // Aggiungi il consenso al marketing
    });
    
    // Prepara la risposta escludendo la password
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      consentToMarketing: newUser.consentToMarketing, // Includi il consenso nella risposta
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };
    
    return NextResponse.json(userResponse, { status: 201 });
  } catch (error) {
    console.error("Errore in register API:", error);
    return NextResponse.json({ error: "Errore durante la registrazione" }, { status: 500 });
  }
}