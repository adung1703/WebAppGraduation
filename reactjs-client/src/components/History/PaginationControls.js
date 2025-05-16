// src/components/History/PaginationControls.js
import React from "react";
import { Pagination } from "react-bootstrap";

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
  const items = [];

  // Previous button
  items.push(
    <Pagination.Prev 
      key="prev" 
      onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
    />
  );

  // Page numbers
  for (let page = 1; page <= totalPages; page++) {
    items.push(
      <Pagination.Item
        key={page}
        active={page === currentPage}
        onClick={() => onPageChange(page)}
      >
        {page}
      </Pagination.Item>
    );
  }

  // Next button
  items.push(
    <Pagination.Next 
      key="next" 
      onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
    />
  );

  return <Pagination>{items}</Pagination>;
};

export default PaginationControls;