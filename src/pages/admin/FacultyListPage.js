import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockFaculty } from '../../data/mockFaculty';
// import { Pagination } from 'react-bootstrap'; // Removed
import {
  StyledContainer,
  StyledTable,
  StyledCard,
  StyledButton,
  // FormField, // No longer directly used
  StyledFormControl, // Added StyledFormControl
  StyledFormSelect,  // Added StyledFormSelect
  StyledPagination, // Added
  ListControlsToolbar, // Added ListControlsToolbar
  // StyledBadge, // Not used in this version of FacultyList as no status is shown
} from '../../components';
import styles from './FacultyListPage.module.scss';

const FacultyListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [titleFilter, setTitleFilter] = useState('');

  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [titleOptions, setTitleOptions] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const uniqueDepartments = ['All', ...new Set(mockFaculty.map(f => f.department).filter(Boolean))];
    setDepartmentOptions(uniqueDepartments);

    const uniqueTitles = ['All', ...new Set(mockFaculty.map(f => f.title).filter(Boolean))];
    setTitleOptions(uniqueTitles);
  }, []);

  const filteredFaculty = mockFaculty.filter(faculty => {
    const nameMatch = faculty.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      faculty.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (faculty.email && faculty.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const departmentMatch = departmentFilter === '' || departmentFilter === 'All' || faculty.department === departmentFilter;
    const titleMatch = titleFilter === '' || titleFilter === 'All' || (faculty.title && faculty.title.toLowerCase().includes(titleFilter.toLowerCase()));
    return nameMatch && departmentMatch && titleMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredFaculty.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTableData = filteredFaculty.slice(indexOfFirstItem, indexOfLastItem);

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
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Faculty Management</h1>
      </div>
      <StyledCard className={styles.contentCard}>
        <StyledCard.Header>
          {/* <StyledCard.Title className={styles.pageTitle}>Faculty Management</StyledCard.Title> */}
        </StyledCard.Header>
        <ListControlsToolbar
          searchTerm={searchTerm}
          onSearchChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          searchPlaceholder="Name or email..."
          searchLabel="Search Faculty"
          filters={[
            {
              controlId: "departmentFilter",
              label: "Department",
              value: departmentFilter,
              onChange: (e) => { setDepartmentFilter(e.target.value); setCurrentPage(1); },
              options: departmentOptions.map(dept => ({ value: dept === 'All' ? '' : dept, label: dept })),
              type: 'select',
            },
            {
              controlId: "titleFilter",
              label: "Title/Role",
              value: titleFilter,
              onChange: (e) => { setTitleFilter(e.target.value); setCurrentPage(1); },
              options: titleOptions.map(title => ({ value: title === 'All' ? '' : title, label: title })),
              type: 'select',
            }
          ]}
          addAction={{
            label: "Add New Faculty",
            onClick: () => navigate('/admin/faculty/new'),
            icon: "add",
          }}
        />
        <StyledCard.Body>
          {/* The headerActions div is removed from here as Add button moved to tableControls */}
          {filteredFaculty.length === 0 ? (
            <p className={styles.noDataText}>No faculty members found matching your criteria.</p>
          ) : (
            <StyledTable striped bordered hover responsive className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Faculty ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Title</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentTableData.map((faculty) => (
                  <tr key={faculty.id}>
                    <td>{faculty.id}</td>
                    <td>{`${faculty.firstName} ${faculty.lastName}`}</td>
                    <td>{faculty.email}</td>
                    <td>{faculty.department}</td>
                    <td>{faculty.title}</td>
                    <td>
                      <StyledButton
                        variant="outline-primary"
                        size="sm"
                        onClick={() => navigate(`/admin/faculty/edit/${faculty.id}`)}
                        title="Edit Faculty"
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
      {/* Pagination outside the card */}
      {totalPages > 0 && (
        <div className={styles.paginationContainer}>
          <span className={styles.resultsText}>
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredFaculty.length)} of {filteredFaculty.length} results
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

export default FacultyListPage;
