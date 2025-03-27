// app/api/offers/active/route.js
import Offer from "@/app/models/Offer";

export async function GET() {
  try {
    const currentDate = new Date();
    const activeOffers = await Offer.find({
      $or: [
        { expiresAt: { $gte: currentDate } }, // Offerte con scadenza futura
        { expiresAt: null }, // Offerte senza scadenza
      ],
    });
    return new Response(JSON.stringify(activeOffers), { status: 200 });
  } catch (error) {
    console.error("❌ Errore nel recupero delle offerte attive:", error);
    return new Response(JSON.stringify({ message: "Errore nel recupero delle offerte attive", error }), { status: 500 });
  }
}