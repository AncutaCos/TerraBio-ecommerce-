import { NextResponse } from "next/server";
import Order from "@/app/models/Order";
import { dbConnect } from "../utils/dbConnect";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");

  if (!orderId) {
    return NextResponse.json({ message: "ID ordine mancante" }, { status: 400 });
  }

  await dbConnect();

  try {
    // Popola i prodotti e il campo user (solo l'email)
    const order = await Order.findById(orderId)
      .populate("products.product")
      .populate("user", "email")
      .lean();
    if (!order) {
      console.error("Ordine non trovato per ID:", orderId);
      return NextResponse.json({ message: "Ordine non trovato" }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error) {
    console.error("Errore nel recupero dell'ordine:", error);
    return NextResponse.json({ message: "Errore nel recupero dell'ordine" }, { status: 500 });
  }
}
