import { NextResponse } from "next/server";
import { dbConnect } from "../utils/dbConnect";
import Product from "@/app/models/Product";

// GET all products
export async function GET() {
  await dbConnect();
  const products = await Product.find({});
  return NextResponse.json(products, { status: 200 });
}

// POST a new product
export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  console.log("Dati ricevuti:", body);
  // Per sicurezza, crea l'oggetto in modo esplicito:
  const newProduct = await Product.create({
    name: body.name,
    shortDescription: body.shortDescription,
    description: body.description,
    price: body.price,
    category: body.category,
    imageUrl: body.imageUrl,
    stock: body.stock,
    ingredients: body.ingredients,
    usage: body.usage,
    certifications: body.certifications
  });
  return NextResponse.json(newProduct, { status: 201 });
}

