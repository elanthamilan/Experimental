import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockStudents } from '../../data/mockStudents';
// import { Pagination } from 'react-bootstrap'; // Already removed
// Import custom styled components from centralized design system
import {
  StyledContainer,
  // StyledTable, // Removed
  StyledButton, // Keep for action buttons in table cell renderer
  // StyledFormControl, // Removed (ResultsTable or ListControlsToolbar handles inputs)
  // StyledFormSelect,  // Removed (ResultsTable handles itemsPerPage)
  // StyledPagination, // Removed
  ListControlsToolbar,
  ResultsTable, // Added
} from '../../components';
import styles from './StudentListPage.module.scss';

const StudentListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [majorFilter, setMajorFilter] = useState('');
  const [majorOptions, setMajorOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);

  // const [currentPage, setCurrentPage] = useState(1); // Removed
  // const [itemsPerPage, setItemsPerPage] = useState(10); // Removed

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

  // Old pagination logic removed:
  // const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentTableData = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
  // handlePageChange, handlePageInputSubmit, handleItemsPerPageChange

  const studentTableColumns = [
    { header: 'Student ID', accessor: 'id' },
    {
      header: 'Full Name',
      accessor: 'fullName', // Using a new accessor as it's derived
      cell: (item) => `${item.firstName} ${item.lastName}`,
    },
    { header: 'Email', accessor: 'email' },
    { header: 'Major', accessor: 'major' },
    { header: 'Enrollment Date', accessor: 'enrollmentDate' },
    { header: 'Enrollment Status', accessor: 'enrollmentStatus' },
    { header: 'Academic Standing', accessor: 'academicStanding' },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (item) => (
        <>
          <StyledButton
            variant="outline-info"
            size="sm"
            className="me-2 mb-1 mb-md-0" // Keep existing responsive margin
            onClick={() => navigate(`/profile/${item.id}`)}
            title="View Profile"
          >
            <span className={`material-symbols-outlined ${styles.actionButtonIcon}`}>visibility</span>
          </StyledButton>
          <StyledButton
            variant="outline-primary"
            size="sm"
            onClick={() => navigate(`/students/edit/${item.id}`)}
            title="Edit Student"
          >
            <span className={`material-symbols-outlined ${styles.actionButtonIcon}`}>edit</span>
          </StyledButton>
        </>
      ),
    },
  ];

  return (
    <StyledContainer className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Student Management</h1>
      </div>

      <ListControlsToolbar
        searchTerm={searchTerm}
        onSearchChange={(e) => { setSearchTerm(e.target.value); /* setCurrentPage(1) removed */}}
        searchPlaceholder="Enter name or email..."
        searchLabel="Search by Name/Email"
        filters={[
          {
            controlId: "statusFilter",
            label: "Filter by Enrollment Status",
            value: statusFilter,
            onChange: (e) => { setStatusFilter(e.target.value); /* setCurrentPage(1) removed */},
            options: statusOptions.map(status => ({ value: status === 'All' ? '' : status, label: status })),
            type: 'select',
          },
          {
            controlId: "majorFilter",
            label: "Filter by Major",
            value: majorFilter,
            onChange: (e) => { setMajorFilter(e.target.value); /* setCurrentPage(1) removed */},
            options: majorOptions.map(major => ({ value: major === 'All' ? '' : major, label: major })),
            type: 'select',
          }
        ]}
        // addAction prop removed from ListControlsToolbar
        // addAction={{
        //   label: "Add New Student",
        //   onClick: () => navigate('/students/new'),
        //   icon: "add",
        // }}
      />

      <ResultsTable
        data={filteredStudents}
        columns={studentTableColumns}
        showFilterTabs={false}
        showSearch={false}
        addActionLabel="Add New Student"
        addActionTo="/students/new"
      />

      {filteredStudents.length === 0 && <p className={styles.noDataText}>No students match the current filters.</p>}
      
      {/* Old StyledTable and Pagination JSX removed */}
    </StyledContainer>
  );
};

export default StudentListPage;
