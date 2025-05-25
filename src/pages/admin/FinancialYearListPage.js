import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockFinancialYears } from '../../data/mockFinancialYears';
import { Pagination } from 'react-bootstrap';
import {
  StyledContainer,
  StyledTable,
  StyledCard,
  StyledButton,
  StyledBadge, // Added StyledBadge
  FormField,
  StyledFormControl,
  StyledFormSelect,
} from '../../components';
import styles from './FinancialYearListPage.module.scss';

const FinancialYearListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [statusOptions, setStatusOptions] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const uniqueStatuses = ['All', ...new Set(mockFinancialYears.map(fy => fy.status).filter(Boolean))];
    setStatusOptions(uniqueStatuses);
  }, []);

  const filteredFinancialYears = mockFinancialYears.filter(fy => {
    const nameMatch = fy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      fy.id.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === '' || statusFilter === 'All' || fy.status === statusFilter;
    return nameMatch && statusMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredFinancialYears.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTableData = filteredFinancialYears.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handlePageInputSubmit = (e) => {
    e.preventDefault();
    const pageNumber = parseInt(e.target.elements.pageInput.value, 10);
    handlePageChange(pageNumber);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const getStatusBadge = (status) => {
    // Assuming status values like 'Open', 'Upcoming', 'Closed'
    switch (status) {
      case 'Open': return <StyledBadge variant="success">{status}</StyledBadge>;
      case 'Upcoming': return <StyledBadge variant="warning">{status}</StyledBadge>;
      case 'Closed': return <StyledBadge variant="danger">{status}</StyledBadge>;
      default: return <StyledBadge variant="secondary">{status}</StyledBadge>;
    }
  };
  
  const paginationItems = [];
  if (totalPages > 0) {
    if (totalPages <= 7) {
      for (let number = 1; number <= totalPages; number++) {
        paginationItems.push(<Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>{number}</Pagination.Item>);
      }
    } else {
      paginationItems.push(<Pagination.Item key={1} active={1 === currentPage} onClick={() => handlePageChange(1)}>1</Pagination.Item>);
      if (currentPage > 3) paginationItems.push(<Pagination.Ellipsis key="ellipsis-start" disabled />);
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      if (currentPage <= 2) endPage = Math.min(totalPages - 1, 3);
      if (currentPage >= totalPages - 1) startPage = Math.max(2, totalPages - 2);
      for (let number = startPage; number <= endPage; number++) {
        paginationItems.push(<Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>{number}</Pagination.Item>);
      }
      if (currentPage < totalPages - 2) paginationItems.push(<Pagination.Ellipsis key="ellipsis-end" disabled />);
      paginationItems.push(<Pagination.Item key={totalPages} active={totalPages === currentPage} onClick={() => handlePageChange(totalPages)}>{totalPages}</Pagination.Item>);
    }
  }

  return (
    <StyledContainer className={styles.pageContainer}>
      <StyledCard className={styles.contentCard}>
        <StyledCard.Header>
          <StyledCard.Title className={styles.cardTitle}>Financial Year Management</StyledCard.Title>
        </StyledCard.Header>

        <div className={styles.tableControls}>
          <div className={styles.filterSection}>
            <div className={styles.searchFilterItem}>
              <FormField
                controlId="searchTerm"
                label="Search Financial Year"
                type="text"
                placeholder="ID or Name..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <div className={styles.dropdownFilterItem}>
              <FormField
                controlId="statusFilter"
                label="Status"
                as="select"
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                options={statusOptions.map(status => ({ value: status === 'All' ? '' : status, label: status }))}
              />
            </div>
          </div>
          <div className={styles.actionsSection}>
            <StyledButton variant="primary" onClick={() => navigate('/admin/financialyears/new')} className={styles.addButton}>
              <span className={`material-symbols-outlined ${styles.buttonIcon}`}>add</span>
              Add New Financial Year
            </StyledButton>
          </div>
        </div>
        
        <StyledCard.Body>
          {/* Removed headerActions div */}
          {filteredFinancialYears.length === 0 ? (
            <p className={styles.noDataText}>No financial years found matching your criteria.</p>
          ) : (
            <StyledTable striped bordered hover responsive className={styles.dataTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentTableData.map((fy) => (
                  <tr key={fy.id}>
                    <td>{fy.id}</td>
                    <td>{fy.name}</td>
                    <td>{fy.startDate}</td>
                    <td>{fy.endDate}</td>
                    <td>{getStatusBadge(fy.status)}</td>
                    <td>
                      <StyledButton
                        variant="outline-primary"
                        size="sm"
                        onClick={() => navigate(`/admin/financialyears/edit/${fy.id}`)}
                        title="Edit Financial Year"
                      >
                        <span className={`material-symbols-outlined ${styles.actionButtonIcon}`}>edit</span>
                      </StyledButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </StyledTable>
          )}
        </StyledCard.Body>
      </StyledCard>

      {totalPages > 0 && (
        <div className={styles.paginationContainer}>
          <span className={styles.resultsText}>
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredFinancialYears.length)} of {filteredFinancialYears.length} results
          </span>
          <Pagination className={styles.paginationControls}>
            <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
            {paginationItems}
            <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
            <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
          </Pagination>
          <div className={styles.pageInputControls}>
            <span>Page</span>
            <form onSubmit={handlePageInputSubmit} style={{display: 'inline-flex', alignItems: 'center', gap: '0.5rem'}}>
              <StyledFormControl
                type="number"
                name="pageInput"
                defaultValue={currentPage}
                key={currentPage} 
                className={styles.pageInput}
                min="1"
                max={totalPages}
                size="sm"
              />
            </form>
            <span className={styles.totalPagesText}>of {totalPages}</span>
          </div>
          <StyledFormSelect size="sm" className={styles.itemsPerPageSelect} value={itemsPerPage} onChange={handleItemsPerPageChange}>
            <option value="10">10 per page</option>
            <option value="25">25 per page</option>
            <option value="50">50 per page</option>
          </StyledFormSelect>
        </div>
      )}
    </StyledContainer>
  );
};

export default FinancialYearListPage;
