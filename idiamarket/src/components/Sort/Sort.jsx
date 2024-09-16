import { useState, useRef, useEffect } from "react";
import ArrowUp from "../../assets/images/icons/arrow-up.svg";
import ArrowDown from "../../assets/images/icons/arrow-down.svg";
import "./Sort.css";

const Sort = ({ onSortChange }) => {
    const [selectedOption, setSelectedOption] = useState("По популярности");
    const [isOpen, setIsOpen] = useState(false);
    const sortRef = useRef();

    useEffect(() => {
        // Add event listener when the dropdown is open
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        // Clean up the event listener on component unmount
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleClickOutside = (event) => {
        if (sortRef.current && !sortRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    const options = ["По популярности", "По скидке", "По новизне", "По возрастанию цены", "По убыванию цены"];

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
        onSortChange(option); // Trigger the sorting change
    };

    return (
        <div className="sort" ref={sortRef}>
            <div className="sort__wrapper" onClick={toggleDropdown}>
                {selectedOption}
                <img className="sort__icon_arrow" src={isOpen ? ArrowUp : ArrowDown} alt="" />
            </div>
            {isOpen && (
                <ul className="sort__options">
                    {options.map((option) => (
                        <li key={option} onClick={() => handleOptionClick(option)} className={`sort__option ${option === selectedOption ? "sort__option_selected" : ""}`}>
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Sort;
