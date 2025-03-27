// Route API aggiornata
import { dbConnect } from "../utils/dbConnect";
import Order from "@/app/models/Order";
import Product from "@/app/models/Product";

export async function GET(req) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "weekly";

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("user");

    // Calcola entrate in base al periodo selezionato
    const revenue = {};
    orders.forEach(order => {
      let key;
      const date = new Date(order.createdAt);
      switch (period) {
        case "daily":
          key = date.toLocaleDateString();
          break;
        case "weekly":
          key = `Settimana ${Math.ceil(date.getDate() / 7)}`;
          break;
        case "monthly":
          key = date.toLocaleString('default', { month: 'long' });
          break;
      }
      revenue[key] = (revenue[key] || 0) + order.totalAmount;
    });
    const revenueData = Object.entries(revenue).map(([label, revenue]) => ({ label, revenue }));

    // Stato degli ordini
    const orderStatus = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});
    const statusData = Object.entries(orderStatus).map(([status, count]) => ({ status, count }));

    // Prodotti più venduti
    const productSales = {};
    for (const order of orders) {
      for (const item of order.products) {
        const product = await Product.findById(item.product);
        if (product) {
          productSales[product.name] = (productSales[product.name] || 0) + item.quantity;
        }
      }
    }
    const topProducts = Object.entries(productSales)
      .map(([name, sold]) => ({ name, sold }))
      .sort((a, b) => b.sold - a.sold);

    return new Response(JSON.stringify({
      orders,
      stats: {
        revenueData,
        orderStatus: statusData,
        topProducts
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Errore nel recupero delle statistiche:", error);
    return new Response(JSON.stringify({ message: "Errore interno del server" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
