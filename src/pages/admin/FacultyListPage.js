import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockFaculty } from '../../data/mockFaculty';
// Import custom styled components from centralized design system
import {
  StyledContainer,
  StyledTable,
  StyledCard,
  StyledButton
} from '../../components';
import styles from './AdminPages.module.scss';

const FacultyListPage = () => {
  const navigate = useNavigate();

  return (
    <StyledContainer className={styles.pageContainer}>
      <StyledCard className={styles.formCard}>
        <StyledCard.Header>
          <StyledCard.Title>Faculty Management</StyledCard.Title>
        </StyledCard.Header>
        <StyledCard.Body>
          <div className="d-flex justify-content-end mb-3">
            <StyledButton variant="primary" onClick={() => navigate('/admin/faculty/new')}>
              <span className="material-symbols-outlined me-2" style={{ verticalAlign: 'middle' }}>add</span>
              Add New Faculty
            </StyledButton>
          </div>

          {mockFaculty.length === 0 ? (
            <p>No faculty members found.</p>
          ) : (
            <StyledTable striped bordered hover responsive className={styles.table}>
              <thead>
                <tr>
                  <th>Faculty ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Title</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockFaculty.map((faculty) => (
                  <tr key={faculty.id}>
                    <td>{faculty.id}</td>
                    <td>{`${faculty.firstName} ${faculty.lastName}`}</td>
                    <td>{faculty.email}</td>
                    <td>{faculty.department}</td>
                    <td>{faculty.title}</td>
                    <td>
                      <StyledButton
                        variant="outline-primary"
                        size="sm"
                        onClick={() => navigate(`/admin/faculty/edit/${faculty.id}`)}
                        title="Edit Faculty"
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

export default FacultyListPage;
