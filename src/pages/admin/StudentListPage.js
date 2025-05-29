import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockStudents } from '../../data/mockStudents';
// import { Pagination } from 'react-bootstrap'; // Removed
// Import custom styled components from centralized design system
import {
  StyledContainer,
  StyledTable,
  StyledButton,
  // FormField, // No longer directly used
  StyledFormControl, // For page input
  StyledFormSelect,  // For items per page
  StyledPagination, // Added
  ListControlsToolbar, // Added
} from '../../components';
import styles from './StudentListPage.module.scss';

const StudentListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [majorFilter, setMajorFilter] = useState('');
  const [majorOptions, setMajorOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const uniqueMajors = ['All', ...new Set(mockStudents.map(student => student.major).filter(m => m))];
    setMajorOptions(uniqueMajors);

    const uniqueStatuses = ['All', ...new Set(mockStudents.map(student => student.enrollmentStatus).filter(s => s))];
    setStatusOptions(uniqueStatuses);
  }, []);

  const filteredStudents = mockStudents.filter(student => {
    const nameMatch = student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const statusMatch = statusFilter === '' || statusFilter === 'All' || student.enrollmentStatus === statusFilter;
    const majorMatch = majorFilter === '' || majorFilter === 'All' || student.major === majorFilter;
    return nameMatch && statusMatch && majorMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentTableData = filteredStudents.slice(indexOfFirstItem, indexOfLastItem); // Removed unused variable

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
    setCurrentPage(1); // Reset to first page
  };

  // Generate pagination items // Removed
  // const paginationItems = []; // Removed
  // if (totalPages <= 7) { // Show all pages if 7 or less // Removed
  //   for (let number = 1; number <= totalPages; number++) { // Removed
  //     paginationItems.push( // Removed
  //       <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}> // Removed
  //         {number} // Removed
  //       </Pagination.Item> // Removed
  //     ); // Removed
  //   } // Removed
  // } else { // Removed
  //   paginationItems.push( // Removed
  //     <Pagination.Item key={1} active={1 === currentPage} onClick={() => handlePageChange(1)}> // Removed
  //       1 // Removed
  //     </Pagination.Item> // Removed
  //   ); // Removed
  //   if (currentPage > 3) { // Removed
  //     paginationItems.push(<Pagination.Ellipsis key="ellipsis-start" disabled />); // Removed
  //   } // Removed
  //   let startPage = Math.max(2, currentPage - 1); // Removed
  //   let endPage = Math.min(totalPages - 1, currentPage + 1); // Removed

  //   if (currentPage <= 2) endPage = Math.min(totalPages -1, 3); // Removed
  //   if (currentPage >= totalPages -1) startPage = Math.max(2, totalPages -2); // Removed

  //   for (let number = startPage; number <= endPage; number++) { // Removed
  //     paginationItems.push( // Removed
  //       <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}> // Removed
  //         {number} // Removed
  //       </Pagination.Item> // Removed
  //     ); // Removed
  //   } // Removed
  //   if (currentPage < totalPages - 2) { // Removed
  //     paginationItems.push(<Pagination.Ellipsis key="ellipsis-end" disabled />); // Removed
  //   } // Removed
  //   paginationItems.push( // Removed
  //     <Pagination.Item key={totalPages} active={totalPages === currentPage} onClick={() => handlePageChange(totalPages)}> // Removed
  //         {totalPages} // Removed
  //     </Pagination.Item> // Removed
  //   ); // Removed
  // } // Removed


  return (
    <StyledContainer className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Student Management</h1>
      </div>

      <ListControlsToolbar
        searchTerm={searchTerm}
        onSearchChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1);}}
        searchPlaceholder="Enter name or email..."
        searchLabel="Search by Name/Email"
        filters={[
          {
            controlId: "statusFilter",
            label: "Filter by Enrollment Status",
            value: statusFilter,
            onChange: (e) => { setStatusFilter(e.target.value); setCurrentPage(1);},
            options: statusOptions.map(status => ({ value: status === 'All' ? '' : status, label: status })),
            type: 'select',
          },
          {
            controlId: "majorFilter",
            label: "Filter by Major",
            value: majorFilter,
            onChange: (e) => { setMajorFilter(e.target.value); setCurrentPage(1);},
            options: majorOptions.map(major => ({ value: major === 'All' ? '' : major, label: major })),
            type: 'select',
          }
        ]}
        addAction={{
          label: "Add New Student",
          onClick: () => navigate('/students/new'),
          icon: "add",
        }}
      />

      <StyledTable striped bordered hover responsive="sm" className={styles.dataTable}>
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Major</th>
            <th>Enrollment Date</th>
            <th>Enrollment Status</th>
            <th>Academic Standing</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Map directly over the sliced array */}
          {filteredStudents.slice(indexOfFirstItem, indexOfLastItem).map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{`${student.firstName} ${student.lastName}`}</td>
              <td>{student.email}</td>
              <td>{student.major}</td>
              <td>{student.enrollmentDate}</td>
              <td>{student.enrollmentStatus}</td>
              <td>{student.academicStanding}</td>
              <td>
                <StyledButton
                  variant="outline-info"
                  size="sm"
                  className="me-2 mb-1 mb-md-0"
                  onClick={() => navigate(`/profile/${student.id}`)}
                >
                  <span className={`material-symbols-outlined ${styles.actionButtonIcon}`}>visibility</span> {/* Apply actionButtonIcon */}
                </StyledButton>
                <StyledButton
                  variant="outline-primary"
                  size="sm"
                  onClick={() => navigate(`/students/edit/${student.id}`)}
                >
                  <span className={`material-symbols-outlined ${styles.actionButtonIcon}`}>edit</span> {/* Apply actionButtonIcon */}
                </StyledButton>
              </td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
      {filteredStudents.length === 0 && <p className={styles.noDataText}>No students match the current filters.</p>} {/* Apply noDataText */}
      
      {/* Pagination Container - Placed outside table but inside StyledContainer if it's meant to be part of the main content block */}
      {totalPages > 0 && (
        <div className={styles.paginationContainer}>
          <span className={styles.resultsText}>
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredStudents.length)} of {filteredStudents.length} results
          </span>
          <StyledPagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            maxVisiblePages={7} // Default or adjust as needed
            className={styles.paginationControls} // Apply existing styling
            size="sm" // Consistent with other list pages
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

export default StudentListPage;
