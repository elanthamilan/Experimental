import React from 'react';
import { useParams } from 'react-router-dom';
import { mockStudents } from '../../data/mockStudents';
import { mockCourses } from '../../data/mockCourses';
import { mockEnrollments } from '../../data/mockEnrollments';
import { Card, Row, Col, Image, Table, Alert } from 'react-bootstrap';
import styles from './UserPages.module.scss'; // Optional: for custom styles

const StudentProfilePage = () => {
  const { studentId } = useParams();
  const student = mockStudents.find(s => s.id === studentId);

  if (!student) {
    return (
      <div className={styles.pageContainer}>
        <Alert variant="danger">Student not found.</Alert>
      </div>
    );
  }

  const studentEnrollments = mockEnrollments.filter(e => e.studentId === student.id);
  const enrolledCoursesDetails = studentEnrollments.map(enrollment => {
    const course = mockCourses.find(c => c.id === enrollment.courseId);
    return {
      ...course,
      grade: enrollment.grade,
      enrollmentDate: enrollment.enrollmentDate // Or from student if it's overall
    };
  });

  return (
    <div className={styles.pageContainer}>
      <Card className={styles.profileCard}>
        <Card.Header as="h4" className={styles.profileCardHeader}>
          Student Profile
        </Card.Header>
        <Card.Body>
          <Row className="mb-4">
            <Col md={4} className="text-center">
              {student.profileImageUrl ? (
                <Image src={student.profileImageUrl} roundedCircle fluid thumbnail className={styles.profileImage} />
              ) : (
                <div className={styles.profileImagePlaceholder}>
                  <span className="material-symbols-outlined" style={{ fontSize: '4rem' }}>person</span>
                </div>
              )}
              <h5 className="mt-3">{`${student.firstName} ${student.lastName}`}</h5>
              <p className="text-muted">{student.major}</p>
            </Col>
            <Col md={8}>
              <h5>Student Details</h5>
              <Table borderless hover size="sm" className={styles.detailsTable}>
                <tbody>
                  <tr>
                    <td><strong>Student ID:</strong></td>
                    <td>{student.id}</td>
                  </tr>
                  <tr>
                    <td><strong>Email:</strong></td>
                    <td>{student.email}</td>
                  </tr>
                  <tr>
                    <td><strong>Date of Birth:</strong></td>
                    <td>{student.dateOfBirth}</td>
                  </tr>
                  <tr>
                    <td><strong>Enrollment Date:</strong></td>
                    <td>{student.enrollmentDate}</td>
                  </tr>
                  <tr>
                    <td colSpan="2"><strong>Address:</strong></td>
                  </tr>
                  <tr>
                    <td className="ps-4">Street:</td>
                    <td>{student.address.street}</td>
                  </tr>
                  <tr>
                    <td className="ps-4">City:</td>
                    <td>{student.address.city}</td>
                  </tr>
                  <tr>
                    <td className="ps-4">State:</td>
                    <td>{student.address.state}</td>
                  </tr>
                  <tr>
                    <td className="ps-4">Zip Code:</td>
                    <td>{student.address.zipCode}</td>
                  </tr>
                  <tr>
                    <td className="ps-4">Country:</td>
                    <td>{student.address.country}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>

          <h5>Enrolled Courses</h5>
          {enrolledCoursesDetails.length > 0 ? (
            <Table striped bordered hover responsive="sm" size="sm" className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Name</th>
                  <th>Department</th>
                  <th>Credits</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {enrolledCoursesDetails.map(course => (
                  <tr key={course.id}>
                    <td>{course.courseCode}</td>
                    <td>{course.name}</td>
                    <td>{course.department}</td>
                    <td>{course.credits}</td>
                    <td>{course.grade}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No courses enrolled.</p>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default StudentProfilePage;
