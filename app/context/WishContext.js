"use client";
import { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Carica la wishlist dal localStorage quando il componente monta
  useEffect(() => {
    const storedWishlist = localStorage.getItem("wishlistItems");
    if (storedWishlist) {
      setWishlistItems(JSON.parse(storedWishlist));
    }
  }, []);

  // Salva la wishlist nel localStorage ogni volta che cambia
  useEffect(() => {
    localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (product) => {
    // Se il prodotto non è già presente, lo aggiunge
    if (!wishlistItems.find((item) => item._id === product._id)) {
      setWishlistItems((prev) => [...prev, product]);
    } else {
      // Se è già presente, lo rimuove (toggle)
      setWishlistItems((prev) => prev.filter((item) => item._id !== product._id));
    }
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prev) => prev.filter((item) => item._id !== productId));
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
