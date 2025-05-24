import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockStudents } from '../../data/mockStudents';
import { Button, Table, Form, Row, Col, Card } from 'react-bootstrap';
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
    <div className={styles.pageContainer}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Student Management</h1>
        <Button variant="primary" onClick={() => navigate('/students/new')}>
          <span className="material-symbols-outlined me-2" style={{ verticalAlign: 'middle' }}>add</span>
          Add New Student
        </Button>
      </div>

      <Card className="mb-4">
        <Card.Body>
          <Form>
            <Row className="g-3">
              <Col md={4}>
                <Form.Group controlId="searchTerm">
                  <Form.Label>Search by Name/Email</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="statusFilter">
                  <Form.Label>Filter by Enrollment Status</Form.Label>
                  <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    {statusOptions.map(status => (
                      <option key={status} value={status === 'All' ? '' : status}>{status}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="majorFilter">
                  <Form.Label>Filter by Major</Form.Label>
                  <Form.Select value={majorFilter} onChange={(e) => setMajorFilter(e.target.value)}>
                    {majorOptions.map(major => (
                      <option key={major} value={major === 'All' ? '' : major}>{major}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <Table striped bordered hover responsive="sm" className={styles.dataTable}>
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
                <Button
                  variant="outline-info"
                  size="sm"
                  className="me-2 mb-1 mb-md-0" // Added margin bottom for mobile
                  onClick={() => navigate(`/profile/${student.id}`)}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '1rem', verticalAlign: 'middle' }}>visibility</span>
                </Button>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => navigate(`/students/edit/${student.id}`)}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '1rem', verticalAlign: 'middle' }}>edit</span>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {filteredStudents.length === 0 && <p className="text-center mt-3">No students match the current filters.</p>}
    </div>
  );
};

export default StudentListPage;
