import React from 'react';
import { Pagination } from 'react-bootstrap';
import styles from './StyledPagination.module.scss';

const StyledPagination = ({
  totalPages,
  currentPage,
  onPageChange,
  maxVisiblePages = 7,
  className = '',
  size, 
}) => {
  // Logic to determine pagination items (first, prev, numbers, ellipsis, next, last)
  const renderPageNumbers = () => {
    const pageNumbers = [];
    let startPage, endPage;

    if (totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const maxPagesBeforeCurrentPage = Math.floor((maxVisiblePages - 3) / 2);
      const maxPagesAfterCurrentPage = Math.ceil((maxVisiblePages - 3) / 2);

      if (currentPage <= maxPagesBeforeCurrentPage + 1) {
        startPage = 1;
        endPage = maxVisiblePages - 2;
      } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
        startPage = totalPages - maxVisiblePages + 3;
        endPage = totalPages;
      } else {
        startPage = currentPage - maxPagesBeforeCurrentPage;
        endPage = currentPage + maxPagesAfterCurrentPage;
      }
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pageNumbers.push(
        <Pagination.Item key={1} active={1 === currentPage} onClick={() => onPageChange(1)}>
          {1}
        </Pagination.Item>
      );
      if (startPage > 2) {
        pageNumbers.push(<Pagination.Ellipsis key="start-ellipsis" onClick={() => onPageChange(Math.max(1, startPage - maxVisiblePages + 2))} />);
      }
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Pagination.Item key={i} active={i === currentPage} onClick={() => onPageChange(i)}>
          {i}
        </Pagination.Item>
      );
    }

    // Add last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(<Pagination.Ellipsis key="end-ellipsis" onClick={() => onPageChange(Math.min(totalPages, endPage + maxVisiblePages - 2))} />);
      }
      pageNumbers.push(
        <Pagination.Item key={totalPages} active={totalPages === currentPage} onClick={() => onPageChange(totalPages)}>
          {totalPages}
        </Pagination.Item>
      );
    }
    return pageNumbers;
  };
  
  let bsSize;
  if (size === 'sm') bsSize = 'sm';
  if (size === 'lg') bsSize = 'lg';

  const paginationClasses = [
    styles.styledPagination,
    size ? styles[`pagination-${size}`] : '', 
    className
  ].filter(Boolean).join(' ');

  return (
    <Pagination size={bsSize} className={paginationClasses}>
      <Pagination.First onClick={() => onPageChange(1)} disabled={currentPage === 1} />
      <Pagination.Prev onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} />
      {renderPageNumbers()}
      <Pagination.Next onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} />
      <Pagination.Last onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} />
    </Pagination>
  );
};

export default StyledPagination;
