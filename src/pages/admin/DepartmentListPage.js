import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockDepartments } from '../../data/mockDepartments';
import { mockFaculty } from '../../data/mockFaculty';
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
} from '../../components';
import styles from './DepartmentListPage.module.scss';

const DepartmentListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  // Add other filter states if needed, e.g., head of department
  // const [headFilter, setHeadFilter] = useState('');
  // const [headOptions, setHeadOptions] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Populate filter options - example for head (faculty)
  // useEffect(() => {
  //   const uniqueHeads = ['All', ...new Set(mockDepartments.map(dept => getFacultyName(dept.head)).filter(Boolean))];
  //   setHeadOptions(uniqueHeads);
  // }, []);


  const getFacultyName = (facultyId) => {
    if (!facultyId) return 'N/A';
    const facultyMember = mockFaculty.find(f => f.id === facultyId);
    return facultyMember ? `${facultyMember.firstName} ${facultyMember.lastName}` : 'N/A';
  };

  const filteredDepartments = mockDepartments.filter(dept => {
    const searchTermLower = searchTerm.toLowerCase();
    const nameMatch = dept.name.toLowerCase().includes(searchTermLower);
    const idMatch = dept.id.toLowerCase().includes(searchTermLower);
    const headName = getFacultyName(dept.head).toLowerCase();
    const headMatch = headName.includes(searchTermLower);
    // const headFilterMatch = headFilter === '' || headFilter === 'All' || getFacultyName(dept.head) === headFilter;

    return (nameMatch || idMatch || headMatch); // && headFilterMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTableData = filteredDepartments.slice(indexOfFirstItem, indexOfLastItem);

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
          <StyledCard.Title className={styles.cardTitle}>Department Management</StyledCard.Title>
        </StyledCard.Header>

        <div className={styles.tableControls}>
          <div className={styles.filterSection}>
            <div className={styles.searchFilterItem}>
              <FormField
                controlId="searchTerm"
                label="Search Department"
                type="text"
                placeholder="ID, Name, or Head..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
            {/* Example for another filter if needed 
            <div className={styles.dropdownFilterItem}>
              <FormField
                controlId="headFilter"
                label="Filter by Head"
                as="select"
                value={headFilter}
                onChange={(e) => { setHeadFilter(e.target.value); setCurrentPage(1); }}
                options={headOptions.map(opt => ({ value: opt === 'All' ? '' : opt, label: opt }))}
              />
            </div>
            */}
          </div>
          <div className={styles.actionsSection}>
            <StyledButton variant="primary" onClick={() => navigate('/admin/masterdata/departments/new')} className={styles.addButton}>
              <span className={`material-symbols-outlined ${styles.buttonIcon}`}>add</span>
              Add New Department
            </StyledButton>
          </div>
        </div>
        
        <StyledCard.Body>
          {/* Removed headerActions div */}
          {filteredDepartments.length === 0 ? (
            <p className={styles.noDataText}>No departments found matching your criteria.</p>
          ) : (
            <StyledTable striped bordered hover responsive className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Department ID</th>
                  <th>Name</th>
                  <th>Head</th>
                  <th>Description</th>
                  <th>Office Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentTableData.map((dept) => (
                  <tr key={dept.id}>
                    <td>{dept.id}</td>
                    <td>{dept.name}</td>
                    <td>{getFacultyName(dept.head)}</td>
                    <td>{dept.description}</td>
                    <td>{dept.officeLocation}</td>
                    <td>
                      <StyledButton
                        variant="outline-primary"
                        size="sm"
                        onClick={() => navigate(`/admin/masterdata/departments/edit/${dept.id}`)}
                        title="Edit Department"
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
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredDepartments.length)} of {filteredDepartments.length} results
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

export default DepartmentListPage;
