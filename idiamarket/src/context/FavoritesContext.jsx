import React, { createContext, useState, useEffect } from "react";

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFavorites = JSON.parse(localStorage.getItem("favourites")) || [];
      setFavorites(storedFavorites);
    }
  }, []);

  const addToFavorite = (productCode) => {
    const updatedFavorites = [...favorites, productCode];
    setFavorites(updatedFavorites);
    localStorage.setItem("favourites", JSON.stringify(updatedFavorites));
  };

  const removeFromFavorite = (productCode) => {
    const updatedFavorites = favorites.filter((code) => code !== productCode);
    setFavorites(updatedFavorites);
    localStorage.setItem("favourites", JSON.stringify(updatedFavorites));
  };

  return <FavoritesContext.Provider value={{ favorites, addToFavorite, removeFromFavorite }}>{children}</FavoritesContext.Provider>;
};
