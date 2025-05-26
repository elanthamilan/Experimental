import React from 'react';
import { useParams } from 'react-router-dom';
import { mockStudents } from '../../data/mockStudents';
import { mockCourses } from '../../data/mockCourses';
import { mockEnrollments } from '../../data/mockEnrollments';
import { mockHealthRecords } from '../../data/mockHealthRecords'; // New import
import { mockDisciplinaryRecords } from '../../data/mockDisciplinaryRecords'; // New import
import { Image } from 'react-bootstrap'; // Row, Col, Alert, Badge removed
// Import custom styled components from centralized design system
import {
  StyledContainer,
  StyledTable,
  StyledCard,
  StyledBadge, // Added StyledBadge import
  StyledRow,  
  StyledCol,   
  StyledAlert, // Added
} from '../../components';
import styles from './StudentProfilePage.module.scss'; // Use new SCSS module

const StudentProfilePage = () => {
  const { studentId } = useParams();
  const student = mockStudents.find(s => s.id === studentId);

  if (!student) {
    return (
      // Assuming StyledContainer is already imported and used as pageContainer
      <StyledContainer className={styles.pageContainer}> 
        <StyledAlert variant="danger" className={styles.alertDanger}>Student not found.</StyledAlert> {/* Use styled div for alert */}
      </StyledContainer>
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
    <StyledContainer className={styles.pageContainer}>
      <StyledCard className={styles.profileCard}>
        <StyledCard.Header as="h4" className={styles.profileCardHeader}>
          Student Profile
        </StyledCard.Header>
        <StyledCard.Body>
          <StyledRow className="mb-4">
            <StyledCol className="col-md-4 text-center">
              {student.profileImageUrl ? (
                <Image src={student.profileImageUrl} roundedCircle fluid thumbnail className={styles.profileImage} />
              ) : (
                <div className={styles.profileImagePlaceholder}>
                  <span className={`material-symbols-outlined ${styles.placeholderIcon}`}>person</span>
                </div>
              )}
              <h3 className={styles.studentName}>{`${student.firstName} ${student.lastName}`}</h3>
              <p className={styles.studentMajor}>{student.major}</p>
              <p className={styles.statusBadgeContainer}><StyledBadge variant={student.enrollmentStatus === 'Enrolled' ? 'success' : 'secondary'}>{student.enrollmentStatus}</StyledBadge></p>
              <p className={styles.detailText}><strong className={styles.detailLabel}>Academic Standing:</strong> {student.academicStanding}</p>
            </StyledCol>
            <StyledCol className="col-md-8">
              <h5 className={styles.sectionTitle}>Personal & Contact Information</h5>
              <StyledTable borderless hover size="sm" className={styles.detailsTable}>
                <tbody>
                  <tr><td className={styles.labelColumn}>Student ID:</td><td>{student.id}</td></tr>
                  <tr><td className={styles.labelColumn}>Email:</td><td>{student.email}</td></tr>
                  <tr><td className={styles.labelColumn}>Date of Birth:</td><td>{student.dateOfBirth}</td></tr>
                  <tr><td className={styles.labelColumn}>Gender:</td><td>{student.gender}</td></tr>
                  <tr><td className={styles.labelColumn}>Nationality:</td><td>{student.nationality}</td></tr>
                </tbody>
              </StyledTable>

              <h5 className={styles.sectionTitle}>Address</h5>
              <StyledTable borderless hover size="sm" className={styles.detailsTable}>
                <tbody>
                  <tr><td className={styles.labelColumn}>Street:</td><td>{student.address.street}</td></tr>
                  <tr><td className={styles.labelColumn}>City:</td><td>{student.address.city}</td></tr>
                  <tr><td className={styles.labelColumn}>State:</td><td>{student.address.state}</td></tr>
                  <tr><td className={styles.labelColumn}>Zip Code:</td><td>{student.address.zipCode}</td></tr>
                  <tr><td className={styles.labelColumn}>Country:</td><td>{student.address.country}</td></tr>
                </tbody>
              </StyledTable>

              <h5 className={styles.sectionTitle}>Academic Details</h5>
              <StyledTable borderless hover size="sm" className={styles.detailsTable}>
                <tbody>
                  <tr><td className={styles.labelColumn}>Admission Date:</td><td>{student.admissionDate}</td></tr>
                  <tr><td className={styles.labelColumn}>Enrollment Date:</td><td>{student.enrollmentDate}</td></tr>
                  {student.withdrawalDate && <tr><td className={styles.labelColumn}>Withdrawal Date:</td><td>{student.withdrawalDate}</td></tr>}
                </tbody>
              </StyledTable>
            </StyledCol>
          </StyledRow>

          {student.emergencyContacts && student.emergencyContacts.length > 0 && (
            <>
              <h5 className={styles.sectionTitle}>Emergency Contact(s)</h5>
              {student.emergencyContacts.map((contact, index) => (
                <StyledCard key={index} className={styles.contactCard}>
                  <StyledCard.Body> {/* Removed p-2, assuming contactCard style handles padding */}
                    <strong className={styles.contactName}>{contact.name}</strong> ({contact.relationship})<br />
                    Phone: {contact.phone || 'N/A'}<br />
                    Email: {contact.email || 'N/A'}
                  </StyledCard.Body>
                </StyledCard>
              ))}
            </>
          )}

          {student.parentGuardianInfo && student.parentGuardianInfo.length > 0 && (
            <>
              <h5 className={styles.sectionTitle}>Parent/Guardian Information</h5>
              {student.parentGuardianInfo.map((info, index) => (
                 <StyledCard key={index} className={styles.contactCard}>
                  <StyledCard.Body> {/* Removed p-2 */}
                    <strong className={styles.contactName}>{info.name}</strong> ({info.relationship})<br />
                    Phone: {info.phone || 'N/A'}<br />
                    Email: {info.email || 'N/A'}
                  </StyledCard.Body>
                </StyledCard>
              ))}
            </>
          )}

          <h5 className={styles.sectionTitle}>Enrolled Courses</h5>
          {enrolledCoursesDetails.length > 0 ? (
            <StyledTable striped bordered hover responsive="sm" size="sm" className={styles.dataTable}>
              <thead><tr><th>Course Code</th><th>Name</th><th>Department</th><th>Credits</th><th>Grade</th></tr></thead>
              <tbody>
                {enrolledCoursesDetails.map(course => (
                  <tr key={course.id}><td>{course.courseCode}</td><td>{course.name}</td><td>{course.department}</td><td>{course.credits}</td><td>{course.grade}</td></tr>
                ))}
              </tbody>
            </StyledTable>
          ) : <p className={styles.noDataText}>No courses currently enrolled.</p>}

          <h5 className={styles.sectionTitle}>Health Records</h5>
          {healthRecords.length > 0 ? (
            <StyledTable striped bordered hover responsive="sm" size="sm" className={styles.dataTable}>
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
            </StyledTable>
          ) : <p className={styles.noDataText}>No health records found for this student.</p>}

          <h5 className={styles.sectionTitle}>Disciplinary Records</h5>
          {disciplinaryRecords.length > 0 ? (
            <StyledTable striped bordered hover responsive="sm" size="sm" className={styles.dataTable}>
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
            </StyledTable>
          ) : <p className={styles.noDataText}>No disciplinary records found for this student.</p>}

        </StyledCard.Body>
      </StyledCard>
    </StyledContainer>
  );
};

export default StudentProfilePage;
