import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockStudents } from '../../data/mockStudents';
import { Pagination } from 'react-bootstrap';
// Import custom styled components from centralized design system
import {
  StyledContainer,
  StyledTable,
  StyledButton,
  FormField,
  StyledFormControl, // For page input
  StyledFormSelect,  // For items per page
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
  const currentTableData = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);

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

  // Generate pagination items
  const paginationItems = [];
  if (totalPages <= 7) { // Show all pages if 7 or less
    for (let number = 1; number <= totalPages; number++) {
      paginationItems.push(
        <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
          {number}
        </Pagination.Item>
      );
    }
  } else {
    paginationItems.push(
      <Pagination.Item key={1} active={1 === currentPage} onClick={() => handlePageChange(1)}>
        1
      </Pagination.Item>
    );
    if (currentPage > 3) {
      paginationItems.push(<Pagination.Ellipsis key="ellipsis-start" disabled />);
    }
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage <= 2) endPage = Math.min(totalPages -1, 3);
    if (currentPage >= totalPages -1) startPage = Math.max(2, totalPages -2);

    for (let number = startPage; number <= endPage; number++) {
      paginationItems.push(
        <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
          {number}
        </Pagination.Item>
      );
    }
    if (currentPage < totalPages - 2) {
      paginationItems.push(<Pagination.Ellipsis key="ellipsis-end" disabled />);
    }
    paginationItems.push(
      <Pagination.Item key={totalPages} active={totalPages === currentPage} onClick={() => handlePageChange(totalPages)}>
        {totalPages}
      </Pagination.Item>
    );
  }


  return (
    <StyledContainer className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Student Management</h1>
      </div>

      <div className={styles.tableControls}>
        <div className={styles.filterSection}>
          <div className={styles.searchFilterItem}>
            <FormField
              controlId="searchTerm"
              label="Search by Name/Email"
              type="text"
              placeholder="Enter name or email..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1);}}
            />
          </div>
          <div className={styles.dropdownFilterItem}>
            <FormField
              controlId="statusFilter"
              label="Filter by Enrollment Status"
              as="select"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1);}}
              options={statusOptions.map(status => ({
                value: status === 'All' ? '' : status,
                label: status
              }))}
            />
          </div>
          <div className={styles.dropdownFilterItem}>
            <FormField
              controlId="majorFilter"
              label="Filter by Major"
              as="select"
              value={majorFilter}
              onChange={(e) => { setMajorFilter(e.target.value); setCurrentPage(1);}}
              options={majorOptions.map(major => ({
                value: major === 'All' ? '' : major,
                label: major
              }))}
            />
          </div>
        </div>
        <div className={styles.actionsSection}>
          <StyledButton variant="primary" onClick={() => navigate('/students/new')} className={styles.addButton}>
            <span className={`material-symbols-outlined ${styles.buttonIcon}`}>add</span>
            Add New Student
          </StyledButton>
        </div>
      </div>

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
          {filteredStudents.map((student) => (
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
    </StyledContainer>
  );
};

export default StudentListPage;
