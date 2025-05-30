import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockCourses } from '../../data/mockCourses';
import { mockUsers } from '../../data/mockUsers'; // To get teacher names
// import { Pagination } from 'react-bootstrap'; // Removed
import {
  StyledContainer,
  StyledTable,
  // StyledCard, // Not used directly on this page anymore for main layout
  StyledButton,
  // FormField, // No longer directly used
  StyledFormControl,
  StyledFormSelect,
  StyledPagination, // Added
  ListControlsToolbar, // Added
} from '../../components';
import styles from './CourseListPage.module.scss';

const CourseListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');

  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [semesterOptions, setSemesterOptions] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  // Pagination logic
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTableData = filteredCourses.slice(indexOfFirstItem, indexOfLastItem);

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
  //       paginationItems.push( // Removed
  //         <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}> // Removed
  //           {number} // Removed
  //         </Pagination.Item> // Removed
  //       ); // Removed
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
        <h1 className={styles.pageTitle}>Course Management</h1>
      </div>

      <ListControlsToolbar
        searchTerm={searchTerm}
        onSearchChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        searchPlaceholder="Name or Code..."
        searchLabel="Search Course"
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
            controlId: "semesterFilter",
            label: "Semester",
            value: semesterFilter,
            onChange: (e) => { setSemesterFilter(e.target.value); setCurrentPage(1); },
            options: semesterOptions.map(sem => ({ value: sem === 'All' ? '' : sem, label: sem })),
            type: 'select',
          }
        ]}
        addAction={{
          label: "Add New Course",
          onClick: () => navigate('/courses/new'),
          icon: "add",
        }}
      />

      <StyledTable striped bordered hover responsive="sm" className={styles.dataTable}>
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Course Name</th>
            <th>Department</th>
            <th>Credits</th>
            <th>Teacher</th>
            <th>Semester</th> {/* Added Semester to table display */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentTableData.map((course) => (
            <tr key={course.id}>
              <td>{course.courseCode}</td>
              <td>{course.name}</td>
              <td>{course.department}</td>
              <td>{course.credits}</td>
              <td>{getTeacherName(course.teacherId)}</td>
              <td>{course.semester}</td> {/* Added Semester data */}
              <td>
                <StyledButton
                  variant="outline-secondary"
                  size="sm"
                  className="me-2"
                  onClick={() => navigate(`/courses/${course.id}`)}
                  title="View Details"
                >
                  <span className={`material-symbols-outlined ${styles.actionButtonIcon}`}>visibility</span>
                </StyledButton>
                <StyledButton
                  variant="outline-primary"
                  size="sm"
                  onClick={() => navigate(`/courses/edit/${course.id}`)}
                  title="Edit Course"
                >
                  <span className={`material-symbols-outlined ${styles.actionButtonIcon}`}>edit</span>
                </StyledButton>
              </td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
      {filteredCourses.length === 0 && <p className={styles.noDataText}>No courses found matching your criteria.</p>}

      {totalPages > 0 && (
        <div className={styles.paginationContainer}>
          <span className={styles.resultsText}>
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredCourses.length)} of {filteredCourses.length} results
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

export default CourseListPage;
