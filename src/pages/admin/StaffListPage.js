import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockStaff } from '../../data/mockStaff';
import { Badge } from 'react-bootstrap';
// Import custom styled components from centralized design system
import {
  StyledContainer,
  StyledTable,
  StyledCard,
  StyledButton
} from '../../components';
import styles from './AdminPages.module.scss';

const StaffListPage = () => {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return <Badge bg="success">{status}</Badge>;
      case 'On Leave':
        return <Badge bg="warning" text="dark">{status}</Badge>;
      case 'Terminated':
        return <Badge bg="danger">{status}</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  return (
    <StyledContainer className={styles.pageContainer}>
      <StyledCard className={styles.formCard}>
        <StyledCard.Header>
          <StyledCard.Title>Staff Management (Non-Academic)</StyledCard.Title>
        </StyledCard.Header>
        <StyledCard.Body>
          <div className="d-flex justify-content-end mb-3">
            <StyledButton variant="primary" onClick={() => navigate('/staff/new')}>
              <span className="material-symbols-outlined me-2" style={{ verticalAlign: 'middle' }}>add</span>
              Add New Staff
            </StyledButton>
          </div>

          {mockStaff.length === 0 ? (
            <p>No staff members found.</p>
          ) : (
            <StyledTable striped bordered hover responsive className={styles.table}>
              <thead>
                <tr>
                  <th>Staff ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Role/Title</th>
                  <th>Employment Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockStaff.map((staffMember) => (
                  <tr key={staffMember.id}>
                    <td>{staffMember.id}</td>
                    <td>{`${staffMember.firstName} ${staffMember.lastName}`}</td>
                    <td>{staffMember.email}</td>
                    <td>{staffMember.department}</td>
                    <td>{staffMember.role}</td>
                    <td>{staffMember.employmentDate}</td>
                    <td>{getStatusBadge(staffMember.status)}</td>
                    <td>
                      <StyledButton
                        variant="outline-primary"
                        size="sm"
                        onClick={() => navigate(`/staff/edit/${staffMember.id}`)}
                        title="Edit Staff Member"
                      >
                        <span className="material-symbols-outlined">edit</span>
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

export default StaffListPage;
