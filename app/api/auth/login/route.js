import { NextResponse } from "next/server";
import { dbConnect } from "../../utils/dbConnect";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    const { email, password } = body;

    // Trova l'utente con l'email fornita
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Utente non trovato" }, { status: 404 });
    }

    // Confronta la password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Password errata" }, { status: 401 });
    }

    // Se il login ha successo, restituisci i dati dell'utente (oppure un token JWT in un'app reale)
    return NextResponse.json({ 
      _id: user._id, 
      name: user.name, 
      email: user.email,
      role: user.role
    }, { status: 200 });
  } catch (error) {
    console.error("Errore durante il login:", error);
    return NextResponse.json({ error: "Errore durante il login" }, { status: 500 });
  }
}
