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

  // Logic để hiển thị tối đa 7 mục
  const maxVisiblePages = 7;
  let startPage = 1;
  let endPage = totalPages;

  if (totalPages > maxVisiblePages) {
    // Tính toán range hiển thị dựa trên trang hiện tại
    const leftSide = Math.floor((maxVisiblePages - 1) / 2);
    const rightSide = maxVisiblePages - 1 - leftSide;

    startPage = Math.max(1, currentPage - leftSide);
    endPage = Math.min(totalPages, currentPage + rightSide);

    // Điều chỉnh nếu range bị lệch
    if (startPage === 1) {
      endPage = Math.min(totalPages, maxVisiblePages);
    } else if (endPage === totalPages) {
      startPage = Math.max(1, totalPages - maxVisiblePages + 1);
    }
  }

  // Thêm dấu "..." ở đầu nếu cần
  if (startPage > 1) {
    items.push(
      <Pagination.Item
        key="first"
        onClick={() => onPageChange(1)}
      >
        1
      </Pagination.Item>
    );
    
    if (startPage > 2) {
      items.push(
        <Pagination.Ellipsis key="ellipsis-start" />
      );
    }
  }

  // Page numbers trong range
  for (let page = startPage; page <= endPage; page++) {
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

  // Thêm dấu "..." ở cuối nếu cần
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      items.push(
        <Pagination.Ellipsis key="ellipsis-end" />
      );
    }
    
    items.push(
      <Pagination.Item
        key="last"
        onClick={() => onPageChange(totalPages)}
      >
        {totalPages}
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