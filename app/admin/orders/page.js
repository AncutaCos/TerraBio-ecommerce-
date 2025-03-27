"use client";
import { useState, useEffect } from "react";
import AdminNavbar from "@/app/components/AdminNavbar";
import AdminOrderForm from "./AdminOrderForm";
import "./AdminOrders.css";


const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null);

  useEffect(() => {
    // Verifica se l'utente ha inserito il codice segreto
    const hasAccess = sessionStorage.getItem("adminAccess");
    if (!hasAccess) {
      window.location.href = "/admin/access"; // Reindirizza alla pagina di accesso
    }
  }, []);

  // Funzione per recuperare gli ordini dall'API
  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      const data = await response.json();
      console.log("Dati ricevuti:", data);
      // Se data è un oggetto con una proprietà "orders", usa quella; altrimenti, usa data direttamente
      const ordersArray = Array.isArray(data) ? data : data.orders || [];
      setOrders(ordersArray);
      setLoading(false);
    } catch (error) {
      console.error("Errore nel recupero degli ordini:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Funzione per aggiornare lo stato di un ordine (usata nel form di modifica)
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) {
        throw new Error("Errore nell'aggiornamento dello stato");
      }
      fetchOrders();
    } catch (error) {
      console.error("Errore:", error);
    }
  };

  // Funzione per eliminare un ordine
  const deleteOrder = async (id) => {
    if (confirm("Sei sicuro di voler eliminare questo ordine?")) {
      try {
        const response = await fetch(`/api/orders/${id}`, { method: "DELETE" });
        if (!response.ok) {
          throw new Error("Errore nell'eliminazione dell'ordine");
        }
        fetchOrders();
      } catch (error) {
        console.error("Errore:", error);
      }
    }
  };

  // Funzione per aprire il form di modifica
  const openEditOrder = (order) => {
    setEditingOrder(order);
  };

  // Funzione per chiudere il form e aggiornare gli ordini
  const closeEditOrder = () => {
    setEditingOrder(null);
    fetchOrders();
  };

  return (
    <div className="admin-page">
      <AdminNavbar />
      <div className="admin-content">
        <h1>Gestione Ordini</h1>

        {editingOrder && (
          <AdminOrderForm order={editingOrder} onClose={closeEditOrder} refreshOrders={fetchOrders} />
        )}

        {loading ? (
          <p>Caricamento ordini...</p>
        ) : orders.length === 0 ? (
          <p>Nessun ordine presente.</p>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>ID Ordine</th>
                <th>Cliente</th>
                <th>Data</th>
                <th>Totale</th>
                <th>Indirizzo Spedizione</th>
                <th>Stato</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user?.name || "Cliente sconosciuto"}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>€{order.totalAmount?.toFixed(2) || "N/D"}</td>
                  <td>{order.shippingAddress?.address} , {order.shippingAddress?.city} - {order.shippingAddress?.postalCode}</td>
                  <td>
                    <select
                      defaultValue={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order._id, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={() => openEditOrder(order)}>✏ Modifica</button>
                    <button onClick={() => deleteOrder(order._id)}>🗑 Elimina</button>
                  </td>
                </tr>
                
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
