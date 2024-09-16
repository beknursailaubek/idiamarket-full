import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./reset.css";
import "./style.css";
import Header from "./components/Header/Header";
import HomePage from "./pages/HomePage/HomePage";
import ProductPage from "./pages/ProductPage/ProductPage";
import Footer from "./components/Footer/Footer";
import CategoryPage from "./pages/CategoryPage/CategoryPage";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import { FavoritesProvider } from "./context/FavoritesContext";
import { CityProvider } from "./context/CityContext";
import SearchPage from "./pages/SearchPage/SearchPage";

const App = () => {
  return (
    <div className="wrapper">
      <FavoritesProvider>
        <CityProvider>
          <Header />
          <Routes>
            <Route path="/:city" element={<HomePage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/category/*" element={<CategoryPage />} />
            <Route path="/:city/category/*" element={<CategoryPage />} />
            <Route path="/p/:uri" element={<ProductPage />} />
            <Route path="/:city/p/:uri" element={<ProductPage />} />
            <Route path="/search/*" element={<SearchPage />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
          <Footer />
        </CityProvider>
      </FavoritesProvider>
    </div>
  );
};

export default App;
