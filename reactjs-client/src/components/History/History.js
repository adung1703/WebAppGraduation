import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Pagination, Modal, Form, Button, Alert } from "react-bootstrap";
import Particle from "../Particle";
import axios from "axios";

function History() {
  const [historyData, setHistoryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loginError, setLoginError] = useState(null);

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

      const response = await axios.get(`http://localhost:3333/history-data?page=${page}`, {
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
        // Token expired or invalid
        localStorage.removeItem("authToken");
        setShowLoginModal(true);
      } else {
        setError("Failed to fetch history data. Please try again later.");
      }
      setLoading(false);
    }
  };

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(null);

    try {
      const response = await axios.post("http://localhost:3333/auth/login", loginForm);
      
      if (response.data && response.data.access_token) {
        console.log("Response data:", response.data);
        localStorage.setItem("authToken", response.data.access_token);
        setShowLoginModal(false);
        fetchHistoryData(currentPage);
      }
    } catch (err) {
      console.error("Login error:", err);
      setLoginError("Invalid credentials. Please try again.");
    }
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchHistoryData(page);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
  };

  // Initial data fetch
  useEffect(() => {
    fetchHistoryData();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    
    // Previous button
    items.push(
      <Pagination.Prev 
        key="prev" 
        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />
    );
    
    // Page numbers
    for (let page = 1; page <= totalPages; page++) {
      items.push(
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </Pagination.Item>
      );
    }
    
    // Next button
    items.push(
      <Pagination.Next 
        key="next" 
        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
    );
    
    return items;
  };

  return (
    <Container fluid className="history-section">
      <Particle />
      <Container className="body-container">
        <h1 className="project-heading">
          Historical <strong className="purple">Data </strong>
        </h1>
        
        {error && (
          <Alert variant="danger">{error}</Alert>
        )}
        
        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="table-responsive mt-4">
              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <th>Date/Time</th>
                    <th>Temp (°C)</th>
                    <th>Humidity (%)</th>
                    <th>Lux</th>
                    <th>Broadband</th>
                    <th>Infrared</th>
                    <th>UVA</th>
                    <th>UVB</th>
                    <th>UVI</th>
                  </tr>
                </thead>
                <tbody>
                  {historyData.map((record) => (
                    <tr key={record._id}>
                      <td>{formatDate(record.createdAt)}</td>
                      <td>{record.temperature}</td>
                      <td>{record.humidity}</td>
                      <td>{record.lux}</td>
                      <td>{record.broadband}</td>
                      <td>{record.infrared}</td>
                      <td>{record.UVA}</td>
                      <td>{record.UVB}</td>
                      <td>{record.UVI}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            
            <Row className="mt-4">
              <Col className="d-flex justify-content-center">
                <Pagination>{renderPaginationItems()}</Pagination>
              </Col>
            </Row>
          </>
        )}
      </Container>

      {/* Login Modal */}
      <Modal show={showLoginModal} onHide={() => {}} backdrop="static" keyboard={false}>
        <Modal.Header>
          <Modal.Title>Login Required</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loginError && <Alert variant="danger">{loginError}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={loginForm.username}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={loginForm.password}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <div className="d-grid gap-2">
              <Button variant="primary" type="submit">
                Login
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default History;