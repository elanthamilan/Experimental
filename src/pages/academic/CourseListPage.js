import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockCourses } from '../../data/mockCourses';
import { mockUsers } from '../../data/mockUsers'; // To get teacher names
import {
  StyledContainer,
  // StyledTable, // Removed
  StyledButton, // Keep for action buttons in table if needed, or remove if ResultsTable handles all
  // StyledFormControl, // To be removed if ResultsTable handles its own search/pagination inputs
  // StyledFormSelect, // To be removed if ResultsTable handles its own itemsPerPage
  // StyledPagination, // To be removed
  ListControlsToolbar,
  ResultsTable, // Added
} from '../../components';
import styles from './CourseListPage.module.scss';

const CourseListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');

  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [semesterOptions, setSemesterOptions] = useState([]);

  // Pagination state and itemsPerPage will be managed by ResultsTable
  // const [currentPage, setCurrentPage] = useState(1);
  // const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const uniqueDepartments = ['All', ...new Set(mockCourses.map(course => course.department).filter(Boolean))];
    setDepartmentOptions(uniqueDepartments);

    const uniqueSemesters = ['All', ...new Set(mockCourses.map(course => course.semester).filter(Boolean))];
    setSemesterOptions(uniqueSemesters);
  }, []);

  const getTeacherName = (teacherId) => {
    const teacher = mockUsers.find(user => user.id === teacherId);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : 'N/A';
  };

  const filteredCourses = mockCourses.filter(course => {
    const nameMatch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      course.courseCode.toLowerCase().includes(searchTerm.toLowerCase());
    const departmentMatch = departmentFilter === '' || departmentFilter === 'All' || course.department === departmentFilter;
    const semesterMatch = semesterFilter === '' || semesterFilter === 'All' || course.semester === semesterFilter;
    return nameMatch && departmentMatch && semesterMatch;
  });

  // Columns definition for ResultsTable
  const courseTableColumns = [
    { header: 'Course Code', accessor: 'courseCode' },
    { header: 'Course Name', accessor: 'name' },
    { header: 'Department', accessor: 'department' },
    { header: 'Credits', accessor: 'credits' },
    {
      header: 'Teacher',
      accessor: 'teacherId',
      cell: (item) => getTeacherName(item.teacherId),
    },
    { header: 'Semester', accessor: 'semester' },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (item) => (
        <>
          <StyledButton
            variant="outline-secondary"
            size="sm"
            className="me-2"
            onClick={() => navigate(`/courses/${item.id}`)}
            title="View Details"
          >
            <span className={`material-symbols-outlined ${styles.actionButtonIcon}`}>visibility</span>
          </StyledButton>
          <StyledButton
            variant="outline-primary"
            size="sm"
            onClick={() => navigate(`/courses/edit/${item.id}`)}
            title="Edit Course"
          >
            <span className={`material-symbols-outlined ${styles.actionButtonIcon}`}>edit</span>
          </StyledButton>
        </>
      ),
    },
  ];


  // Removed old pagination logic:
  // const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentTableData = filteredCourses.slice(indexOfFirstItem, indexOfLastItem);
  // handlePageChange, handlePageInputSubmit, handleItemsPerPageChange
  // paginationItems array generation

  return (
    <StyledContainer className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Course Management</h1>
      </div>

      <ListControlsToolbar
        searchTerm={searchTerm}
        onSearchChange={(e) => { setSearchTerm(e.target.value); /* ResultsTable handles its own pagination, ListControlsToolbar search still filters data passed to ResultsTable */ }}
        searchPlaceholder="Name or Code..."
        searchLabel="Search Course"
        filters={[
          {
            controlId: "departmentFilter",
            label: "Department",
            value: departmentFilter,
            onChange: (e) => { setDepartmentFilter(e.target.value); },
            options: departmentOptions.map(dept => ({ value: dept === 'All' ? '' : dept, label: dept })),
            type: 'select',
          },
          {
            controlId: "semesterFilter",
            label: "Semester",
            value: semesterFilter,
            onChange: (e) => { setSemesterFilter(e.target.value); },
            options: semesterOptions.map(sem => ({ value: sem === 'All' ? '' : sem, label: sem })),
            type: 'select',
          }
        ]}
        // addAction prop is removed from ListControlsToolbar as ResultsTable will handle it.
        // addAction={{
        //   label: "Add New Course",
        //   onClick: () => navigate('/courses/new'),
        //   icon: "add",
        // }}
      />

      <ResultsTable
        data={filteredCourses}
        columns={courseTableColumns}
        showFilterTabs={false}
        addActionLabel="Add New Course"
        addActionTo="/courses/new"
        showSearch={false}
      />

      {filteredCourses.length === 0 && <p className={styles.noDataText}>No courses found matching your criteria.</p>}

      {/* Old StyledTable and Pagination JSX removed */}
      {/*
      <StyledTable striped bordered hover responsive="sm" className={styles.dataTable}>
        ...
      </StyledTable>
      */}
      {/*
      {totalPages > 0 && (
        <div className={styles.paginationContainer}>
          ...
        </div>
      )}
      */}
    </StyledContainer>
  );
};

export default CourseListPage;
