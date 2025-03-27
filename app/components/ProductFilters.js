// components/ProductFilters.jsx
import { useState } from "react";
import "./ProductFilters.css";

const ProductFilters = ({ onFilterChange }) => {
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const handleFilterChange = () => {
    onFilterChange({ category, priceRange });
  };

  return (
    <div className="filters">
      <select onChange={(e) => setCategory(e.target.value)} onBlur={handleFilterChange}>
        <option value="">Tutte le categorie</option>
        <option value="skincare">Skincare</option>
        <option value="alimentari">Altro</option>
      </select>

      <select onChange={(e) => setPriceRange(e.target.value)} onBlur={handleFilterChange}>
        <option value="">Tutti i prezzi</option>
        <option value="low">0-10€</option>
        <option value="medium">10-30€</option>
        <option value="high">30€+</option>
      </select>
    </div>
  );
};

export default ProductFilters;
