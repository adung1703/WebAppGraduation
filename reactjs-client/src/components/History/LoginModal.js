// src/components/History/LoginModal.js
import React, { useState } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import NotificationModal from "./NotificationModal";

const LoginModal = ({ show, onLoginSuccess, onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(null);

  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState({
    title: "",
    message: "",
    variant: "success"
  });

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  console.log("Backend URL:", backendUrl);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null);

    try {
      const response = await axios.post(`${backendUrl}auth/login`, { username, password });
      if (response.data && response.data.access_token) {
        // Ẩn modal đăng nhập ngay lập tức
        onLoginSuccess(response.data.access_token);
        
        // Hiển thị thông báo thành công
        setNotification({
          title: "Login Successful",
          message: "You have successfully logged in. You can now view historical data.",
          variant: "success"
        });
        setShowNotification(true);
      }
    } catch (err) {
      console.error("Login error:", err);
      // Hiển thị lỗi trong form
      setLoginError("Invalid credentials. Please try again.");
      
      // Đặt thông báo thất bại
      setNotification({
        title: "Login Failed",
        message: "Unable to authenticate. Please check your username and password.",
        variant: "danger"
      });
      setShowNotification(true);
    }
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  return (
    <>
      <Modal show={show} backdrop="static" keyboard={false} centered>
        <Modal.Header>
          <Modal.Title>Login Required</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loginError && <Alert variant="danger">{loginError}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={onClose}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Login
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal thông báo */}
      <NotificationModal
        show={showNotification}
        onClose={handleCloseNotification}
        title={notification.title}
        message={notification.message}
        variant={notification.variant}
      />
    </>
  );
};

export default LoginModal;