import { NextResponse } from "next/server";
import { dbConnect } from "../../utils/dbConnect";
import Product from "@/app/models/Product";

// GET: Recupera un prodotto specifico per ID
export async function GET(req, { params }) {
  await dbConnect();
  const { id } = params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: "Prodotto non trovato" }, { status: 404 });
    }
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Errore durante il recupero del prodotto:", error);
    return NextResponse.json({ error: "Errore durante il recupero del prodotto" }, { status: 500 });
  }
}

// PUT: Aggiorna un prodotto esistente
export async function PUT(req, { params }) {
  await dbConnect();
  const { id } = params;
  try {
    const body = await req.json();
    const updatedProduct = await Product.findByIdAndUpdate(id, body, { new: true });
    if (!updatedProduct) {
      return NextResponse.json({ error: "Prodotto non trovato" }, { status: 404 });
    }
    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("Errore durante l'aggiornamento del prodotto:", error);
    return NextResponse.json({ error: "Errore durante l'aggiornamento del prodotto" }, { status: 500 });
  }
}

// DELETE: Elimina un prodotto
export async function DELETE(req, { params }) {
  await dbConnect();
  const { id } = params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return NextResponse.json({ error: "Prodotto non trovato" }, { status: 404 });
    }
    return NextResponse.json({ message: "Prodotto eliminato con successo" }, { status: 200 });
  } catch (error) {
    console.error("Errore durante l'eliminazione del prodotto:", error);
    return NextResponse.json({ error: "Errore durante l'eliminazione del prodotto" }, { status: 500 });
  }
}
