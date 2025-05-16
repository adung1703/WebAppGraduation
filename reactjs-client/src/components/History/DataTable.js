// src/components/History/DataTable.js
import React from "react";
import { Table } from "react-bootstrap";

const formatDate = (dateString) => {
  const options = { 
    year: "numeric", 
    month: "short", 
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  };
  return new Date(dateString).toLocaleString(undefined, options);
};

const DataTable = ({ data }) => {
  return (
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
        {data.map((record) => (
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
  );
};

export default DataTable;