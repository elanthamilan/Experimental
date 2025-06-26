import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockApplications } from '../../data/mockApplications';
// import { Pagination } from 'react-bootstrap'; // Already removed
import {
  StyledContainer,
  // StyledTable, // Removed
  StyledCard,
  StyledButton, // Kept for action buttons in cell renderer
  StyledBadge,  // Kept for getStatusBadge function
  // StyledFormControl, // Removed
  // StyledFormSelect,  // Removed
  // StyledPagination, // Removed
  ListControlsToolbar,
  ResultsTable, // Added
} from '../../components';
import styles from './ApplicationListPage.module.scss';

const ApplicationListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  // const [programFilter, setProgramFilter] = useState('');

  const [statusOptions, setStatusOptions] = useState([]);
  // const [programOptions, setProgramOptions] = useState([]);

  // const [currentPage, setCurrentPage] = useState(1); // Removed
  // const [itemsPerPage, setItemsPerPage] = useState(10); // Removed

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

  // Old pagination logic removed:
  // const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentTableData = filteredApplications.slice(indexOfFirstItem, indexOfLastItem);
  // handlePageChange, handlePageInputSubmit, handleItemsPerPageChange

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
  
  const applicationTableColumns = [
    { header: 'App ID', accessor: 'id' },
    { header: 'Applicant Name', accessor: 'applicantName' },
    { header: 'Program', accessor: 'programName' },
    { header: 'Submitted Date', accessor: 'submittedDate' },
    {
      header: 'Status',
      accessor: 'status',
      cell: (item) => getStatusBadge(item.status),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (item) => (
        <StyledButton
          variant="outline-primary"
          size="sm"
          onClick={() => navigate(`/admissions/applications/view/${item.id}`)}
          title="View/Manage Application"
        >
          <span className={`material-symbols-outlined ${styles.actionButtonIcon}`}>visibility</span> View/Manage
        </StyledButton>
      ),
    },
  ];

  return (
    <StyledContainer className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Application Submissions</h1>
      </div>
      <StyledCard className={styles.contentCard}>
        <StyledCard.Header>
          {/* Optional: <StyledCard.Title className={styles.cardTitle}>Application Submissions</StyledCard.Title> */}
        </StyledCard.Header>

        <ListControlsToolbar
          searchTerm={searchTerm}
          onSearchChange={(e) => { setSearchTerm(e.target.value); /* setCurrentPage(1) removed */ }}
          searchPlaceholder="Applicant, Program, ID..."
          searchLabel="Search Applications"
          filters={[
            {
              controlId: "statusFilter",
              label: "Status",
              value: statusFilter,
              onChange: (e) => { setStatusFilter(e.target.value); /* setCurrentPage(1) removed */ },
              options: statusOptions,
              type: 'select',
            }
          ]}
          // No addAction needed for this page
        />
        
        {/* ResultsTable will replace StyledCard.Body for the table part, or be placed within it */}
        {/* For consistency with prompt (keep StyledCard structure), ResultsTable could go inside a new StyledCard.Body or replace the old one */}
        <StyledCard.Body> 
          {filteredApplications.length === 0 ? (
            <p className={styles.noDataText}>No applications found matching your criteria.</p>
          ) : (
            <ResultsTable
              data={filteredApplications}
              columns={applicationTableColumns}
              showFilterTabs={false}
              showSearch={false}
              // No addActionLabel or addActionTo needed
            />
          )}
        </StyledCard.Body>
      </StyledCard>

      {/* Old Pagination JSX removed */}
    </StyledContainer>
  );
};

export default ApplicationListPage;
