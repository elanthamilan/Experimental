import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockApplications } from '../../data/mockApplications';
// Import custom styled components from centralized design system
import {
  StyledContainer,
  StyledTable,
  StyledCard,
  StyledButton,
  StyledBadge
} from '../../components';
import styles from '../admin/AdminPages.module.scss'; // Reusing admin styles for consistency

const ApplicationListPage = () => {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Received':
        return <StyledBadge variant="secondary">{status}</StyledBadge>;
      case 'Under Review':
        return <StyledBadge variant="info">{status}</StyledBadge>;
      case 'Interview Scheduled':
        return <StyledBadge variant="warning">{status}</StyledBadge>;
      case 'Accepted':
        return <StyledBadge variant="success">{status}</StyledBadge>;
      case 'Rejected':
        return <StyledBadge variant="danger">{status}</StyledBadge>;
      default:
        return <StyledBadge variant="light">{status}</StyledBadge>;
    }
  };

  return (
    <StyledContainer className={styles.pageContainer}>
      <StyledCard className={styles.formCard}>
        <StyledCard.Header>
          <StyledCard.Title>Application Submissions</StyledCard.Title>
        </StyledCard.Header>
        <StyledCard.Body>
          {mockApplications.length === 0 ? (
            <p>No applications found.</p>
          ) : (
            <StyledTable striped bordered hover responsive className={styles.table}>
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
                      <StyledButton
                        variant="outline-primary"
                        size="sm"
                        onClick={() => navigate(`/admissions/applications/view/${app.id}`)}
                        title="View/Manage Application"
                      >
                        <span className="material-symbols-outlined">visibility</span> View/Manage
                      </StyledButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </StyledTable>
          )}
        </StyledCard.Body>
      </StyledCard>
    </StyledContainer>
  );
};

export default ApplicationListPage;
