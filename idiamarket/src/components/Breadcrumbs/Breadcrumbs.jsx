import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import { CityContext } from "../../context/CityContext";
import "./Breadcrumbs.css"; // Assuming you have your custom classes defined here

const Breadcrumbs = ({ onBreadcrumbClick, code, productName }) => {
    const location = useLocation();
    const [breadcrumbs, setBreadcrumbs] = useState([]);
    const { selectedCity } = useContext(CityContext);

    useEffect(() => {
        const pathnames = location.pathname.split("/").filter((x) => x);
        const category_code = pathnames[pathnames.length - 1];

        const fetchBreadcrumbs = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/breadcrumbs/${code || category_code}`);
                if (!response.ok) throw new Error("Failed to fetch breadcrumbs");
                const data = await response.json();

                // Add "Главная" as the first breadcrumb
                const homeBreadcrumb = {
                    name: "Главная",
                    path: selectedCity.uri ? `/${selectedCity.uri}` : "/",
                };

                let allBreadcrumbs = [homeBreadcrumb, ...data];

                // If productName is provided, add it as the last breadcrumb
                if (productName) {
                    allBreadcrumbs = [
                        ...allBreadcrumbs,
                        {
                            name: productName,
                            path: location.pathname, // or set to the current path
                        },
                    ];
                }

                setBreadcrumbs(allBreadcrumbs);
            } catch (error) {
                console.error("Error fetching breadcrumbs:", error);
            }
        };

        fetchBreadcrumbs();
    }, [location.pathname, selectedCity.uri, code, productName]);

    const handleBreadcrumbClick = (breadcrumb) => {
        if (onBreadcrumbClick) {
            onBreadcrumbClick(breadcrumb); // Notify parent component
        }
    };

    // Generate JSON-LD structured data for breadcrumbs
    const generateStructuredData = () => {
        const itemListElement = breadcrumbs.map((breadcrumb, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: breadcrumb.name,
            item: `${window.location.origin}${breadcrumb.path}`,
        }));

        return {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement,
        };
    };

    return (
        <>
            <nav className="breadcrumbs">
                {breadcrumbs.map((breadcrumb, index) => {
                    const isLast = index === breadcrumbs.length - 1;

                    return isLast ? (
                        <span key={breadcrumb.path} className="breadcrumb">
                            {breadcrumb.name}
                        </span>
                    ) : (
                        <React.Fragment key={breadcrumb.path}>
                            <Link to={breadcrumb.path} className="breadcrumb" onClick={() => handleBreadcrumbClick(breadcrumb)}>
                                {breadcrumb.name}
                            </Link>
                            <div className="breadcrumb__icon">/</div>
                        </React.Fragment>
                    );
                })}
            </nav>

            {/* Add structured data using Helmet */}
            <Helmet>
                <script type="application/ld+json">
                    {JSON.stringify(generateStructuredData())}
                </script>
            </Helmet>
        </>
    );
};

export default Breadcrumbs;
