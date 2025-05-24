import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockDepartments } from '../../data/mockDepartments';
import { mockFaculty } from '../../data/mockFaculty';
import { Button, Table, Card } from 'react-bootstrap';
import styles from './AdminPages.module.scss';

const DepartmentListPage = () => {
  const navigate = useNavigate();

  const getFacultyName = (facultyId) => {
    if (!facultyId) return 'N/A';
    const facultyMember = mockFaculty.find(f => f.id === facultyId);
    return facultyMember ? `${facultyMember.firstName} ${facultyMember.lastName}` : 'N/A';
  };

  return (
    <div className={styles.pageContainer}>
      <Card className={styles.formCard}>
        <Card.Header>
          <Card.Title>Department Management</Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="d-flex justify-content-end mb-3">
            <Button variant="primary" onClick={() => navigate('/admin/masterdata/departments/new')}>
              <span className="material-symbols-outlined me-2" style={{ verticalAlign: 'middle' }}>add</span>
              Add New Department
            </Button>
          </div>

          {mockDepartments.length === 0 ? (
            <p>No departments found.</p>
          ) : (
            <Table striped bordered hover responsive className={styles.table}>
              <thead>
                <tr>
                  <th>Department ID</th>
                  <th>Name</th>
                  <th>Head</th>
                  <th>Description</th>
                  <th>Office Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockDepartments.map((dept) => (
                  <tr key={dept.id}>
                    <td>{dept.id}</td>
                    <td>{dept.name}</td>
                    <td>{getFacultyName(dept.head)}</td>
                    <td>{dept.description}</td>
                    <td>{dept.officeLocation}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => navigate(`/admin/masterdata/departments/edit/${dept.id}`)}
                        title="Edit Department"
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

export default DepartmentListPage;
