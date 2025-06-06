// src/components/History/History.js
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Alert, Button } from "react-bootstrap";
import Particle from "../Particle";
import axios from "axios";
import DataTable from "./DataTable";
import PaginationControls from "./PaginationControls";
import LoginModal from "./LoginModal";
import NotificationModal from "./NotificationModal";

function History() {
  const [historyData, setHistoryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState({
    title: "",
    message: "",
    variant: "success"
  });

  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  // Fetch historical data with authentication
  const fetchHistoryData = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setShowLoginModal(true);
        setLoading(false);
        return;
      }
      const response = await axios.get(`${backendUrl}history-data?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setHistoryData(response.data.data);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.page);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching history data:", err);

      if (err.response && err.response.status === 401) {
        localStorage.removeItem("authToken");
        setShowLoginModal(true);
        setError("Authentication expired. Please login again.");

        // Hiển thị thông báo token hết hạn
        setNotification({
          title: "Session Expired",
          message: "Your login session has expired. Please login again to continue.",
          variant: "danger"
        });
        setShowNotification(true);

      } else {
        setError("Failed to fetch history data. Please try again later.");
      }
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchHistoryData(page);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowLoginModal(false);
    // Redirect or show message if needed when user cancels login
    setError("You need to be logged in to view historical data.");
  };

  // Handle notification close
  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  // Handle successful login
  const handleLoginSuccess = (token) => {
    localStorage.setItem("authToken", token);
    setShowLoginModal(false);

    // Tải lại dữ liệu sau khi đăng nhập
    fetchHistoryData(currentPage);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setShowLoginModal(true);
    setHistoryData([]);
    setCurrentPage(1);
    setError("You have been logged out. Please login again.");
  }

  // Initial data fetch
  useEffect(() => {
    fetchHistoryData();
  }, []);

  return (
    <Container fluid className="history-section">
      <Particle />
      <Container className="body-container">
        <h1 className="project-heading">
          Historical <strong className="purple">Data </strong>
        </h1>

        {error && (
          <div className="text-center my-5">
            <Alert variant="danger">{error}</Alert>
            <Button
              variant="primary"
              onClick={() => setShowLoginModal(true)}
              className="mt-3"
              style={{ position: "relative", zIndex: 1001 }}
            >
              Login
            </Button>
          </div>
        )}

        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            {historyData.length > 0 ? (
              <>
                <div className="table-responsive mt-4">
                  <DataTable data={historyData} />
                </div>

                <Row className="mt-4">
                  <Col className="d-flex justify-content-center">
                    <PaginationControls
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </Col>
                </Row>
                <Button
                  variant="secondary"
                  onClick={handleLogout}
                  className="mt-3"
                  style={{ position: "relative", zIndex: 1001 }}
                >
                  Log out
                </Button>
              </>
            ) : !error && !loading && (
              <div className="text-center my-5">
                {/* <Alert variant="info">No data available. Please login to view historical data.</Alert> */}
                <Button
                  variant="primary"
                  onClick={() => setShowLoginModal(true)}
                  className="mt-3"
                >
                  Login
                </Button>
              </div>
            )}
          </>
        )}

        <LoginModal
          show={showLoginModal}
          onLoginSuccess={handleLoginSuccess}
          onClose={handleCloseModal}
        />

        <NotificationModal
          show={showNotification}
          onClose={handleCloseNotification}
          title={notification.title}
          message={notification.message}
          variant={notification.variant}
        />

      </Container>
    </Container>
  );
}

export default History;