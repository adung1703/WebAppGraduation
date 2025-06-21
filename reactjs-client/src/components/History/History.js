// src/components/History/History.js
import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Alert, Button, Card } from "react-bootstrap";
import Particle from "../Particle";
import axios from "axios";
import DataTable from "./DataTable";
import PaginationControls from "./PaginationControls";
import LoginModal from "./LoginModal";
import NotificationModal from "./NotificationModal";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
  const fetchHistoryData = useCallback(async (page = 1) => {
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
          message: "Your login session has expired. Please login again.",
          variant: "danger"
        });
        setShowNotification(true);

      } else {
        setError("Failed to fetch history data. Please try again later.");
      }
      setLoading(false);
    }
  }, [backendUrl, setLoading, setError, setShowLoginModal, setHistoryData, setTotalPages, setCurrentPage, setNotification, setShowNotification]);

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
  }, [fetchHistoryData]);

  // Hàm chuyển đổi dữ liệu cho từng biểu đồ
  const chartData = [...historyData].reverse().map(record => ({
    time: new Date(record.createdAt).toLocaleString(),
    temperature: record.temperature,
    humidity: record.humidity,
    lux: record.lux,
    broadband: record.broadband,
    infrared: record.infrared,
    UVA: record.UVA,
    UVB: record.UVB,
    UVI: record.UVI,
  }));

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
                {/* Biểu đồ nhiệt độ & độ ẩm */}
                <div className="chart-card">
                  <div style={{ textAlign: 'center', color: '#fff', marginTop: 8, fontWeight: 500 }}>Biểu đồ Nhiệt độ & Độ ẩm</div>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" minTickGap={30} tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="left" label={{ value: 'Temp (°C)', angle: -90, position: 'insideLeft', fontSize: 12 }} />
                      <YAxis yAxisId="right" orientation="right" label={{ value: 'Humidity (%)', angle: 90, position: 'insideRight', fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#ff7300" name="Temperature" dot={false} />
                      <Line yAxisId="right" type="monotone" dataKey="humidity" stroke="#387908" name="Humidity" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Biểu đồ ánh sáng */}
                <div className="chart-card">
                  <div style={{ textAlign: 'center', color: '#fff', marginTop: 8, fontWeight: 500 }}>Biểu đồ Ánh sáng</div>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" minTickGap={30} tick={{ fontSize: 10 }} />
                      <YAxis label={{ value: 'Light', angle: -90, position: 'insideLeft', fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="lux" stroke="#8884d8" name="Lux" dot={false} />
                      <Line type="monotone" dataKey="broadband" stroke="#82ca9d" name="Broadband" dot={false} />
                      <Line type="monotone" dataKey="infrared" stroke="#ffc658" name="Infrared" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Biểu đồ UV */}
                <div className="chart-card">
                  <div style={{ textAlign: 'center', color: '#fff', marginTop: 8, fontWeight: 500 }}>Biểu đồ Tia UV</div>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" minTickGap={30} tick={{ fontSize: 10 }} />
                      <YAxis label={{ value: 'UV', angle: -90, position: 'insideLeft', fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="UVA" stroke="#a832a6" name="UVA" dot={false} />
                      <Line type="monotone" dataKey="UVB" stroke="#32a852" name="UVB" dot={false} />
                      <Line type="monotone" dataKey="UVI" stroke="#326fa8" name="UVI" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
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
                <h2 style={{ color: '#fff', margin: '32px 0 16px 0', fontWeight: 600, textAlign: 'center' }}>Chi tiết dữ liệu</h2>

                <div className="table-responsive mt-4">
                  <DataTable data={historyData} />
                </div>
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