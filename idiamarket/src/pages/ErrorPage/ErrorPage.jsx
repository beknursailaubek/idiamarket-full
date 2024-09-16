import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CityContext } from "../../context/CityContext";
import "./Error.css";

const ErrorPage = () => {
    const { selectedCity } = useContext(CityContext);
    const cityPrefix = selectedCity.uri ? `/${selectedCity.uri}` : "";

    return (
        <main className="main">
            <div className="container">
                <div className="error">
                    <p className="error__status">404</p>
                    <p className="error__text">Страница не найдена</p>
                    <Link className="error__redirect" to={cityPrefix}>
                        На главную страницу
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default ErrorPage;
