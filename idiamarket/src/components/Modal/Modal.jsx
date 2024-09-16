import React, { useEffect, useRef } from "react";
import "./Modal.css";
import CloseIcon from "../../assets/images/icons/close.svg";

const Modal = ({ isOpen, onClose, children }) => {
    const modalRef = useRef();

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add("no-scroll");
        } else {
            document.body.classList.remove("no-scroll");
        }

        return () => {
            document.body.classList.remove("no-scroll");
        };
    }, [isOpen]);

    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            onClose();
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className={`modal-overlay ${isOpen ? "modal-overlay_active" : ""}`} onClick={handleClickOutside}>
            <div className={`modal-content ${isOpen ? "modal-content_active" : ""}`} ref={modalRef}>
                <img className="modal-close" src={CloseIcon} alt="" onClick={onClose} />
                {children}
            </div>
        </div>
    );
};

export default Modal;
