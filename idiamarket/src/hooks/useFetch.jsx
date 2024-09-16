// src/hooks/useFetch.js

import { useState, useEffect } from "react";
import { products, categories } from "../data"; // Импорт локальных данных

const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                let fetchedData;
                if (url === "/api/products") {
                    fetchedData = products;
                } else if (url.startsWith("/api/products/")) {
                    const uri = url.split("/").pop();
                    fetchedData = products.find((product) => product.uri === uri);
                } else if (url === "/api/categories") {
                    fetchedData = categories;
                } else if (url.startsWith("/api/categories/")) {
                    const category_code = url.split("/").pop();
                    fetchedData = categories.find((category) => category.category_code === category_code);
                    if (!fetchedData) {
                        throw new Error("Category not found");
                    }
                } else {
                    throw new Error("Invalid URL");
                }

                setData(fetchedData);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);

    return { data, loading, error };
};

export default useFetch;
