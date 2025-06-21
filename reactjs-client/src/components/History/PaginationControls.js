// src/components/History/PaginationControls.js
import React, { useState, useEffect } from "react";
import { Pagination } from "react-bootstrap";

// Custom hook để detect responsive breakpoints
const useResponsive = () => {
  const [breakpoint, setBreakpoint] = useState('lg');

  useEffect(() => {
    const mediaQueries = {
      xs: '(max-width: 575.98px)',
      sm: '(min-width: 576px) and (max-width: 767.98px)',
      md: '(min-width: 768px) and (max-width: 991.98px)',
      lg: '(min-width: 992px) and (max-width: 1199.98px)',
      xl: '(min-width: 1200px)'
    };

    const getBreakpoint = () => {
      for (const [key, query] of Object.entries(mediaQueries)) {
        if (window.matchMedia(query).matches) {
          return key;
        }
      }
      return 'lg'; // fallback
    };

    const updateBreakpoint = () => {
      setBreakpoint(getBreakpoint());
    };

    // Set initial breakpoint
    updateBreakpoint();

    // Add listeners for all breakpoints
    const listeners = Object.values(mediaQueries).map(query => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", updateBreakpoint);
      return mql;
    });

    // Cleanup
    return () => {
      listeners.forEach(mql => mql.removeEventListener("change", updateBreakpoint));
    };
  }, []);

  return breakpoint;
};

// Config cho số trang hiển thị theo breakpoint
const PAGINATION_CONFIG = {
  xs: { maxVisiblePages: 3, showEllipsis: false },
  sm: { maxVisiblePages: 5, showEllipsis: true },
  md: { maxVisiblePages: 6, showEllipsis: true },
  lg: { maxVisiblePages: 7, showEllipsis: true },
  xl: { maxVisiblePages: 9, showEllipsis: true }
};

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
  const breakpoint = useResponsive();
  const config = PAGINATION_CONFIG[breakpoint] || PAGINATION_CONFIG.lg;
  const { maxVisiblePages, showEllipsis } = config;

  const items = [];

  // Previous button
  items.push(
    <Pagination.Prev 
      key="prev" 
      onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
    />
  );

  // Logic để hiển thị tối đa maxVisiblePages mục
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

  // Thêm dấu "..." ở đầu nếu cần và được enable
  if (startPage > 1 && showEllipsis) {
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

  // Thêm dấu "..." ở cuối nếu cần và được enable
  if (endPage < totalPages && showEllipsis) {
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