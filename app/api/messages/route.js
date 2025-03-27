// app/api/messages/route.js
import Message from "@/app/models/Message";

export async function GET() {
  try {
    const messages = await Message.find({});
    return new Response(JSON.stringify(messages), { status: 200 });
  } catch (error) {
    console.error("❌ Errore nel recupero dei messaggi:", error);
    return new Response(JSON.stringify({ message: "Errore nel recupero dei messaggi", error }), { status: 500 });
  }
}