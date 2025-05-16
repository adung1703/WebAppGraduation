// src/components/History/NotificationModal.js
import React from "react";
import { Modal, Button } from "react-bootstrap";

const NotificationModal = ({ show, onClose, title, message, variant }) => {
    // variant có thể là "success" hoặc "danger"
    const headerBgClass = variant === "success" ? "bg-success" : "bg-danger";
    const headerTextClass = "text-white";

    return (
        <Modal show={show} onHide={onClose} centered className="backdrop-blur" >
            <Modal.Header className={`${headerBgClass} ${headerTextClass}`}>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{message}</Modal.Body>
            <Modal.Footer>
                <Button variant={variant} onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default NotificationModal;