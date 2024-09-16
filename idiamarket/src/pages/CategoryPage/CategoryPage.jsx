import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import "./CategoryPage.css";
import Filter from "../../components/Filter/Filter";
import Sort from "../../components/Sort/Sort";
import ProductCard from "../../components/ProductCard/ProductCard";
import { CityContext } from "../../context/CityContext";
import { Helmet } from "react-helmet";

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

const CategoryPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectedCity } = useContext(CityContext);
  const { "*": fullPath } = useParams();

  useEffect(() => {
    const category_code = fullPath.split("/").pop();
    fetchCategory(category_code);
  }, [fullPath]);

  const fetchCategory = async (category_code) => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/categories/${category_code}`);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setCategory(data.category);
      setProducts(data.products);
      sortProducts(data.products, "По популярности"); // Apply default sorting
    } catch (error) {
      console.error("Error fetching category:", error);
      setCategory(null);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const sortProducts = (products, sortOption) => {
    let sortedProducts = [...products];
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
    sortProducts(filtered, "По популярности"); // Maintain the default sort order after filtering
  };

  const handleSortChange = (sortOption) => {
    sortProducts(filteredProducts, sortOption);
  };

  if (loading) {
    return (
      <main className="main">
        <div className="container">
          <p>Загрузка...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="main">
        <div className="container">
          <p>Ошибка: {error}</p>
        </div>
      </main>
    );
  }

  return (
    <>
      <Helmet>
        <title>{category ? `${category.title} в ${selectedCity.title}` : "IDIA Market"}</title>
        <meta name="description" content={category ? `${category.title} по доступным ценам в ${selectedCity.title}` : "Качественные товары по доступным ценам на idiamarket.kz"} />
        <link rel="canonical" href={`https://www.idiamarket.kz${fullPath}`} />
      </Helmet>

      <main className="main">
        <div className="container">
          <Breadcrumbs />
          <div className="category-page">
            <Filter products={products} onFilterChange={handleFilterChange} />
            <div className="category-page__body">
              <div className="category-page__header">
                <div className="category-page__info">
                  <h1 className="title category-page__title">
                    {category.title} в {selectedCity.title}
                  </h1>
                  <span className="category-page__count">
                    {filteredProducts.length === 1 ? "Найден" : "Найдено"} {filteredProducts.length} {getProductWord(filteredProducts.length)}
                  </span>
                </div>
                <Sort onSortChange={handleSortChange} />
              </div>
              {category.children && category.children.length > 0 ? (
                <div className="category_page__redirects">
                  {category.children.map((redirect) => (
                    <Link to={`${redirect.uri}`} className="category_page__redirect" key={redirect.uri}>
                      {redirect.image ? <img className="redirect__image" src={redirect.image} alt="" /> : null}
                      {redirect.title}
                    </Link>
                  ))}
                </div>
              ) : null}
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

export default CategoryPage;
