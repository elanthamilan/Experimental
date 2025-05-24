import React from 'react';
import { useParams } from 'react-router-dom';
import { mockCourses } from '../../data/mockCourses';
import { mockUsers } from '../../data/mockUsers';
import { mockStudents } from '../../data/mockStudents';
import { mockEnrollments } from '../../data/mockEnrollments';
import { Card, Row, Col, Table, Alert } from 'react-bootstrap';
import styles from '../admin/AdminPages.module.scss'; // Using admin styles for consistency

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const course = mockCourses.find(c => c.id === courseId);

  if (!course) {
    return (
      <div className={styles.pageContainer}>
        <Alert variant="danger">Course not found.</Alert>
      </div>
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
    <div className={styles.pageContainer}>
      <Card className={styles.formCard}> {/* Reusing formCard style for consistency */}
        <Card.Header as="h4" className={styles.formCardHeader}>
          Course Details: {course.name} ({course.courseCode})
        </Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col md={6}>
              <p><strong>Description:</strong> {course.description}</p>
              <p><strong>Department:</strong> {course.department}</p>
              <p><strong>Credits:</strong> {course.credits}</p>
            </Col>
            <Col md={6}>
              <p><strong>Teacher:</strong> {teacher ? `${teacher.firstName} ${teacher.lastName}` : 'N/A'}</p>
              <p><strong>Semester:</strong> {course.semester}</p>
              <p><strong>Schedule:</strong> {course.schedule}</p>
            </Col>
          </Row>
          {course.syllabus && (
            <Row className="mb-3">
              <Col>
                <h5>Syllabus / Learning Objectives</h5>
                <Card>
                  <Card.Body style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.9rem', backgroundColor: '#f8f9fa' }}>
                    {course.syllabus}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          <h5 className="mt-4">Enrolled Students</h5>
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
                    <td>{student.grade}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No students currently enrolled in this course.</p>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default CourseDetailPage;
