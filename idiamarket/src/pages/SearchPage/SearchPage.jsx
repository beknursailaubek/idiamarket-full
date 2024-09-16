import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import "./SearchPage.css";
import Filter from "../../components/Filter/Filter";
import Sort from "../../components/Sort/Sort";
import ProductCard from "../../components/ProductCard/ProductCard";
import { CityContext } from "../../context/CityContext";

const getProductWord = (count) => {
  switch (true) {
    case count % 10 === 1 && count % 100 !== 11:
      return "товар";
    case [2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100):
      return "товара";
    default:
      return "товаров";
  }
};

const SearchPage = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { selectedCity } = useContext(CityContext);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);

  const searchQuery = location.pathname.split("/search/")[1] || "";

  useEffect(() => {
    if (!products.length) {
      setFilteredProducts([]);
      return;
    }
    handleSortChange("По популярности"); // Apply default sorting by popularity
  }, [products]);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredProducts([]);
      return;
    }

    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/products/search?query=${searchQuery}`);
        if (!response.ok) throw new Error("Failed to fetch search results");
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        setError("An error occurred while fetching search results.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery]);

  const handleFilterChange = (filters) => {
    const { priceRange, colors, attributes } = filters;

    const filtered = products.filter((product) => {
      const productPrice = parseInt(product.price, 10);

      const priceMatch = productPrice >= priceRange[0] && productPrice <= priceRange[1];
      const colorMatch = colors.length === 0 || (product.color && colors.includes(product.color.code));
      const attributeMatch = Object.entries(attributes).every(([attrCode, values]) => {
        return values.some((selectedValue) => {
          return product.attributes.some((attribute) => {
            return attribute.items.some((item) => {
              return item.attribute_values === selectedValue || item.value === selectedValue;
            });
          });
        });
      });

      return priceMatch && colorMatch && attributeMatch;
    });

    setFilteredProducts(filtered);
    handleSortChange("По популярности"); // Maintain default sort order after filtering
  };

  const handleSortChange = (sortOption) => {
    let sortedProducts = [...filteredProducts];
    switch (sortOption) {
      case "По популярности":
        sortedProducts.sort((a, b) => b.view_count - a.view_count);
        break;
      case "По скидке":
        sortedProducts.sort((a, b) => {
          const discountA = a.old_price ? a.old_price - a.price : 0;
          const discountB = b.old_price ? b.old_price - b.price : 0;
          return discountB - discountA;
        });
        break;
      case "По новизне":
        sortedProducts.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "По возрастанию цены":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "По убыванию цены":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    setFilteredProducts(sortedProducts);
  };

  if (isLoading) {
    return (
      <div className="main">
        <div className="container"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Результаты поиска: {decodeURIComponent(searchQuery)} | IDIA Market</title>
        <meta name="description" content={`Результаты поиска для ${decodeURIComponent(searchQuery)}.`} />
        <link rel="canonical" href={`https://www.idiamarket.kz/search/${searchQuery}`} />
      </Helmet>

      <main className="main main_search">
        <div className="container">
          <div className="category-page">
            <Filter products={products} onFilterChange={handleFilterChange} />
            <div className="category-page__body">
              <div className="category-page__header">
                <div className="category-page__info">
                  <h1 className="title category-page__title">Результаты поиска: {decodeURIComponent(searchQuery)}</h1>
                  <span className="category-page__count">
                    {filteredProducts.length === 1 ? "Найден" : "Найдено"} {filteredProducts.length} {getProductWord(filteredProducts.length)}
                  </span>
                </div>
                <Sort onSortChange={handleSortChange} />
              </div>
              <div className="category-page__content">
                {filteredProducts && filteredProducts.length > 0 ? (
                  <div className="category-page__products">
                    {filteredProducts.map((product, index) => (
                      <ProductCard className="product-card" key={index} product={product} />
                    ))}
                  </div>
                ) : (
                  <div>Не найдено</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default SearchPage;
