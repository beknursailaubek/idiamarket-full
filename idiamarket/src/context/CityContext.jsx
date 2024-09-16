import React, { createContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export const CityContext = createContext();

export const CityProvider = ({ children }) => {
  const cities = [
    { title: "Алматы", uri: "", code: "almaty" },
    { title: "Астана", uri: "astana", code: "astana" },
    { title: "Шымкент", uri: "shymkent", code: "shymkent" },
    { title: "Актау", uri: "aktau", code: "aktau" },
    { title: "Актобе", uri: "aktobe", code: "aktobe" },
    { title: "Атырау", uri: "atyrau", code: "atyrau" },
    { title: "Жанаозен", uri: "janaozen", code: "janaozen" },
    { title: "Жезказган", uri: "jezkazgan", code: "jezkazgan" },
    { title: "Караганда", uri: "karaganda", code: "karaganda" },
    { title: "Кокшетау", uri: "kokshetau", code: "kokshetau" },
    { title: "Костанай", uri: "kostanai", code: "kostanai" },
    { title: "Кызылорда", uri: "kyzylorda", code: "kyzylorda" },
    { title: "Павлодар", uri: "pavlodar", code: "pavlodar" },
    { title: "Петропавловск", uri: "petropavlovsk", code: "petropavlovsk" },
    { title: "Семей", uri: "semei", code: "semei" },
    { title: "Талдыкорган", uri: "taldykorgan", code: "taldykorgan" },
    { title: "Тараз", uri: "taraz", code: "taraz" },
    { title: "Туркестан", uri: "turkestan", code: "turkestan" },
    { title: "Уральск", uri: "uralsk", code: "uralsk" },
    { title: "Усть-Каменогорск", uri: "ust-kamenogorsk", code: "ust-kamenogorsk" },
  ];

  const location = useLocation();
  const [selectedCity, setSelectedCity] = useState(cities.find((city) => city.code === "almaty"));

  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathSegments = location.pathname.split("/");
      const cityFromUrl = pathSegments[1];
      const city = cities.find((city) => city.uri === cityFromUrl);
      if (city) {
        setSelectedCity(city);
      }
    }
  }, [location.pathname]);

  return <CityContext.Provider value={{ selectedCity, setSelectedCity, cities }}>{children}</CityContext.Provider>;
};
