import React from 'react';
import { useParams } from 'react-router-dom';
import { mockStudents } from '../../data/mockStudents';
import { mockCourses } from '../../data/mockCourses';
import { mockEnrollments } from '../../data/mockEnrollments';
import { mockHealthRecords } from '../../data/mockHealthRecords'; // New import
import { mockDisciplinaryRecords } from '../../data/mockDisciplinaryRecords'; // New import
import { Card, Row, Col, Image, Table, Alert, Badge } from 'react-bootstrap';
import styles from './UserPages.module.scss';

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
      enrollmentDate: enrollment.enrollmentDate
    };
  });

  const healthRecords = mockHealthRecords.filter(hr => hr.studentId === student.id);
  const disciplinaryRecords = mockDisciplinaryRecords.filter(dr => dr.studentId === student.id);

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
                  <span className="material-symbols-outlined" style={{ fontSize: '6rem' }}>person</span>
                </div>
              )}
              <h3 className="mt-3">{`${student.firstName} ${student.lastName}`}</h3>
              <p className="text-muted">{student.major}</p>
              <p><Badge bg={student.enrollmentStatus === 'Enrolled' ? 'success' : 'secondary'}>{student.enrollmentStatus}</Badge></p>
              <p><strong>Academic Standing:</strong> {student.academicStanding}</p>
            </Col>
            <Col md={8}>
              <h5>Personal & Contact Information</h5>
              <Table borderless hover size="sm" className={styles.detailsTable}>
                <tbody>
                  <tr><td><strong>Student ID:</strong></td><td>{student.id}</td></tr>
                  <tr><td><strong>Email:</strong></td><td>{student.email}</td></tr>
                  <tr><td><strong>Date of Birth:</strong></td><td>{student.dateOfBirth}</td></tr>
                  <tr><td><strong>Gender:</strong></td><td>{student.gender}</td></tr>
                  <tr><td><strong>Nationality:</strong></td><td>{student.nationality}</td></tr>
                </tbody>
              </Table>

              <h5 className="mt-3">Address</h5>
              <Table borderless hover size="sm" className={styles.detailsTable}>
                <tbody>
                  <tr><td style={{ width: '100px' }}>Street:</td><td>{student.address.street}</td></tr>
                  <tr><td>City:</td><td>{student.address.city}</td></tr>
                  <tr><td>State:</td><td>{student.address.state}</td></tr>
                  <tr><td>Zip Code:</td><td>{student.address.zipCode}</td></tr>
                  <tr><td>Country:</td><td>{student.address.country}</td></tr>
                </tbody>
              </Table>
              
              <h5 className="mt-3">Academic Details</h5>
              <Table borderless hover size="sm" className={styles.detailsTable}>
                <tbody>
                  <tr><td style={{ width: '150px' }}><strong>Admission Date:</strong></td><td>{student.admissionDate}</td></tr>
                  <tr><td><strong>Enrollment Date:</strong></td><td>{student.enrollmentDate}</td></tr>
                  {student.withdrawalDate && <tr><td><strong>Withdrawal Date:</strong></td><td>{student.withdrawalDate}</td></tr>}
                </tbody>
              </Table>
            </Col>
          </Row>

          {student.emergencyContacts && student.emergencyContacts.length > 0 && (
            <>
              <h5 className="mt-4">Emergency Contact(s)</h5>
              {student.emergencyContacts.map((contact, index) => (
                <Card key={index} className="mb-2">
                  <Card.Body className="p-2">
                    <strong>{contact.name}</strong> ({contact.relationship})<br />
                    Phone: {contact.phone || 'N/A'}<br />
                    Email: {contact.email || 'N/A'}
                  </Card.Body>
                </Card>
              ))}
            </>
          )}

          {student.parentGuardianInfo && student.parentGuardianInfo.length > 0 && (
            <>
              <h5 className="mt-4">Parent/Guardian Information</h5>
              {student.parentGuardianInfo.map((info, index) => (
                 <Card key={index} className="mb-2">
                  <Card.Body className="p-2">
                    <strong>{info.name}</strong> ({info.relationship})<br />
                    Phone: {info.phone || 'N/A'}<br />
                    Email: {info.email || 'N/A'}
                  </Card.Body>
                </Card>
              ))}
            </>
          )}

          <h5 className="mt-4">Enrolled Courses</h5>
          {enrolledCoursesDetails.length > 0 ? (
            <Table striped bordered hover responsive="sm" size="sm" className={styles.dataTable}>
              <thead><tr><th>Course Code</th><th>Name</th><th>Department</th><th>Credits</th><th>Grade</th></tr></thead>
              <tbody>
                {enrolledCoursesDetails.map(course => (
                  <tr key={course.id}><td>{course.courseCode}</td><td>{course.name}</td><td>{course.department}</td><td>{course.credits}</td><td>{course.grade}</td></tr>
                ))}
              </tbody>
            </Table>
          ) : <p>No courses currently enrolled.</p>}

          <h5 className="mt-4">Health Records</h5>
          {healthRecords.length > 0 ? (
            <Table striped bordered hover responsive="sm" size="sm" className={styles.dataTable}>
              <thead><tr><th>Record ID</th><th>Conditions</th><th>Allergies</th><th>Immunizations</th><th>Last Updated</th></tr></thead>
              <tbody>
                {healthRecords.map(record => (
                  <tr key={record.recordId}>
                    <td>{record.recordId}</td>
                    <td>{Array.isArray(record.medicalConditions) ? record.medicalConditions.map(c => typeof c === 'object' ? `${c.condition} (${c.notes})` : c).join(', ') : record.medicalConditions}</td>
                    <td>{Array.isArray(record.allergies) ? record.allergies.join(', ') : record.allergies}</td>
                    <td>{Array.isArray(record.immunizations) ? record.immunizations.join(', ') : record.immunizations}</td>
                    <td>{record.lastUpdated}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : <p>No health records found for this student.</p>}

          <h5 className="mt-4">Disciplinary Records</h5>
          {disciplinaryRecords.length > 0 ? (
            <Table striped bordered hover responsive="sm" size="sm" className={styles.dataTable}>
              <thead><tr><th>Record ID</th><th>Incident Date</th><th>Description</th><th>Action Taken</th><th>Reported By</th></tr></thead>
              <tbody>
                {disciplinaryRecords.map(record => (
                  <tr key={record.recordId}>
                    <td>{record.recordId}</td>
                    <td>{record.incidentDate}</td>
                    <td>{record.description}</td>
                    <td>{record.actionTaken}</td>
                    <td>{record.reportedBy}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : <p>No disciplinary records found for this student.</p>}

        </Card.Body>
      </Card>
    </div>
  );
};

export default StudentProfilePage;
