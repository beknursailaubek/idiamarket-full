import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FavoritesContext } from "../../context/FavoritesContext";
import { CityContext } from "../../context/CityContext";
import Modal from "../Modal/Modal";
import Location from "../Location/Location";
import Search from "../Search/Search";
import LogoIcon from "../../assets/images/logo.svg";
import LocationIcon from "../../assets/images/icons/location.svg";
import PhoneIcon from "../../assets/images/icons/phone.svg";
import ArrowDownIcon from "../../assets/images/icons/arrow-down.svg";
import CategoryIcon from "../../assets/images/icons/category.svg";
import SearchIcon from "../../assets/images/icons/search.svg";
import Heart from "../../assets/images/icons/heart.svg";
import Compare from "../../assets/images/icons/compare.svg";
import Cart from "../../assets/images/icons/cart.svg";
import User from "../../assets/images/icons/user.svg";
import CloseIcon from "../../assets/images/icons/close.svg";
import "./Header.css";

const Header = () => {
  const { favorites } = useContext(FavoritesContext);
  const { selectedCity } = useContext(CityContext);
  const [isLocationModalOpen, setLocationModalOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchProducts, setSearchProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const openLocationModal = () => setLocationModalOpen(true);
  const closeLocationModal = () => setLocationModalOpen(false);
  const [searchHistory, setSearchHistory] = useState([]);

  const navigate = useNavigate();

  const openSearch = () => setSearchOpen(true);
  const closeSearch = () => setSearchOpen(false);

  const cityPrefix = selectedCity.uri ? `/${selectedCity.uri}` : "";

  const handleSearchInput = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchQuery = () => {
    setSearchQuery("");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      if (!searchQuery.trim()) {
        return;
      }
      let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
      if (!searchHistory.some((item) => item.query === searchQuery)) {
        searchHistory.unshift({ query: searchQuery, path: `/search/${searchQuery}` });
        searchHistory = searchHistory.slice(0, 5);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        setSearchHistory(searchHistory); // Update the state immediately
      }

      event.target.blur();
      navigate(`/search/${searchQuery}`, { state: { products: searchProducts, searchQuery: searchQuery } });
      closeSearch();
    }
  };

  useEffect(() => {
    const fetchSearchProducts = async () => {
      if (!searchQuery) {
        setSearchProducts([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/products/search?query=${encodeURIComponent(searchQuery)}`);

        if (response.ok) {
          const data = await response.json();
          console.log("Search result data:", data);
          console.log(searchQuery);
          setSearchProducts(data);
        } else {
          console.log(searchQuery);
          throw new Error("Failed to fetch search results");
        }
      } catch (error) {
        console.error(error);
        setError("An error occurred while fetching search results.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchProducts();
  }, [searchQuery]);

  return (
    <>
      <div className="header__top">
        <div className="header__inner container">
          <Link className="header__logo logo" to={cityPrefix}>
            <img src={LogoIcon} alt="Logo" className="logo__image" />
          </Link>

          <div className="header__info">
            <button className="header__location location" onClick={openLocationModal}>
              <img src={LocationIcon} alt="Location" className="location__icon" width="16px" height="16px" />
              <span className="location__city">{selectedCity.title}</span>
            </button>
            <button className="header__contacts contacts">
              <img src={PhoneIcon} alt="Phone" className="contacts__icon contacts__icon_phone" width="16px" height="16px" />
              <div className="contacts__phone">8 (727) 344-99-00</div>
              <img src={ArrowDownIcon} alt="Arrow Down" className="contacts__icon contacts__icon_arrow" width="16px" height="16px" />
            </button>
            <span className="header__schedule">с 09:00 до 18:00 ежедневно</span>
          </div>
          <nav className="header__menu menu">
            <ul className="menu__list">
              {["Главная", "Проекты", "3D Дизайн", "Доставка", "О нас", "Отзывы", "Контакты"].map((item, index) => (
                <li className="menu__item" key={index}>
                  <Link to={cityPrefix} className="menu__link">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      <header className="header__bottom">
        <div className="header__inner container">
          <button className="header__category category-btn">
            <img className="category-btn__icon" src={CategoryIcon} alt="Category" />
            <span className="category-btn__title">Категории</span>
          </button>
          <div className="header__search search" onClick={openSearch}>
            <input className="search__input" type="text" placeholder="Я хочу найти" value={searchQuery} onChange={handleSearchInput} onKeyPress={handleKeyPress} onBlur={openSearch} />
            {searchQuery ? <img className="search__icon" onClick={handleSearchQuery} src={CloseIcon} alt="" /> : <img className="search__icon" src={SearchIcon} alt="" />}
          </div>
          <div className="header__actions actions">
            <div className="action action__favorite">
              <img className="action__icon" src={Heart} alt="Favorite" />
              <p className="action__title">Избранное</p>
              {favorites.length > 0 && <span className="action__count action_favourite__count">{favorites.length}</span>}
            </div>
            <div className="action action_compare">
              <img className="action__icon" src={Compare} alt="Compare" />
              <p className="action__title">Сравнить</p>
            </div>
            <div className="action action_cart">
              <img className="action__icon" src={Cart} alt="Cart" />
              <p className="action__title">Корзина</p>
            </div>
            <div className="action action_signin">
              <img className="action__icon" src={User} alt="Sign In" />
              <p className="action__title">Вход</p>
            </div>
          </div>
        </div>

        <Search searchQuery={searchQuery} searchProducts={searchProducts} isOpen={isSearchOpen} onClose={closeSearch} />
      </header>

      <Modal isOpen={isLocationModalOpen} onClose={closeLocationModal}>
        <Location closeModal={closeLocationModal} />
      </Modal>
    </>
  );
};

export default Header;
