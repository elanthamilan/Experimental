import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockPrograms } from '../../data/mockPrograms';
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
import styles from './ProgramListPage.module.scss';

const ProgramListPage = () => {
  const navigate = useNavigate();
  // const [programs, setPrograms] = useState([]); // Will use filteredPrograms instead
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [degreeLevelFilter, setDegreeLevelFilter] = useState('');

  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [degreeLevelOptions, setDegreeLevelOptions] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    // setPrograms(mockPrograms); // Initial data load, filtering will handle display

    const uniqueDepartments = ['All', ...new Set(mockPrograms.map(p => p.department).filter(Boolean))];
    setDepartmentOptions(uniqueDepartments);

    const uniqueDegreeLevels = ['All', ...new Set(mockPrograms.map(p => p.degreeLevel).filter(Boolean))];
    setDegreeLevelOptions(uniqueDegreeLevels);
  }, []);

  const filteredPrograms = mockPrograms.filter(program => {
    const nameMatch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      program.id.toLowerCase().includes(searchTerm.toLowerCase());
    const departmentMatch = departmentFilter === '' || departmentFilter === 'All' || program.department === departmentFilter;
    const degreeLevelMatch = degreeLevelFilter === '' || degreeLevelFilter === 'All' || program.degreeLevel === degreeLevelFilter;
    return nameMatch && departmentMatch && degreeLevelMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTableData = filteredPrograms.slice(indexOfFirstItem, indexOfLastItem);

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
          <StyledCard.Title className={styles.cardTitle}>Program Management</StyledCard.Title>
        </StyledCard.Header>

        <div className={styles.tableControls}>
          <div className={styles.filterSection}>
            <div className={styles.searchFilterItem}>
              <FormField
                controlId="searchTerm"
                label="Search Program"
                type="text"
                placeholder="ID or Name..."
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
                controlId="degreeLevelFilter"
                label="Degree Level"
                as="select"
                value={degreeLevelFilter}
                onChange={(e) => { setDegreeLevelFilter(e.target.value); setCurrentPage(1); }}
                options={degreeLevelOptions.map(level => ({ value: level === 'All' ? '' : level, label: level }))}
              />
            </div>
          </div>
          <div className={styles.actionsSection}>
            <StyledButton variant="primary" onClick={() => navigate('/admin/programs/new')} className={styles.addButton}>
              <span className={`material-symbols-outlined ${styles.buttonIcon}`}>add</span>
              Add New Program
            </StyledButton>
          </div>
        </div>

        <StyledCard.Body>
          {/* Removed headerActions div as button is now in tableControls */}
          {filteredPrograms.length === 0 ? (
            <p className={styles.noDataText}>No programs found matching your criteria.</p>
          ) : (
            <StyledTable striped bordered hover responsive className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Program ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Degree Level</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentTableData.map((program) => (
                  <tr key={program.id}>
                    <td>{program.id}</td>
                    <td>{program.name}</td>
                    <td>{program.department}</td>
                    <td>{program.degreeLevel}</td>
                    <td>{program.duration}</td>
                    <td>
                      <StyledButton
                        variant="outline-primary"
                        size="sm"
                        onClick={() => navigate(`/admin/programs/edit/${program.id}`)}
                        title="Edit Program"
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
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredPrograms.length)} of {filteredPrograms.length} results
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

export default ProgramListPage;
