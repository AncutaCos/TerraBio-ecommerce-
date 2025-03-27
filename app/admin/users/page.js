"use client"
import { useState, useEffect } from "react";
import AdminNavbar from "@/app/components/AdminNavbar";
import AdminUserForm from "./AdminUserForm";
import "./AdminUsers.css";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Verifica se l'utente ha inserito il codice segreto
    const hasAccess = sessionStorage.getItem("adminAccess");
    if (!hasAccess) {
      window.location.href = "/admin/access"; // Reindirizza alla pagina di accesso
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error("Errore nel recupero degli utenti:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openEditUser = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const openNewUserForm = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    fetchUsers();
  };

  const deleteUser = async (id) => {
    if (confirm("Sei sicuro di voler eliminare questo utente?")) {
      try {
        const response = await fetch(`/api/users/${id}`, { method: "DELETE" });
        if (!response.ok) {
          throw new Error("Errore nell'eliminazione dell'utente");
        }
        fetchUsers();
      } catch (error) {
        console.error("Errore:", error);
      }
    }
  };

  return (
    <div className="admin-page">
      <AdminNavbar />
      <div className="admin-content">
        <h1>Gestione Utenti</h1>
        <button className="add-user-btn" onClick={openNewUserForm}>➕ Aggiungi Utente</button>
        {showForm && <AdminUserForm user={editingUser} onClose={closeForm} refreshUsers={fetchUsers} />}
        {loading ? (
          <p>Caricamento utenti...</p>
        ) : users.length === 0 ? (
          <p>Nessun utente presente.</p>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Ruolo</th>
                <th>Consenso Marketing</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.consentToMarketing ? "Sì" : "No"}</td>
                  <td>
                    <button onClick={() => openEditUser(user)}>✏ Modifica</button>
                    <button onClick={() => deleteUser(user._id)}>🗑 Elimina</button>
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

export default AdminUsersPage;