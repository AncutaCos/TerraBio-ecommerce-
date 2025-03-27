"use client";
import { useState, useEffect, useCallback } from "react";
import "./AdminOrderForm.css";

const AdminOrderForm = ({ order, onClose, refreshOrders }) => {
  const [availableProducts, setAvailableProducts] = useState([]);

  const [formData, setFormData] = useState({
    customer: order ? order.customer : "",
    total: order ? order.total : 0,
    status: order ? order.status : "In attesa",
    trackingNumber: order ? order.trackingNumber : "",
    notes: order ? order.notes : "",
  });

  const [productLines, setProductLines] = useState(
    order
      ? order.products.map((p) => ({
          product: p.product.toString(),
          quantity: p.quantity,
        }))
      : [{ product: "", quantity: 1 }]
  );

  // Fetch dei prodotti disponibili
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        setAvailableProducts(data);
      } catch (error) {
        console.error("Errore nel recupero dei prodotti:", error);
      }
    };
    fetchProducts();
  }, []);

  // Funzione per calcolare il totale dell'ordine
  const calculateTotal = useCallback(() => {
    let total = 0;
    productLines.forEach((line) => {
      const product = availableProducts.find((p) => p._id === line.product);
      if (product) {
        total += product.price * (line.quantity ? parseInt(line.quantity, 10) : 1);
      }
    });
    setFormData((prev) => ({ ...prev, total: total.toFixed(2) }));
  }, [productLines, availableProducts]);

  // Effettua il calcolo ogni volta che i prodotti o le quantità cambiano
  useEffect(() => {
    calculateTotal();
  }, [productLines, calculateTotal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductLineChange = (index, field, value) => {
    const newLines = [...productLines];
    newLines[index][field] = value;
    setProductLines(newLines);
  };

  const addProductLine = () => {
    setProductLines([...productLines, { product: "", quantity: 1 }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderData = {
      ...formData,
      products: productLines,
    };

    try {
      const method = order ? "PUT" : "POST";
      const url = order ? `/api/orders/${order._id}` : "/api/orders";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error("Errore nell'invio dei dati: " + errorText);
      }

      refreshOrders && refreshOrders();
      onClose();
    } catch (error) {
      console.error("Errore:", error);
      alert(error.message);
    }
  };

  return (
    <div className="admin-order-form-overlay">
      <div className="admin-order-form-modal">
        <button className="form-close-btn" onClick={onClose}>×</button>
        <h2>{order ? "Modifica Ordine" : "Aggiungi Nuovo Ordine"}</h2>
        <form onSubmit={handleSubmit} className="admin-order-form">
          <label>
            Cliente:
            <input
              type="text"
              name="customer"
              value={formData.customer || ""}
              onChange={handleChange}
              required
            />
          </label>

          <label>Prodotti:</label>
          {productLines.map((line, index) => (
            <div key={index} className="product-line">
              <select
                value={line.product || ""}
                onChange={(e) => handleProductLineChange(index, "product", e.target.value)}
                required
              >
                <option value="">Seleziona un prodotto</option>
                {availableProducts.map((prod) => (
                  <option key={prod._id} value={prod._id || ""}>
                    {prod.name} (€{prod.price})
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Quantità"
                value={line.quantity || ""}
                onChange={(e) => handleProductLineChange(index, "quantity", e.target.value)}
                min="1"
                required
              />
            </div>
          ))}

          <button type="button" onClick={addProductLine} className="add-line-btn">
            Aggiungi Prodotto
          </button>

          <label>
            Totale (€):
            <input
              type="number"
              name="total"
              value={formData.total || ""}
              readOnly
            />
          </label>

          <label>
            Stato:
            <select name="status" value={formData.status || ""} onChange={handleChange}>
              <option value="In attesa">In attesa</option>
              <option value="Spedito">Spedito</option>
              <option value="Consegnato">Consegnato</option>
              <option value="Annullato">Annullato</option>
            </select>
          </label>

          <label>
            Numero di Tracking:
            <input
              type="text"
              name="trackingNumber"
              value={formData.trackingNumber || ""}
              onChange={handleChange}
            />
          </label>

          <label>
            Note:
            <textarea name="notes" value={formData.notes || ""} onChange={handleChange} />
          </label>

          <button type="submit" className="form-submit-btn">
            {order ? "Salva Modifiche" : "Aggiungi Ordine"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminOrderForm;
