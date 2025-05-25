import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockFaculty } from '../../data/mockFaculty';
import { Pagination } from 'react-bootstrap';
import {
  StyledContainer,
  StyledTable,
  StyledCard,
  StyledButton,
  FormField, // Added FormField
  StyledFormControl, // Added StyledFormControl
  StyledFormSelect,  // Added StyledFormSelect
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
      {/* Page Title is part of StyledCard.Header in this layout */}
      <StyledCard className={styles.contentCard}>
        <StyledCard.Header>
          <StyledCard.Title className={styles.pageTitle}>Faculty Management</StyledCard.Title>
        </StyledCard.Header>
        {/* Control Bar is now inside StyledCard.Body or just before it, but outside Header */}
        <div className={styles.tableControls}>
            <div className={styles.filterSection}>
              <div className={styles.searchFilterItem}>
                <FormField
                  controlId="searchTerm"
                  label="Search Faculty"
                  type="text"
                  placeholder="Name or email..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
              </div>
              <div className={styles.dropdownFilterItem}>
                <FormField
                  controlId="departmentFilter"
                  label="Department"
                  as="select"
                  value={departmentFilter}
                  onChange={(e) => { setDepartmentFilter(e.target.value); setCurrentPage(1); }}
                  options={departmentOptions.map(dept => ({ value: dept === 'All' ? '' : dept, label: dept }))}
                />
              </div>
              <div className={styles.dropdownFilterItem}>
                <FormField
                  controlId="titleFilter"
                  label="Title/Role"
                  as="select" // Changed to select for consistency, can be text if free-form search is preferred
                  value={titleFilter}
                  onChange={(e) => { setTitleFilter(e.target.value); setCurrentPage(1); }}
                  options={titleOptions.map(title => ({ value: title === 'All' ? '' : title, label: title }))}
                />
              </div>
            </div>
            <div className={styles.actionsSection}>
              <StyledButton variant="primary" onClick={() => navigate('/admin/faculty/new')} className={styles.addButton}>
                <span className={`material-symbols-outlined ${styles.buttonIcon}`}>add</span>
                Add New Faculty
              </StyledButton>
            </div>
          </div>
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

export default FacultyListPage;
