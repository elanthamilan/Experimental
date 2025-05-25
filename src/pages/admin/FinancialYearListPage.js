import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockFinancialYears } from '../../data/mockFinancialYears';
// Import custom styled components from centralized design system
import {
  StyledContainer,
  StyledTable,
  StyledCard,
  StyledButton
} from '../../components';
import styles from './AdminPages.module.scss';

const FinancialYearListPage = () => {
  const navigate = useNavigate();

  return (
    <StyledContainer className={styles.pageContainer}>
      <StyledCard className={styles.formCard}>
        <StyledCard.Header>
          <StyledCard.Title>Financial Year Management</StyledCard.Title>
        </StyledCard.Header>
        <StyledCard.Body>
          <div className="d-flex justify-content-end mb-3">
            <StyledButton variant="primary" onClick={() => navigate('/admin/financialyears/new')}>
              <span className="material-symbols-outlined me-2" style={{ verticalAlign: 'middle' }}>add</span>
              Add New Financial Year
            </StyledButton>
          </div>

          {mockFinancialYears.length === 0 ? (
            <p>No financial years found.</p>
          ) : (
            <StyledTable striped bordered hover responsive className={styles.table}>
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
                      <StyledButton
                        variant="outline-primary"
                        size="sm"
                        onClick={() => navigate(`/admin/financialyears/edit/${fy.id}`)}
                        title="Edit Financial Year"
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

export default FinancialYearListPage;
