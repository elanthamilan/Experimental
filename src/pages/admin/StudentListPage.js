import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockStudents } from '../../data/mockStudents';
import { Button, Table } from 'react-bootstrap';
import styles from './AdminPages.module.scss'; // Optional: for custom styles

const StudentListPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.pageContainer}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Student Management</h1>
        <Button variant="primary" onClick={() => navigate('/students/new')}>
          <span className="material-symbols-outlined me-2" style={{ verticalAlign: 'middle' }}>add</span>
          Add New Student
        </Button>
      </div>

      <Table striped bordered hover responsive="sm" className={styles.dataTable}>
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Major</th>
            <th>Enrollment Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {mockStudents.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{`${student.firstName} ${student.lastName}`}</td>
              <td>{student.email}</td>
              <td>{student.major}</td>
              <td>{student.enrollmentDate}</td>
              <td>
                <Button
                  variant="outline-info"
                  size="sm"
                  className="me-2"
                  onClick={() => navigate(`/profile/${student.id}`)} // Assuming /profile/:studentId for student profile
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
      {mockStudents.length === 0 && <p>No students found.</p>}
    </div>
  );
};

export default StudentListPage;
