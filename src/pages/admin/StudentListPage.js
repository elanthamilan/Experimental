import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockStudents } from '../../data/mockStudents';
import { Form, Row, Col } from 'react-bootstrap';
// Import custom styled components from centralized design system
import {
  StyledContainer,
  StyledTable,
  StyledCard,
  StyledButton,
  FormField
} from '../../components';
import styles from './AdminPages.module.scss';

const StudentListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // Default to 'All'
  const [majorFilter, setMajorFilter] = useState('');   // Default to 'All'

  const [majorOptions, setMajorOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);

  useEffect(() => {
    const uniqueMajors = ['All', ...new Set(mockStudents.map(student => student.major))];
    setMajorOptions(uniqueMajors);

    const uniqueStatuses = ['All', ...new Set(mockStudents.map(student => student.enrollmentStatus))];
    setStatusOptions(uniqueStatuses);
  }, []);

  const filteredStudents = mockStudents.filter(student => {
    const nameMatch = student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === '' || statusFilter === 'All' || student.enrollmentStatus === statusFilter;
    const majorMatch = majorFilter === '' || majorFilter === 'All' || student.major === majorFilter;

    return nameMatch && statusMatch && majorMatch;
  });

  return (
    <StyledContainer className={styles.pageContainer}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Student Management</h1>
        <StyledButton variant="primary" onClick={() => navigate('/students/new')}>
          <span className="material-symbols-outlined me-2" style={{ verticalAlign: 'middle' }}>add</span>
          Add New Student
        </StyledButton>
      </div>

      <StyledCard className="mb-4">
        <StyledCard.Body>
          <Form>
            <Row className="g-3">
              <Col md={4}>
                <FormField
                  controlId="searchTerm"
                  label="Search by Name/Email"
                  type="text"
                  placeholder="Enter name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Col>
              <Col md={4}>
                <FormField
                  controlId="statusFilter"
                  label="Filter by Enrollment Status"
                  as="select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={statusOptions.map(status => ({
                    value: status === 'All' ? '' : status,
                    label: status
                  }))}
                />
              </Col>
              <Col md={4}>
                <FormField
                  controlId="majorFilter"
                  label="Filter by Major"
                  as="select"
                  value={majorFilter}
                  onChange={(e) => setMajorFilter(e.target.value)}
                  options={majorOptions.map(major => ({
                    value: major === 'All' ? '' : major,
                    label: major
                  }))}
                />
              </Col>
            </Row>
          </Form>
        </StyledCard.Body>
      </StyledCard>

      <StyledTable striped bordered hover responsive="sm" className={styles.dataTable}>
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Major</th>
            <th>Enrollment Date</th>
            <th>Enrollment Status</th>
            <th>Academic Standing</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{`${student.firstName} ${student.lastName}`}</td>
              <td>{student.email}</td>
              <td>{student.major}</td>
              <td>{student.enrollmentDate}</td>
              <td>{student.enrollmentStatus}</td>
              <td>{student.academicStanding}</td>
              <td>
                <StyledButton
                  variant="outline-info"
                  size="sm"
                  className="me-2 mb-1 mb-md-0" // Added margin bottom for mobile
                  onClick={() => navigate(`/profile/${student.id}`)}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '1rem', verticalAlign: 'middle' }}>visibility</span>
                </StyledButton>
                <StyledButton
                  variant="outline-primary"
                  size="sm"
                  onClick={() => navigate(`/students/edit/${student.id}`)}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '1rem', verticalAlign: 'middle' }}>edit</span>
                </StyledButton>
              </td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
      {filteredStudents.length === 0 && <p className="text-center mt-3">No students match the current filters.</p>}
    </StyledContainer>
  );
};

export default StudentListPage;
