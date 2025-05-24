import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockApplications } from '../../data/mockApplications';
import { Button, Table, Card, Badge } from 'react-bootstrap';
import styles from '../admin/AdminPages.module.scss'; // Reusing admin styles for consistency

const ApplicationListPage = () => {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Received':
        return <Badge bg="secondary">{status}</Badge>;
      case 'Under Review':
        return <Badge bg="info">{status}</Badge>;
      case 'Interview Scheduled':
        return <Badge bg="warning" text="dark">{status}</Badge>;
      case 'Accepted':
        return <Badge bg="success">{status}</Badge>;
      case 'Rejected':
        return <Badge bg="danger">{status}</Badge>;
      default:
        return <Badge bg="light" text="dark">{status}</Badge>;
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Card className={styles.formCard}>
        <Card.Header>
          <Card.Title>Application Submissions</Card.Title>
        </Card.Header>
        <Card.Body>
          {mockApplications.length === 0 ? (
            <p>No applications found.</p>
          ) : (
            <Table striped bordered hover responsive className={styles.table}>
              <thead>
                <tr>
                  <th>App ID</th>
                  <th>Applicant Name</th>
                  <th>Program</th>
                  <th>Submitted Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockApplications.map((app) => (
                  <tr key={app.id}>
                    <td>{app.id}</td>
                    <td>{app.applicantName}</td>
                    <td>{app.programName}</td>
                    <td>{app.submittedDate}</td>
                    <td>{getStatusBadge(app.status)}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => navigate(`/admissions/applications/view/${app.id}`)}
                        title="View/Manage Application"
                      >
                        <span className="material-symbols-outlined">visibility</span> View/Manage
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

export default ApplicationListPage;
