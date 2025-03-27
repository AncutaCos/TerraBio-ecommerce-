import { NextResponse } from "next/server";
import { dbConnect } from "../utils/dbConnect";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";

// GET: Recupera tutti gli utenti
export async function GET() {
  await dbConnect();
  try {
    const users = await User.find({});
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Errore nel recupero degli utenti:", error);
    return NextResponse.json({ error: "Errore nel recupero degli utenti" }, { status: 500 });
  }
}

// POST: Crea un nuovo utente
export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    
    // Controllo che l'email non sia già in uso
    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      return NextResponse.json({ error: "Email già in uso" }, { status: 400 });
    }

    // Hash della password
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const newUser = await User.create({
      name: body.name,
      email: body.email,
      password: hashedPassword,
      role: body.role,
      consentToMarketing: body.consentToMarketing || false,
    });
    console.log("New User Created:", newUser); // Log dell'utente creato
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Errore nella creazione dell'utente:", error);
    return NextResponse.json({ error: "Errore nella creazione dell'utente" }, { status: 500 });
  }
}
