// app/api/orders/[id]/route.js
import { NextResponse } from "next/server";
import { dbConnect } from "../../utils/dbConnect";
import Order from "@/app/models/Order";
import  "@/app/models/User";

// GET: Recupera tutti gli ordini
export async function GET() {
    await dbConnect();
    try {
      const orders = await Order.find({}).populate("user", "name email");
      return NextResponse.json(orders, { status: 200 });
    } catch (error) {
      console.error("Errore nel recupero degli ordini:", error);
      return NextResponse.json({ error: "Errore nel recupero degli ordini" }, { status: 500 });
    }
  }
  

// PUT per aggiornare un ordine
export async function PUT(req, { params }) {
    await dbConnect();
    const { id } = params;
    try {
      const body = await req.json();
      const updatedOrder = await Order.findByIdAndUpdate(id, body, { new: true });
      if (!updatedOrder) {
        return NextResponse.json({ error: "Ordine non trovato" }, { status: 404 });
      }
      return NextResponse.json(updatedOrder, { status: 200 });
    } catch (error) {
      console.error("Errore durante l'aggiornamento dell'ordine:", error);
      return NextResponse.json({ error: "Errore durante l'aggiornamento dell'ordine" }, { status: 500 });
    }
  }
// DELETE per eliminare un ordine
export async function DELETE(req, { params }) {
  await dbConnect();
  const { id } = params;
  try {
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return NextResponse.json({ error: "Ordine non trovato" }, { status: 404 });
    }
    return NextResponse.json({ message: "Ordine eliminato con successo" }, { status: 200 });
  } catch (error) {
    console.error("Errore nell'eliminazione dell'ordine:", error);
    return NextResponse.json({ error: "Errore nell'eliminazione dell'ordine" }, { status: 500 });
  }
}
