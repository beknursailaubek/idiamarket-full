import React, { useState, useEffect } from "react";
import "./Filter.css";

const Filter = ({ onFilterChange, products }) => {
    // Extract prices from products and set initial price range
    const prices = products.length > 0 ? products.map((product) => parseInt(product.price, 10)) : [0];

    const minInitialPrice = Math.min(...prices);
    const maxInitialPrice = Math.max(...prices);

    const [minPrice, setMinPrice] = useState(minInitialPrice);
    const [maxPrice, setMaxPrice] = useState(maxInitialPrice);
    const [tempMinPrice, setTempMinPrice] = useState(minInitialPrice);
    const [tempMaxPrice, setTempMaxPrice] = useState(maxInitialPrice);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [rangeValues, setRangeValues] = useState({});

    const colorMap = products.reduce((acc, product) => {
        if (product.color && !acc[product.color.code]) {
            acc[product.color.code] = product.color;
        }
        return acc;
    }, {});
    const colors = Object.values(colorMap);

    const attributeMap = products.reduce((acc, product) => {
        if (product.attributes && Array.isArray(product.attributes)) {
            product.attributes.forEach((attribute) => {
                if (attribute.items && Array.isArray(attribute.items)) {
                    attribute.items.forEach((item) => {
                        if (item.display_type) {
                            if (!acc[item.title]) {
                                acc[item.title] = { values: new Set(), display_type: item.display_type, code: attribute.code };
                            }
                            acc[item.title].values.add(item.value);
                        }
                    });
                }
            });
        }
        return acc;
    }, {});

    const attributes = Object.entries(attributeMap)
        .map(([title, { values, display_type, code }]) => ({
            title,
            values: Array.from(values),
            display_type,
            code,
        }))
        .filter((attribute) => attribute.values.length > 0);

    useEffect(() => {
        onFilterChange({
            priceRange: [minPrice, maxPrice],
            colors: selectedColors,
            attributes: selectedAttributes,
        });
    }, [minPrice, maxPrice, selectedColors, selectedAttributes]);

    const handleMinPriceChange = (e) => {
        let value = Number(e.target.value.replace(/\s+/g, ""));
        if (!isNaN(value)) {
            if (value > tempMaxPrice) {
                value = tempMaxPrice; // Ensure min does not exceed max
            }
            setTempMinPrice(value);
            setMinPrice(value); // Update slider in real-time
            updateTrackBackground(value, tempMaxPrice);
        }
    };

    const handleMaxPriceChange = (e) => {
        let value = Number(e.target.value.replace(/\s+/g, ""));
        if (!isNaN(value)) {
            if (value < tempMinPrice) {
                value = tempMinPrice; // Ensure max is not less than min
            }
            setTempMaxPrice(value);
            setMaxPrice(value); // Update slider in real-time
            updateTrackBackground(tempMinPrice, value);
        }
    };

    const handlePriceChange = () => {
        let adjustedMinPrice = Math.max(minInitialPrice, Math.min(tempMinPrice, maxInitialPrice));
        let adjustedMaxPrice = Math.min(maxInitialPrice, Math.max(tempMaxPrice, minInitialPrice));

        if (adjustedMinPrice > adjustedMaxPrice) {
            adjustedMinPrice = adjustedMaxPrice;
        }

        // Update state with validated values
        setMinPrice(adjustedMinPrice);
        setMaxPrice(adjustedMaxPrice);

        // Update the slider positions
        setTempMinPrice(adjustedMinPrice);
        setTempMaxPrice(adjustedMaxPrice);

        // Update the track background
        updateTrackBackground(adjustedMinPrice, adjustedMaxPrice);

        // Update selected filters
        if (adjustedMinPrice !== minInitialPrice || adjustedMaxPrice !== maxInitialPrice) {
            const newSelectedFilters = selectedFilters.filter((f) => !f.key.includes("price"));
            setSelectedFilters([...newSelectedFilters, { key: "price", label: `Цена: ${adjustedMinPrice} - ${adjustedMaxPrice} ₸` }]);
        } else {
            setSelectedFilters(selectedFilters.filter((f) => !f.key.includes("price")));
        }
    };

    const handlePriceSliderChange = () => {
        let adjustedMinPrice = tempMinPrice;
        let adjustedMaxPrice = tempMaxPrice;

        if (adjustedMinPrice > adjustedMaxPrice) {
            adjustedMinPrice = adjustedMaxPrice;
        }

        setMinPrice(adjustedMinPrice);
        setMaxPrice(adjustedMaxPrice);

        if (adjustedMinPrice !== minInitialPrice || adjustedMaxPrice !== maxInitialPrice) {
            const newSelectedFilters = selectedFilters.filter((f) => !f.key.includes("price"));
            setSelectedFilters([...newSelectedFilters, { key: "price", label: `Цена: ${adjustedMinPrice} - ${adjustedMaxPrice} ₸` }]);
        } else {
            setSelectedFilters(selectedFilters.filter((f) => !f.key.includes("price")));
        }

        updateTrackBackground(adjustedMinPrice, adjustedMaxPrice);
    };

    const updateTrackBackground = (minPrice, maxPrice) => {
        const minPercent = ((minPrice - minInitialPrice) / (maxInitialPrice - minInitialPrice)) * 100;
        const maxPercent = ((maxPrice - minInitialPrice) / (maxInitialPrice - minInitialPrice)) * 100;

        document.querySelector(".price-range__track").style.background = `linear-gradient(to right, var(--grey-light) 0%, var(--grey-light) ${minPercent}%, var(--red) ${minPercent}%, var(--red) ${maxPercent}%, var(--grey-light) ${maxPercent}%, var(--grey-light) 100%)`;
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handlePriceChange();
        }
    };

    const handleColorChange = (color) => {
        const newSelectedColors = selectedColors.includes(color.code)
            ? selectedColors.filter((c) => c !== color.code) // Deselect the color if it's already selected
            : [...selectedColors, color.code]; // Select the color if it's not selected

        setSelectedColors(newSelectedColors);

        // Пересчитываем допустимые цвета и атрибуты после выбора цвета
        const filteredProducts = getFilteredProducts(newSelectedColors, selectedAttributes);

        const validColors = getValidColors(filteredProducts);
        const validAttributes = getValidAttributes(filteredProducts);

        setSelectedFilters((prevFilters) => {
            const newFilters = prevFilters.filter((filter) => !filter.key.startsWith("color:"));
            return [
                ...newFilters,
                ...newSelectedColors.map((selectedColor) => ({
                    key: `color:${selectedColor}`,
                    label: colors.find((c) => c.code === selectedColor).title,
                })),
            ];
        });
    };

    const handleAttributeChange = (attributeCode, valueCode) => {
        const newAttributes = { ...selectedAttributes };

        if (!newAttributes[attributeCode]) {
            newAttributes[attributeCode] = [];
        }

        if (newAttributes[attributeCode].includes(valueCode)) {
            newAttributes[attributeCode] = newAttributes[attributeCode].filter((val) => val !== valueCode);
        } else {
            newAttributes[attributeCode].push(valueCode);
        }

        if (newAttributes[attributeCode].length === 0) {
            delete newAttributes[attributeCode];
        }

        setSelectedAttributes(newAttributes);

        // Проверяем, есть ли атрибуты и они не undefined перед вызовом map
        const attribute = attributes.find((attr) => attr.code === attributeCode);
        const values = attribute ? attribute.values : [];

        const newAttributeFilters = Object.entries(newAttributes).flatMap(([code, values]) =>
            values.map((valueCode) => {
                const value = attribute ? values.find((val) => val === valueCode) : valueCode;
                return {
                    key: `attribute:${code}:${valueCode}`,
                    label: `${value}`,
                };
            })
        );

        setSelectedFilters((prevFilters) => [...prevFilters.filter((filter) => !filter.key.startsWith(`attribute:${attributeCode}:`)), ...newAttributeFilters]);
    };

    const handleRangeChange = (attributeTitle, minValue, maxValue) => {
        setRangeValues((prev) => ({
            ...prev,
            [attributeTitle]: { minValue, maxValue },
        }));

        setSelectedAttributes((prev) => ({
            ...prev,
            [attributeTitle]: [minValue, maxValue],
        }));

        const newSelectedFilters = selectedFilters.filter((f) => !f.key.includes(`${attributeTitle}`));
        setSelectedFilters([...newSelectedFilters, { key: `range:${attributeTitle}`, label: ` ${minValue} - ${maxValue}` }]);
    };

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };

    const removeFilter = (filterToRemove) => {
        setSelectedFilters(selectedFilters.filter((filter) => filter.key !== filterToRemove.key));

        if (filterToRemove.key.startsWith("color:")) {
            const colorCode = filterToRemove.key.split(":")[1];
            setSelectedColors(selectedColors.filter((c) => c !== colorCode));
        } else if (filterToRemove.key === "price") {
            // Reset the price to initial values and update the track background
            setMinPrice(minInitialPrice);
            setMaxPrice(maxInitialPrice);
            setTempMinPrice(minInitialPrice);
            setTempMaxPrice(maxInitialPrice);
            updateTrackBackground(minInitialPrice, maxInitialPrice);
        } else if (filterToRemove.key.startsWith("range:")) {
            const title = filterToRemove.key.split(":")[1];
            setRangeValues((prev) => {
                const newRangeValues = { ...prev };
                delete newRangeValues[title];
                return newRangeValues;
            });
            setSelectedAttributes((prev) => {
                const newAttributes = { ...prev };
                delete newAttributes[title];
                return newAttributes;
            });
        } else if (filterToRemove.key.startsWith("attribute:")) {
            const [_, attributeCode, valueCode] = filterToRemove.key.split(":");
            setSelectedAttributes((prev) => {
                const newAttributes = { ...prev };
                newAttributes[attributeCode] = newAttributes[attributeCode].filter((val) => val !== valueCode);
                if (newAttributes[attributeCode].length === 0) {
                    delete newAttributes[attributeCode];
                }
                return newAttributes;
            });
        }
    };

    const getFilteredProducts = (selectedColors = [], selectedAttributes = {}) => {
        return products.filter((product) => {
            const productPrice = parseInt(product.price, 10);
            const priceMatch = productPrice >= minPrice && productPrice <= maxPrice;

            const colorMatch = selectedColors.length === 0 || selectedColors.includes(product.color?.code);

            const attributeMatch = Object.entries(selectedAttributes).every(([code, values]) => {
                return values.every((value) => {
                    return product.attributes.some((attribute) => {
                        return attribute.items.some((item) => {
                            if (Array.isArray(value)) {
                                const [minValue, maxValue] = value;
                                const itemValue = parseFloat(item.value.replace(",", "."));
                                return itemValue >= minValue && itemValue <= maxValue;
                            }
                            return attribute.code === code && item.value === value;
                        });
                    });
                });
            });

            return priceMatch && colorMatch && attributeMatch;
        });
    };

    const getValidAttributes = (filteredProducts) => {
        return filteredProducts.reduce((acc, product) => {
            product.attributes.forEach((attribute) => {
                attribute.items.forEach((item) => {
                    if (!acc[item.title]) {
                        acc[item.title] = new Set();
                    }
                    acc[item.title].add(item.value);
                });
            });
            return acc;
        }, {});
    };

    const getValidColors = (filteredProducts) => {
        const validColors = new Set();

        filteredProducts.forEach((product) => {
            if (product.color) {
                validColors.add(product.color.code);
            }
        });

        return validColors;
    };

    const getAttributeCounts = (filteredProducts) => {
        return attributes.reduce((acc, attribute) => {
            acc[attribute.title] = attribute.values.reduce((counts, value) => {
                counts[value] = 0;

                filteredProducts.forEach((product) => {
                    product.attributes.forEach((attr) => {
                        if (attr.items && Array.isArray(attr.items)) {
                            attr.items.forEach((item) => {
                                if (item.title === attribute.title && item.value === value) {
                                    counts[value]++;
                                }
                            });
                        }
                    });
                });

                return counts;
            }, {});
            return acc;
        }, {});
    };

    const filteredProducts = getFilteredProducts();

    const validAttributes = getValidAttributes(filteredProducts);
    const validColors = getValidColors(filteredProducts);

    const attributeCounts = getAttributeCounts(filteredProducts);

    const clearAllFilters = () => {
        setMinPrice(minInitialPrice);
        setMaxPrice(maxInitialPrice);
        setTempMinPrice(minInitialPrice);
        setTempMaxPrice(maxInitialPrice);
        setSelectedColors([]);
        setSelectedAttributes({});
        setSelectedFilters([]);
        setRangeValues({});

        updateTrackBackground(minInitialPrice, maxInitialPrice);
    };

    return (
        <div className="filter">
            {selectedFilters.length > 0 && (
                <div className="selected-filters">
                    <p className="selected-filters__title">Вы выбрали:</p>
                    <div className="selected-filters__items">
                        {selectedFilters.map((filter, index) => (
                            <button key={index} className="selected-filters__remove" onClick={() => removeFilter(filter)}>
                                <span>{filter.label} X</span>
                            </button>
                        ))}
                    </div>
                    <button className="selected-filters__reset" onClick={clearAllFilters}>
                        Очистить все
                    </button>
                </div>
            )}

            <div className="filter__body">
                <div className="filter__section filter__section_bar">
                    <label htmlFor="price" className="filter__title">
                        Цена (₸)
                    </label>
                    <div className="filter__bars">
                        <div className="filter-bar">
                            <label className="filter-bar__label" htmlFor="minPrice">
                                От
                            </label>
                            <input
                                className="filter-bar__input"
                                type="text"
                                id="minPrice"
                                name="minPrice"
                                value={formatPrice(tempMinPrice)}
                                onBlur={handlePriceChange}
                                onKeyDown={handleKeyDown}
                                onInput={(e) => {
                                    e.target.value = e.target.value.replace(/[^0-9\s]/g, "");
                                    handleMinPriceChange(e);
                                }}
                            />
                        </div>
                        <span className="filter-bar__divider">-</span>
                        <div className="filter-bar">
                            <label className="filter-bar__label" htmlFor="maxPrice">
                                До
                            </label>
                            <input
                                className="filter-bar__input"
                                type="text"
                                id="maxPrice"
                                name="maxPrice"
                                value={formatPrice(tempMaxPrice)}
                                onBlur={handlePriceChange}
                                onKeyDown={handleKeyDown}
                                onInput={(e) => {
                                    e.target.value = e.target.value.replace(/[^0-9\s]/g, "");
                                    handleMaxPriceChange(e);
                                }}
                            />
                        </div>
                    </div>

                    <div className="price-range">
                        <input
                            type="range"
                            min={minInitialPrice}
                            max={maxInitialPrice}
                            value={tempMinPrice}
                            onChange={handleMinPriceChange}
                            onMouseUp={handlePriceSliderChange} // Trigger filtering on mouse release
                            className="price-range__slider price-range__slider--min"
                        />
                        <input
                            type="range"
                            min={minInitialPrice}
                            max={maxInitialPrice}
                            value={tempMaxPrice}
                            onChange={handleMaxPriceChange}
                            onMouseUp={handlePriceSliderChange} // Trigger filtering on mouse release
                            className="price-range__slider price-range__slider--max"
                        />
                        <div className="price-range__track"></div>
                    </div>
                </div>
                {colors && colors.length > 0 ? (
                    <div className="filter__section">
                        <label className="filter__title">Цвет</label>
                        <div className="filter__colors">
                            {colors.map((color) => (
                                <label key={color.code} className={`filter-color ${selectedColors.includes(color.code) ? "filter-color_active" : ""} ${!validColors.has(color.code) && !selectedColors.includes(color.code) ? "filter-unavailable" : ""}`}>
                                    <input type="checkbox" value={color.code} onChange={() => handleColorChange(color)} checked={selectedColors.includes(color.code)} disabled={!validColors.has(color.code) && !selectedColors.includes(color.code)} />
                                    <span className="filter-color__palette" style={{ backgroundColor: color.hex }}></span>
                                    <span className="filter-color__label">{color.title}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ) : null}

                {attributes.map((attribute, index) => {
                    if (attribute.values.length > 1 && attribute.display_type === "checkbox") {
                        return (
                            <div key={`${attribute.title}-${index}`} className="filter__section">
                                <label className="filter__title">{attribute.title}</label>
                                <div className="filter__attributes">
                                    {attribute.values.map((value) => (
                                        <label key={value} className={`filter-attribute ${selectedAttributes[attribute.code]?.includes(value) ? "filter-attribute_active" : ""} ${!validAttributes[attribute.title]?.has(value) && !selectedAttributes[attribute.code]?.includes(value) ? "filter-unavailable" : ""}`}>
                                            <input type="checkbox" value={value} onChange={() => handleAttributeChange(attribute.code, value)} checked={selectedAttributes[attribute.code]?.includes(value)} disabled={getAttributeCounts(filteredProducts)[attribute.title][value] === 0} />
                                            <span className="filter-attribute__custom-checkbox"></span>
                                            <span className="filter-attribute__label">{value}</span>
                                            <span className="filter-attribute__count">{getAttributeCounts(filteredProducts)[attribute.title][value]}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        );
                    } else if (attribute.values.length > 1 && attribute.display_type === "range") {
                        const minAttributeValue = Math.min(...attribute.values);
                        const maxAttributeValue = Math.max(...attribute.values);
                        const handleRangeMinChange = (e) => {
                            const value = Number(e.target.value.replace(/\s+/g, ""));
                            if (!isNaN(value)) {
                                setRangeValues((prev) => ({
                                    ...prev,
                                    [attribute.title]: {
                                        ...prev[attribute.title],
                                        minValue: value,
                                    },
                                }));
                            }
                        };
                        const handleRangeMaxChange = (e) => {
                            const value = Number(e.target.value.replace(/\s+/g, ""));
                            if (!isNaN(value)) {
                                setRangeValues((prev) => ({
                                    ...prev,
                                    [attribute.title]: {
                                        ...prev[attribute.title],
                                        maxValue: value,
                                    },
                                }));
                            }
                        };

                        const handleRangeBlur = () => {
                            const minValue = rangeValues[attribute.title]?.minValue ?? minAttributeValue;
                            const maxValue = rangeValues[attribute.title]?.maxValue ?? maxAttributeValue;
                            handleRangeChange(attribute.title, minValue, maxValue);
                        };

                        return (
                            <div key={`${attribute.title}-${index}`} className="filter__section">
                                <label htmlFor={attribute.code} className="filter__title">
                                    {attribute.title}
                                </label>
                                <div className="filter__bars">
                                    <div className="filter-bar">
                                        <label className="filter-bar__label" htmlFor={`${attribute.code}_min`}>
                                            От
                                        </label>
                                        <input
                                            className="filter-bar__input"
                                            type="text"
                                            id={`${attribute.code}_min`}
                                            name={`${attribute.code}_min`}
                                            value={formatPrice(rangeValues[attribute.title]?.minValue ?? minAttributeValue)}
                                            onBlur={handleRangeBlur}
                                            onKeyDown={handleKeyDown}
                                            onInput={(e) => {
                                                e.target.value = e.target.value.replace(/[^0-9\s]/g, "");
                                                handleRangeMinChange(e);
                                            }}
                                        />
                                    </div>
                                    <span className="filter-bar__divider">-</span>
                                    <div className="filter-bar">
                                        <label className="filter-bar__label" htmlFor={`${attribute.code}_max`}>
                                            До
                                        </label>
                                        <input
                                            className="filter-bar__input"
                                            type="text"
                                            id={`${attribute.code}_max`}
                                            name={`${attribute.code}_max`}
                                            value={formatPrice(rangeValues[attribute.title]?.maxValue ?? maxAttributeValue)}
                                            onBlur={handleRangeBlur}
                                            onKeyDown={handleKeyDown}
                                            onInput={(e) => {
                                                e.target.value = e.target.value.replace(/[^0-9\s]/g, "");
                                                handleRangeMaxChange(e);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
};

export default Filter;