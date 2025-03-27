// app/api/campaigns/route.js
import { NextResponse } from "next/server";
import { dbConnect } from "../utils/dbConnect";
import Campaign from "@/app/models/Campaign";

// GET: Recupera tutte le campagne
export async function GET() {
  await dbConnect();
  try {
    const campaigns = await Campaign.find({});
    return NextResponse.json(campaigns, { status: 200 });
  } catch (error) {
    console.error("Errore nel recupero delle campagne:", error);
    return NextResponse.json({ error: "Errore nel recupero delle campagne" }, { status: 500 });
  }
}

// POST: Crea una nuova campagna
export async function POST(req) {
  await dbConnect();
  try {
    const { campaignName, offerDetails, emailContent } = await req.json();

    if (!campaignName || !offerDetails || !emailContent) {
      return NextResponse.json({ message: "Dati mancanti" }, { status: 400 });
    }

    const newCampaign = new Campaign({ campaignName, offerDetails, emailContent });
    await newCampaign.save();

    return NextResponse.json(newCampaign, { status: 201 });
  } catch (error) {
    console.error("Errore nella creazione della campagna:", error);
    return NextResponse.json({ error: "Errore nella creazione della campagna" }, { status: 500 });
  }
}