import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockSemesters } from '../../data/mockSemesters';
// Import custom styled components from centralized design system
import {
  StyledContainer,
  StyledTable,
  StyledCard,
  StyledButton
} from '../../components';
import styles from './AdminPages.module.scss';

const SemesterListPage = () => {
  const navigate = useNavigate();

  return (
    <StyledContainer className={styles.pageContainer}>
      <StyledCard className={styles.formCard}>
        <StyledCard.Header>
          <StyledCard.Title>Semester Management</StyledCard.Title>
        </StyledCard.Header>
        <StyledCard.Body>
          <div className="d-flex justify-content-end mb-3">
            <StyledButton variant="primary" onClick={() => navigate('/admin/semesters/new')}>
              <span className="material-symbols-outlined me-2" style={{ verticalAlign: 'middle' }}>add</span>
              Add New Semester
            </StyledButton>
          </div>

          {mockSemesters.length === 0 ? (
            <p>No semesters found.</p>
          ) : (
            <StyledTable striped bordered hover responsive className={styles.table}>
              <thead>
                <tr>
                  <th>Semester ID</th>
                  <th>Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockSemesters.map((semester) => (
                  <tr key={semester.id}>
                    <td>{semester.id}</td>
                    <td>{semester.name}</td>
                    <td>{semester.startDate}</td>
                    <td>{semester.endDate}</td>
                    <td>{semester.status}</td>
                    <td>
                      <StyledButton
                        variant="outline-primary"
                        size="sm"
                        onClick={() => navigate(`/admin/semesters/edit/${semester.id}`)}
                        title="Edit Semester"
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

export default SemesterListPage;
