import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockFinancialYears } from '../../data/mockFinancialYears';
import { Button, Table, Card } from 'react-bootstrap';
import styles from './AdminPages.module.scss';

const FinancialYearListPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.pageContainer}>
      <Card className={styles.formCard}>
        <Card.Header>
          <Card.Title>Financial Year Management</Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="d-flex justify-content-end mb-3">
            <Button variant="primary" onClick={() => navigate('/admin/financialyears/new')}>
              <span className="material-symbols-outlined me-2" style={{ verticalAlign: 'middle' }}>add</span>
              Add New Financial Year
            </Button>
          </div>

          {mockFinancialYears.length === 0 ? (
            <p>No financial years found.</p>
          ) : (
            <Table striped bordered hover responsive className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockFinancialYears.map((fy) => (
                  <tr key={fy.id}>
                    <td>{fy.id}</td>
                    <td>{fy.name}</td>
                    <td>{fy.startDate}</td>
                    <td>{fy.endDate}</td>
                    <td>{fy.status}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => navigate(`/admin/financialyears/edit/${fy.id}`)}
                        title="Edit Financial Year"
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

export default FinancialYearListPage;
