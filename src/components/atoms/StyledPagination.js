import React from 'react';
import StyledButton from './StyledButton'; // Assuming StyledButton is in the same atoms directory
import styles from './StyledPagination.module.scss';

const StyledPagination = ({
  totalPages,
  currentPage,
  onPageChange,
  maxVisiblePages = 7,
  className = '',
  size, // sm, lg
}) => {
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    let startPage, endPage;

    if (totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = totalPages;
    } else {
      let maxPagesShown = maxVisiblePages - 2; // for first/last page items
      if (maxVisiblePages < 5) maxPagesShown = maxVisiblePages; // Adjust for smaller maxVisiblePages

      const halfPagesToShow = Math.floor((maxPagesShown - 1) / 2); // -1 for current page
      const quarterPagesToShow = Math.floor((maxPagesShown -3) /2); // -3 for current page & 2 ellipses


      if (currentPage <= halfPagesToShow + 1 && maxVisiblePages > 4) { // Show 1 ... x y z
        startPage = 1;
        endPage = maxPagesShown -1;
      } else if (currentPage >= totalPages - halfPagesToShow && maxVisiblePages > 4) { // Show x y z ... total
        startPage = totalPages - maxPagesShown + 2;
        endPage = totalPages;
      } else if (maxVisiblePages <=4 && totalPages > maxVisiblePages) { // for very small maxVisiblePages
        if(currentPage === 1 && totalPages > 1 && maxVisiblePages === 3) {
            startPage = currentPage;
            endPage = currentPage + 1;
        } else if (currentPage === totalPages && totalPages > 1 && maxVisiblePages === 3) {
            startPage = currentPage - 1;
            endPage = currentPage;
        } else if (currentPage > 1 && currentPage < totalPages && maxVisiblePages === 3) {
            startPage = currentPage -1;
            endPage = currentPage +1;
        }
         else if (maxVisiblePages === 2 && totalPages > 2) {
            startPage = currentPage;
            endPage = currentPage;
        }
        else if (maxVisiblePages === 1 && totalPages > 1){
            startPage = currentPage;
            endPage = currentPage;
        }
         else { // Fallback for very small or edge cases
            startPage = currentPage;
            endPage = currentPage;
        }
      }
      
      else { // Show ... x Current y ...
        startPage = currentPage - quarterPagesToShow;
        endPage = currentPage + quarterPagesToShow;
      }
    }
    
    // Ensure startPage and endPage are within bounds, especially for small totalPages
    if (totalPages <= maxVisiblePages) {
        startPage = 1;
        endPage = totalPages;
    } else { // Re-adjust if calculated start/end are out of sensible range with ellipses
        if (startPage < 1) startPage = 1;
        if (endPage > totalPages) endPage = totalPages;

        if (endPage - startPage + 1 < (maxVisiblePages - 2) && maxVisiblePages > 4) {
            if (currentPage <= (maxVisiblePages -2)/2 +1 ) { // closer to start
                endPage = Math.min(totalPages, startPage + maxVisiblePages - 3);
            } else { // closer to end
                startPage = Math.max(1, endPage - maxVisiblePages + 3);
            }
        }
    }


    // Add first page button if not in main sequence
    if (startPage > 1 && maxVisiblePages > 4) {
      pageNumbers.push(
        <li key={1} className={styles.paginationItem}>
          <StyledButton
            variant={1 === currentPage ? 'primary' : 'outline-secondary'}
            onClick={() => handlePageChange(1)}
            size={size}
            aria-label="Go to page 1"
          >
            {1}
          </StyledButton>
        </li>
      );
      if (startPage > 2) { // Ellipsis after first page
        pageNumbers.push(
          <li key="start-ellipsis" className={`${styles.paginationItem} ${styles.ellipsis}`}>
            <StyledButton variant="link" size={size} disabled aria-label="More pages">
              ...
            </StyledButton>
          </li>
        );
      }
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      if (i < 1 || i > totalPages) continue; // Safety check
      pageNumbers.push(
        <li key={i} className={styles.paginationItem}>
          <StyledButton
            variant={i === currentPage ? 'primary' : 'outline-secondary'}
            onClick={() => handlePageChange(i)}
            size={size}
            aria-current={i === currentPage ? 'page' : undefined}
            aria-label={`Go to page ${i}`}
          >
            {i}
          </StyledButton>
        </li>
      );
    }

    // Add last page button if not in main sequence
    if (endPage < totalPages && maxVisiblePages > 4) {
      if (endPage < totalPages - 1) { // Ellipsis before last page
        pageNumbers.push(
          <li key="end-ellipsis" className={`${styles.paginationItem} ${styles.ellipsis}`}>
            <StyledButton variant="link" size={size} disabled aria-label="More pages">
              ...
            </StyledButton>
          </li>
        );
      }
      pageNumbers.push(
        <li key={totalPages} className={styles.paginationItem}>
          <StyledButton
            variant={totalPages === currentPage ? 'primary' : 'outline-secondary'}
            onClick={() => handlePageChange(totalPages)}
            size={size}
            aria-label={`Go to page ${totalPages}`}
          >
            {totalPages}
          </StyledButton>
        </li>
      );
    }
    return pageNumbers;
  };

  const paginationContainerClasses = [
    styles.styledPagination,
    size ? styles[`pagination${size.charAt(0).toUpperCase() + size.slice(1)}`] : '', // e.g. styles.paginationSm
    className,
  ].filter(Boolean).join(' ');

  if (totalPages <=0) return null;

  return (
    <nav aria-label="pagination" className={paginationContainerClasses}>
      <ul className={styles.paginationList}>
        <li className={styles.paginationItem}>
          <StyledButton
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            size={size}
            variant="outline-secondary"
            aria-label="Go to first page"
          >
            <span className="material-symbols-outlined">first_page</span>
          </StyledButton>
        </li>
        <li className={styles.paginationItem}>
          <StyledButton
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            size={size}
            variant="outline-secondary"
            aria-label="Go to previous page"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </StyledButton>
        </li>
        {renderPageNumbers()}
        <li className={styles.paginationItem}>
          <StyledButton
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            size={size}
            variant="outline-secondary"
            aria-label="Go to next page"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </StyledButton>
        </li>
        <li className={styles.paginationItem}>
          <StyledButton
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            size={size}
            variant="outline-secondary"
            aria-label="Go to last page"
          >
            <span className="material-symbols-outlined">last_page</span>
          </StyledButton>
        </li>
      </ul>
    </nav>
  );
};

export default StyledPagination;
