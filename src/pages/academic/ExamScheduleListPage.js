import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockExamSchedules } from '../../data/mockExamSchedules';
import { mockCourses } from '../../data/mockCourses';
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
import styles from './ExamScheduleListPage.module.scss';

const ExamScheduleListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const [courseOptions, setCourseOptions] = useState([]);

  // const [currentPage, setCurrentPage] = useState(1); // Removed
  // const [itemsPerPage, setItemsPerPage] = useState(10); // Removed

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
    const courseNameMatch = courseName.toLowerCase().includes(searchTerm.toLowerCase()); 

    const courseFilterMatch = courseFilter === '' || courseFilter === 'All' || courseName === courseFilter;
    const dateFilterMatch = dateFilter === '' || schedule.date === dateFilter;

    return (examNameMatch || courseNameMatch) && courseFilterMatch && dateFilterMatch;
  });

  // Old pagination logic removed
  // const totalPages = Math.ceil(filteredSchedules.length / itemsPerPage);
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentTableData = filteredSchedules.slice(indexOfFirstItem, indexOfLastItem);
  // handlePageChange, handlePageInputSubmit, handleItemsPerPageChange

  const examScheduleTableColumns = [
    { header: 'Schedule ID', accessor: 'id' },
    {
      header: 'Course',
      accessor: 'courseId', // Accessor remains courseId for data access
      cell: (item) => getCourseName(item.courseId), // Custom cell renderer
    },
    { header: 'Exam Name', accessor: 'examName' },
    { header: 'Date', accessor: 'date' },
    { header: 'Time', accessor: 'time' },
    { header: 'Room', accessor: 'room' },
    { header: 'Duration', accessor: 'duration' },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (item) => (
        <StyledButton
          variant="outline-primary"
          size="sm"
          onClick={() => navigate(`/academic/examschedules/edit/${item.id}`)}
          title="Edit Schedule"
        >
          <span className={`material-symbols-outlined ${styles.actionButtonIcon}`}>edit</span>
        </StyledButton>
      ),
    },
  ];

  return (
    <StyledContainer className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Examination Schedules</h1>
      </div>
      <StyledCard className={styles.contentCard}>
        <StyledCard.Header>
          {/* Optional: <StyledCard.Title className={styles.cardTitle}>Examination Schedules</StyledCard.Title> */}
        </StyledCard.Header>

        <ListControlsToolbar
          searchTerm={searchTerm}
          onSearchChange={(e) => { setSearchTerm(e.target.value); /* setCurrentPage(1) removed */ }}
          searchPlaceholder="Exam or Course Name..."
          searchLabel="Search Exam/Course"
          filters={[
            {
              controlId: "courseFilter",
              label: "Filter by Course",
              value: courseFilter,
              onChange: (e) => { setCourseFilter(e.target.value); /* setCurrentPage(1) removed */ },
              options: courseOptions,
              type: 'select',
            },
            {
              controlId: "dateFilter",
              label: "Filter by Date",
              value: dateFilter,
              onChange: (e) => { setDateFilter(e.target.value); /* setCurrentPage(1) removed */ },
              type: 'date',
            }
          ]}
          // addAction prop removed from ListControlsToolbar
          // addAction={{
          //   label: "Add New Schedule",
          //   onClick: () => navigate('/academic/examschedules/new'),
          //   icon: "add",
          // }}
        />
        
        <StyledCard.Body>
          {filteredSchedules.length === 0 ? (
            <p className={styles.noDataText}>No examination schedules found matching your criteria.</p>
          ) : (
            <ResultsTable
              data={filteredSchedules}
              columns={examScheduleTableColumns}
              showFilterTabs={false}
              showSearch={false}
              addActionLabel="Add New Schedule"
              addActionTo="/academic/examschedules/new"
            />
          )}
        </StyledCard.Body>
      </StyledCard>

      {/* Old Pagination JSX Removed */}
    </StyledContainer>
  );
};

export default ExamScheduleListPage;
