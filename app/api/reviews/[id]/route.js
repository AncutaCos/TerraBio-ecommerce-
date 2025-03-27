import { NextResponse } from "next/server";
import { dbConnect } from "@/app/api/utils/dbConnect";
import Review from "@/app/models/Review";

// Connessione al database
dbConnect();

// **AGGIORNA UNA RECENSIONE (PUT)**
export async function PUT(req, { params }) {
  try {
    const id = params.id; // Ottieni l'ID dalla URL
    const reviewData = await req.json();

    const updatedReview = await Review.findByIdAndUpdate(id, reviewData, { new: true });

    if (!updatedReview) {
      return NextResponse.json({ error: "Recensione non trovata" }, { status: 404 });
    }

    return NextResponse.json(updatedReview, { status: 200 });

  } catch (error) {
    console.error("Errore nell'aggiornamento della recensione:", error);
    return NextResponse.json({ error: "Errore nell'aggiornamento" }, { status: 500 });
  }
}

// **ELIMINA UNA RECENSIONE (DELETE)**
export async function DELETE(req, { params }) {
  try {
    const id = params.id; // Ottieni l'ID dalla URL
    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return NextResponse.json({ error: "Recensione non trovata" }, { status: 404 });
    }

    return NextResponse.json({ message: "Recensione eliminata" }, { status: 200 });

  } catch (error) {
    console.error("Errore nell'eliminazione della recensione:", error);
    return NextResponse.json({ error: "Errore nell'eliminazione" }, { status: 500 });
  }
}
