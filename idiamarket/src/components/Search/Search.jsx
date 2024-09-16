import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Search.css";

const Search = ({ isOpen, onClose, searchProducts, searchQuery }) => {
    const [suitableProducts, setSuitableProducts] = useState([]);
    const [searchHistory, setSearchHistory] = useState([]);
    const searchRef = useRef();

    const handleClickOutside = (event) => {
        if (searchRef.current && !searchRef.current.contains(event.target)) {
            onClose();
        }
    };

    useEffect(() => {
        const fetchSuitableProducts = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/products/popular`);
                if (!response.ok) throw new Error("Failed to fetch suitable products");
                const data = await response.json();
                setSuitableProducts(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchSuitableProducts();
    }, []);

    useEffect(() => {
        const storedHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
        setSearchHistory(storedHistory);
    }, [isOpen, searchQuery]);

    const clearHistory = () => {
        localStorage.removeItem("searchHistory");
        setSearchHistory([]);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("ru-RU").format(price);
    };

    if (!isOpen) {
        return null;
    }
    return (
        <div className="search-modal" onClick={handleClickOutside}>
            <div className="search-modal__content" ref={searchRef}>
                <div className="search-modal__info">
                    {searchQuery.length > 0 ? (
                        <div className="search-suggestions">
                            <p className="search-modal__title">Возможно вы ищете</p>
                        </div>
                    ) : (
                        <div className="search-often">
                            <p className="search-modal__title">Часто смотрят</p>

                            <div className="search-often__items">
                                <Link onClick={onClose} className="serch-often__redirect" to={""}>
                                    стеллажи
                                </Link>
                                <Link onClick={onClose} className="serch-often__redirect" to={""}>
                                    плиты
                                </Link>
                                <Link onClick={onClose} className="serch-often__redirect" to={""}>
                                    холодильники
                                </Link>
                                <Link onClick={onClose} className="serch-often__redirect" to={""}>
                                    морозильники
                                </Link>
                                <Link onClick={onClose} className="serch-often__redirect" to={""}>
                                    pos
                                </Link>
                            </div>
                        </div>
                    )}
                    {searchHistory.length ? (
                        <div className="search-history">
                            <div className="search-history__header">
                                <p className="search-modal__title">Недавно искали</p>
                                <button className="search-history__clear-btn" onClick={clearHistory}>
                                    Очистить
                                </button>
                            </div>
                            {searchHistory.length && (
                                <>
                                    <div className="search-history__list">
                                        {searchHistory.map((item, index) => (
                                            <Link className="search-history__redirect" key={index} to={item.path} onClick={onClose}>
                                                {item.query}
                                            </Link>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    ) : null}
                </div>

                <div className="search-modal__results">
                    <p className="search-modal__title">Подходящие товары</p>
                    {searchProducts && searchProducts.length > 0 ? (
                        <div className="search__results">
                            {searchProducts.map((product) => (
                                <Link className="search-card" key={product.uri} to={`/p/${product.uri}`} onClick={onClose}>
                                    <img className="search-card__image" src={product.images && product.images[0] ? product.images[0] : "/default-image.png"} alt={product.title} width={60} height={60} />
                                    <div className="search-card__info">
                                        <p className="search-card__title">{product.title}</p>
                                        {product.price_from ? <span className="product-card__price-actual">от {formatPrice(product.price)} ₸</span> : <span className="product-card__price-actual">{formatPrice(product.price)} ₸</span>}
                                        {product.old_price ? <span className="product-card__price-discount">{formatPrice(product.old_price)} ₸</span> : null}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="search__results">
                            {suitableProducts.map((product) => (
                                <Link className="search-card" key={product.uri} to={`/p/${product.uri}`} onClick={onClose}>
                                    <img className="search-card__image" src={product.images && product.images[0] ? product.images[0] : "/default-image.png"} alt={product.title} width={60} height={60} />
                                    <div className="search-card__info">
                                        <p className="search-card__title">{product.title}</p>
                                        {product.price_from ? <span className="product-card__price-actual">от {formatPrice(product.price)} ₸</span> : <span className="product-card__price-actual">{formatPrice(product.price)} ₸</span>}
                                        {product.old_price ? <span className="product-card__price-discount">{formatPrice(product.old_price)} ₸</span> : null}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Search;
