import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockFaculty } from '../../data/mockFaculty';
// import { Pagination } from 'react-bootstrap'; // Already removed
import {
  StyledContainer,
  // StyledTable, // Removed
  StyledCard,
  StyledButton, // Kept for action button in cell renderer
  // StyledFormControl, // Removed
  // StyledFormSelect,  // Removed
  // StyledPagination, // Removed
  ListControlsToolbar,
  ResultsTable, // Added
  // StyledBadge, 
} from '../../components';
import styles from './FacultyListPage.module.scss';

const FacultyListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [titleFilter, setTitleFilter] = useState('');

  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [titleOptions, setTitleOptions] = useState([]);

  // const [currentPage, setCurrentPage] = useState(1); // Removed
  // const [itemsPerPage, setItemsPerPage] = useState(10); // Removed

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

  // Old pagination logic removed
  // const totalPages = Math.ceil(filteredFaculty.length / itemsPerPage);
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentTableData = filteredFaculty.slice(indexOfFirstItem, indexOfLastItem);
  // handlePageChange, handlePageInputSubmit, handleItemsPerPageChange

  const facultyTableColumns = [
    { header: 'Faculty ID', accessor: 'id' },
    {
      header: 'Full Name',
      accessor: 'fullName', // Derived
      cell: (item) => `${item.firstName} ${item.lastName}`,
    },
    { header: 'Email', accessor: 'email' },
    { header: 'Department', accessor: 'department' },
    { header: 'Title', accessor: 'title' },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (item) => (
        <StyledButton
          variant="outline-primary"
          size="sm"
          onClick={() => navigate(`/admin/faculty/edit/${item.id}`)}
          title="Edit Faculty"
        >
          <span className={`material-symbols-outlined ${styles.actionButtonIcon}`}>edit</span>
        </StyledButton>
      ),
    },
  ];

  return (
    <StyledContainer className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Faculty Management</h1>
      </div>
      <StyledCard className={styles.contentCard}>
        <StyledCard.Header>
          {/* Optional: <StyledCard.Title>Faculty Management</StyledCard.Title> */}
        </StyledCard.Header>
        <ListControlsToolbar
          searchTerm={searchTerm}
          onSearchChange={(e) => { setSearchTerm(e.target.value); /* setCurrentPage(1) removed */ }}
          searchPlaceholder="Name or email..."
          searchLabel="Search Faculty"
          filters={[
            {
              controlId: "departmentFilter",
              label: "Department",
              value: departmentFilter,
              onChange: (e) => { setDepartmentFilter(e.target.value); /* setCurrentPage(1) removed */ },
              options: departmentOptions.map(dept => ({ value: dept === 'All' ? '' : dept, label: dept })),
              type: 'select',
            },
            {
              controlId: "titleFilter",
              label: "Title/Role",
              value: titleFilter,
              onChange: (e) => { setTitleFilter(e.target.value); /* setCurrentPage(1) removed */ },
              options: titleOptions.map(title => ({ value: title === 'All' ? '' : title, label: title })),
              type: 'select',
            }
          ]}
          // addAction prop removed from ListControlsToolbar
          // addAction={{
          //   label: "Add New Faculty",
          //   onClick: () => navigate('/admin/faculty/new'),
          //   icon: "add",
          // }}
        />
        <StyledCard.Body>
          {filteredFaculty.length === 0 ? (
            <p className={styles.noDataText}>No faculty members found matching your criteria.</p>
          ) : (
            <ResultsTable
              data={filteredFaculty}
              columns={facultyTableColumns}
              showFilterTabs={false}
              showSearch={false}
              addActionLabel="Add New Faculty"
              addActionTo="/admin/faculty/new"
            />
          )}
        </StyledCard.Body>
      </StyledCard>
      {/* Old Pagination JSX Removed */}
    </StyledContainer>
  );
};

export default FacultyListPage;
