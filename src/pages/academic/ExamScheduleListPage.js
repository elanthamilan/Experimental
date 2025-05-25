import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockExamSchedules } from '../../data/mockExamSchedules';
import { mockCourses } from '../../data/mockCourses';
// Import custom styled components from centralized design system
import {
  StyledContainer,
  StyledTable,
  StyledCard,
  StyledButton
} from '../../components';
import styles from '../admin/AdminPages.module.scss'; // Reusing admin styles

const ExamScheduleListPage = () => {
  const navigate = useNavigate();

  const getCourseName = (courseId) => {
    const course = mockCourses.find(c => c.id === courseId);
    return course ? `${course.name} (${course.courseCode})` : 'Unknown Course';
  };

  return (
    <StyledContainer className={styles.pageContainer}>
      <StyledCard className={styles.formCard}>
        <StyledCard.Header>
          <StyledCard.Title>Examination Schedules</StyledCard.Title>
        </StyledCard.Header>
        <StyledCard.Body>
          <div className="d-flex justify-content-end mb-3">
            <StyledButton variant="primary" onClick={() => navigate('/academic/examschedules/new')}>
              <span className="material-symbols-outlined me-2" style={{ verticalAlign: 'middle' }}>add</span>
              Add New Schedule
            </StyledButton>
          </div>

          {mockExamSchedules.length === 0 ? (
            <p>No examination schedules found.</p>
          ) : (
            <StyledTable striped bordered hover responsive className={styles.table}>
              <thead>
                <tr>
                  <th>Schedule ID</th>
                  <th>Course</th>
                  <th>Exam Name</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Room</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockExamSchedules.map((schedule) => (
                  <tr key={schedule.id}>
                    <td>{schedule.id}</td>
                    <td>{getCourseName(schedule.courseId)}</td>
                    <td>{schedule.examName}</td>
                    <td>{schedule.date}</td>
                    <td>{schedule.time}</td>
                    <td>{schedule.room}</td>
                    <td>{schedule.duration}</td>
                    <td>
                      <StyledButton
                        variant="outline-primary"
                        size="sm"
                        onClick={() => navigate(`/academic/examschedules/edit/${schedule.id}`)}
                        title="Edit Schedule"
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </StyledButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </StyledTable>
          )}
        </StyledCard.Body>
      </StyledCard>
    </StyledContainer>
  );
};

export default ExamScheduleListPage;
