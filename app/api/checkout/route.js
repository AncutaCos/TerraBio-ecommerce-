import { NextResponse } from "next/server";
import Stripe from "stripe";
import Order from "@/app/models/Order";
import { dbConnect } from "../utils/dbConnect";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  await dbConnect();
  
  try {
    const { orderId } = await req.json();
    const order = await Order.findById(orderId).populate("products.product");

    const lineItems = order.products.map(item => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.product.name

        },
        unit_amount: Math.round(item.product.price * 100)
      },
      quantity: item.quantity
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}&orderId=${orderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`,
    });

    return NextResponse.json({ sessionId: session.url });
    
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Errore durante il checkout" },
      { status: 500 }
    );
  }
}