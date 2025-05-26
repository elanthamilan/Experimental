import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockSemesters } from '../../data/mockSemesters';
// import { Pagination } from 'react-bootstrap'; // Removed
import {
  StyledContainer,
  StyledTable,
  StyledCard,
  StyledButton,
  FormField,
  StyledFormControl,
  StyledFormSelect,
  StyledPagination, // Added
  // StyledBadge, // If status needs specific badge styling beyond text
} from '../../components';
import styles from './SemesterListPage.module.scss';

const SemesterListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [statusOptions, setStatusOptions] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const uniqueStatuses = ['All', ...new Set(mockSemesters.map(s => s.status).filter(Boolean))];
    setStatusOptions(uniqueStatuses);
  }, []);

  const filteredSemesters = mockSemesters.filter(semester => {
    const nameMatch = semester.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      semester.id.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === '' || statusFilter === 'All' || semester.status === statusFilter;
    return nameMatch && statusMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredSemesters.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTableData = filteredSemesters.slice(indexOfFirstItem, indexOfLastItem);

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
  
  // const paginationItems = []; // Removed
  // if (totalPages > 0) { // Removed
  //   if (totalPages <= 7) { // Removed
  //     for (let number = 1; number <= totalPages; number++) { // Removed
  //       paginationItems.push(<Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>{number}</Pagination.Item>); // Removed
  //     } // Removed
  //   } else { // Removed
  //     paginationItems.push(<Pagination.Item key={1} active={1 === currentPage} onClick={() => handlePageChange(1)}>1</Pagination.Item>); // Removed
  //     if (currentPage > 3) paginationItems.push(<Pagination.Ellipsis key="ellipsis-start" disabled />); // Removed
  //     let startPage = Math.max(2, currentPage - 1); // Removed
  //     let endPage = Math.min(totalPages - 1, currentPage + 1); // Removed
  //     if (currentPage <= 2) endPage = Math.min(totalPages - 1, 3); // Removed
  //     if (currentPage >= totalPages - 1) startPage = Math.max(2, totalPages - 2); // Removed
  //     for (let number = startPage; number <= endPage; number++) { // Removed
  //       paginationItems.push(<Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>{number}</Pagination.Item>); // Removed
  //     } // Removed
  //     if (currentPage < totalPages - 2) paginationItems.push(<Pagination.Ellipsis key="ellipsis-end" disabled />); // Removed
  //     paginationItems.push(<Pagination.Item key={totalPages} active={totalPages === currentPage} onClick={() => handlePageChange(totalPages)}>{totalPages}</Pagination.Item>); // Removed
  //   } // Removed
  // } // Removed

  return (
    <StyledContainer className={styles.pageContainer}>
      <StyledCard className={styles.contentCard}>
        <StyledCard.Header>
          <StyledCard.Title className={styles.cardTitle}>Semester Management</StyledCard.Title>
        </StyledCard.Header>

        <div className={styles.tableControls}>
          <div className={styles.filterSection}>
            <div className={styles.searchFilterItem}>
              <FormField
                controlId="searchTerm"
                label="Search Semester"
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
            <StyledButton variant="primary" onClick={() => navigate('/admin/semesters/new')} className={styles.addButton}>
              <span className={`material-symbols-outlined ${styles.buttonIcon}`}>add</span>
              Add New Semester
            </StyledButton>
          </div>
        </div>
        
        <StyledCard.Body>
          {/* Removed headerActions div as button is now in tableControls */}
          {filteredSemesters.length === 0 ? (
            <p className={styles.noDataText}>No semesters found matching your criteria.</p>
          ) : (
            <StyledTable striped bordered hover responsive className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Semester ID</th>
                  <th>Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentTableData.map((semester) => (
                  <tr key={semester.id}>
                    <td>{semester.id}</td>
                    <td>{semester.name}</td>
                    <td>{semester.startDate}</td>
                    <td>{semester.endDate}</td>
                    <td>{semester.status}</td> 
                    {/* If StyledBadge is needed for status, import and use it here */}
                    <td>
                      <StyledButton
                        variant="outline-primary"
                        size="sm"
                        onClick={() => navigate(`/admin/semesters/edit/${semester.id}`)}
                        title="Edit Semester"
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
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredSemesters.length)} of {filteredSemesters.length} results
          </span>
          <StyledPagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            maxVisiblePages={7}
            className={styles.paginationControls}
            size="sm"
          />
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

export default SemesterListPage;
