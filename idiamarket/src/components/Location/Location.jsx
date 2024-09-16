import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CityContext } from "../../context/CityContext";
import "./Location.css";
import SelectedIcon from "../../assets/images/icons/done.svg";

const Location = ({ closeModal }) => {
    const { selectedCity, setSelectedCity, cities } = useContext(CityContext);
    const location = useLocation();
    const navigate = useNavigate();

    const handleCitySelect = (city) => {
        setSelectedCity(city);
        const pathSegments = location.pathname.split("/").filter((segment) => !cities.some((c) => c.uri === segment));
        const newUri = city.uri ? `/${city.uri}/${pathSegments.join("/")}` : `/${pathSegments.join("/")}`;
        navigate(newUri);
        closeModal();
    };

    return (
        <div className="location-modal">
            <div className="location-modal__content">
                <p className="location-modal__title">Выберите город</p>
                <p className="location-modal__text">Выбор города поможет вам узнать о наличии товара и условиях доставки</p>
                <div className="location-modal__cities">
                    {cities.map((city) => (
                        <button key={city.code} onClick={() => handleCitySelect(city)} className={`location-modal__city ${city.code === selectedCity.code ? "location-modal__city_active" : ""}`}>
                            {city.title}
                            {city.code === selectedCity.code ? <img className="location-modal__city-icon" src={SelectedIcon} alt="" /> : null}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Location;
