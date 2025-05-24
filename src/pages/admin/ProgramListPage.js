import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockPrograms } from '../../data/mockPrograms';
import { Button, Table, Card } from 'react-bootstrap';
import styles from './AdminPages.module.scss';

const ProgramListPage = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    // In a real app, you might fetch this data from an API
    setPrograms(mockPrograms);
  }, []);

  return (
    <div className={styles.pageContainer}>
      <Card className={styles.formCard}>
        <Card.Header>
          <Card.Title>Program Management</Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="d-flex justify-content-end mb-3">
            <Button variant="primary" onClick={() => navigate('/admin/programs/new')}>
              <span className="material-symbols-outlined me-2" style={{ verticalAlign: 'middle' }}>add</span>
              Add New Program
            </Button>
          </div>

          {programs.length === 0 ? (
            <p>No programs found.</p>
          ) : (
            <Table striped bordered hover responsive className={styles.table}>
              <thead>
                <tr>
                  <th>Program ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Degree Level</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {programs.map((program) => (
                  <tr key={program.id}>
                    <td>{program.id}</td>
                    <td>{program.name}</td>
                    <td>{program.department}</td>
                    <td>{program.degreeLevel}</td>
                    <td>{program.duration}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => navigate(`/admin/programs/edit/${program.id}`)}
                        title="Edit Program"
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

export default ProgramListPage;
