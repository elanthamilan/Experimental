import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockExamSchedules } from '../../data/mockExamSchedules';
import { mockCourses } from '../../data/mockCourses';
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
  // StyledBadge, // Import if status column is added
} from '../../components';
import styles from './ExamScheduleListPage.module.scss';

const ExamScheduleListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [dateFilter, setDateFilter] = useState(''); // For filtering by a specific date

  const [courseOptions, setCourseOptions] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const uniqueCourses = ['All', ...new Set(mockExamSchedules.map(schedule => {
      const course = mockCourses.find(c => c.id === schedule.courseId);
      return course ? course.name : 'Unknown Course';
    }).filter(Boolean))];
    setCourseOptions(uniqueCourses.map(courseName => ({ value: courseName === 'All' ? '' : courseName, label: courseName })));
  }, []);
  
  const getCourseName = (courseId) => {
    const course = mockCourses.find(c => c.id === courseId);
    return course ? `${course.name} (${course.courseCode})` : 'Unknown Course';
  };

  const filteredSchedules = mockExamSchedules.filter(schedule => {
    const courseName = mockCourses.find(c => c.id === schedule.courseId)?.name || '';
    const examNameMatch = schedule.examName.toLowerCase().includes(searchTerm.toLowerCase());
    const courseNameMatch = courseName.toLowerCase().includes(searchTerm.toLowerCase()); // Allow search by course name too

    const courseFilterMatch = courseFilter === '' || courseFilter === 'All' || courseName === courseFilter;
    const dateFilterMatch = dateFilter === '' || schedule.date === dateFilter;

    return (examNameMatch || courseNameMatch) && courseFilterMatch && dateFilterMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredSchedules.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTableData = filteredSchedules.slice(indexOfFirstItem, indexOfLastItem);

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
        <h1 className={styles.pageTitle}>Examination Schedules</h1>
      </div>
      <StyledCard className={styles.contentCard}>
        <StyledCard.Header>
          {/* <StyledCard.Title className={styles.cardTitle}>Examination Schedules</StyledCard.Title> */}
        </StyledCard.Header>

        <div className={styles.tableControls}>
          <div className={styles.filterSection}>
            <div className={styles.searchFilterItem}>
              <FormField
                controlId="searchTerm"
                label="Search Exam/Course"
                type="text"
                placeholder="Exam or Course Name..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <div className={styles.dropdownFilterItem}>
              <FormField
                controlId="courseFilter"
                label="Filter by Course"
                as="select"
                value={courseFilter}
                onChange={(e) => { setCourseFilter(e.target.value); setCurrentPage(1); }}
                options={courseOptions}
              />
            </div>
            <div className={styles.dateFilterItem}>
              <FormField
                controlId="dateFilter"
                label="Filter by Date"
                type="date"
                value={dateFilter}
                onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
              />
            </div>
          </div>
          <div className={styles.actionsSection}>
            <StyledButton variant="primary" onClick={() => navigate('/academic/examschedules/new')} className={styles.addButton}>
              <span className={`material-symbols-outlined ${styles.buttonIcon}`}>add</span>
              Add New Schedule
            </StyledButton>
          </div>
        </div>
        
        <StyledCard.Body>
          {/* Removed headerActions div */}
          {filteredSchedules.length === 0 ? (
            <p className={styles.noDataText}>No examination schedules found matching your criteria.</p>
          ) : (
            <StyledTable striped bordered hover responsive className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Schedule ID</th>
                  <th>Course</th>
                  <th>Exam Name</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Room</th>
                  <th>Duration</th>
                  {/* Add Status column if data model supports it */}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentTableData.map((schedule) => (
                  <tr key={schedule.id}>
                    <td>{schedule.id}</td>
                    <td>{getCourseName(schedule.courseId)}</td>
                    <td>{schedule.examName}</td>
                    <td>{schedule.date}</td>
                    <td>{schedule.time}</td>
                    <td>{schedule.room}</td>
                    <td>{schedule.duration}</td>
                    {/* Add status cell with StyledBadge if applicable */}
                    <td>
                      <StyledButton
                        variant="outline-primary"
                        size="sm"
                        onClick={() => navigate(`/academic/examschedules/edit/${schedule.id}`)}
                        title="Edit Schedule"
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
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredSchedules.length)} of {filteredSchedules.length} results
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

export default ExamScheduleListPage;
