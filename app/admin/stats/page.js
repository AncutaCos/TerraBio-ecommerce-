// COMPONENTE AdminDashboard aggiornato
"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import "./AdminDashboard.css";
import AdminNavbar from "@/app/components/AdminNavbar";

const COLORS = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#E7E9ED",
  "#71B37C",
];

const statusColors = {
  Pending: "#FF6384",
  Delivered: "#36A2EB",
  Cancelled: "#FFCE56",
  Processing: "#4BC0C0",
  Shipped:  "#9966FF",
};

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [period, setPeriod] = useState("weekly");

  useEffect(() => {
    // Verifica se l'utente ha inserito il codice segreto
    const hasAccess = sessionStorage.getItem("adminAccess");
    if (!hasAccess) {
      window.location.href = "/admin/access"; // Reindirizza alla pagina di accesso
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await fetch(`/api/stats?period=${period}`);
      const data = await response.json();
      setOrders(data.orders.slice(-10));
      setStats(data.stats);
    } catch (error) {
      console.error("Errore nel recupero dei dati", error);
    }
  }, [period]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <>
    <AdminNavbar />
    <div className="admin-dashboard">
      <h1>Dashboard Ordini</h1>
      <div>
        <label>Visualizza entrate per: </label>
        <select value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="daily">Giornaliero</option>
          <option value="weekly">Settimanale</option>
          <option value="monthly">Mensile</option>
        </select>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <h2>Ordini per Stato</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={stats.orderStatus} dataKey="count" nameKey="status" label>
                {stats.orderStatus?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={statusColors[entry.status] || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-section">
          <h2>Prodotti più Venduti</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.topProducts}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sold">
                {stats.topProducts?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-section">
          <h2>Andamento Entrate</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.revenueData}>
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#FF6384" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-section">
          <h2>Ultimi Ordini Registrati</h2>
          <table>
            <thead>
              <tr>
                <th>Utente</th>
                <th>Data</th>
                <th>Importo</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index}>
                  <td>{order.user?.name || "Anonimo"}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{order.totalAmount}€</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
  );
};

export default AdminDashboard;
