import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockApplications } from '../../data/mockApplications';
// import { Pagination } from 'react-bootstrap'; // Removed
import {
  StyledContainer,
  StyledTable,
  StyledCard,
  StyledButton,
  StyledBadge,
  // FormField, // No longer directly used
  StyledFormControl,
  StyledFormSelect,
  StyledPagination, // Added
  ListControlsToolbar, // Added
} from '../../components';
import styles from './ApplicationListPage.module.scss';

const ApplicationListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  // const [programFilter, setProgramFilter] = useState(''); // Optional filter

  const [statusOptions, setStatusOptions] = useState([]);
  // const [programOptions, setProgramOptions] = useState([]); // Optional

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const uniqueStatuses = ['All', ...new Set(mockApplications.map(app => app.status).filter(Boolean))];
    setStatusOptions(uniqueStatuses.map(s => ({ value: s === 'All' ? '' : s, label: s })));

    // Optional: Populate program options if a dedicated filter is desired
    // const uniquePrograms = ['All', ...new Set(mockApplications.map(app => app.programName).filter(Boolean))];
    // setProgramOptions(uniquePrograms.map(p => ({ value: p === 'All' ? '' : p, label: p })));
  }, []);

  const filteredApplications = mockApplications.filter(app => {
    const searchTermLower = searchTerm.toLowerCase();
    const nameMatch = app.applicantName.toLowerCase().includes(searchTermLower);
    const programMatch = app.programName.toLowerCase().includes(searchTermLower);
    const idMatch = app.id.toLowerCase().includes(searchTermLower);
    
    const statusMatch = statusFilter === '' || statusFilter === 'All' || app.status === statusFilter;
    // const programFilterMatch = programFilter === '' || programFilter === 'All' || app.programName === programFilter;

    return (nameMatch || programMatch || idMatch) && statusMatch; // && programFilterMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTableData = filteredApplications.slice(indexOfFirstItem, indexOfLastItem);

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
    switch (status) {
      case 'Received': return <StyledBadge variant="secondary">{status}</StyledBadge>;
      case 'Under Review': return <StyledBadge variant="info">{status}</StyledBadge>;
      case 'Interview Scheduled': return <StyledBadge variant="warning">{status}</StyledBadge>;
      case 'Accepted': return <StyledBadge variant="success">{status}</StyledBadge>;
      case 'Rejected': return <StyledBadge variant="danger">{status}</StyledBadge>;
      default: return <StyledBadge variant="light">{status}</StyledBadge>;
    }
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
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Application Submissions</h1>
      </div>
      <StyledCard className={styles.contentCard}>
        <StyledCard.Header>
          {/* <StyledCard.Title className={styles.cardTitle}>Application Submissions</StyledCard.Title> */}
        </StyledCard.Header>

        <ListControlsToolbar
          searchTerm={searchTerm}
          onSearchChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          searchPlaceholder="Applicant, Program, ID..."
          searchLabel="Search Applications"
          filters={[
            {
              controlId: "statusFilter",
              label: "Status",
              value: statusFilter,
              onChange: (e) => { setStatusFilter(e.target.value); setCurrentPage(1); },
              options: statusOptions,
              type: 'select',
            }
          ]}
          // No addAction needed for this page as per current UI
        />
        
        <StyledCard.Body>
          {filteredApplications.length === 0 ? (
            <p className={styles.noDataText}>No applications found matching your criteria.</p>
          ) : (
            <StyledTable striped bordered hover responsive className={styles.dataTable}>
              <thead>
                <tr>
                  <th>App ID</th>
                  <th>Applicant Name</th>
                  <th>Program</th>
                  <th>Submitted Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentTableData.map((app) => (
                  <tr key={app.id}>
                    <td>{app.id}</td>
                    <td>{app.applicantName}</td>
                    <td>{app.programName}</td>
                    <td>{app.submittedDate}</td>
                    <td>{getStatusBadge(app.status)}</td>
                    <td>
                      <StyledButton
                        variant="outline-primary"
                        size="sm"
                        onClick={() => navigate(`/admissions/applications/view/${app.id}`)}
                        title="View/Manage Application"
                      >
                        <span className={`material-symbols-outlined ${styles.actionButtonIcon}`}>visibility</span> View/Manage
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
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredApplications.length)} of {filteredApplications.length} results
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

export default ApplicationListPage;
