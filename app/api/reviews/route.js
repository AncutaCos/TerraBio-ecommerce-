// app/api/reviews/route.js

import { NextResponse } from "next/server";
import { dbConnect } from "../utils/dbConnect";
import Review from "@/app/models/Review";

// POST: Crea una nuova recensione
export async function POST(req) {
  await dbConnect();

  try {
    const reviewData = await req.json();
    const newReview = new Review(reviewData);
    const savedReview = await newReview.save();
    return NextResponse.json({ reviewId: savedReview._id }, { status: 201 });
  } catch (error) {
    console.error("Errore nella creazione della recensione:", error);
    return NextResponse.json({ error: "Errore creazione recensione" }, { status: 500 });
  }
}

// GET: Recupera tutte le recensioni
export async function GET() {
  await dbConnect();

  try {
    const reviews = await Review.find({}).sort({ createdAt: -1 }); // Ordina le recensioni per data di creazione
    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error("Errore nel recupero delle recensioni:", error);
    return NextResponse.json({ error: "Errore nel recupero delle recensioni" }, { status: 500 });
  }
}

// PUT: Aggiorna una recensione (es. approvazione)
export async function PUT(req) {
  await dbConnect();

  try {
    const { id } = req.query; // Recupera l'ID della recensione
    const reviewData = await req.json();

    const updatedReview = await Review.findByIdAndUpdate(id, reviewData, { new: true });
    
    if (!updatedReview) {
      return NextResponse.json({ error: "Recensione non trovata" }, { status: 404 });
    }

    return NextResponse.json(updatedReview, { status: 200 });
  } catch (error) {
    console.error("Errore nell'aggiornamento della recensione:", error);
    return NextResponse.json({ error: "Errore nell'aggiornamento della recensione" }, { status: 500 });
  }
}

// DELETE: Elimina una recensione
export async function DELETE(req) {
  await dbConnect();

  try {
    const { id } = req.query; // Recupera l'ID della recensione

    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return NextResponse.json({ error: "Recensione non trovata" }, { status: 404 });
    }

    return NextResponse.json({ message: "Recensione eliminata con successo" }, { status: 200 });
  } catch (error) {
    console.error("Errore nell'eliminazione della recensione:", error);
    return NextResponse.json({ error: "Errore nell'eliminazione della recensione" }, { status: 500 });
  }
}
