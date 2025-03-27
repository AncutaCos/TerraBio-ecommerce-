// app/api/messages/[id]/route.js
import Message from "@/app/models/Message";

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const message = await Message.findByIdAndUpdate(id, { read: true }, { new: true });
    return new Response(JSON.stringify(message), { status: 200 });
  } catch (error) {
    console.error("❌ Errore nell'aggiornamento del messaggio:", error);
    return new Response(JSON.stringify({ message: "Errore nell'aggiornamento del messaggio", error }), { status: 500 });
  }
}