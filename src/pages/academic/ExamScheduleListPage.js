import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockExamSchedules } from '../../data/mockExamSchedules';
import { mockCourses } from '../../data/mockCourses';
import { Button, Table, Card } from 'react-bootstrap';
import styles from '../admin/AdminPages.module.scss'; // Reusing admin styles

const ExamScheduleListPage = () => {
  const navigate = useNavigate();

  const getCourseName = (courseId) => {
    const course = mockCourses.find(c => c.id === courseId);
    return course ? `${course.name} (${course.courseCode})` : 'Unknown Course';
  };

  return (
    <div className={styles.pageContainer}>
      <Card className={styles.formCard}>
        <Card.Header>
          <Card.Title>Examination Schedules</Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="d-flex justify-content-end mb-3">
            <Button variant="primary" onClick={() => navigate('/academic/examschedules/new')}>
              <span className="material-symbols-outlined me-2" style={{ verticalAlign: 'middle' }}>add</span>
              Add New Schedule
            </Button>
          </div>

          {mockExamSchedules.length === 0 ? (
            <p>No examination schedules found.</p>
          ) : (
            <Table striped bordered hover responsive className={styles.table}>
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
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => navigate(`/academic/examschedules/edit/${schedule.id}`)}
                        title="Edit Schedule"
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ExamScheduleListPage;
