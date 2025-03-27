import { NextResponse } from "next/server";
import { dbConnect } from "../../utils/dbConnect";
import User from "@/app/models/User";

// GET: Recupera un utente specifico per ID (opzionale)
export async function GET(req, { params }) {
  await dbConnect();
  const { id } = params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "Utente non trovato" }, { status: 404 });
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Errore durante il recupero dell'utente:", error);
    return NextResponse.json({ error: "Errore durante il recupero dell'utente" }, { status: 500 });
  }
}

// PUT: Aggiorna un utente esistente
export async function PUT(req, { params }) {
  await dbConnect();
  const { id } = params;
  try {
    const body = await req.json();
    const updatedUser = await User.findByIdAndUpdate(id, body, { new: true });
    if (!updatedUser) {
      return NextResponse.json({ error: "Utente non trovato" }, { status: 404 });
    }
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Errore durante l'aggiornamento dell'utente:", error);
    return NextResponse.json({ error: "Errore durante l'aggiornamento dell'utente" }, { status: 500 });
  }
}

// DELETE: Elimina un utente
export async function DELETE(req, { params }) {
  await dbConnect();
  const { id } = params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return NextResponse.json({ error: "Utente non trovato" }, { status: 404 });
    }
    return NextResponse.json({ message: "Utente eliminato con successo" }, { status: 200 });
  } catch (error) {
    console.error("Errore durante l'eliminazione dell'utente:", error);
    return NextResponse.json({ error: "Errore durante l'eliminazione dell'utente" }, { status: 500 });
  }
}
