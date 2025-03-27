// app/api/offers/route.js
import Offer from "@/app/models/Offer";

// Crea una nuova offerta
export async function POST(req) {
  try {
    const { type, value, description, expiresAt, forNewCustomers } = await req.json();

    const newOffer = new Offer({
      type,
      value,
      description,
      expiresAt,
      forNewCustomers,
    });

    await newOffer.save();
    return new Response(JSON.stringify(newOffer), { status: 201 });
  } catch (error) {
    console.error("❌ Errore nella creazione dell'offerta:", error);
    return new Response(JSON.stringify({ message: "Errore nella creazione dell'offerta", error }), { status: 500 });
  }
}

// Recupera tutte le offerte
export async function GET() {
  try {
    const offers = await Offer.find({});
    return new Response(JSON.stringify(offers), { status: 200 });
  } catch (error) {
    console.error("❌ Errore nel recupero delle offerte:", error);
    return new Response(JSON.stringify({ message: "Errore nel recupero delle offerte", error }), { status: 500 });
  }
}

// Aggiorna un'offerta
export async function PUT(req) {
  try {
    const { id, ...updateData } = await req.json();
    const updatedOffer = await Offer.findByIdAndUpdate(id, updateData, { new: true });
    return new Response(JSON.stringify(updatedOffer), { status: 200 });
  } catch (error) {
    console.error("❌ Errore nell'aggiornamento dell'offerta:", error);
    return new Response(JSON.stringify({ message: "Errore nell'aggiornamento dell'offerta", error }), { status: 500 });
  }
}

// Elimina un'offerta
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    await Offer.findByIdAndDelete(id);
    return new Response(JSON.stringify({ message: "Offerta eliminata con successo" }), { status: 200 });
  } catch (error) {
    console.error("❌ Errore nell'eliminazione dell'offerta:", error);
    return new Response(JSON.stringify({ message: "Errore nell'eliminazione dell'offerta", error }), { status: 500 });
  }
}