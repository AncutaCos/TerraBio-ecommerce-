import { NextResponse } from "next/server";
import { dbConnect } from "../utils/dbConnect";
import Order from "@/app/models/Order";
import User from "@/app/models/User";

// GET: Recupera tutti gli ordini
export async function GET() {
  await dbConnect();
  try {
    const orders = await Order.find({}).populate("user", "name email");
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Errore nel recupero degli ordini:", error);
    console.error("Errore nella creazione dell'ordine:", error);
    return NextResponse.json({ error: "Errore nel recupero degli ordini" }, { status: 500 });
  }
}

// POST: Crea un nuovo ordine
export async function POST(req) {
  await dbConnect();
  
  try {
    const orderData = await req.json();
    const newOrder = new Order(orderData);
    const savedOrder = await newOrder.save();

        // Se l'utente è un nuovo cliente, impostalo come "non nuovo" dopo il primo ordine
        if (orderData.user) {
          await User.findByIdAndUpdate(orderData.user, { isNewCustomer: false });
        }
    
    return NextResponse.json({ orderId: savedOrder._id });
    
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Errore creazione ordine" },
      { status: 500 }
    );
  }
}