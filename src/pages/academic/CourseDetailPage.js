import React from 'react';
import { useParams } from 'react-router-dom';
import { mockCourses } from '../../data/mockCourses';
import { mockUsers } from '../../data/mockUsers';
import { mockStudents } from '../../data/mockStudents';
import { mockEnrollments } from '../../data/mockEnrollments';
import { Row, Col, Table, Alert } from 'react-bootstrap'; // Alert and Table are kept from react-bootstrap for now
import {
  StyledContainer,
  StyledCard,
  // StyledButton, // Not used in this file
  // FormField, // Not used in this file
} from '../../components';
import styles from './CourseDetailPage.module.scss'; // Using its own SCSS module

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const course = mockCourses.find(c => c.id === courseId);

  if (!course) {
    return (
      <StyledContainer className={styles.pageContainer}>
        {/* Using react-bootstrap Alert, styled via SCSS module */}
        <Alert variant="danger" className={styles.alertDanger}>Course not found.</Alert>
      </StyledContainer>
    );
  }

  const teacher = mockUsers.find(user => user.id === course.teacherId);
  const courseEnrollments = mockEnrollments.filter(e => e.courseId === course.id);
  const enrolledStudentsDetails = courseEnrollments.map(enrollment => {
    const student = mockStudents.find(s => s.id === enrollment.studentId);
    return {
      ...student,
      grade: enrollment.grade,
    };
  });

  return (
    <StyledContainer className={styles.pageContainer}>
      <StyledCard className={styles.contentCard}>
        <StyledCard.Header as="h4" className={styles.cardHeaderTitle}>
          Course Details: {course.name} ({course.courseCode})
        </StyledCard.Header>
        <StyledCard.Body>
          <Row className="mb-3">
            <Col md={6}>
              <p className={styles.detailText}><strong>Description:</strong> {course.description}</p>
              <p className={styles.detailText}><strong>Department:</strong> {course.department}</p>
              <p className={styles.detailText}><strong>Credits:</strong> {course.credits}</p>
            </Col>
            <Col md={6}>
              <p className={styles.detailText}><strong>Teacher:</strong> {teacher ? `${teacher.firstName} ${teacher.lastName}` : 'N/A'}</p>
              <p className={styles.detailText}><strong>Semester:</strong> {course.semester}</p>
              <p className={styles.detailText}><strong>Schedule:</strong> {course.schedule}</p>
            </Col>
          </Row>
          {course.syllabus && (
            <Row className="mb-3">
              <Col>
                <h5 className={styles.sectionTitle}>Syllabus / Learning Objectives</h5>
                <StyledCard className={styles.syllabusCard}>
                  <StyledCard.Body> {/* SCSS handles styling via .syllabusCard :global(.card-body) */}
                    {course.syllabus}
                  </StyledCard.Body>
                </StyledCard>
              </Col>
            </Row>
          )}

          <h5 className={styles.sectionTitle}>Enrolled Students</h5>
          {enrolledStudentsDetails.length > 0 ? (
            <Table striped bordered hover responsive="sm" size="sm" className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {enrolledStudentsDetails.map(student => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{`${student.firstName} ${student.lastName}`}</td>
                    <td>{student.email}</td>
                    <td>{student.grade || 'N/A'}</td> {/* Ensure grade has a fallback */}
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className={styles.detailText}>No students currently enrolled in this course.</p>
          )}
        </StyledCard.Body>
      </StyledCard>
    </StyledContainer>
  );
};

export default CourseDetailPage;
